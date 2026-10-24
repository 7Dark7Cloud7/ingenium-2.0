import test from "node:test";
import assert from "node:assert/strict";
import { analyzeSummary } from "../site/src/study/summary-engine.js";
import {
  shortenText,
  buildMindMap,
  buildMemoryPalace,
  buildLearningMethods,
} from "../site/src/study/learning-methods.js";

const FIXTURE = [
  "A cinemática estuda o movimento dos corpos sem considerar as forças que o provocam.",
  "A velocidade média é a razão entre o deslocamento e o intervalo de tempo.",
  "A aceleração média é a variação da velocidade por unidade de tempo.",
  "Por exemplo, um carro que percorre 120 m em 10 s tem velocidade média de 12 m/s.",
  "A queda livre é um movimento com aceleração constante de aproximadamente 9,8 m/s².",
  "Portanto, a velocidade e a aceleração descrevem como o movimento muda.",
  "Em resumo, a cinemática descreve o movimento com posição, velocidade e aceleração.",
].join(" ");

const ANALYSIS = analyzeSummary({ text: FIXTURE, title: "Cinemática", subject: "physics" });
const NOW = new Date("2026-10-22T09:00:00");

test("shortenText respects the limit and collapses whitespace", () => {
  assert.equal(shortenText("  uma   frase curta  ", 40), "uma frase curta");
  const shortened = shortenText("uma frase bastante longa que precisa de ser cortada", 24);
  assert.ok(shortened.length <= 24);
  assert.match(shortened, /…$/);
  assert.equal(shortenText("", 10), "");
});

test("buildMindMap builds at most five branches of three children", () => {
  const map = buildMindMap(ANALYSIS, { title: "Cinemática", lang: "pt" });
  assert.equal(map.root.label, "Cinemática");
  assert.ok(map.root.detail.length > 0);
  assert.ok(map.branches.length >= 2 && map.branches.length <= 5);
  for (const branch of map.branches) {
    assert.ok(branch.label.length > 0);
    assert.ok(branch.children.length >= 1 && branch.children.length <= 3);
    for (const child of branch.children) assert.ok(child.label.length > 0);
  }
  const expectedNodes = 1 + map.branches.reduce((total, branch) => total + branch.children.length, 0);
  assert.equal(map.nodeCount, expectedNodes);
  assert.ok(map.branches.some((branch) => branch.id === "concepts"));
});

test("buildMindMap never returns an empty map", () => {
  const map = buildMindMap({ centralIdea: "Uma ideia central." }, { title: "", lang: "pt" });
  assert.equal(map.branches.length, 1);
  assert.equal(map.branches[0].children[0].label, "Uma ideia central.");
  const empty = buildMindMap({}, { lang: "en" });
  assert.equal(empty.root.label, "Summary");
  assert.match(empty.branches[0].children[0].label, /Not enough content/);
});

test("buildMemoryPalace uses known places and names every concept", () => {
  const palace = buildMemoryPalace(ANALYSIS, { lang: "pt" });
  assert.ok(palace.length > 0 && palace.length <= 4);
  for (const station of palace) {
    assert.ok(station.place.length > 0);
    assert.ok(station.concept.length > 0);
    assert.match(station.cue, /Coloca/);
  }
  const english = buildMemoryPalace(ANALYSIS, { lang: "en" });
  assert.match(english[0].cue, /Place/);
});

test("buildLearningMethods schedules 5 spaced reviews across 14 days", () => {
  const { schedule, methods } = buildLearningMethods(ANALYSIS, { now: NOW, lang: "pt" });
  assert.deepEqual(schedule.map((item) => item.days), [0, 1, 3, 7, 14]);
  assert.deepEqual(schedule.map((item) => item.date), [
    "2026-10-22",
    "2026-10-23",
    "2026-10-25",
    "2026-10-29",
    "2026-11-05",
  ]);
  const ids = methods.map((method) => method.id);
  for (const id of ["recall", "spaced", "feynman", "dual", "palace", "interleave"]) {
    assert.ok(ids.includes(id), `missing method ${id}`);
  }
  const spaced = methods.find((method) => method.id === "spaced");
  assert.equal(spaced.schedule.length, 5);
  assert.ok(spaced.steps.length >= 4);
  const palace = methods.find((method) => method.id === "palace");
  assert.ok(palace.palace.length > 0);
  assert.ok(palace.steps.length <= 6);
  for (const method of methods) {
    assert.ok(method.title.length > 0);
    assert.ok(method.summary.length > 0);
    assert.ok(method.steps.length >= 3);
  }
});

test("buildLearningMethods adds a gaps method only when coverage is missing", () => {
  const withoutGaps = buildLearningMethods({ ...ANALYSIS, coverage: [] }, { now: NOW, lang: "pt" });
  assert.equal(withoutGaps.methods.some((method) => method.id === "gaps"), false);
  const withGaps = buildLearningMethods({
    ...ANALYSIS,
    coverage: [{ ok: false, hint: "Acrescenta um exemplo numérico." }, { ok: true }],
  }, { now: NOW, lang: "pt" });
  const gaps = withGaps.methods.find((method) => method.id === "gaps");
  assert.ok(gaps);
  assert.match(gaps.steps[0], /exemplo numérico/);
  assert.equal(gaps.meta, "1 critério em falta");
});

test("buildLearningMethods localises to English", () => {
  const { methods, schedule } = buildLearningMethods(ANALYSIS, { now: NOW, lang: "en" });
  assert.equal(schedule[0].date, "2026-10-22");
  assert.match(methods.find((method) => method.id === "recall").title, /Active recall/);
  assert.match(methods.find((method) => method.id === "spaced").meta, /5 reviews/);
});
