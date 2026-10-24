import test from "node:test";
import assert from "node:assert/strict";
import {
  toIsoDate,
  addDaysIso,
  daysUntil,
  parseProgramme,
  getUpcomingEvents,
  buildStudyPlan,
  buildIcs,
} from "../site/src/study/planner-engine.js";

const NOW = new Date(2026, 9, 22, 12, 0, 0);

const PROGRAMME_TEXT = [
  "Exame de Física — 05/11/2026 às 09:00",
  "Entrega do relatório de Química: 30/10/2026 às 23:59",
  "Aula teórica de ALGA — segunda-feira 08:00-10:00",
  "Prova de Matemática 12 de novembro de 2026",
  "Laboratório de Química quarta 14:00-16:00",
].join("\n");

test("date helpers move across month boundaries without timezone drift", () => {
  assert.equal(toIsoDate(NOW), "2026-10-22");
  assert.equal(addDaysIso("2026-10-31", 1), "2026-11-01");
  assert.equal(addDaysIso("2026-03-01", -1), "2026-02-28");
  assert.equal(daysUntil("2026-11-05", NOW), 14);
  assert.equal(daysUntil("2026-10-21", NOW), -1);
});

test("parseProgramme reads ISO dates, slashes and written month names", () => {
  const result = parseProgramme(PROGRAMME_TEXT, { now: NOW });
  assert.equal(result.events.length, 3);
  assert.deepEqual(result.events.map((event) => event.date), ["2026-10-30", "2026-11-05", "2026-11-12"]);
  assert.equal(result.events[0].time, "23:59");
  assert.equal(result.events[1].time, "09:00");
});

test("titles are cleaned and events get type and subject", () => {
  const result = parseProgramme(PROGRAMME_TEXT, { now: NOW });
  const [deadline, physics, math] = result.events;
  assert.equal(deadline.title, "Entrega do relatório de Química");
  assert.equal(deadline.type, "deadline");
  assert.equal(deadline.subject, "chemistry");
  assert.equal(physics.title, "Exame de Física");
  assert.equal(physics.type, "exam");
  assert.equal(physics.subject, "physics");
  assert.equal(math.title, "Prova de Matemática");
  assert.equal(math.subject, "math");
});

test("weekly timetable accepts the weekday in any position", () => {
  const result = parseProgramme(PROGRAMME_TEXT, { now: NOW });
  assert.equal(result.weekly.length, 2);
  const [algebra, lab] = result.weekly;
  assert.equal(algebra.weekday, 1);
  assert.equal(algebra.start, "08:00");
  assert.equal(algebra.end, "10:00");
  assert.equal(algebra.subject, "algebra");
  assert.equal(algebra.title, "Aula teórica de ALGA");
  assert.equal(lab.weekday, 3);
  assert.equal(lab.subject, "chemistry");
  assert.equal(lab.type, "class");
});

test("a course heading labels the weekly rows and events that follow it", () => {
  const result = parseProgramme([
    "ALGA — Álgebra Linear",
    "Terça 08:00-10:00 Sala 12",
    "Quinta 10:00-12:00 Lab. 3",
    "Prova intermédia: 12 de novembro de 2026",
  ].join("\n"), { now: NOW });
  assert.equal(result.weekly.length, 2);
  assert.equal(result.weekly[0].title, "ALGA — Álgebra Linear · Sala 12");
  assert.equal(result.weekly[0].subject, "algebra");
  assert.equal(result.weekly[1].title, "ALGA — Álgebra Linear · Lab. 3");
  assert.equal(result.events.length, 1);
  assert.equal(result.events[0].subject, "algebra");
  assert.deepEqual(result.unparsed, []);
});

test("relative dates and year inference work around the academic year", () => {
  const result = parseProgramme("Revisão hoje às 18:00\nExame 05/01\nTrabalho amanhã", { now: NOW });
  assert.equal(result.events.length, 3);
  const today = result.events.find((event) => event.title === "Revisão");
  const inferred = result.events.find((event) => event.title === "Exame");
  const tomorrow = result.events.find((event) => event.title === "Trabalho");
  assert.equal(today.date, "2026-10-22");
  assert.equal(tomorrow.date, "2026-10-23");
  assert.equal(inferred.date, "2027-01-05");
  assert.equal(inferred.yearAssumed, true);
});

test("unparsed content is reported instead of silently dropped", () => {
  const result = parseProgramme("Exame 05/11/2026\nler capítulos 3 e 4 com atenção redobrada", { now: NOW });
  assert.equal(result.unparsed.length, 1);
  assert.match(result.unparsed[0], /capítulos/);
  assert.equal(result.stats.unparsed, 1);
});

test("getUpcomingEvents hides past items and classes by default", () => {
  const programme = parseProgramme(PROGRAMME_TEXT, { now: NOW });
  const upcoming = getUpcomingEvents(programme, NOW);
  assert.equal(upcoming.length, 3);
  assert.ok(upcoming.every((event) => event.daysUntil >= 0));
  assert.equal(upcoming[0].title, "Entrega do relatório de Química");
  assert.equal(upcoming[0].daysUntil, 8);
});

