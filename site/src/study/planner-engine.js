const MONTHS = new Map([
  ["janeiro", 1], ["fevereiro", 2], ["marco", 3], ["abril", 4], ["maio", 5], ["junho", 6],
  ["julho", 7], ["agosto", 8], ["setembro", 9], ["outubro", 10], ["novembro", 11], ["dezembro", 12],
  ["january", 1], ["february", 2], ["march", 3], ["april", 4], ["may", 5], ["june", 6],
  ["july", 7], ["august", 8], ["september", 9], ["october", 10], ["november", 11], ["december", 12],
]);

const WEEKDAYS = new Map([
  ["domingo", 0], ["segunda", 1], ["terca", 2], ["quarta", 3], ["quinta", 4], ["sexta", 5], ["sabado", 6],
  ["sunday", 0], ["monday", 1], ["tuesday", 2], ["wednesday", 3], ["thursday", 4], ["friday", 5], ["saturday", 6],
]);

const SUBJECT_PATTERNS = [
  ["algebra", /\b(alga|algebra|linear|matriz|matrizes|matrizes?|matrix|matrices|eigen|vetor(?:es)? proprios?)\b/i],
  ["chemistry", /\b(quimica|chemistry|quimica organica|molecula|moleculas|molecule|reacao|reacoes|reaction|estequiometria)\b/i],
  ["physics", /\b(fisica|physics|mecanica|mechanics|movimento|cinematica|kinematics|forca|forcas|energia|projectil|projetil|queda)\b/i],
  ["math", /\b(matematica|mathematics|math|sucessoes|sequences|calculo|calculus|funcoes|functions|trigonometria)\b/i],
];

const TYPE_PATTERNS = [
  ["exam", /\b(exame|exames|prova|provas|teste|testes|frequencia|frequencias|avaliacao|avaliacoes|exam|exams|test|midterm|final)\b/i],
  ["deadline", /\b(entrega|entregas|prazo|prazos|deadline|trabalho|trabalhos|projecto|projectos|projeto|projetos|relatorio|relatorios|apresentacao|assignment|project|report|submission)\b/i],
  ["class", /\b(aula|aulas|teorica|teoricas|pratica|praticas|laboratorio|laboratorial|lab|seminar|class|lecture)\b/i],
];

const MAX_EVENT_TITLE = 120;
const PLANNING_WINDOW = 28;

const pad = (value) => String(value).padStart(2, "0");

