import {
  CLASS_LIMITS,
  CLASS_SUBJECTS,
  MATERIAL_KINDS,
  NOTICE_KINDS,
  classPackStats,
  noticeSort,
  todayIso,
  upcomingClassEvents,
} from '../study/classroom-engine.js';
import { formatFileSize } from '../study/file-import.js';
import { subjectLabel } from './summaries-page.js';

const TABS = ['board', 'materials', 'programme', 'groups', 'teach'];

const COPY = {
  pt: {
    study: 'Estudo',
    home: 'Início',
    kicker: 'TURMA · LOCAL-FIRST',
    title: 'A turma toda, organizada.',
    lead: 'Avisos do professor, materiais, testes passados, programa e grupos de estudo num só lugar. Cada pessoa guarda a turma no seu dispositivo e partilha um pacote — sem contas nem servidores.',
    setupTitle: 'Cria a tua turma',
    setupLead: 'Estes dados ficam neste navegador. O código da turma identifica o pacote quando o partilhas; não dá acesso a nenhum servidor.',
    className: 'Nome da turma',
    institution: 'Instituição',
    course: 'Curso',
    year: 'Ano / semestre',
    owner: 'O teu nome',
    role: 'Entras como',
    code: 'Código da turma',
    codeHint: 'Deixa vazio para gerar um código.',
    create: 'Criar turma',
    saveProfile: 'Guardar alterações',
    student: 'Estudante',
    teacher: 'Professor(a)',
    declared: 'auto-declarado',
    edit: 'Editar turma',
    share: 'Partilhar pacote',
    download: 'Transferir .json',
    importPack: 'Importar pacote',
    codeCopy: 'Copiar código',
    localOnly: 'Sem servidor',
    packNote: 'O pacote leva avisos, materiais, programa e grupos. Os teus resumos pessoais não vão dentro dele.',
    tabBoard: 'Mural',
    tabMaterials: 'Materiais',
    tabProgramme: 'Programa',
    tabGroups: 'Grupos',
    tabTeach: 'Aulas',
    statNotices: 'avisos',
    statMaterials: 'materiais',
    statGroups: 'grupos',
    statMembers: 'colegas',
    postNotice: 'Publicar um aviso',
    noticeKind: 'Tipo',
    noticeTitle: 'Título',
    noticeBody: 'Mensagem',
    noticeDue: 'Data limite (opcional)',
    noticePin: 'Fixar no topo',
    publish: 'Publicar',
    noNotices: 'Ainda não há avisos.',
    noNoticesLead: 'Publica o primeiro aviso: uma alteração de sala, uma entrega ou um teste.',
    upcoming: 'Próximas datas',
    noUpcoming: 'Sem datas marcadas.',
    addMaterial: 'Adicionar material',
    materialKind: 'Tipo de material',
    materialSubject: 'Matéria',
    materialTitle: 'Título',
    materialDesc: 'Descrição curta',
    materialLink: 'Link (opcional)',
    materialText: 'Texto ou apontamento',
    materialTextHint: 'Cola aqui o texto. Para PDFs e fotos, usa o importador abaixo — o ficheiro é lido neste dispositivo.',
    add: 'Adicionar',
    importFile: 'Importar PDF ou foto',
    importing: 'A ler o ficheiro…',
    noMaterials: 'Ainda não há materiais.',
    noMaterialsLead: 'Traz o programa, um teste passado ou apontamentos. Também podes importar um PDF ou uma foto.',
    kindProgramme: 'Programa',
    kindTest: 'Teste passado',
    kindNotes: 'Apontamento',
    kindStatement: 'Enunciado',
    kindOther: 'Outro',
    openLink: 'Abrir link',
    showText: 'Ver texto extraído',
    summarize: 'Transformar em resumo',
    copyText: 'Copiar texto',
    delete: 'Apagar',
    file: 'Ficheiro',
    materialPrivacy: 'O ficheiro original não é guardado nem enviado. Só o texto extraído fica neste dispositivo.',
    programmeTitle: 'Programa e horário da turma',
    programmeLead: 'Cola o programa do semestre ou importa o PDF. O Ingenium reconhece datas, avaliações e aulas semanais.',
    programmePlaceholder: 'Exame de Física — 05/11/2026 às 09:00\nEntrega do relatório de Química: 30/10/2026 às 23:59\nAula de ALGA — segunda-feira 08:00-10:00',
    saveProgramme: 'Ler programa',
    importProgramme: 'Importar PDF do programa',
    openPlanner: 'Abrir no plano de estudo',
    clearProgramme: 'Limpar programa',
    parsedEvents: 'datas e avaliações',
    parsedWeekly: 'aulas semanais',
    parsedNone: 'Ainda não há programa lido.',
    parsedNoneLead: 'Cola o texto ou importa o PDF. As datas ficam organizadas e podem alimentar o teu plano de estudo.',
    weeklyClasses: 'Horário semanal',
    nextDates: 'Próximas datas',
    groupsTitle: 'Grupos de estudo',
    groupsLead: 'Cria um grupo para uma matéria ou um teste. A lista de membros é local e viaja no pacote da turma.',
    groupTitle: 'Nome do grupo',
    groupTopic: 'Tema',
    groupWhen: 'Quando se encontram',
    groupPlace: 'Onde',
    groupCapacity: 'Limite de pessoas',
    createGroup: 'Criar grupo',
    join: 'Entrar',
    leave: 'Sair',
    joined: 'Estás neste grupo',
    full: 'Grupo cheio',
    members: 'pessoas',
    noGroups: 'Ainda não há grupos.',
    noGroupsLead: 'Cria o primeiro grupo de estudo para um teste ou uma matéria difícil.',
    roster: 'Colegas da turma',
    rosterLead: 'Uma lista simples para saberes quem está no pacote. Ninguém é validado pela instituição.',
    memberName: 'Nome do colega',
    memberRole: 'Papel',
    addMember: 'Adicionar colega',
    noMembers: 'Ainda não adicionaste colegas.',
    teachTitle: 'Modo aula e projetor',
    teachLead: 'Abre um resumo em modo de apresentação: letras grandes, conceitos, aplicações reais e a sala 3D. Pensado para o projetor da sala de aula.',
    projector: 'Projetar',
    openSummary: 'Abrir resumo',
    noSummaries: 'Ainda não há resumos para projetar.',
    noSummariesLead: 'Cria um resumo na área de estudo e volta aqui para o apresentar à turma.',
    assessments: 'Avaliações e entregas',
    noAssessments: 'Sem avaliações marcadas no mural.',
    creditsTitle: 'Quem fez o Ingenium',
    creditsBody: 'O Ingenium 2.0 foi criado pelos irmãos Bulezi — Rafael Bulezi e Afonso Bulezi — para tornar o estudo universitário mais claro, visual e colaborativo.',
    honestTitle: 'O que é honesto dizer',
    honestBody: 'Esta turma é local-first: não há contas, servidores nem sincronização automática. Partilhas o pacote por ficheiro com os colegas e cada um importa-o. Os avisos de professor são auto-declarados e os testes são prática, nunca notas oficiais.',
    noticeKinds: { aviso: 'Aviso', alteracao: 'Alteração', entrega: 'Entrega', exame: 'Avaliação', material: 'Material' },
    tabsAria: 'Secções da turma',
    required: 'Preenche o nome da turma e o teu nome.',
    noClass: 'Ainda sem turma',
  },
  en: {
    study: 'Study',
    home: 'Home',
    kicker: 'CLASS · LOCAL-FIRST',
    title: 'The whole class, organised.',
    lead: 'Teacher notices, materials, past tests, the programme and study groups in one place. Everyone keeps the class on their device and shares a pack — no accounts or servers.',
    setupTitle: 'Create your class',
    setupLead: 'This data stays in this browser. The class code identifies the pack when you share it; it does not grant access to any server.',
    className: 'Class name',
    institution: 'Institution',
    course: 'Course',
    year: 'Year / semester',
    owner: 'Your name',
    role: 'You join as',
    code: 'Class code',
    codeHint: 'Leave empty to generate a code.',
    create: 'Create class',
    saveProfile: 'Save changes',
    student: 'Student',
    teacher: 'Teacher',
    declared: 'self-declared',
    edit: 'Edit class',
    share: 'Share pack',
    download: 'Download .json',
    importPack: 'Import pack',
    codeCopy: 'Copy code',
    localOnly: 'No server',
    packNote: 'The pack carries notices, materials, programme and groups. Your personal summaries are not included.',
    tabBoard: 'Board',
    tabMaterials: 'Materials',
    tabProgramme: 'Programme',
    tabGroups: 'Groups',
    tabTeach: 'Classes',
    statNotices: 'notices',
    statMaterials: 'materials',
    statGroups: 'groups',
    statMembers: 'classmates',
    postNotice: 'Post a notice',
    noticeKind: 'Type',
    noticeTitle: 'Title',
    noticeBody: 'Message',
    noticeDue: 'Due date (optional)',
    noticePin: 'Pin to top',
    publish: 'Publish',
    noNotices: 'No notices yet.',
    noNoticesLead: 'Post the first notice: a room change, a deadline or a test.',
    upcoming: 'Upcoming dates',
    noUpcoming: 'No dates marked.',
    addMaterial: 'Add material',
    materialKind: 'Material type',
    materialSubject: 'Subject',
    materialTitle: 'Title',
    materialDesc: 'Short description',
    materialLink: 'Link (optional)',
    materialText: 'Text or notes',
    materialTextHint: 'Paste the text here. For PDFs and photos, use the importer below — the file is read on this device.',
    add: 'Add',
    importFile: 'Import PDF or photo',
    importing: 'Reading the file…',
    noMaterials: 'No materials yet.',
    noMaterialsLead: 'Bring the programme, a past test or notes. You can also import a PDF or a photo.',
    kindProgramme: 'Programme',
    kindTest: 'Past test',
    kindNotes: 'Notes',
    kindStatement: 'Assignment',
    kindOther: 'Other',
    openLink: 'Open link',
    showText: 'View extracted text',
    summarize: 'Turn into a summary',
    copyText: 'Copy text',
    delete: 'Delete',
    file: 'File',
    materialPrivacy: 'The original file is not stored or uploaded. Only the extracted text stays on this device.',
    programmeTitle: 'Class programme and timetable',
    programmeLead: 'Paste the semester programme or import the PDF. Ingenium recognises dates, assessments and weekly classes.',
    programmePlaceholder: 'Physics exam — 05/11/2026 at 09:00\nChemistry report due: 30/10/2026 at 23:59\nALGA class — Monday 08:00-10:00',
    saveProgramme: 'Read programme',
    importProgramme: 'Import programme PDF',
    openPlanner: 'Open in study plan',
    clearProgramme: 'Clear programme',
    parsedEvents: 'dates and assessments',
    parsedWeekly: 'weekly classes',
    parsedNone: 'No programme read yet.',
    parsedNoneLead: 'Paste the text or import the PDF. Dates get organised and can feed your study plan.',
    weeklyClasses: 'Weekly timetable',
    nextDates: 'Upcoming dates',
    groupsTitle: 'Study groups',
    groupsLead: 'Create a group for a subject or a test. The member list is local and travels in the class pack.',
    groupTitle: 'Group name',
    groupTopic: 'Topic',
    groupWhen: 'When you meet',
    groupPlace: 'Where',
    groupCapacity: 'People limit',
    createGroup: 'Create group',
    join: 'Join',
    leave: 'Leave',
    joined: 'You are in this group',
    full: 'Group full',
    members: 'people',
    noGroups: 'No groups yet.',
    noGroupsLead: 'Create the first study group for a test or a difficult subject.',
    roster: 'Classmates',
    rosterLead: 'A simple list so you know who is in the pack. Nobody is validated by the institution.',
    memberName: 'Classmate name',
    memberRole: 'Role',
    addMember: 'Add classmate',
    noMembers: 'No classmates added yet.',
    teachTitle: 'Class mode and projector',
    teachLead: 'Open a summary in presentation mode: large type, concepts, real applications and the 3D room. Made for the classroom projector.',
    projector: 'Present',
    openSummary: 'Open summary',
    noSummaries: 'No summaries to present yet.',
    noSummariesLead: 'Create a summary in the study area and come back here to present it to the class.',
    assessments: 'Assessments and deadlines',
    noAssessments: 'No assessments marked on the board.',
    creditsTitle: 'Who made Ingenium',
    creditsBody: 'Ingenium 2.0 was created by the Bulezi brothers — Rafael Bulezi and Afonso Bulezi — to make university study clearer, more visual and more collaborative.',
    honestTitle: 'What is honest to say',
    honestBody: 'This class is local-first: no accounts, servers or automatic sync. You share the pack as a file with classmates and each one imports it. Teacher notices are self-declared and quizzes are practice, never official grades.',
    noticeKinds: { aviso: 'Notice', alteracao: 'Change', entrega: 'Deadline', exame: 'Assessment', material: 'Material' },
    tabsAria: 'Class sections',
    required: 'Fill in the class name and your name.',
    noClass: 'No class yet',
  },
};

