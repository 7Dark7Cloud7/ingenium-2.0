export const CLASS_LIMITS = {
  notices: 120,
  materials: 50,
  groups: 40,
  members: 100,
  materialText: 12000,
  programmeText: 20000,
  packBytes: 3 * 1024 * 1024,
};

export const CLASS_SUBJECTS = ['math', 'physics', 'chemistry', 'algebra', 'general'];
export const CLASS_ROLES = ['student', 'teacher'];
export const NOTICE_KINDS = ['aviso', 'alteracao', 'entrega', 'exame', 'material'];
export const MATERIAL_KINDS = ['programa', 'teste', 'apontamento', 'enunciado', 'outro'];

const PACK_KIND = 'ingenium-class-pack';
const PACK_VERSION = 1;

const text = (value, max) => String(value ?? '').replace(/\s+/g, ' ').trim().slice(0, max);
const block = (value, max) => String(value ?? '').replace(/\r\n?/g, '\n').trim().slice(0, max);
const isoDate = (value) => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day, 12);
  if (!Number.isFinite(date.getTime())) return null;
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day ? value : null;
};
const timestamp = (value) => {
  if (typeof value !== 'string') return new Date().toISOString();
  const time = Date.parse(value);
  return Number.isFinite(time) ? new Date(time).toISOString() : new Date().toISOString();
};
const role = (value) => (CLASS_ROLES.includes(value) ? value : 'student');
const subject = (value) => (CLASS_SUBJECTS.includes(value) ? value : 'general');
const safeLink = (value) => {
  const raw = String(value ?? '').trim();
  if (!/^https?:\/\//i.test(raw)) return '';
  try {
    const url = new URL(raw);
    return ['http:', 'https:'].includes(url.protocol) ? url.toString().slice(0, 500) : '';
  } catch {
    return '';
  }
};
const safeId = (value) => {
  const raw = String(value ?? '');
  return /^[a-z0-9][a-z0-9-]{4,63}$/i.test(raw) ? raw : newId();
};
const uniqueNames = (items) => {
  const seen = new Set();
  return items.filter((item) => {
    const key = item.name.toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const timeValue = (value) => {
  const match = String(value ?? '').match(/^([01]\d|2[0-3]):([0-5]\d)$/);
  return match ? `${match[1]}:${match[2]}` : null;
};

const normalizeEvent = (value) => {
  if (!value || typeof value !== 'object') return null;
  const title = text(value.title, 120);
  const date = isoDate(value.date);
  if (!title || !date) return null;
  return {
    id: safeId(value.id),
    date,
    time: timeValue(value.time),
    title,
    type: ['exam', 'deadline', 'class', 'other'].includes(value.type) ? value.type : 'other',
    subject: subject(value.subject),
    source: block(value.source, 300),
    yearAssumed: value.yearAssumed === true,
  };
};

const normalizeWeekly = (value) => {
  if (!value || typeof value !== 'object') return null;
  const title = text(value.title, 120);
  const start = timeValue(value.start);
  const weekday = Number(value.weekday);
  if (!title || !start || !Number.isInteger(weekday) || weekday < 0 || weekday > 6) return null;
  return {
    id: safeId(value.id),
    weekday,
    start,
    end: timeValue(value.end),
    title,
    subject: subject(value.subject),
    type: ['exam', 'deadline', 'class', 'other'].includes(value.type) ? value.type : 'class',
  };
};

const normalizeProgramme = (value) => {
  if (!value || typeof value !== 'object') return { text: '', sourceName: '', updatedAt: null, events: [], weekly: [], stats: { events: 0, weekly: 0 }, parsedAt: null };
  const events = (Array.isArray(value.events) ? value.events : []).map(normalizeEvent).filter(Boolean).slice(0, 200);
  const weekly = (Array.isArray(value.weekly) ? value.weekly : []).map(normalizeWeekly).filter(Boolean).slice(0, 60);
  return {
    text: block(value.text, CLASS_LIMITS.programmeText),
    sourceName: text(value.sourceName, 120),
    updatedAt: value.updatedAt ? timestamp(value.updatedAt) : null,
    events,
    weekly,
    stats: { events: events.length, weekly: weekly.length },
    parsedAt: value.parsedAt ? timestamp(value.parsedAt) : null,
  };
};

export function newId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function makeClassCode(seed = '') {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const clean = String(seed || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  const prefix = (clean.slice(0, 3) || 'TUR').padEnd(3, 'X');
  let code = '';
  const random = globalThis.crypto?.getRandomValues ? globalThis.crypto.getRandomValues(new Uint32Array(5)) : null;
  for (let index = 0; index < 4; index += 1) {
    const value = random ? random[index] : Math.floor(Math.random() * 1e9);
    code += alphabet[Math.abs(value) % alphabet.length];
  }
  return `${prefix}-${code}`;
}

export function todayIso(now = new Date()) {
  const date = new Date(now);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function normalizeMember(value) {
  if (!value || typeof value !== 'object') return null;
  const name = text(value.name, 70);
  if (!name) return null;
  return { name, role: role(value.role), joinedAt: timestamp(value.joinedAt) };
}

export function normalizeNotice(value) {
  if (!value || typeof value !== 'object') return null;
  const title = text(value.title, 120);
  if (!title) return null;
  return {
    id: safeId(value.id),
    kind: NOTICE_KINDS.includes(value.kind) ? value.kind : 'aviso',
    title,
    body: block(value.body, 2000),
    dueAt: isoDate(value.dueAt),
    pinned: value.pinned === true,
    createdAt: timestamp(value.createdAt),
    author: text(value.author, 70),
    role: role(value.role),
  };
}

export function normalizeMaterial(value) {
  if (!value || typeof value !== 'object') return null;
  const title = text(value.title, 120);
  const materialText = block(value.text, CLASS_LIMITS.materialText);
  const link = safeLink(value.link);
  if (!title || (!materialText && !link)) return null;
  return {
    id: safeId(value.id),
    kind: MATERIAL_KINDS.includes(value.kind) ? value.kind : 'outro',
    subject: subject(value.subject),
    title,
    description: text(value.description, 400),
    text: materialText,
    link,
    fileName: text(value.fileName, 120),
    size: Number.isFinite(Number(value.size)) ? Math.max(0, Math.min(Number(value.size), 20 * 1024 * 1024)) : 0,
    hash: /^[a-f0-9]{64}$/i.test(String(value.hash || '')) ? String(value.hash).toLowerCase() : '',
    createdAt: timestamp(value.createdAt),
    author: text(value.author, 70),
    role: role(value.role),
  };
}

export function normalizeStudyGroup(value) {
  if (!value || typeof value !== 'object') return null;
  const title = text(value.title, 90);
  if (!title) return null;
  const capacity = Math.max(2, Math.min(200, Number.parseInt(value.capacity, 10) || 6));
  const members = uniqueNames((Array.isArray(value.members) ? value.members : []).map((name) => ({ name: text(name, 70) })).filter((item) => item.name));
  return {
    id: safeId(value.id),
    title,
    topic: text(value.topic, 120),
    when: text(value.when, 90),
    place: text(value.place, 90),
    capacity,
    members: members.map((item) => item.name).slice(0, capacity),
    createdAt: timestamp(value.createdAt),
    author: text(value.author, 70),
  };
}

export function emptyClassroom() {
  return {
    name: '',
    institution: '',
    course: 'Mecatrónica',
    year: '',
    code: '',
    owner: '',
    role: 'student',
    members: [],
    notices: [],
    materials: [],
    groups: [],
    programme: { text: '', sourceName: '', updatedAt: null, events: [], weekly: [], stats: { events: 0, weekly: 0 }, parsedAt: null },
    updatedAt: null,
  };
}

export function normalizeClassroom(value) {
  const base = emptyClassroom();
  if (!value || typeof value !== 'object') return base;
  const members = uniqueNames((Array.isArray(value.members) ? value.members : []).map(normalizeMember).filter(Boolean)).slice(0, CLASS_LIMITS.members);
  const notices = (Array.isArray(value.notices) ? value.notices : []).map(normalizeNotice).filter(Boolean).slice(0, CLASS_LIMITS.notices);
  const materials = (Array.isArray(value.materials) ? value.materials : []).map(normalizeMaterial).filter(Boolean).slice(0, CLASS_LIMITS.materials);
  const groups = (Array.isArray(value.groups) ? value.groups : []).map(normalizeStudyGroup).filter(Boolean).slice(0, CLASS_LIMITS.groups);
  const programme = normalizeProgramme(value.programme);
  return {
    name: text(value.name, 90),
    institution: text(value.institution, 120),
    course: text(value.course, 90),
    year: text(value.year, 40),
    code: /^[A-Z0-9-]{3,24}$/.test(String(value.code || '')) ? String(value.code) : '',
    owner: text(value.owner, 70),
    role: role(value.role),
    members,
    notices,
    materials,
    groups,
    programme,
    updatedAt: value.updatedAt ? timestamp(value.updatedAt) : null,
  };
}

export function noticeSort(a, b) {
  if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
  return Date.parse(b.createdAt) - Date.parse(a.createdAt);
}

export function classPackStats(classroom) {
  const room = normalizeClassroom(classroom);
  return {
    notices: room.notices.length,
    materials: room.materials.length,
    groups: room.groups.length,
    members: room.members.length,
    pinned: room.notices.filter((notice) => notice.pinned).length,
  };
}

export function buildClassPack(classroom, { now = new Date() } = {}) {
  const room = normalizeClassroom(classroom);
  return {
    kind: PACK_KIND,
    version: PACK_VERSION,
    exportedAt: now.toISOString(),
    generator: 'Ingenium 2.0 · irmãos Bulezi',
    classroom: {
      name: room.name,
      institution: room.institution,
      course: room.course,
      year: room.year,
      code: room.code,
      owner: room.owner,
      role: room.role,
      members: room.members,
      notices: room.notices.slice().sort(noticeSort),
      materials: room.materials,
      groups: room.groups,
      programme: room.programme,
    },
  };
}

export class ClassPackError extends Error {
  constructor(code) {
    super(code);
    this.name = 'ClassPackError';
    this.code = code;
  }
}

export function classPackErrorMessage(code, lang = 'pt') {
  const isPt = lang !== 'en';
  const messages = {
    format: isPt ? 'Este ficheiro não é um pacote de turma do Ingenium.' : 'This file is not an Ingenium class pack.',
    version: isPt ? 'Este pacote foi criado por uma versão mais recente e não pode ser lido aqui.' : 'This pack was created by a newer version and cannot be read here.',
    empty: isPt ? 'O pacote não contém dados de turma.' : 'The pack contains no class data.',
    size: isPt ? 'O pacote é demasiado grande. O limite é 3 MB.' : 'The pack is too large. The limit is 3 MB.',
    parse: isPt ? 'Não consegui ler o ficheiro. Confirma que é um pacote .json exportado pelo Ingenium.' : 'Could not read the file. Make sure it is a .json pack exported by Ingenium.',
    save: isPt ? 'O navegador recusou guardar a turma importada. Liberta espaço e tenta outra vez.' : 'The browser refused to save the imported class. Free some space and try again.',
  };
  return messages[code] || messages.parse;
}

export function parseClassPack(raw) {
  let value = raw;
  if (typeof raw === 'string') {
    try {
      value = JSON.parse(raw);
    } catch {
      throw new ClassPackError('parse');
    }
  }
  if (!value || typeof value !== 'object' || value.kind !== PACK_KIND) throw new ClassPackError('format');
  if (Number(value.version) !== PACK_VERSION) throw new ClassPackError('version');
  if (!value.classroom || typeof value.classroom !== 'object') throw new ClassPackError('format');
  const classroom = normalizeClassroom(value.classroom);
  const stats = classPackStats(classroom);
  if (!classroom.name && !stats.notices && !stats.materials && !stats.groups && !classroom.programme.text) throw new ClassPackError('empty');
  return { classroom, exportedAt: timestamp(value.exportedAt) };
}

export function mergeClassPack(current, incoming) {
  const base = normalizeClassroom(current);
  const pack = normalizeClassroom(incoming);
  const stats = { notices: 0, materials: 0, groups: 0, members: 0, skipped: 0 };
  const profile = { ...base };
  for (const field of ['name', 'institution', 'course', 'year', 'code', 'owner']) {
    if (!profile[field] && pack[field]) profile[field] = pack[field];
  }
  if (!base.programme.text && pack.programme.text) profile.programme = pack.programme;
  if (base.role === 'student' && pack.role === 'teacher' && !base.owner && !base.members.length) profile.role = 'teacher';

  const memberNames = new Set(base.members.map((member) => member.name.toLowerCase()));
  for (const member of pack.members) {
    if (memberNames.has(member.name.toLowerCase())) { stats.skipped += 1; continue; }
    memberNames.add(member.name.toLowerCase());
    profile.members.push(member);
    stats.members += 1;
  }

  const noticeIds = new Set(base.notices.map((notice) => notice.id));
  for (const notice of pack.notices) {
    if (noticeIds.has(notice.id)) { stats.skipped += 1; continue; }
    noticeIds.add(notice.id);
    profile.notices.push(notice);
    stats.notices += 1;
  }

  const materialIds = new Set(base.materials.map((material) => material.id));
  const materialHashes = new Set(base.materials.map((material) => material.hash).filter(Boolean));
  for (const material of pack.materials) {
    if (materialIds.has(material.id) || (material.hash && materialHashes.has(material.hash))) {
      stats.skipped += 1;
      continue;
    }
    materialIds.add(material.id);
    if (material.hash) materialHashes.add(material.hash);
    profile.materials.push(material);
    stats.materials += 1;
  }

  const groupIds = new Set(base.groups.map((group) => group.id));
  for (const group of pack.groups) {
    if (groupIds.has(group.id)) { stats.skipped += 1; continue; }
    groupIds.add(group.id);
    profile.groups.push(group);
    stats.groups += 1;
  }

  profile.members = profile.members.slice(0, CLASS_LIMITS.members);
  profile.notices = profile.notices.sort(noticeSort).slice(0, CLASS_LIMITS.notices);
  profile.materials = profile.materials.slice(-CLASS_LIMITS.materials);
  profile.groups = profile.groups.slice(-CLASS_LIMITS.groups);
  profile.updatedAt = new Date().toISOString();
  return { classroom: profile, stats };
}

export function packFileName(classroom) {
  const room = normalizeClassroom(classroom);
  const slug = (room.name || room.course || 'turma')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40) || 'turma';
  return `ingenium-${slug}-${todayIso()}.json`;
}

export function upcomingClassEvents(notices = [], now = new Date(), { limit = 5 } = {}) {
  const today = todayIso(now);
  return notices
    .filter((notice) => notice?.dueAt && notice.dueAt >= today)
    .sort((a, b) => a.dueAt.localeCompare(b.dueAt))
    .slice(0, limit);
}

export function classSearchIndex(classroom) {
  const room = normalizeClassroom(classroom);
  return [
    ...room.notices.map((notice) => ({ type: 'notice', id: notice.id, title: notice.title, body: notice.body })),
    ...room.materials.map((material) => ({ type: 'material', id: material.id, title: material.title, body: `${material.description} ${material.text}`.slice(0, 1200) })),
    ...room.groups.map((group) => ({ type: 'group', id: group.id, title: group.title, body: `${group.topic} ${group.when} ${group.place}` })),
  ];
}