export function toIsoDate(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function fromIsoDate(value) {
  const [year, month, day] = String(value).split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function addDaysIso(value, amount) {
  const date = fromIsoDate(value);
  date.setDate(date.getDate() + amount);
  return toIsoDate(date);
}

export function daysUntil(value, now = new Date()) {
  const today = fromIsoDate(toIsoDate(now));
  const target = fromIsoDate(value);
  return Math.round((target - today) / 86400000);
}

export function startOfToday(now = new Date()) {
  return toIsoDate(now);
}

function normalizeForMatch(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function isValidDate(year, month, day) {
  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) return false;
  if (month < 1 || month > 12 || day < 1 || day > 31) return false;
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

function inferYear(day, month, now) {
  let year = now.getFullYear();
  const candidate = new Date(year, month - 1, day);
  const limit = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 45);
  if (candidate < limit) year += 1;
  return year;
}

function normalizeYear(raw, now) {
  if (!raw) return null;
  const number = Number(raw);
  if (!Number.isFinite(number)) return null;
  return number < 100 ? 2000 + number : number;
}

function matchDate(line, now) {
  const iso = line.match(/\b(20\d{2})[\/.-](\d{1,2})[\/.-](\d{1,2})\b/);
  if (iso) {
    const year = Number(iso[1]);
    const month = Number(iso[2]);
    const day = Number(iso[3]);
    if (isValidDate(year, month, day)) {
      return { iso: `${year}-${pad(month)}-${pad(day)}`, raw: iso[0], yearAssumed: false, index: iso.index ?? 0 };
    }
  }

  const numeric = line.match(/\b(\d{1,2})[\/.-](\d{1,2})(?:[\/.-](\d{2,4}))?\b/);
  if (numeric) {
    const day = Number(numeric[1]);
    const month = Number(numeric[2]);
    if (isValidDate(now.getFullYear(), month, day)) {
      const explicitYear = normalizeYear(numeric[3], now);
      const year = explicitYear ?? inferYear(day, month, now);
      if (isValidDate(year, month, day)) {
        return {
          iso: `${year}-${pad(month)}-${pad(day)}`,
          raw: numeric[0],
          yearAssumed: explicitYear === null,
          index: numeric.index ?? 0,
        };
      }
    }
  }

  const monthNames = line.matchAll(/\b(\d{1,2})\s*(?:de\s+)?([A-Za-zÀ-ÖØ-öø-ÿ]+)(?:\s*(?:de\s+|,\s*)(\d{4}))?/gu);
  for (const match of monthNames) {
    const day = Number(match[1]);
    const monthKey = normalizeForMatch(match[2]);
    const month = MONTHS.get(monthKey);
    if (!month) continue;
    const explicitYear = normalizeYear(match[3], now);
    const year = explicitYear ?? inferYear(day, month, now);
    if (!isValidDate(year, month, day)) continue;
    return {
      iso: `${year}-${pad(month)}-${pad(day)}`,
      raw: match[0],
      yearAssumed: explicitYear === null,
      index: match.index ?? 0,
    };
  }

  const relative = line.match(/(?:^|[^\p{L}])(hoje|today|amanh[aã]|tomorrow)(?=$|[^\p{L}])/iu);
  if (relative) {
    const word = normalizeForMatch(relative[1]);
    const offset = word === "hoje" || word === "today" ? 0 : 1;
    const index = (relative.index ?? 0) + relative[0].length - relative[1].length;
    return {
      iso: addDaysIso(toIsoDate(now), offset),
      raw: relative[1],
      yearAssumed: false,
      index,
    };
  }

  return null;
}

function timesInLine(line) {
  const results = [];
  const pattern = /\b([01]?\d|2[0-3])\s*(?::|h|H)\s*([0-5]\d)?\b/g;
  let match;
  while ((match = pattern.exec(line)) !== null) {
    const hour = Number(match[1]);
    const minute = match[2] === undefined ? 0 : Number(match[2]);
    results.push({
      raw: match[0],
      time: `${pad(hour)}:${pad(minute)}`,
      index: match.index,
    });
  }
  return results;
}

function detectType(title) {
  const normalized = normalizeForMatch(title);
  for (const [type, pattern] of TYPE_PATTERNS) {
    if (pattern.test(normalized)) return type;
  }
  return "other";
}

function detectSubject(title) {
  const normalized = normalizeForMatch(title);
  for (const [subject, pattern] of SUBJECT_PATTERNS) {
    if (pattern.test(normalized)) return subject;
  }
  return "general";
}

function cleanTitle(line, date, times) {
  let title = line;
  const removals = [];
  if (date) removals.push(date.raw);
  for (const time of times) removals.push(time.raw);
  removals.sort((a, b) => b.length - a.length);
  for (const removal of removals) {
    if (removal) title = title.replace(removal, " ");
  }
  title = title
    .replace(/^\s*(segunda|terça|terca|quarta|quinta|sexta|sábado|sabado|domingo)(-feira)?\b/i, " ")
    .replace(/(^|\s)(às|as|at|dia)(?=\s|$)/gi, " ")
    .replace(/[\s\-–—:;|,]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  title = title.replace(/^[\s\-–—:;|,.]+|[\s\-–—:;|,.]+$/g, "");
  return truncateAtWord(title, MAX_EVENT_TITLE);
}

function truncateAtWord(value, max) {
  const text = String(value ?? "").trim();
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const boundary = cut.lastIndexOf(" ");
  return `${(boundary > max * 0.55 ? cut.slice(0, boundary) : cut).trim()}…`;
}

function hashString(value) {
  let hash = 2166136261;
  const text = String(value);
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function eventIdFor(event) {
  return `ev-${hashString(`${event.date}|${event.time ?? ""}|${event.title}|${event.type}`).toString(36)}`;
}

function weekdayFromText(value) {
  const normalized = normalizeForMatch(value);
  const match = normalized.match(/\b(segundas?|tercas?|quartas?|quintas?|sextas?|sabados?|domingos?|mondays?|tuesdays?|wednesdays?|thursdays?|fridays?|saturdays?|sundays?)(-feira)?\b/);
  if (!match) return null;
  let word = match[1].replace(/s$/, "");
  if (word === "terca") word = "terca";
  const index = WEEKDAYS.get(word);
  if (index === undefined) return null;
  return { index, raw: match[0], length: match[0].length };
}

const PLACE_ONLY = /^(sala|lab|laborat[óo]rio|bloco|audit[óo]rio|anfiteatro|recinto)(\s*[-.]?\s*[\w.-]*)?$/i;

function courseHeadingFromLine(line) {
  if (/\d{1,2}:\d{2}/.test(line) || weekdayFromText(line)) return "";
  const words = line.split(/\s+/).filter(Boolean);
  if (!words.length || words.length > 7) return "";
  if (/[.!?…]$/.test(line)) return "";
  const hasCode = /\b[A-Z][A-Z0-9]{1,7}\b/.test(line);
  const hasDash = /[—–]/.test(line);
  const subjectWord = /(álgebra|algebra|física|fisica|química|quimica|matemática|matematica|mecatrón|mecatron|cálculo|calculo|análise|analise vector)/i.test(line);
  if (!(hasCode || hasDash || subjectWord)) return "";
  return line.replace(/\s*[—–]\s*/, " — ").replace(/\s+/g, " ").trim().slice(0, 60);
}

function parseWeekly(line, heading = "") {
  const weekday = weekdayFromText(line);
  if (!weekday) return null;
  const times = timesInLine(line);
  if (!times.length) return null;
  const start = times[0];
  const end = times.length > 1 && /[-–—]|às|as|to|a/.test(line.slice(start.index + start.raw.length, times[1].index)) ? times[1] : null;
  let title = line
    .replace(new RegExp(escapeRegExp(weekday.raw), "i"), " ")
    .replace(/\b(segunda|terça|terca|quarta|quinta|sexta|sábado|sabado|domingo)(-feira)?\b/giu, " ");
  for (const time of times) title = title.replace(time.raw, " ");
  title = title
    .replace(/(^|\s)(das|às|as|from|to|at)(?=\s|$)/gi, " ")
    .replace(/[\s\-–—:;|,]+/g, " ")
    .trim();
  const type = detectType(title) === "other" ? "class" : detectType(title);
  const onlyPlace = heading && PLACE_ONLY.test(title);
  const clean = onlyPlace
    ? `${heading} · ${title}`
    : (title || heading || (type === "exam" ? "Avaliação" : "Aula"));
  const ownSubject = detectSubject(title);
  const subject = ownSubject !== "general" ? ownSubject : detectSubject(`${clean} ${heading}`);
  return {
    id: `wk-${hashString(`${weekday.index}|${start.time}|${end?.time ?? ""}|${clean}`).toString(36)}`,
    weekday: weekday.index,
    start: start.time,
    end: end?.time ?? null,
    title: truncateAtWord(clean, MAX_EVENT_TITLE),
    subject,
    type,
  };
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function parseProgramme(text, { now = new Date() } = {}) {
  const normalized = String(text ?? "").replace(/\r\n?/g, "\n").replace(/\u00a0/g, " ");
  const lines = normalized.split("\n");
  const events = [];
  const weekly = [];
  const unparsed = [];
  const seenEvents = new Set();
  const seenWeekly = new Set();
  let dateLines = 0;
  let currentHeading = "";

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    const date = matchDate(line, now);
    if (!date) {
      const weeklyItem = parseWeekly(line, currentHeading);
      if (weeklyItem) {
        if (!seenWeekly.has(weeklyItem.id)) {
          seenWeekly.add(weeklyItem.id);
          weekly.push(weeklyItem);
        }
        continue;
      }
      const heading = courseHeadingFromLine(line);
      if (heading) {
        currentHeading = heading;
        continue;
      }
      const wordCount = line.split(/\s+/).filter(Boolean).length;
      const looksLikeHeading = /^#{1,6}\s+/.test(line)
        || /:\s*$/.test(line)
        || (wordCount <= 6 && !/[.!?…]$/.test(line) && (/^[A-ZÀ-ÖØ-Þ0-9\s\-–—/]+$/u.test(line)));
      if (!looksLikeHeading && line.length >= 6) {
        unparsed.push(line);
      }
      continue;
    }

    dateLines += 1;
    const times = timesInLine(line);
    const time = times[0]?.time ?? null;
    const rawTitle = cleanTitle(line, date, times);
    const type = detectType(rawTitle);
    const ownSubject = detectSubject(rawTitle);
    const subject = ownSubject !== "general" ? ownSubject : detectSubject(currentHeading);
    const labels = {
      exam: "Avaliação",
      deadline: "Entrega",
      class: "Aula",
      other: "Evento",
    };
    const title = rawTitle || labels[type] || "Evento";
    const event = {
      id: eventIdFor({ ...date, title, time, type }),
      date: date.iso,
      time,
      title,
      type,
      subject,
      source: line,
      yearAssumed: date.yearAssumed,
    };
    if (!seenEvents.has(event.id)) {
      seenEvents.add(event.id);
      events.push(event);
    }
  }

  events.sort((a, b) => `${a.date}T${a.time ?? "00:00"}`.localeCompare(`${b.date}T${b.time ?? "00:00"}`));
  weekly.sort((a, b) => a.weekday - b.weekday || a.start.localeCompare(b.start));
  return {
    events,
    weekly,
    unparsed: unparsed.slice(0, 8),
    stats: {
      lines: lines.filter((line) => line.trim()).length,
      dateLines,
      events: events.length,
      weekly: weekly.length,
      unparsed: unparsed.length,
    },
    parsedAt: new Date().toISOString(),
  };
}

export function getUpcomingEvents(programme = {}, now = new Date(), { includeClasses = false, limit = 20 } = {}) {
  const events = Array.isArray(programme?.events) ? programme.events : [];
  return events
    .filter((event) => includeClasses || event.type !== "class")
    .map((event) => ({ ...event, daysUntil: daysUntil(event.date, now) }))
    .filter((event) => event.daysUntil >= 0)
    .sort((a, b) => a.daysUntil - b.daysUntil || `${a.date}T${a.time ?? "00:00"}`.localeCompare(`${b.date}T${b.time ?? "00:00"}`))
    .slice(0, limit);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function interleaveBySubject(tasks) {
  const groups = new Map();
  for (const task of tasks) {
    const subject = task.subject || "general";
    if (!groups.has(subject)) groups.set(subject, []);
    groups.get(subject).push(task);
  }
  const result = [];
  let remaining = true;
  while (remaining) {
    remaining = false;
    for (const group of groups.values()) {
      if (group.length) {
        result.push(group.shift());
        remaining = true;
      }
    }
  }
  return result;
}

function deadlineLabels(lang, count) {
  const stagesPt = [
    "Planear os passos da entrega",
    "Recolher e organizar o material",
    "Escrever a primeira versão",
    "Rever critérios e preparar a entrega",
  ];
  const stagesEn = [
    "Plan the submission steps",
    "Gather and organise the material",
    "Write the first version",
    "Review the criteria and prepare submission",
  ];
  const stages = lang === "en" ? stagesEn : stagesPt;
  return stages.slice(0, count);
}

function makeFinalSession(event, date, lang) {
  const isDeadline = event.type === "deadline";
  return {
    key: `${event.id}:${date}:final`,
    date,
    eventId: event.id,
    eventTitle: event.title,
    subject: event.subject,
    kind: "final",
    typeLabel: event.type,
    title: lang === "en"
      ? `${isDeadline ? "Final check" : "Final review"}: ${event.title}`
      : `${isDeadline ? "Confirmação final" : "Revisão final"}: ${event.title}`,
    detail: lang === "en"
      ? (isDeadline
        ? "Check format, files and submission details. Submit with time to spare."
        : "Short review. Do not start new topics the day before.")
      : (isDeadline
        ? "Confirma formato, ficheiros e detalhes da entrega. Submete com margem."
        : "Revisão curta. Não comeces matéria nova na véspera."),
    href: null,
    duration: 20,
  };
}

function eventTaskQueue(event, tasks, summaries, lang) {
  if (event.type === "deadline") return [];
  const subjectTasks = tasks.filter((task) => task.subject === event.subject);
  const subjectSummaries = summaries
    .filter((summary) => summary.subject === event.subject)
    .map((summary) => ({
      key: `summary:${summary.id}`,
      subject: summary.subject,
      kind: "summary",
      title: lang === "en" ? `Review summary: ${summary.title}` : `Rever resumo: ${summary.title}`,
      detail: lang === "en" ? "Revisit your own notes, then test yourself." : "Relê as tuas notas e testa-te.",
      href: summary.href || `#summary/${summary.id}`,
      duration: 20,
    }));
  const queue = [...subjectTasks, ...subjectSummaries];
  if (queue.length) return queue;
  return [
    {
      key: `fallback:${event.subject}:review`,
      subject: event.subject,
      kind: "review",
      title: lang === "en" ? `Reread: ${event.title}` : `Rever: ${event.title}`,
      detail: lang === "en" ? "Go back to the notes and formulas for this assessment." : "Volta aos apontamentos e fórmulas desta avaliação.",
      href: null,
      duration: 30,
    },
    {
      key: `fallback:${event.subject}:practice`,
      subject: event.subject,
      kind: "practice",
      title: lang === "en" ? `Practise: ${event.title}` : `Praticar: ${event.title}`,
      detail: lang === "en" ? "Solve exercises without looking at the solution first." : "Resolve exercícios sem ver a solução primeiro.",
      href: null,
      duration: 40,
    },
    {
      key: `fallback:${event.subject}:test`,
      subject: event.subject,
      kind: "test",
      title: lang === "en" ? `Self-test: ${event.title}` : `Testar: ${event.title}`,
      detail: lang === "en" ? "Explain the essentials out loud or in writing." : "Explica o essencial em voz alta ou por escrito.",
      href: null,
      duration: 25,
    },
  ];
}

function candidateSessionsForEvent(event, tasks, summaries, now, lang) {
  const today = startOfToday(now);
  const offsetDays = daysUntil(event.date, now);
  if (offsetDays < 0 || offsetDays > PLANNING_WINDOW) return { content: [], final: [] };
  if (event.type === "class") return { content: [], final: [] };

  if (offsetDays === 0) {
    const queue = eventTaskQueue(event, tasks, summaries, lang);
    const task = queue[0] ?? {
      key: `today:${event.subject}`,
      title: lang === "en" ? `Prepare for: ${event.title}` : `Preparar: ${event.title}`,
      detail: lang === "en" ? "Check what you need and do one focused review." : "Confirma o que precisas e faz uma revisão focada.",
      href: null,
      duration: 20,
      kind: "review",
    };
    return {
      content: [{
        key: `${event.id}:${today}:${task.key}`,
        date: today,
        eventId: event.id,
        eventTitle: event.title,
        subject: event.subject,
        kind: "urgent",
        typeLabel: event.type,
        title: lang === "en" ? `Today: ${event.title}` : `Hoje: ${event.title}`,
        detail: task.detail || (lang === "en" ? "One focused review before the assessment." : "Uma revisão focada antes da avaliação."),
        href: task.href ?? null,
        duration: 20,
      }],
      final: [],
    };
  }

  let contentCount;
  if (event.type === "exam") contentCount = clamp(Math.ceil(offsetDays / 2), 1, 6);
  else if (event.type === "deadline") contentCount = clamp(Math.ceil(offsetDays / 3), 1, 4);
  else contentCount = 1;

  const span = Math.max(0, offsetDays - 1);
  const offsets = [];
  for (let index = 0; index < contentCount; index += 1) {
    const offset = contentCount === 1 ? 0 : Math.round((index * span) / (contentCount - 1));
    offsets.push(clamp(offset, 0, span));
  }
  const uniqueOffsets = [...new Set(offsets)];
  const queue = event.type === "deadline"
    ? deadlineLabels(lang, uniqueOffsets.length).map((title, index) => ({
      key: `deadline:${event.id}:${index}`,
      subject: event.subject,
      kind: "deliverable",
      title: `${title}: ${event.title}`,
      detail: lang === "en" ? "Break the submission into one concrete step." : "Divide a entrega num passo concreto.",
      href: null,
      duration: 40,
    }))
    : eventTaskQueue(event, tasks, summaries, lang);

  const content = uniqueOffsets.map((offset, index) => {
    const task = queue[index % Math.max(1, queue.length)] ?? queue[0];
    const date = addDaysIso(today, offset);
    return {
      key: `${event.id}:${date}:${task?.key ?? "review"}:${index}`,
      date,
      eventId: event.id,
      eventTitle: event.title,
      subject: event.subject,
      kind: task?.kind ?? "review",
      typeLabel: event.type,
      title: task?.title ?? event.title,
      detail: task?.detail ?? (lang === "en" ? "Focused study before the assessment." : "Estudo focado antes da avaliação."),
      href: task?.href ?? null,
      duration: task?.duration ?? 30,
    };
  });

  const final = offsetDays >= 2 ? [makeFinalSession(event, addDaysIso(event.date, -1), lang)] : [];
  return { content, final };
}

function placeSession(session, loadByDate, eventDate, today) {
  const isFinal = session.kind === "final";
  const limit = isFinal ? 3 : 2;
  if ((loadByDate.get(session.date)?.length ?? 0) < limit) return session.date;

  const eventIso = eventDate;
  for (let distance = 1; distance <= 6; distance += 1) {
    const before = addDaysIso(session.date, -distance);
    if (before >= today && before < eventIso && (loadByDate.get(before)?.length ?? 0) < limit) return before;
    const after = addDaysIso(session.date, distance);
    if (after >= today && after < eventIso && (loadByDate.get(after)?.length ?? 0) < limit) return after;
  }
  return null;
}

function fallbackPlan(tasks, summaries, now, lang) {
  const today = startOfToday(now);
  const pools = [];
  const interleavedTasks = interleaveBySubject(tasks);
  for (let index = 0; index < interleavedTasks.length; index += 1) {
    pools.push(interleavedTasks[index]);
    if (summaries.length && index % 3 === 1) {
      const summary = summaries[Math.floor(index / 3) % summaries.length];
      pools.push({
        key: `summary:${summary.id}`,
        subject: summary.subject,
        kind: "summary",
        title: lang === "en" ? `Review summary: ${summary.title}` : `Rever resumo: ${summary.title}`,
        detail: lang === "en" ? "Return to your own words and test yourself." : "Volta às tuas palavras e testa-te.",
        href: summary.href || `#summary/${summary.id}`,
        duration: 20,
      });
    }
  }
  if (!pools.length) {
    for (const summary of summaries) {
      pools.push({
        key: `summary:${summary.id}`,
        subject: summary.subject,
        kind: "summary",
        title: lang === "en" ? `Review summary: ${summary.title}` : `Rever resumo: ${summary.title}`,
        detail: lang === "en" ? "Return to your own words and test yourself." : "Volta às tuas palavras e testa-te.",
        href: summary.href || `#summary/${summary.id}`,
        duration: 20,
      });
    }
  }
  const offsets = [0, 1, 2, 4, 5, 6];
  const sessions = pools.slice(0, offsets.length).map((task, index) => ({
    key: `path:${addDaysIso(today, offsets[index])}:${task.key}`,
    date: addDaysIso(today, offsets[index]),
    eventId: null,
    eventTitle: null,
    subject: task.subject,
    kind: task.kind,
    typeLabel: null,
    title: task.title,
    detail: task.detail,
    href: task.href ?? null,
    duration: task.duration ?? 30,
  }));
  return sessions;
}

function sortAndNumberSessions(sessions) {
  const sorted = [...sessions].sort((a, b) => `${a.date}:${a.kind === "final" ? "9" : "0"}:${a.title}`.localeCompare(`${b.date}:${b.kind === "final" ? "9" : "0"}:${b.title}`));
  const byDate = new Map();
  for (const session of sorted) {
    const index = byDate.get(session.date) ?? 0;
    session.slot = index;
    byDate.set(session.date, index + 1);
  }
  return sorted;
}

export function buildStudyPlan({
  programme = {},
  now = new Date(),
  tasks = [],
  summaries = [],
  lang = "pt",
  windowDays = PLANNING_WINDOW,
} = {}) {
  const today = startOfToday(now);
  const upcoming = getUpcomingEvents(programme, now, { includeClasses: false, limit: 50 });
  const nextEvent = upcoming[0] ?? null;
  const inWindow = upcoming.filter((event) => event.daysUntil <= windowDays && event.type !== "class");
  const usableTasks = tasks
    .filter((task) => task && !task.done)
    .map((task) => ({
      ...task,
      key: task.key || `task-${hashString(task.title ?? "")}`,
      subject: task.subject || "general",
      duration: Number(task.duration) || 30,
    }));
  const usableSummaries = summaries
    .filter((summary) => summary && summary.id)
    .map((summary) => ({ ...summary, subject: summary.subject || "general" }));

  if (!inWindow.length) {
    const sessions = sortAndNumberSessions(fallbackPlan(usableTasks, usableSummaries, now, lang));
    return {
      sessions,
      nextEvent,
      eventsInWindow: 0,
      generatedFor: today,
      fallback: true,
      deferred: 0,
      note: lang === "en"
        ? "No dated assessments in the next four weeks. The plan follows your current path."
        : "Sem avaliações datadas nas próximas quatro semanas. O plano segue o teu percurso actual.",
    };
  }

  const loadByDate = new Map();
  const accepted = [];
  const seenKeys = new Set();
  let deferred = 0;

  for (const event of inWindow) {
    const candidates = candidateSessionsForEvent(event, usableTasks, usableSummaries, now, lang);
    for (const session of [...candidates.content, ...candidates.final]) {
      if (seenKeys.has(session.key)) continue;
      const placedDate = placeSession(session, loadByDate, event.date, today);
      if (!placedDate) {
        deferred += 1;
        continue;
      }
      seenKeys.add(session.key);
      const placed = { ...session, date: placedDate };
      accepted.push(placed);
      if (!loadByDate.has(placedDate)) loadByDate.set(placedDate, []);
      loadByDate.get(placedDate).push(placed);
    }
  }

  const sessions = sortAndNumberSessions(accepted);
  return {
    sessions,
    nextEvent,
    eventsInWindow: inWindow.length,
    generatedFor: today,
    fallback: false,
    deferred,
    note: deferred
      ? (lang === "en"
        ? `${deferred} extra session${deferred === 1 ? "" : "s"} did not fit before the deadlines. Complete the listed sessions and reopen the plan.`
        : `${deferred} sessão${deferred === 1 ? "" : "ões"} extra não cabia${deferred === 1 ? "" : "m"} antes dos prazos. Conclui as sessões listadas e volta a abrir o plano.`)
      : null,
  };
}

function escapeIcs(value) {
  return String(value ?? "")
    .replace(/\\/g, "\\\\")
    .replace(/\r?\n/g, "\\n")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,");
}

function foldIcsLine(line) {
  if (line.length <= 74) return line;
  const parts = [];
  let rest = line;
  while (rest.length > 74) {
    parts.push(rest.slice(0, 74));
    rest = rest.slice(74);
  }
  parts.push(rest);
  return parts.join("\r\n ");
}

function icsStamp(now) {
  return `${now.getUTCFullYear()}${pad(now.getUTCMonth() + 1)}${pad(now.getUTCDate())}T${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}${pad(now.getUTCSeconds())}Z`;
}

function icsDate(value) {
  return String(value).replace(/-/g, "");
}

function nextWeekdayDate(weekday, now) {
  const base = fromIsoDate(toIsoDate(now));
  const distance = (weekday - base.getDay() + 7) % 7;
  base.setDate(base.getDate() + distance);
  return toIsoDate(base);
}

export function buildIcs({ events = [], weekly = [], sessions = [], now = new Date() } = {}) {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Ingenium 2.0//Plano de estudo//PT",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
  ];
  const stamp = icsStamp(now);

  for (const event of events) {
    lines.push("BEGIN:VEVENT");
    lines.push(`UID:${escapeIcs(event.id || hashString(event.title))}@ingenium.local`);
    lines.push(`DTSTAMP:${stamp}`);
    if (event.date) {
      if (event.time) {
        lines.push(`DTSTART:${icsDate(event.date)}T${event.time.replace(":", "")}00`);
      } else {
        lines.push(`DTSTART;VALUE=DATE:${icsDate(event.date)}`);
      }
    }
    const kind = event.type === "exam" ? "Avaliação" : event.type === "deadline" ? "Entrega" : "Evento";
    lines.push(foldIcsLine(`SUMMARY:${escapeIcs(`${kind}: ${event.title}`)}`));
    lines.push(foldIcsLine(`DESCRIPTION:${escapeIcs(`Ingenium 2.0 · ${event.source || event.title}`)}`));
    if (event.subject && event.subject !== "general") {
      lines.push(`CATEGORIES:${escapeIcs(event.subject)}`);
    }
    lines.push("END:VEVENT");
  }

  for (const item of weekly) {
    const startDate = nextWeekdayDate(item.weekday, now);
    lines.push("BEGIN:VEVENT");
    lines.push(`UID:${escapeIcs(item.id || hashString(item.title))}@ingenium.local`);
    lines.push(`DTSTAMP:${stamp}`);
    lines.push(`DTSTART:${icsDate(startDate)}T${item.start.replace(":", "")}00`);
    if (item.end) lines.push(`DTEND:${icsDate(startDate)}T${item.end.replace(":", "")}00`);
    lines.push("RRULE:FREQ=WEEKLY;COUNT=16");
    lines.push(foldIcsLine(`SUMMARY:${escapeIcs(item.title)}`));
    lines.push("END:VEVENT");
  }

  for (const session of sessions) {
    if (!session.date) continue;
    const startHour = 18 + Math.min(Number(session.slot) || 0, 2);
    lines.push("BEGIN:VEVENT");
    lines.push(`UID:${escapeIcs(session.key || hashString(session.title))}@ingenium.local`);
    lines.push(`DTSTAMP:${stamp}`);
    lines.push(`DTSTART:${icsDate(session.date)}T${pad(startHour)}0000`);
    lines.push(`DURATION:PT${Number(session.duration) || 30}M`);
    lines.push(foldIcsLine(`SUMMARY:${escapeIcs(`Estudo · ${session.title}`)}`));
    if (session.detail || session.eventTitle) {
      lines.push(foldIcsLine(`DESCRIPTION:${escapeIcs([session.detail, session.eventTitle ? `Avaliação: ${session.eventTitle}` : ""].filter(Boolean).join(" · "))}`));
    }
    lines.push("BEGIN:VALARM");
    lines.push("TRIGGER:-PT15M");
    lines.push("ACTION:DISPLAY");
    lines.push(`DESCRIPTION:${escapeIcs(session.title)}`);
    lines.push("END:VALARM");
    lines.push("END:VEVENT");
  }

  lines.push("END:VCALENDAR");
  return `${lines.join("\r\n")}\r\n`;
}