const MATERIAL_LABELS = {
  pt: { programa: 'Programa', teste: 'Teste passado', apontamento: 'Apontamento', enunciado: 'Enunciado', outro: 'Outro' },
  en: { programa: 'Programme', teste: 'Past test', apontamento: 'Notes', enunciado: 'Assignment', outro: 'Other' },
};
const MATERIAL_ICONS = { programa: 'calendar', teste: 'target', apontamento: 'book', enunciado: 'file', outro: 'file' };
const NOTICE_ICONS = { aviso: 'megaphone', alteracao: 'reset', entrega: 'calendar', exame: 'target', material: 'book' };

function formatDate(value, lang) {
  const date = value ? new Date(`${value}T12:00:00`) : null;
  if (date && !Number.isNaN(date.getTime())) {
    return new Intl.DateTimeFormat(lang === 'en' ? 'en-GB' : 'pt-PT', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
  }
  const fallback = value ? new Date(value) : null;
  if (!fallback || Number.isNaN(fallback.getTime())) return '';
  return new Intl.DateTimeFormat(lang === 'en' ? 'en-GB' : 'pt-PT', { day: '2-digit', month: 'short' }).format(fallback);
}

function roleLabel(value, copyLang) {
  return value === 'teacher' ? copyLang.teacher : copyLang.student;
}

function emptyState({ e, icon, title, lead, action = '' }) {
  return `<div class="class-empty">
    <span class="class-empty-icon">${icon('book', 24)}</span>
    <strong>${e(title)}</strong>
    <p>${e(lead)}</p>
    ${action}
  </div>`;
}

function setupForm({ lang, e, icon, classroom, copy, isFirst }) {
  return `<form class="class-form class-setup" data-class-form="profile">
    <div class="class-form-head"><span class="study-eyebrow">${e(isFirst ? 'PRIMEIRO PASSO' : 'TURMA')}</span><h2>${e(isFirst ? copy.setupTitle : copy.edit)}</h2><p>${e(copy.setupLead)}</p></div>
    <div class="class-form-grid">
      <label><span>${e(copy.className)} *</span><input name="name" required maxlength="90" value="${e(classroom.name)}" placeholder="${e(lang === 'en' ? 'e.g. Mechatronics · 2nd year' : 'ex.: Mecatrónica · 2.º ano')}" /></label>
      <label><span>${e(copy.institution)}</span><input name="institution" maxlength="120" value="${e(classroom.institution)}" placeholder="${e(lang === 'en' ? 'University or school' : 'Universidade ou escola')}" /></label>
      <label><span>${e(copy.course)}</span><input name="course" maxlength="90" value="${e(classroom.course)}" /></label>
      <label><span>${e(copy.year)}</span><input name="year" maxlength="40" value="${e(classroom.year)}" placeholder="${e(lang === 'en' ? 'e.g. 2026/27' : 'ex.: 2026/27')}" /></label>
      <label><span>${e(copy.owner)} *</span><input name="owner" required maxlength="70" value="${e(classroom.owner)}" placeholder="${e(lang === 'en' ? 'Your name' : 'O teu nome')}" /></label>
      <label><span>${e(copy.role)}</span><select name="role"><option value="student"${classroom.role === 'student' ? ' selected' : ''}>${e(copy.student)}</option><option value="teacher"${classroom.role === 'teacher' ? ' selected' : ''}>${e(copy.teacher)}</option></select></label>
      <label><span>${e(copy.code)}</span><input name="code" maxlength="24" value="${e(classroom.code)}" placeholder="${e(copy.codeHint)}" /></label>
    </div>
    <div class="class-form-actions">
      <button type="submit" class="button button-primary">${icon('check', 15)} ${e(isFirst ? copy.create : copy.saveProfile)}</button>
      <span class="class-form-note">${icon('lock', 13)} ${e(copy.setupLead)}</span>
    </div>
  </form>`;
}

export function renderClassroomPage({
  app,
  lang,
  ui,
  e,
  icon,
  href,
  classroom = {},
  tab = 'board',
  notice = null,
  busy = null,
  canShare = false,
  summaries = [],
  programme = null,
}) {
  const isPt = lang !== 'en';
  const copy = COPY[isPt ? 'pt' : 'en'];
  const materialLabels = MATERIAL_LABELS[isPt ? 'pt' : 'en'];
  const stats = classPackStats(classroom);
  const configured = Boolean(classroom.name);
  const currentTab = TABS.includes(tab) ? tab : 'board';
  const upcoming = upcomingClassEvents(classroom.notices || [], new Date(), { limit: 5 });
  const today = todayIso();
  const assessments = (classroom.notices || [])
    .filter((item) => item.dueAt && item.dueAt >= today && ['exame', 'entrega', 'alteracao'].includes(item.kind))
    .sort((a, b) => a.dueAt.localeCompare(b.dueAt));
  const pendingProgramme = programme || { events: [], weekly: [], stats: { events: 0, weekly: 0 }, unparsed: [] };
  const upcomingProgramme = (pendingProgramme.events || []).filter((event) => event.date >= today).slice(0, 6);

  const noticeMarkup = notice
    ? `<div class="study-notice ${notice.tone === 'ok' ? 'is-ok' : ''}" role="status">${icon(notice.tone === 'ok' ? 'check' : 'info', 16)}<span>${e(notice.message)}</span></div>`
    : '';
  const busyMarkup = busy
    ? `<div class="class-busy" role="status">${icon('clock', 16)}<div><strong>${e(busy.title || copy.importing)}</strong><span>${e(busy.detail || '')}</span><div class="class-busy-track"><i style="width:${Math.max(4, Math.min(100, Number(busy.progress) || 0))}%"></i></div></div></div>`
    : '';

  if (!configured) {
    app.innerHTML = `<section class="page tools-page classroom-page">
      <div class="tools-back-row"><a class="text-link" href="${href('home')}">${icon('back', 15)} ${e(ui('home'))}</a><span class="tools-kicker">${e(copy.kicker)}</span></div>
      <header class="tools-heading study-heading">
        <div><h1>${e(copy.title).replace('.', '')}<span class="title-period" aria-hidden="true">.</span></h1><p class="lead">${e(copy.lead)}</p></div>
        <div class="class-heading-mark">${icon('users', 30)}<span>${e(copy.localOnly)}</span></div>
      </header>
      ${noticeMarkup}${busyMarkup}
      <div class="class-setup-layout">
        ${setupForm({ lang, e, icon, classroom, copy, isFirst: true })}
        <aside class="class-setup-aside">
          <div class="class-credit-card"><span class="study-eyebrow">${e(copy.creditsTitle)}</span><p>${e(copy.creditsBody)}</p><strong>Rafael Bulezi · Afonso Bulezi</strong></div>
          <div class="class-honesty-card">${icon('info', 16)}<p>${e(copy.honestBody)}</p></div>
          <button type="button" class="button button-ghost" data-action="class-pack-open">${icon('upload', 15)} ${e(copy.importPack)}</button>
          <input type="file" accept="application/json,.json" data-class-file="pack" hidden />
        </aside>
      </div>
    </section>`;
    return;
  }

  const tabsMarkup = [
    ['board', copy.tabBoard, 'megaphone'],
    ['materials', copy.tabMaterials, 'layers'],
    ['programme', copy.tabProgramme, 'calendar'],
    ['groups', copy.tabGroups, 'users'],
    ['teach', copy.tabTeach, 'projector'],
  ].map(([id, label, iconName]) => `<button type="button" data-action="class-tab" data-tab="${id}" aria-selected="${currentTab === id}" role="tab" id="class-tab-${id}" aria-controls="class-panel-${id}">${icon(iconName, 15)}<span>${e(label)}</span></button>`).join('');

  const header = `<div class="class-head">
    <div class="class-head-tags"><span class="study-eyebrow">${e(copy.kicker)}</span><span class="class-code-chip">${icon('lock', 12)} ${e(classroom.code || copy.noClass)}</span><span class="class-role-chip${classroom.role === 'teacher' ? ' is-teacher' : ''}">${icon('user', 12)} ${e(roleLabel(classroom.role, copy))} · ${e(copy.declared)}</span></div>
    <h1>${e(classroom.name)}<span class="title-period" aria-hidden="true">.</span></h1>
    <p class="class-head-meta">${[classroom.institution, classroom.course, classroom.year].filter(Boolean).map((item) => e(item)).join(' · ') || e(copy.course)}</p>
    <div class="class-head-actions">
      <button type="button" class="button button-primary" data-action="class-pack-share">${icon('users', 15)} ${e(copy.share)}</button>
      <button type="button" class="button button-ghost" data-action="class-pack-export">${icon('download', 15)} ${e(copy.download)}</button>
      <button type="button" class="button button-ghost" data-action="class-pack-open">${icon('upload', 15)} ${e(copy.importPack)}</button>
      <button type="button" class="button button-ghost" data-action="class-code-copy">${icon('link', 15)} ${e(copy.codeCopy)}</button>
    </div>
    <input type="file" accept="application/json,.json" data-class-file="pack" hidden />
  </div>`;

  const statsStrip = `<div class="class-stats">
    <div><strong>${stats.notices}</strong><span>${e(copy.statNotices)}</span></div>
    <div><strong>${stats.materials}</strong><span>${e(copy.statMaterials)}</span></div>
    <div><strong>${stats.groups}</strong><span>${e(copy.statGroups)}</span></div>
    <div><strong>${stats.members}</strong><span>${e(copy.statMembers)}</span></div>
    <div class="class-stats-note">${icon('info', 13)} ${e(copy.packNote)}</div>
  </div>`;

  const settings = `<details class="class-settings">
    <summary>${icon('wrench', 14)} ${e(copy.edit)}</summary>
    ${setupForm({ lang, e, icon, classroom, copy, isFirst: false })}
  </details>`;

  let panel = '';
  if (currentTab === 'board') {
    const notices = (classroom.notices || []).slice().sort(noticeSort);
    const noticeCards = notices.length
      ? notices.map((item) => `<article class="class-notice${item.pinned ? ' is-pinned' : ''}">
          <div class="class-notice-head">
            <span class="class-kind class-kind-${e(item.kind)}">${icon(NOTICE_ICONS[item.kind] || 'info', 13)} ${e(copy.noticeKinds[item.kind] || item.kind)}</span>
            <div class="class-notice-tools">
              <button type="button" class="class-icon-btn${item.pinned ? ' is-active' : ''}" data-action="class-notice-pin" data-id="${e(item.id)}" aria-label="${e(isPt ? 'Fixar aviso' : 'Pin notice')}" aria-pressed="${item.pinned}">${icon('pin', 14)}</button>
              <button type="button" class="class-icon-btn is-danger" data-action="class-notice-delete" data-id="${e(item.id)}" aria-label="${e(copy.delete)}">${icon('trash', 14)}</button>
            </div>
          </div>
          <h3>${e(item.title)}</h3>
          ${item.body ? `<p>${e(item.body)}</p>` : ''}
          <footer class="class-notice-foot">
            <span>${icon('user', 12)} ${e(item.author || classroom.owner || copy.student)} · ${e(roleLabel(item.role, copy))}</span>
            ${item.dueAt ? `<span class="class-due">${icon('calendar', 12)} ${e(formatDate(item.dueAt, lang))}</span>` : ''}
            <span class="class-date">${e(formatDate(item.createdAt, lang))}</span>
          </footer>
        </article>`).join('')
      : emptyState({ e, icon, title: copy.noNotices, lead: copy.noNoticesLead });

    panel = `<div class="class-columns">
      <form class="class-form" data-class-form="notice">
        <div class="class-form-head"><span class="study-eyebrow">${e(copy.postNotice)}</span><h2>${e(copy.postNotice)}</h2></div>
        <div class="class-form-grid">
          <label><span>${e(copy.noticeKind)}</span><select name="kind">${NOTICE_KINDS.map((kind) => `<option value="${kind}">${e(copy.noticeKinds[kind])}</option>`).join('')}</select></label>
          <label><span>${e(copy.noticeDue)}</span><input type="date" name="dueAt" /></label>
          <label class="is-wide"><span>${e(copy.noticeTitle)} *</span><input name="title" required maxlength="120" placeholder="${e(isPt ? 'Ex.: Teste de Física mudou de sala' : 'e.g. Physics test moved rooms')}" /></label>
          <label class="is-wide"><span>${e(copy.noticeBody)}</span><textarea name="body" rows="4" maxlength="2000" placeholder="${e(isPt ? 'Escreve o aviso para a turma…' : 'Write the notice for the class…')}"></textarea></label>
          <label class="class-check is-wide"><input type="checkbox" name="pinned" /> <span>${e(copy.noticePin)}</span></label>
        </div>
        <div class="class-form-actions"><button type="submit" class="button button-primary">${icon('megaphone', 15)} ${e(copy.publish)}</button></div>
      </form>
      <div class="class-column-main">
        <div class="class-upcoming">
          <div class="class-upcoming-head">${icon('calendar', 15)}<strong>${e(copy.upcoming)}</strong></div>
          ${upcoming.length ? `<ul>${upcoming.map((item) => `<li><span class="class-kind class-kind-${e(item.kind)}">${e(copy.noticeKinds[item.kind] || item.kind)}</span><strong>${e(item.title)}</strong><small>${e(formatDate(item.dueAt, lang))}</small></li>`).join('')}</ul>` : `<p>${e(copy.noUpcoming)}</p>`}
        </div>
        <div class="class-notice-list">${noticeCards}</div>
      </div>
    </div>`;
  } else if (currentTab === 'materials') {
    const materials = (classroom.materials || []).slice().sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
    const materialCards = materials.length
      ? materials.map((item) => `<article class="class-material">
          <div class="class-material-head">
            <span class="class-material-icon">${icon(MATERIAL_ICONS[item.kind] || 'file', 18)}</span>
            <div><span class="class-kind class-kind-${e(item.kind)}">${e(materialLabels[item.kind] || item.kind)}</span><span class="study-subject-tag ${e(item.subject)}">${e(subjectLabel(item.subject, lang))}</span></div>
            <div class="class-notice-tools">
              <button type="button" class="class-icon-btn is-danger" data-action="class-material-delete" data-id="${e(item.id)}" aria-label="${e(copy.delete)}">${icon('trash', 14)}</button>
            </div>
          </div>
          <h3>${e(item.title)}</h3>
          ${item.description ? `<p class="class-material-desc">${e(item.description)}</p>` : ''}
          <div class="class-material-meta">
            ${item.fileName ? `<span>${icon('file', 12)} ${e(item.fileName)}${item.size ? ` · ${e(formatFileSize(item.size))}` : ''}</span>` : ''}
            <span>${icon('user', 12)} ${e(item.author || classroom.owner || copy.student)}</span>
            <span>${e(formatDate(item.createdAt, lang))}</span>
          </div>
          ${item.text ? `<details class="class-material-text"><summary>${icon('book', 13)} ${e(copy.showText)}</summary><pre>${e(item.text.slice(0, 6000))}${item.text.length > 6000 ? '\n…' : ''}</pre></details>` : ''}
          <div class="class-material-actions">
            ${item.link ? `<a class="button button-ghost button-small" href="${e(item.link)}" target="_blank" rel="noopener noreferrer">${icon('external', 13)} ${e(copy.openLink)}</a>` : ''}
            ${item.text ? `<button type="button" class="button button-ghost button-small" data-action="class-material-copy" data-id="${e(item.id)}">${icon('file', 13)} ${e(copy.copyText)}</button>` : ''}
            ${item.text ? `<button type="button" class="button button-lime button-small" data-action="class-material-summarize" data-id="${e(item.id)}">${icon('spark', 13)} ${e(copy.summarize)}</button>` : ''}
          </div>
        </article>`).join('')
      : emptyState({ e, icon, title: copy.noMaterials, lead: copy.noMaterialsLead });

    panel = `<div class="class-columns">
      <div class="class-column-main">
        <form class="class-form" data-class-form="material">
          <div class="class-form-head"><span class="study-eyebrow">${e(copy.addMaterial)}</span><h2>${e(copy.addMaterial)}</h2></div>
          <div class="class-form-grid">
            <label><span>${e(copy.materialKind)}</span><select name="kind">${MATERIAL_KINDS.map((kind) => `<option value="${kind}">${e(materialLabels[kind])}</option>`).join('')}</select></label>
            <label><span>${e(copy.materialSubject)}</span><select name="subject">${CLASS_SUBJECTS.map((value) => `<option value="${value}"${value === 'general' ? ' selected' : ''}>${e(subjectLabel(value, lang))}</option>`).join('')}</select></label>
            <label class="is-wide"><span>${e(copy.materialTitle)} *</span><input name="title" required maxlength="120" /></label>
            <label class="is-wide"><span>${e(copy.materialDesc)}</span><input name="description" maxlength="400" /></label>
            <label class="is-wide"><span>${e(copy.materialLink)}</span><input name="link" type="url" maxlength="500" placeholder="https://" /></label>
            <label class="is-wide"><span>${e(copy.materialText)}</span><textarea name="text" rows="6" maxlength="${CLASS_LIMITS.materialText}" placeholder="${e(copy.materialTextHint)}"></textarea></label>
          </div>
          <div class="class-form-actions">
            <button type="submit" class="button button-primary">${icon('check', 15)} ${e(copy.add)}</button>
            <button type="button" class="button button-ghost" data-action="class-file-open" data-target="material">${icon('upload', 15)} ${e(copy.importFile)}</button>
            <span class="class-form-note">${icon('lock', 13)} ${e(copy.materialPrivacy)}</span>
          </div>
        </form>
        <input type="file" accept="application/pdf,image/png,image/jpeg,image/webp" data-class-file="material" hidden />
        <div class="class-material-list">${materialCards}</div>
      </div>
    </div>`;
  } else if (currentTab === 'programme') {
    panel = `<div class="class-columns class-columns-even">
      <form class="class-form" data-class-form="programme">
        <div class="class-form-head"><span class="study-eyebrow">${e(copy.tabProgramme)}</span><h2>${e(copy.programmeTitle)}</h2><p>${e(copy.programmeLead)}</p></div>
        <label class="class-textarea"><span>${e(copy.programmeTitle)}</span><textarea name="programme" rows="12" maxlength="${CLASS_LIMITS.programmeText}" placeholder="${e(copy.programmePlaceholder)}">${e(classroom.programme?.text || '')}</textarea></label>
        <div class="class-form-actions">
          <button type="submit" class="button button-primary">${icon('calendar', 15)} ${e(copy.saveProgramme)}</button>
          <button type="button" class="button button-ghost" data-action="class-file-open" data-target="programme">${icon('upload', 15)} ${e(copy.importProgramme)}</button>
          ${classroom.programme?.text ? `<button type="button" class="button button-ghost" data-action="class-programme-plan">${icon('route', 15)} ${e(copy.openPlanner)}</button><button type="button" class="class-link-danger" data-action="class-programme-clear">${e(copy.clearProgramme)}</button>` : ''}
        </div>
        <input type="file" accept="application/pdf,image/png,image/jpeg,image/webp" data-class-file="programme" hidden />
      </form>
      <div class="class-programme-result">
        ${pendingProgramme.stats?.events || pendingProgramme.stats?.weekly
          ? `<div class="class-programme-stats"><div><strong>${pendingProgramme.stats.events}</strong><span>${e(copy.parsedEvents)}</span></div><div><strong>${pendingProgramme.stats.weekly}</strong><span>${e(copy.parsedWeekly)}</span></div></div>
            ${upcomingProgramme.length ? `<section class="class-programme-block"><h3>${e(copy.nextDates)}</h3><ul class="class-programme-events">${upcomingProgramme.map((event) => `<li><span>${e(formatDate(event.date, lang))}${event.time ? ` · ${e(event.time)}` : ''}</span><strong>${e(event.title)}</strong><small>${e(event.type === 'exam' ? (isPt ? 'Avaliação' : 'Assessment') : event.type === 'deadline' ? (isPt ? 'Entrega' : 'Deadline') : (isPt ? 'Evento' : 'Event'))}</small></li>`).join('')}</ul></section>` : ''}
            ${(pendingProgramme.weekly || []).length ? `<section class="class-programme-block"><h3>${e(copy.weeklyClasses)}</h3><ul class="class-weekly">${pendingProgramme.weekly.map((item) => `<li><span>${e((isPt ? ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'] : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'])[item.weekday] || '')}</span><strong>${e(item.title)}</strong><small>${e(item.start)}${item.end ? `–${e(item.end)}` : ''}</small></li>`).join('')}</ul></section>` : ''}`
          : emptyState({ e, icon, title: copy.parsedNone, lead: copy.parsedNoneLead })}
      </div>
    </div>`;
  } else if (currentTab === 'groups') {
    const groups = (classroom.groups || []).slice().sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
    const ownerKey = String(classroom.owner || '').toLowerCase();
    const groupCards = groups.length
      ? groups.map((group) => {
        const joined = group.members.some((name) => name.toLowerCase() === ownerKey);
        const full = group.members.length >= group.capacity;
        return `<article class="class-group">
          <div class="class-group-head"><span class="class-group-icon">${icon('users', 18)}</span><div><h3>${e(group.title)}</h3>${group.topic ? `<p>${e(group.topic)}</p>` : ''}</div><div class="class-notice-tools"><button type="button" class="class-icon-btn is-danger" data-action="class-group-delete" data-id="${e(group.id)}" aria-label="${e(copy.delete)}">${icon('trash', 14)}</button></div></div>
          <div class="class-group-meta">
            ${group.when ? `<span>${icon('clock', 12)} ${e(group.when)}</span>` : ''}
            ${group.place ? `<span>${icon('map', 12)} ${e(group.place)}</span>` : ''}
            <span>${icon('users', 12)} ${group.members.length}/${group.capacity} ${e(copy.members)}</span>
          </div>
          ${group.members.length ? `<div class="class-group-members">${group.members.map((name) => `<span>${e(name)}</span>`).join('')}</div>` : ''}
          <div class="class-group-actions">
            ${joined
              ? `<button type="button" class="button button-ghost button-small" data-action="class-group-join" data-id="${e(group.id)}">${icon('check', 13)} ${e(copy.joined)} · ${e(copy.leave)}</button>`
              : `<button type="button" class="button button-primary button-small" data-action="class-group-join" data-id="${e(group.id)}" ${full ? 'disabled' : ''}>${icon('users', 13)} ${e(full ? copy.full : copy.join)}</button>`}
          </div>
        </article>`;
      }).join('')
      : emptyState({ e, icon, title: copy.noGroups, lead: copy.noGroupsLead });

    const members = classroom.members || [];
    panel = `<div class="class-columns">
      <div class="class-column-main">
        <form class="class-form" data-class-form="group">
          <div class="class-form-head"><span class="study-eyebrow">${e(copy.groupsTitle)}</span><h2>${e(copy.groupsTitle)}</h2><p>${e(copy.groupsLead)}</p></div>
          <div class="class-form-grid">
            <label><span>${e(copy.groupTitle)} *</span><input name="title" required maxlength="90" /></label>
            <label><span>${e(copy.groupTopic)}</span><input name="topic" maxlength="120" /></label>
            <label><span>${e(copy.groupWhen)}</span><input name="when" maxlength="90" placeholder="${e(isPt ? 'Quinta, 18:00' : 'Thursday, 18:00')}" /></label>
            <label><span>${e(copy.groupPlace)}</span><input name="place" maxlength="90" /></label>
            <label><span>${e(copy.groupCapacity)}</span><input name="capacity" type="number" min="2" max="200" value="6" /></label>
          </div>
          <div class="class-form-actions"><button type="submit" class="button button-primary">${icon('users', 15)} ${e(copy.createGroup)}</button></div>
        </form>
        <div class="class-group-list">${groupCards}</div>
        <div class="class-roster">
          <div class="class-roster-head"><div><span class="study-eyebrow">${e(copy.roster)}</span><h3>${e(copy.roster)}</h3><p>${e(copy.rosterLead)}</p></div><span class="class-roster-count">${members.length}</span></div>
          <form class="class-roster-form" data-class-form="member">
            <label><span>${e(copy.memberName)}</span><input name="name" required maxlength="70" /></label>
            <label><span>${e(copy.memberRole)}</span><select name="role"><option value="student">${e(copy.student)}</option><option value="teacher">${e(copy.teacher)}</option></select></label>
            <button type="submit" class="button button-ghost button-small">${icon('user', 13)} ${e(copy.addMember)}</button>
          </form>
          ${members.length ? `<ul class="class-roster-list">${members.map((member) => `<li><span>${icon('user', 13)}<strong>${e(member.name)}</strong><small>${e(roleLabel(member.role, copy))}</small></span><button type="button" class="class-icon-btn is-danger" data-action="class-member-delete" data-name="${e(member.name)}" aria-label="${e(copy.delete)}">${icon('close', 12)}</button></li>`).join('')}</ul>` : `<p class="class-roster-empty">${e(copy.noMembers)}</p>`}
        </div>
      </div>
    </div>`;
  } else {
    const teachCards = summaries.length
      ? `<div class="class-teach-summaries">${summaries.map(({ record, analysis }) => `<article class="class-teach-card">
          <div class="class-teach-top"><span class="study-subject-tag ${e(record.subject)}">${e(subjectLabel(record.subject, lang))}</span><span class="class-teach-time">${icon('clock', 12)} ${analysis.stats?.readingMinutes || 0} min</span></div>
          <h3>${e(record.title)}</h3>
          <p>${e((analysis.centralIdea || '').slice(0, 140))}${(analysis.centralIdea || '').length > 140 ? '…' : ''}</p>
          <div class="class-teach-actions"><a class="button button-primary button-small" href="${href(`present/${record.id}`)}">${icon('projector', 14)} ${e(copy.projector)}</a><a class="button button-ghost button-small" href="${href(`summary/${record.id}`)}">${icon('book', 14)} ${e(copy.openSummary)}</a></div>
        </article>`).join('')}</div>`
      : emptyState({ e, icon, title: copy.noSummaries, lead: copy.noSummariesLead, action: `<a class="button button-ghost button-small" href="${href('summaries')}">${icon('spark', 14)} ${e(isPt ? 'Criar um resumo' : 'Create a summary')}</a>` });

    panel = `<div class="class-teach">
      <section class="class-teach-hero">
        <div><span class="study-eyebrow">${e(copy.tabTeach)}</span><h2>${e(copy.teachTitle)}</h2><p>${e(copy.teachLead)}</p></div>
        ${icon('projector', 44)}
      </section>
      ${teachCards}
      <div class="class-teach-grid">
        <section class="class-assessments">
          <div class="class-section-head">${icon('calendar', 16)}<h3>${e(copy.assessments)}</h3></div>
          ${assessments.length ? `<ul>${assessments.map((item) => `<li><span class="class-kind class-kind-${e(item.kind)}">${e(copy.noticeKinds[item.kind] || item.kind)}</span><div><strong>${e(item.title)}</strong><small>${e(formatDate(item.dueAt, lang))}</small></div></li>`).join('')}</ul>` : `<p>${e(copy.noAssessments)}</p>`}
        </section>
        <section class="class-credit-card">
          <span class="study-eyebrow">${e(copy.creditsTitle)}</span>
          <p>${e(copy.creditsBody)}</p>
          <strong>Rafael Bulezi · Afonso Bulezi</strong>
        </section>
        <section class="class-honesty-card">
          ${icon('info', 16)}
          <div><strong>${e(copy.honestTitle)}</strong><p>${e(copy.honestBody)}</p></div>
        </section>
        <section class="class-share-card">
          <span class="study-eyebrow">${e(copy.share)}</span>
          <p>${e(copy.packNote)}</p>
          <div><button type="button" class="button button-primary button-small" data-action="class-pack-share">${icon('users', 14)} ${e(copy.share)}</button><button type="button" class="button button-ghost button-small" data-action="class-pack-export">${icon('download', 14)} ${e(copy.download)}</button></div>
        </section>
      </div>
    </div>`;
  }

  app.innerHTML = `<section class="page tools-page classroom-page">
    <div class="tools-back-row"><a class="text-link" href="${href('home')}">${icon('back', 15)} ${e(ui('home'))}</a><span class="tools-kicker">${e(copy.kicker)}</span></div>
    ${header}
    ${statsStrip}
    ${settings}
    ${noticeMarkup}${busyMarkup}
    <div class="class-tabbar" role="tablist" aria-label="${e(copy.tabsAria)}">${tabsMarkup}</div>
    <div class="class-panel" role="tabpanel" id="class-panel-${currentTab}" aria-labelledby="class-tab-${currentTab}">${panel}</div>
  </section>`;
}
