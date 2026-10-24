import test from "node:test";
import assert from "node:assert/strict";
import {
  normalizeText,
  splitSentences,
  detectLanguage,
  analyzeSummary,
} from "../site/src/study/summary-engine.js";

const FIXTURE = [
  "A cinemática estuda o movimento dos corpos sem considerar as forças que o provocam.",
  "A velocidade média é a razão entre o deslocamento e o intervalo de tempo.",
  "A aceleração média é a variação da velocidade por unidade de tempo.",
  "Por exemplo, um carro que percorre 120 m em 10 s tem velocidade média de 12 m/s.",
  "A queda livre é um movimento com aceleração constante de aproximadamente 9,8 m/s².",
  "Portanto, a velocidade e a aceleração descrevem como o movimento muda.",
  "Em resumo, a cinemática descreve o movimento com posição, velocidade e aceleração.",
].join(" ");

const LESSONS = [
  { id: "velocity", searchText: "velocidade média deslocamento tempo aceleração movimento" },
  { id: "free-fall", searchText: "queda livre aceleração gravidade" },
  { id: "unrelated", searchText: "matrizes determinantes" },
];

test("normalizeText collapses accidental whitespace", () => {
  assert.equal(normalizeText("  A   linha\r\nsegunda\t\n\n\n\nterceira  "), "A   linha\nsegunda\n\nterceira");
});

test("splitSentences keeps abbreviations and decimals together", () => {
  const sentences = splitSentences("Usa a fig. 3 para ver o gráfico. O valor é 9,8 m/s². Já está?");
  assert.equal(sentences.length, 3);
  assert.match(sentences[0], /fig\. 3/);
  assert.match(sentences[1], /9,8 m\/s²/);
});

test("detectLanguage separates Portuguese and English prose", () => {
  assert.equal(detectLanguage("A velocidade é uma grandeza que mede o deslocamento no tempo."), "pt");
  assert.equal(detectLanguage("The velocity is the rate of change of displacement with time."), "en");
});

test("analyzeSummary refuses text that is too short and says why", () => {
  const result = analyzeSummary({ text: "Muito curto." });
  assert.equal(result.insufficient, true);
  assert.equal(result.reason, "too_short");
  assert.equal(result.stats.words, 2);
  assert.equal(typeof result.title, "string");
});

test("analyzeSummary builds definitions, key ideas and an outline", () => {
  const result = analyzeSummary({ text: FIXTURE, title: "Cinemática", subject: "physics", lessons: LESSONS });
  assert.equal(result.insufficient, false);
  assert.equal(result.language, "pt");
  assert.equal(result.title, "Cinemática");
  assert.ok(result.centralIdea.length > 20);
  assert.ok(result.keyIdeas.length >= 2);
  assert.ok(result.outline.length >= 1);
  const terms = result.definitions.map((definition) => definition.term);
  assert.ok(terms.includes("velocidade média"));
  assert.ok(terms.includes("aceleração média"));
  assert.ok(terms.includes("queda livre"));
  assert.match(result.keywords.map((keyword) => keyword.term).join(" "), /velocidade/);
});

test("coverage recognises definitions, examples, quantities, links and closure", () => {
  const result = analyzeSummary({ text: FIXTURE });
  const byId = Object.fromEntries(result.coverage.map((item) => [item.id, item]));
  assert.equal(byId.definitions.ok, true);
  assert.equal(byId.example.ok, true);
  assert.equal(byId.quantities.ok, true);
  assert.equal(byId.connections.ok, true);
  assert.equal(byId.conclusion.ok, true);
  assert.ok(result.coverage.every((item) => typeof item.hint === "string" && item.hint.length > 10));
});

test("flashcards have a prompt, answer and source sentence", () => {
  const result = analyzeSummary({ text: FIXTURE });
  assert.ok(result.cards.length >= 4);
  for (const card of result.cards) {
    assert.ok(card.front.length > 4);
    assert.ok(card.back.length > 0);
    assert.ok(card.answer.length > 0);
    assert.ok(card.sentence.length > 0);
    assert.ok(["definition", "cloze"].includes(card.kind));
  }
  const definition = result.cards.find((card) => card.kind === "definition");
  assert.match(definition.front, /O que é/);
});

test("quiz options always contain the correct answer and come from the text", () => {
  const result = analyzeSummary({ text: FIXTURE });
  assert.ok(result.quiz.length >= 2);
  for (const question of result.quiz) {
    assert.ok(question.options.length >= 3);
    assert.equal(question.options[question.correct], question.answer);
    assert.match(question.prompt, /_____/);
    assert.ok(question.options.every((option) => FIXTURE.toLowerCase().includes(option.toLowerCase())));
    assert.ok(question.explanation.length > 10);
  }
});

test("quiz stays empty when the text has fewer than three usable keywords", () => {
  const text = "A luz é a luz e a luz é boa. ".repeat(6);
  const result = analyzeSummary({ text });
  assert.equal(result.insufficient, false);
  assert.deepEqual(result.quiz, []);
});

test("line definitions are extracted from term-colon pairs", () => {
  const text = [
    "Cinemática: ramo da mecânica que descreve o movimento sem estudar as causas.",
    "A velocidade média é a razão entre o deslocamento e o tempo gasto.",
    "A aceleração média é a variação da velocidade por unidade de tempo.",
    "Por exemplo, um atleta percorre 100 m em 12 s, logo tem 8,3 m/s de velocidade média.",
  ].join("\n");
  const result = analyzeSummary({ text });
  const terms = result.definitions.map((definition) => definition.term);
  assert.ok(terms.includes("Cinemática"));
});

test("related lessons are ranked by keyword overlap only", () => {
  const result = analyzeSummary({ text: FIXTURE, lessons: LESSONS });
  assert.ok(result.related.length >= 1);
  assert.equal(result.related[0].lessonId, "velocity");
  assert.ok(result.related.every((item) => item.lessonId !== "unrelated"));
});

test("english prose receives english prompts", () => {
  const text = [
    "Velocity is the rate of change of displacement with time.",
    "Acceleration is the rate of change of velocity with time.",
    "For example, a car that travels 120 m in 10 s has an average velocity of 12 m/s.",
    "Therefore, velocity and acceleration describe how motion changes.",
    "In summary, kinematics describes motion with position, velocity and acceleration.",
  ].join(" ");
  const result = analyzeSummary({ text });
  assert.equal(result.language, "en");
  assert.match(result.cards[0].front, /What is/);
});
