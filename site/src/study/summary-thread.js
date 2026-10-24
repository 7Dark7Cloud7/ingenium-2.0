const GENERIC_TERMS = new Set([
  'coisa', 'coisas', 'forma', 'parte', 'partes', 'valor', 'valores', 'exemplo', 'exemplos',
  'unidade', 'unidades', 'tempo', 'caso', 'casos', 'tipo', 'tipos', 'modo', 'modos',
  'thing', 'things', 'value', 'values', 'example', 'examples', 'unit', 'units', 'case', 'cases',
]);

export function stripKey(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function stemToken(token) {
  if (token.length > 5 && token.endsWith('s') && !token.endsWith('ss')) return token.slice(0, -1);
  return token;
}

function tokenKey(value) {
  return stripKey(value).split(' ').filter(Boolean).map(stemToken);
}

function containsSequence(longer, shorter) {
  if (!shorter.length || shorter.length > longer.length) return false;
  for (let index = 0; index <= longer.length - shorter.length; index += 1) {
    let matches = true;
    for (let offset = 0; offset < shorter.length; offset += 1) {
      if (longer[index + offset] !== shorter[offset]) {
        matches = false;
        break;
      }
    }
    if (matches) return true;
  }
  return false;
}

export function termsOverlap(left, right) {
  const a = tokenKey(left);
  const b = tokenKey(right);
  if (!a.length || !b.length) return false;
  if (a.join(' ') === b.join(' ')) return true;
  const short = a.length <= b.length ? a : b;
  const long = a.length <= b.length ? b : a;
  if (short.length === 1 && short[0].length < 4) return false;
  return containsSequence(long, short);
}

export function conceptTerms(analysis = {}) {
  const terms = new Map();
  const add = (value, kind, weight) => {
    const label = String(value ?? '').replace(/\s+/g, ' ').trim();
    const key = stripKey(label);
    if (!key || key.length < 3 || GENERIC_TERMS.has(key)) return;
    const existing = terms.get(key);
    if (existing) {
      existing.weight += weight;
      if (label.length > existing.label.length && kind === 'definition') existing.label = label;
      if (kind === 'definition') existing.kind = kind;
      return;
    }
    terms.set(key, { key, label, kind, weight });
  };
  for (const definition of analysis.definitions || []) add(definition.term, 'definition', 2);
  for (const keyword of analysis.keywords || []) add(keyword.term, 'keyword', 1);
  return [...terms.values()]
    .sort((a, b) => b.weight - a.weight || a.label.localeCompare(b.label))
    .slice(0, 14);
}

function matchTerms(currentTerms, previousTerms) {
  const shared = [];
  const matchedCurrent = new Set();
  const matchedPrevious = new Set();
  for (const current of currentTerms) {
    const previous = previousTerms.find((candidate) => !matchedPrevious.has(candidate.key) && termsOverlap(current.key, candidate.key));
    if (!previous) continue;
    matchedCurrent.add(current.key);
    matchedPrevious.add(previous.key);
    shared.push({ term: current.label, previousTerm: previous.label });
  }
  const fresh = currentTerms.filter((term) => !matchedCurrent.has(term.key));
  return { shared, fresh };
}

function dateValue(record) {
  const parsed = Date.parse(record?.createdAt || '');
  return Number.isFinite(parsed) ? parsed : 0;
}

export function buildSummaryThread(summaries = []) {
  const ordered = summaries
    .filter((entry) => entry?.record?.id)
    .map((entry, originalIndex) => ({ ...entry, originalIndex, time: dateValue(entry.record) }))
    .sort((a, b) => a.time - b.time || a.originalIndex - b.originalIndex);

  const groups = [];
  const groupBySubject = new Map();
  for (const entry of ordered) {
    const subject = entry.record.subject || entry.analysis?.subject || 'general';
    if (!groupBySubject.has(subject)) {
      const group = { subject, entries: [] };
      groupBySubject.set(subject, group);
      groups.push(group);
    }
    groupBySubject.get(subject).entries.push(entry);
  }

  const positions = Object.create(null);
  const all = [];
  ordered.forEach((entry, index) => {
    entry.overallOrder = index + 1;
    entry.overallTotal = ordered.length;
  });

  for (const group of groups) {
    group.entries.forEach((entry, index) => {
      const previous = index > 0 ? group.entries[index - 1] : null;
      const next = index < group.entries.length - 1 ? group.entries[index + 1] : null;
      const currentTerms = conceptTerms(entry.analysis);
      const previousTerms = previous ? conceptTerms(previous.analysis) : [];
      const { shared, fresh } = previous
        ? matchTerms(currentTerms, previousTerms)
        : { shared: [], fresh: currentTerms };
      const continuity = {
        subject: group.subject,
        position: index + 1,
        total: group.entries.length,
        isFirst: !previous,
        isLatest: !next,
        previous: previous ? { id: previous.record.id, title: previous.record.title } : null,
        next: next ? { id: next.record.id, title: next.record.title } : null,
        shared: shared.slice(0, 5),
        fresh: fresh.slice(0, 5).map((term) => term.label),
        hasShared: shared.length > 0,
      };
      entry.position = continuity.position;
      entry.subjectTotal = continuity.total;
      entry.isFirst = continuity.isFirst;
      entry.isLatest = continuity.isLatest;
      entry.previousId = continuity.previous?.id || null;
      entry.nextId = continuity.next?.id || null;
      entry.continuity = continuity;
      positions[entry.record.id] = entry;
      all.push(entry);
    });
  }

  return { entries: all, groups, positions };
}

export function continuityCopy(continuity, lang = 'pt') {
  const isPt = lang !== 'en';
  if (!continuity) return { label: '', detail: '' };
  if (continuity.isFirst) {
    return {
      label: isPt ? 'Primeiro resumo' : 'First summary',
      detail: continuity.total > 1
        ? (isPt
          ? 'Este é o ponto de partida desta matéria. Os próximos resumos vão continuar a partir daqui.'
          : 'This is the starting point for this subject. The next summaries will continue from here.')
        : (isPt
          ? 'Este é o primeiro resumo desta matéria. Quando adicionares outro, o Ingenium vai ligar os conceitos em comum.'
          : 'This is the first summary in this subject. When you add another, Ingenium will link shared concepts.'),
    };
  }
  const previousTitle = continuity.previous?.title || (isPt ? 'o resumo anterior' : 'the previous summary');
  if (continuity.hasShared) {
    const names = continuity.shared.map((item) => `«${item.term}»`).slice(0, 3).join(isPt ? ', ' : ', ');
    return {
      label: isPt ? `Continuação ${continuity.position}` : `Continuation ${continuity.position}`,
      detail: isPt
        ? `Continua «${previousTitle}». Conceitos que voltam: ${names}.`
        : `Continues “${previousTitle}”. Returning concepts: ${names}.`,
    };
  }
  return {
    label: isPt ? `Continuação ${continuity.position}` : `Continuation ${continuity.position}`,
    detail: isPt
      ? `Segue «${previousTitle}» na sequência, mas ainda não partilha conceitos com ele. Revê o anterior antes de avançar.`
      : `It follows “${previousTitle}” in the sequence but does not share concepts with it yet. Review the previous one before moving on.`,
  };
}
