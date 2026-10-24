import test from "node:test";
import assert from "node:assert/strict";
import {
  buildClassPack,
  classPackStats,
  emptyClassroom,
  makeClassCode,
  mergeClassPack,
  normalizeClassroom,
  normalizeMaterial,
  normalizeNotice,
  normalizeStudyGroup,
  packFileName,
  parseClassPack,
  ClassPackError,
} from "../site/src/study/classroom-engine.js";

const NOW = new Date(2026, 9, 22, 12, 0, 0);
const LONG_HASH = "a".repeat(64);

function sampleClassroom(overrides = {}) {
  return {
    name: "Mecatrónica · 2.º ano",
    institution: "Universidade Metodista",
    course: "Mecatrónica",
    year: "2026/27",
    code: "MEC-8K2P",
    owner: "Rafael",
    role: "student",
    members: [{ name: "Rafael", role: "student" }, { name: "Afonso", role: "teacher" }],
    notices: [{
      id: "notice-test-1",
      kind: "exame",
      title: "Teste de Física mudou de sala",
      body: "Passa para o laboratório 2.",
      dueAt: "2026-11-05",
      pinned: true,
      createdAt: "2026-10-20T09:00:00.000Z",
      author: "Rafael",
      role: "student",
    }],
    materials: [{
      id: "material-test-1",
      kind: "teste",
      subject: "physics",
      title: "Teste passado de Física",
      description: "Enunciado e resolução.",
      text: "1. Calcula a aceleração do corpo.",
      link: "",
      fileName: "teste-fisica.pdf",
      size: 1024,
      hash: LONG_HASH,
      createdAt: "2026-10-19T10:00:00.000Z",
      author: "Afonso",
      role: "teacher",
    }],
    groups: [{
      id: "group-test-1",
      title: "Grupo de Física",
      topic: "Cinemática",
      when: "Quinta, 18:00",
      place: "Biblioteca",
      capacity: 6,
      members: ["Rafael"],
      createdAt: "2026-10-18T10:00:00.000Z",
      author: "Rafael",
    }],
    programme: {
      text: "Exame de Física — 05/11/2026 às 09:00",
      events: [
        { id: "ev-test-1", date: "2026-11-05", time: "09:00", title: "Exame de Física", type: "exam", subject: "physics", source: "Exame de Física — 05/11/2026 às 09:00" },
        { id: "ev-broken", date: "not-a-date", title: "Sem data" },
      ],
      weekly: [
        { id: "wk-test-1", weekday: 1, start: "08:00", end: "10:00", title: "ALGA", subject: "algebra", type: "class" },
        { id: "wk-broken", weekday: 12, start: "99:99", title: "Inválida" },
      ],
      stats: { events: 2, weekly: 2 },
    },
    ...overrides,
  };
}

test("makeClassCode builds a readable prefix and stable format", () => {
  const code = makeClassCode("Mecatrónica 2.º ano");
  assert.match(code, /^MEC-[A-Z2-9]{4}$/);
  assert.match(makeClassCode(""), /^TUR-[A-Z2-9]{4}$/);
  assert.match(makeClassCode("çã"), /^[A-Z]{3}-[A-Z2-9]{4}$/);
});

test("normalizeClassroom cleans content, caps collections and dedupes members", () => {
  const raw = sampleClassroom({
    members: [{ name: "Rafael" }, { name: "rafael" }, { name: "" }, { name: "Afonso", role: "teacher" }],
    notices: new Array(140).fill(null).map((_, index) => ({
      id: `notice-${index}`,
      title: `Aviso ${index}`,
      kind: index % 2 ? "aviso" : "invalido",
      createdAt: "2026-10-20T09:00:00.000Z",
    })),
    materials: new Array(60).fill(null).map((_, index) => ({
      id: `material-${index}`,
      title: `Material ${index}`,
      text: "Texto",
      createdAt: "2026-10-20T09:00:00.000Z",
    })),
    groups: new Array(45).fill(null).map((_, index) => ({
      id: `group-${index}`,
      title: `Grupo ${index}`,
      createdAt: "2026-10-20T09:00:00.000Z",
    })),
  });
  const room = normalizeClassroom(raw);
  assert.equal(room.name, "Mecatrónica · 2.º ano");
  assert.equal(room.members.length, 2);
  assert.deepEqual(room.members.map((member) => member.name), ["Rafael", "Afonso"]);
  assert.equal(room.members[1].role, "teacher");
  assert.equal(room.notices.length, 120);
  assert.equal(room.notices[1].kind, "aviso");
  assert.equal(room.notices[0].kind, "aviso");
  assert.equal(room.materials.length, 50);
  assert.equal(room.groups.length, 40);
});

test("notice and material validators reject malformed or unsafe values", () => {
  assert.equal(normalizeNotice({ title: "" }), null);
  assert.equal(normalizeNotice({ title: "Aviso", dueAt: "2026-02-31" }).dueAt, null);
  const longBody = normalizeNotice({ title: "Aviso", body: "x".repeat(3000), dueAt: "2026-11-05" });
  assert.equal(longBody.body.length, 2000);
  assert.equal(longBody.dueAt, "2026-11-05");

  assert.equal(normalizeMaterial({ title: "Só título" }), null);
  assert.equal(normalizeMaterial({ title: "Link", link: "javascript:alert(1)" }), null);
  const safe = normalizeMaterial({ title: "Notas", text: "Conteúdo" });
  assert.equal(safe.link, "");
  assert.equal(safe.subject, "general");
  assert.equal(safe.kind, "outro");
  const withHash = normalizeMaterial({ title: "PDF", text: "Conteúdo", hash: LONG_HASH.toUpperCase(), size: 9e9 });
  assert.equal(withHash.hash, LONG_HASH);
  assert.equal(withHash.size, 20 * 1024 * 1024);
});