test("study plan schedules work before each deadline and never after it", () => {
  const programme = parseProgramme(PROGRAMME_TEXT, { now: NOW });
  const tasks = [
    { key: "vectors", title: "Rever vectores", subject: "physics", href: "#lesson/vector-operations" },
    { key: "matrices", title: "Exercícios de matrizes", subject: "algebra", href: "#lesson/matrices" },
    { key: "sequences", title: "Rever sucessões", subject: "math", href: "#topic/math" },
  ];
  const summaries = [{ id: "s1", title: "Queda livre", subject: "physics" }];
  const plan = buildStudyPlan({ programme, now: NOW, tasks, summaries, lang: "pt" });
  assert.equal(plan.fallback, false);
  assert.ok(plan.sessions.length >= 6);
  for (const session of plan.sessions) {
    assert.ok(session.date >= "2026-10-22");
    if (session.eventId) {
      const event = programme.events.find((item) => item.id === session.eventId);
      assert.ok(session.date < event.date || (event.date === "2026-10-22" && session.date === event.date));
    }
    assert.equal(typeof session.title, "string");
    assert.ok(session.title.length > 3);
  }
  const physicsExam = programme.events.find((event) => event.subject === "physics");
  assert.ok(plan.sessions.some((session) => session.kind === "final" && session.date === "2026-11-04" && session.eventId === physicsExam.id));
  assert.ok(plan.sessions.some((session) => session.href === "#lesson/vector-operations"));
  assert.ok(plan.sessions.some((session) => session.subject === "math"));
});

test("plan falls back to the current study path when no dates exist", () => {
  const tasks = [
    { key: "t1", title: "Rever vectores", subject: "physics" },
    { key: "t2", title: "Matrizes", subject: "algebra" },
    { key: "t3", title: "Sucessões", subject: "math" },
    { key: "t4", title: "Queda livre", subject: "physics" },
    { key: "t5", title: "Determinantes", subject: "algebra" },
    { key: "t6", title: "Funções", subject: "math" },
  ];
  const plan = buildStudyPlan({ programme: {}, now: NOW, tasks, summaries: [], lang: "pt" });
  assert.equal(plan.fallback, true);
  assert.equal(plan.sessions.length, 6);
  assert.equal(plan.sessions[0].date, "2026-10-22");
  assert.deepEqual(plan.sessions.map((session) => session.date), ["2026-10-22", "2026-10-23", "2026-10-24", "2026-10-26", "2026-10-27", "2026-10-28"]);
  assert.match(plan.note, /Sem avaliações datadas/);
  assert.equal(new Set(plan.sessions.map((session) => session.subject)).size, 3);
});

test("fallback plan stays empty rather than inventing sessions", () => {
  const plan = buildStudyPlan({ programme: {}, now: NOW, tasks: [], summaries: [], lang: "pt" });
  assert.equal(plan.fallback, true);
  assert.equal(plan.sessions.length, 0);
});

test("completed sessions disappear from a regenerated plan", () => {
  const programme = parseProgramme(PROGRAMME_TEXT, { now: NOW });
  const first = buildStudyPlan({ programme, now: NOW, tasks: [{ key: "t1", title: "Rever vectores", subject: "physics" }], lang: "pt" });
  const doneKey = first.sessions[0].key;
  const doneKeys = new Set([doneKey]);
  const second = buildStudyPlan({
    programme,
    now: NOW,
    tasks: first.sessions.filter((session) => !doneKeys.has(session.key)).map((session) => ({
      key: session.key,
      title: session.title,
      subject: session.subject,
      href: session.href,
      duration: session.duration,
    })),
    lang: "pt",
  });
  assert.ok(second.sessions.length >= 1);
});

test("ICS export contains events, recurring classes and reminders", () => {
  const programme = parseProgramme(PROGRAMME_TEXT, { now: NOW });
  const plan = buildStudyPlan({ programme, now: NOW, tasks: [], lang: "pt" });
  const ics = buildIcs({ events: programme.events, weekly: programme.weekly, sessions: plan.sessions.slice(0, 2), now: NOW });
  assert.ok(ics.startsWith("BEGIN:VCALENDAR"));
  assert.ok(ics.endsWith("END:VCALENDAR\r\n"));
  assert.ok(ics.includes("RRULE:FREQ=WEEKLY;COUNT=16"));
  assert.ok(ics.includes("BEGIN:VALARM"));
  assert.ok(ics.includes("TRIGGER:-PT15M"));
  assert.ok(ics.includes("DTSTART:20261105T090000"));
  assert.ok(ics.includes("DTSTART;VALUE=DATE:20261112"));
  assert.ok(ics.includes("DTSTART:20261026T080000"));
  assert.ok(ics.includes("DTEND:20261026T100000"));
  assert.ok(ics.includes("SUMMARY:Avaliação: Exame de Física"));
  for (const line of ics.split("\r\n")) {
    assert.ok(line.length <= 75, `ICS line too long: ${line}`);
  }
});

test("ICS escapes commas, semicolons and newlines in user text", () => {
  const ics = buildIcs({
    events: [{ id: "e1", date: "2026-11-05", title: "Exame, Física; parte A", type: "exam", source: "linha 1\nlinha 2" }],
    now: NOW,
  });
  assert.ok(ics.includes("SUMMARY:Avaliação: Exame\\, Física\\; parte A"));
  assert.ok(ics.includes("linha 1\\nlinha 2"));
});