test("study group capacity is clamped and members respect the limit", () => {
  const group = normalizeStudyGroup({
    title: "Grupo de Química",
    capacity: 1000,
    members: ["A", "B", "C"],
  });
  assert.equal(group.capacity, 200);
  assert.deepEqual(group.members, ["A", "B", "C"]);
  assert.equal(normalizeStudyGroup({ title: "" }), null);
  assert.equal(normalizeStudyGroup({ title: "G", capacity: 1 }).capacity, 2);
});

test("programme normalization keeps only valid events and weekly classes", () => {
  const room = normalizeClassroom(sampleClassroom());
  assert.equal(room.programme.events.length, 1);
  assert.equal(room.programme.events[0].date, "2026-11-05");
  assert.equal(room.programme.events[0].time, "09:00");
  assert.equal(room.programme.weekly.length, 1);
  assert.equal(room.programme.weekly[0].weekday, 1);
  assert.equal(room.programme.weekly[0].start, "08:00");
  assert.equal(room.programme.stats.events, 1);
  assert.equal(room.programme.stats.weekly, 1);
});

test("emptyClassroom exposes a complete programme shape", () => {
  const room = emptyClassroom();
  assert.deepEqual(room.programme, {
    text: "",
    sourceName: "",
    updatedAt: null,
    events: [],
    weekly: [],
    stats: { events: 0, weekly: 0 },
    parsedAt: null,
  });
  assert.equal(classPackStats(room).notices, 0);
});

test("class pack round-trips class data and never carries personal summaries", () => {
  const pack = buildClassPack(sampleClassroom({ summaries: [{ id: "private" }] }), { now: NOW });
  assert.equal(pack.kind, "ingenium-class-pack");
  assert.equal(pack.version, 1);
  assert.equal(pack.exportedAt, NOW.toISOString());
  assert.ok(!Object.hasOwn(pack.classroom, "summaries"));

  const parsed = parseClassPack(JSON.stringify(pack));
  assert.equal(parsed.classroom.name, "Mecatrónica · 2.º ano");
  assert.equal(parsed.classroom.notices.length, 1);
  assert.equal(parsed.classroom.materials[0].hash, LONG_HASH);
  assert.equal(parsed.classroom.programme.events.length, 1);
});

test("pack parser reports format, version and empty packs distinctly", () => {
  assert.throws(() => parseClassPack("não é json"), (error) => error instanceof ClassPackError && error.code === "parse");
  assert.throws(() => parseClassPack({ kind: "outro" }), (error) => error.code === "format");
  assert.throws(() => parseClassPack({ kind: "ingenium-class-pack", version: 9, classroom: {} }), (error) => error.code === "version");
  assert.throws(() => parseClassPack({ kind: "ingenium-class-pack", version: 1, classroom: {} }), (error) => error.code === "empty");
  const namedOnly = parseClassPack({ kind: "ingenium-class-pack", version: 1, classroom: { name: "Turma vazia" } });
  assert.equal(namedOnly.classroom.name, "Turma vazia");
});

test("merging packs dedupes notices by id, materials by id and hash, and groups", () => {
  const base = sampleClassroom();
  const incoming = sampleClassroom({
    name: "Outro nome",
    owner: "Afonso",
    notices: [
      { id: "notice-test-1", title: "Duplicado", createdAt: "2026-10-21T09:00:00.000Z" },
      { id: "notice-test-2", title: "Novo aviso", kind: "entrega", createdAt: "2026-10-21T09:00:00.000Z" },
    ],
    materials: [
      { id: "material-test-1", title: "Duplicado por id", text: "x" },
      { id: "material-test-2", title: "Duplicado por hash", text: "x", hash: LONG_HASH },
      { id: "material-test-3", title: "Material novo", text: "x", hash: "b".repeat(64) },
    ],
    groups: [
      { id: "group-test-1", title: "Duplicado" },
      { id: "group-test-2", title: "Grupo novo" },
    ],
    members: [{ name: "Rafael" }, { name: "Novo Colega" }],
  });
  const { classroom, stats } = mergeClassPack(base, incoming);
  assert.equal(classroom.name, "Mecatrónica · 2.º ano");
  assert.equal(classroom.owner, "Rafael");
  assert.equal(classroom.notices.length, 2);
  assert.equal(classroom.materials.length, 2);
  assert.equal(classroom.groups.length, 2);
  assert.equal(classroom.members.length, 3);
  assert.deepEqual(stats, { notices: 1, materials: 1, groups: 1, members: 1, skipped: 5 });
  assert.ok(classroom.updatedAt);
});

test("merge adopts a teacher role only for an unclaimed class", () => {
  const student = mergeClassPack({ name: "Turma", owner: "", role: "student" }, { name: "Turma", role: "teacher", notices: sampleClassroom().notices });
  assert.equal(student.classroom.role, "teacher");
  const claimed = mergeClassPack({ name: "Turma", owner: "Rafael", role: "student" }, { name: "Turma", role: "teacher", notices: sampleClassroom().notices });
  assert.equal(claimed.classroom.role, "student");
});

test("packFileName produces a portable slug for accented class names", () => {
  assert.match(packFileName({ name: "Mecatrónica · 2.º ano" }), /^ingenium-mecatronica-2-ano-\d{4}-\d{2}-\d{2}\.json$/);
  assert.match(packFileName({}), /^ingenium-turma-\d{4}-\d{2}-\d{2}\.json$/);
});
