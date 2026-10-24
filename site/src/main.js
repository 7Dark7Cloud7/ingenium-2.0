import { course, lessonById, moduleById } from './content/kinematics.js';
import { createLevelConstructorPrototype, renderLevelConstructorPrototype, validatePrototypeLine, isPrototypeFinalAnswer, insertPrototypeToken, removePrototypeToken, undoPrototypeToken, clearPrototypeLine, selectPrototypeSlot, selectPrototypeToken, getPrototypeSolutionLines } from './components/level-constructor-prototype.js?v=expression-engine-stage2-v10';
import { renderDiagram } from './components/diagrams.js';
import { triangleFormulas, shortcutIntro, shortcutKindNames, studyShortcuts } from './content/studyTools.js';
import { algebraSyllabus } from './content/algebra.js';
import { gameLevels } from './content/levels.js?v=expression-engine-stage2-v5';
import { homeSubjectDiagram } from './ui/home-diagrams.js';
import { renderFormulasPage, renderAlgebraPage, renderChemistryPage, renderHomePage, renderProgrammePage } from './ui/subject-pages.js';
import { icon } from './ui/icons.js';
import { createScienceRun, renderScienceLevelOne, updateScienceAnswer, checkScienceRun, scienceLevelDefinition } from './content/science-level-one.js?v=science-level-one-v2';
import { analyzeSummary } from './study/summary-engine.js';
import { parseProgramme, buildStudyPlan, buildIcs, getUpcomingEvents, toIsoDate } from './study/planner-engine.js';
import { renderSummariesPage, renderSummaryDetailPage } from './ui/summaries-page.js';
import { renderPlannerPage, programmeExample } from './ui/planner-page.js';
import { extractFileText, sha256Hex, validateImportFile, importErrorMessage, suggestSubject, IMPORT_LIMITS } from './study/file-import.js';
import { buildMindMap } from './study/learning-methods.js';
import { mindMapSvg } from './ui/mind-map.js';
import { buildSummaryThread } from './study/summary-thread.js';
import { buildConceptLens } from './study/concept-lens.js';
import { fetchWikipediaConcept, WikiLookupError, wikiLookupErrorMessage } from './study/wiki-lens.js';
import { mountConceptLab } from './ui/concept-lab.js';
import { mountAudioLesson } from './ui/audio-lesson.js';
import { renderClassroomPage } from './ui/classroom-page.js';
import { renderPresentationPage } from './ui/presentation-page.js';
import {
  buildClassPack,
  classPackErrorMessage,
  ClassPackError,
  CLASS_LIMITS,
  makeClassCode,
  mergeClassPack,
  newId,
  normalizeClassroom,
  normalizeMaterial,
  normalizeMember,
  normalizeNotice,
  normalizeStudyGroup,
  packFileName,
  parseClassPack,
} from './study/classroom-engine.js';

const STORAGE_KEY = 'ingenium2-kinematics-v1';
const copy = {
  pt:{home:'Início',course:'Curso',practice:'Níveis',profile:'Perfil',language:'Idioma',topic:'ÁREAS DE ESTUDO',continue:'Continuar percurso',start:'Começar a aprender',resume:'Retomar de onde paraste',lessons:'lições',modules:'secções',minutes:'min',done:'concluídas',progress:'Progresso',yourPath:'A tua rota',studyPath:'Percurso de estudo',section:'SECÇÃO',lesson:'LIÇÃO',readTime:'min de leitura',keyIdea:'IDEIA-CHAVE',inWords:'Em palavras simples',visual:'MAPA VISUAL',lessonText:'A ideia por partes',worked:'EXEMPLO GUIADO',problem:'Problema',showStep:'Mostrar próximo passo',restart:'Recomeçar exemplo',solution:'Solução completa',check:'AGORA TU',checkQuestion:'Confirma a ideia',choose:'Escolhe uma resposta',correct:'Deu bom. Agora explica porquê.',incorrect:'Quase. Revê a ideia-chave e tenta de novo.',why:'Porquê?',exercise:'DESAFIO PARA TI',tryIt:'Tenta primeiro no teu caderno.',showAnswer:'Ver uma pista',markDone:'Marcar lição como feita',markUndone:'Reabrir para rever',previous:'Lição anterior',next:'Próxima lição',backCourse:'Voltar à rota',allSections:'Todas as secções',pathProgress:'A tua caminhada',reset:'Limpar progresso',resetConfirm:'Queres mesmo apagar o progresso guardado neste navegador?',resetDone:'Progresso limpo. A rota está pronta de novo.',profileLead:'Pequenos passos também mudam a trajetória.',review:'Rever conceitos',checks:'perguntas rápidas',courseOnly:'Várias áreas. Um percurso claro.',onlySubject:'Explora as áreas de aprendizagem',lessonCount:'Lições guiadas',visualCount:'diagramas para pensar',welcome:'Aprende Mecatrónica, uma ideia de cada vez.',heroLead:'Liga Matemática, Física e Engenharia através de explicações visuais, exemplos e prática.',resumeEmpty:'O teu percurso está à espera do primeiro passo.',chapter:'CAPÍTULO',locked:'Abre quando quiseres',saved:'guardado neste navegador',completeCourse:'Rota completa. Boa consistência.',time:'tempo de estudo',languagePt:'Português',languageEn:'English',emptyExercise:'Escreve os teus passos, aponta o eixo e verifica as unidades.',study:'Estudar',ariaNav:'Navegação principal',moduleProgress:'progresso da secção'},
  en:{home:'Home',course:'Course',practice:'Levels',profile:'Profile',language:'Language',topic:'STUDY AREAS',continue:'Continue the path',start:'Start learning',resume:'Pick up where you left off',lessons:'lessons',modules:'sections',minutes:'min',done:'completed',progress:'Progress',yourPath:'Your path',studyPath:'Study path',section:'SECTION',lesson:'LESSON',readTime:'min read',keyIdea:'KEY IDEA',inWords:'In plain words',visual:'VISUAL MAP',lessonText:'The idea, step by step',worked:'GUIDED EXAMPLE',problem:'Problem',showStep:'Show next step',restart:'Restart example',solution:'Full solution',check:'YOUR TURN',checkQuestion:'Check the idea',choose:'Choose an answer',correct:'Nice. Now explain why.',incorrect:'Not quite. Revisit the key idea and try again.',why:'Why?',exercise:'TRY IT YOURSELF',tryIt:'Try it on paper first.',showAnswer:'Show a hint',markDone:'Mark lesson complete',markUndone:'Reopen for review',previous:'Previous lesson',next:'Next lesson',backCourse:'Back to the path',allSections:'All sections',pathProgress:'Your journey',reset:'Reset progress',resetConfirm:'Do you really want to erase the progress saved in this browser?',resetDone:'Progress cleared. The path is ready again.',profileLead:'Small steps still change the trajectory.',review:'Review concepts',checks:'quick checks',courseOnly:'Many fields. One clear path.',onlySubject:'Explore learning areas',lessonCount:'Guided lessons',visualCount:'diagrams to think with',welcome:'Learn Mechatronics, one idea at a time.',heroLead:'Connect Mathematics, Physics and Engineering through visual explanations, examples and practice.',resumeEmpty:'Your path is waiting for its first step.',chapter:'CHAPTER',locked:'Open whenever you like',saved:'saved in this browser',completeCourse:'Path complete. Great consistency.',time:'study time',languagePt:'Português',languageEn:'English',emptyExercise:'Write your steps, mark the axis, and check the units.',study:'Study',ariaNav:'Main navigation',moduleProgress:'section progress'},
};

const stored = (() => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch { return {}; } })();
const SUMMARY_SUBJECTS = ['general', 'math', 'physics', 'algebra', 'chemistry'];
const SUMMARY_METHODS = ['pdf-text', 'pdf-ocr', 'mixed', 'image-ocr'];
const normalizeSummarySource = (source) => {
  if (!source || typeof source !== 'object') return null;
  const name = typeof source.name === 'string' ? source.name.replace(/\s+/g, ' ').trim().slice(0, 140) : '';
  if (!name) return null;
  return {
    name,
    kind: source.kind === 'image' ? 'image' : source.kind === 'pdf' ? 'pdf' : '',
    method: SUMMARY_METHODS.includes(source.method) ? source.method : '',
    size: Math.max(0, Number(source.size) || 0),
    pages: Math.max(0, Number(source.pages) || 0),
    ocrPages: Math.max(0, Number(source.ocrPages) || 0),
    hash: typeof source.hash === 'string' && /^[a-f0-9]{64}$/.test(source.hash) ? source.hash : '',
    importedAt: typeof source.importedAt === 'string' ? source.importedAt : new Date().toISOString(),
  };
};
const normalizeSummaryExternal = (value) => {
  if (!value || typeof value !== 'object') return null;
  const term = typeof value.term === 'string' ? value.term.replace(/\s+/g, ' ').trim().slice(0, 100) : '';
  const extract = typeof value.extract === 'string' ? value.extract.slice(0, 4000).trim() : '';
  const url = typeof value.url === 'string' && /^https:\/\//i.test(value.url) ? value.url : '';
  if (!term || !extract || !url) return null;
  return {
    term,
    title: typeof value.title === 'string' ? value.title.slice(0, 160) : term,
    description: typeof value.description === 'string' ? value.description.slice(0, 240) : '',
    extract,
    url,
    lang: value.lang === 'en' ? 'en' : 'pt',
    source: 'Wikipédia',
    license: 'CC BY-SA',
    fetchedAt: typeof value.fetchedAt === 'string' ? value.fetchedAt : new Date().toISOString(),
  };
};
const normalizeSummary = (record) => {
  if (!record || typeof record !== 'object') return null;
  const text = typeof record.text === 'string' ? record.text.slice(0, 20000) : '';
  if (!text.trim() || !record.id) return null;
  const progress = record.progress && typeof record.progress === 'object' ? record.progress : {};
  return {
    id: String(record.id),
    title: String(record.title || '').slice(0, 90) || 'Resumo sem título',
    subject: SUMMARY_SUBJECTS.includes(record.subject) ? record.subject : 'general',
    text,
    sources: Array.isArray(record.sources) ? record.sources.map(normalizeSummarySource).filter(Boolean).slice(0, 8) : [],
    external: normalizeSummaryExternal(record.external),
    createdAt: typeof record.createdAt === 'string' ? record.createdAt : new Date().toISOString(),
    progress: {
      cardIndex: Math.max(0, Number(progress.cardIndex) || 0),
      reveal: progress.reveal === true,
      known: Array.isArray(progress.known) ? progress.known.filter(Number.isInteger) : [],
      review: Array.isArray(progress.review) ? progress.review.filter(Number.isInteger) : [],
      quizAnswers: progress.quizAnswers && typeof progress.quizAnswers === 'object' ? progress.quizAnswers : {},
      quizChecked: progress.quizChecked === true,
    },
  };
};
const emptyProgramme = () => ({ text: '', events: [], weekly: [], unparsed: [], stats: { lines: 0, dateLines: 0, events: 0, weekly: 0, unparsed: 0 }, parsedAt: null });
const normalizeProgramme = (value) => {
  if (!value || typeof value !== 'object') return emptyProgramme();
  const events = Array.isArray(value.events) ? value.events.filter((event) => event && typeof event.date === 'string' && typeof event.title === 'string') : [];
  const weekly = Array.isArray(value.weekly) ? value.weekly.filter((item) => item && Number.isInteger(item.weekday) && typeof item.start === 'string') : [];
  return {
    text: typeof value.text === 'string' ? value.text.slice(0, 20000) : '',
    events,
    weekly,
    unparsed: Array.isArray(value.unparsed) ? value.unparsed.filter((line) => typeof line === 'string').slice(0, 8) : [],
    stats: value.stats && typeof value.stats === 'object' ? value.stats : { lines: 0, dateLines: 0, events: events.length, weekly: weekly.length, unparsed: 0 },
    parsedAt: typeof value.parsedAt === 'string' ? value.parsedAt : null,
  };
};
const state = {
  language: stored.language === 'en' ? 'en' : 'pt',
  fullAccess: stored.fullAccess === true,
  completed: Array.isArray(stored.completed) ? stored.completed : [],
  answers: stored.answers && typeof stored.answers === 'object' ? stored.answers : {},
  stepAt: stored.stepAt && typeof stored.stepAt === 'object' ? stored.stepAt : {},
  lastLesson: stored.lastLesson || course.lessons[0].id,
  activeModule: stored.activeModule || course.modules[0].id,
  sequenceView: stored.sequenceView === 'continuous' ? 'continuous' : 'split',
  levelProgress: { completed: stored.levelPuzzleVersion === 2 && Array.isArray(stored.levelProgress?.completed) ? stored.levelProgress.completed : [], bestScores: stored.levelPuzzleVersion === 2 && stored.levelProgress?.bestScores && typeof stored.levelProgress.bestScores === 'object' ? stored.levelProgress.bestScores : {} },
  levelRun: stored.levelPuzzleVersion === 2 && stored.levelRun && typeof stored.levelRun === 'object' && ['matching', 'construct-prototype', 'science-level-one'].includes(stored.levelRun.type) ? stored.levelRun : null,
  levelPuzzleVersion: 2,
  summaries: Array.isArray(stored.summaries) ? stored.summaries.map(normalizeSummary).filter(Boolean).slice(0, 40) : [],
  programme: normalizeProgramme(stored.programme),
  planDone: Array.isArray(stored.planDone) ? stored.planDone.filter((key) => typeof key === 'string') : [],
  classroom: normalizeClassroom(stored.classroom),
};
const drafts = {
  summaryTitle: '',
  summarySubject: 'general',
  summaryText: '',
  summarySources: [],
  programmeText: state.programme.text || '',
};
let summaryImportBusy = false;
const summaryNoticeState = { value: null };
const planNoticeState = { value: null };
const summaryTabs = {};
const summaryWikiState = {};
const classroomNoticeState = { value: null };
let classroomTab = 'board';
let classroomBusy = null;
let classroomFileBusy = false;
let presentationRecordId = null;
let presentationSlide = 0;
let presentationSlideCount = 0;
const app = document.querySelector('#app');
const topbar = document.querySelector('#topbar');
const bottomNav = document.querySelector('#bottom-nav');
const navToggle = document.querySelector('#nav-toggle');
let shortcutFilters = { subject: 'all', kind: 'all', search: '' };
let navHideTimer;
let booted = false;
let toastTimer;
const lang = () => state.language;
const THEME_KEY = 'ingenium2-theme-v1';
const currentTheme = () => (document.documentElement.dataset.theme === 'purple' ? 'purple' : 'classic');
function applyTheme(theme) {
  const value = theme === 'purple' ? 'purple' : 'classic';
  document.documentElement.dataset.theme = value;
  try { localStorage.setItem(THEME_KEY, value); } catch { /* storage blocked; the choice lasts this visit */ }
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', value === 'purple' ? '#f6effc' : '#f7f5ef');
  return value;
}
function themeActionLabel(theme, isPt) {
  return theme === 'purple'
    ? (isPt ? 'Mudar para o tema clássico' : 'Switch to the classic theme')
    : (isPt ? 'Mudar para o tema roxo' : 'Switch to the purple theme');
}
const hasFullAccess = () => state.fullAccess === true;
const isLevelLocked = (levelId) => !hasFullAccess() && levelId > 1 && !state.levelProgress.completed.includes(levelId - 1);
function hideBottomNav() {
  if (!bottomNav || !navToggle || !window.matchMedia('(max-width: 720px)').matches) return;
  bottomNav.classList.add('nav-hidden');
  navToggle.classList.remove('nav-visible');
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.setAttribute('aria-label', lang()==='pt' ? 'Mostrar navegação' : 'Show navigation');
  navToggle.textContent = '☰';
}
function showBottomNav(autoHide = true) {
  if (!bottomNav || !navToggle) return;
  if (!window.matchMedia('(max-width: 720px)').matches) {
    bottomNav.classList.remove('nav-hidden');
    navToggle.hidden = true;
    clearTimeout(navHideTimer);
    return;
  }
  navToggle.hidden = false;
  bottomNav.classList.remove('nav-hidden');
  navToggle.classList.add('nav-visible');
  navToggle.setAttribute('aria-expanded', 'true');
  navToggle.setAttribute('aria-label', lang()==='pt' ? 'Ocultar navegação' : 'Hide navigation');
  navToggle.textContent = '⌄';
  clearTimeout(navHideTimer);
  if (autoHide) navHideTimer = setTimeout(hideBottomNav, 3800);
}

const t = (value) => value?.[lang()] ?? value?.pt ?? value ?? '';
const ui = (key) => copy[lang()][key] || copy.pt[key] || key;
const e = (value='') => String(value).replace(/[&<>"']/g, (ch) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
// Render vector-arrow notation as a real over-arrow, avoiding unsupported Unicode combining glyphs.
const formulaMarkup = (value='') => e(value).replace(/([A-Za-zΔ])⃗/gu, '<span class="vector-symbol">$1</span>');

const levelMathMarkup = (value='') => {
  let html = e(value);
  html = html.replace(/log_\{([^{}]+)\}/g, '<span class="math-log">log<sub>$1</sub></span>');
  html = html.replace(/\^\(([^()]*)\)/g, '<sup>$1</sup>').replace(/\^([0-9]+)/g, '<sup>$1</sup>');
  html = html.replace(/√\(([^()]*)\)/g, '<span class="math-root"><span class="math-root-sign">√</span><span class="math-root-body">$1</span></span>');
  html = html.replace(/√([0-9]+)/g, '<span class="math-root"><span class="math-root-sign">√</span><span class="math-root-body">$1</span></span>');
  html = html.replace(/1\/\(([^()]+)\)/g, '<span class="math-frac"><span class="math-frac-top">1</span><span class="math-frac-bottom">$1</span></span>');
  html = html.replace(/\(([^()]+)\)\/\(([^()]+)\)/g, '<span class="math-frac"><span class="math-frac-top">$1</span><span class="math-frac-bottom">$2</span></span>');
  html = html.replace(/\(([^()]+)\)\/([0-9]+)/g, '<span class="math-frac"><span class="math-frac-top">$1</span><span class="math-frac-bottom">$2</span></span>');
  html = html.replace(/\b([0-9]+)\s*\/\s*([0-9]+)\b/g, '<span class="math-frac"><span class="math-frac-top">$1</span><span class="math-frac-bottom">$2</span></span>');
  html = html.replace(/\b([A-Za-z][A-Za-z0-9²³]*)\s*\/\s*([0-9]+)\b/g, '<span class="math-frac"><span class="math-frac-top">$1</span><span class="math-frac-bottom">$2</span></span>');
  return html.replace(/\n/g, '<br />');
};
const save = () => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); return true; } catch { return false; } };
const completedCount = () => state.completed.filter(id => lessonById[id]).length;
const percentage = () => Math.round(completedCount() / course.lessons.length * 100);
const lessonIndex = (id) => course.lessons.findIndex(item => item.id === id);
const route = () => {
  const raw = (location.hash || '#home').replace(/^#\/?/, '');
  const [page, subjectPart, moduleId] = raw.split('/');
  if (page === 'lesson' && lessonById[subjectPart]) return {page, id:subjectPart};
  if (page === 'topic') {
    const subject = ['math','physics'].includes(subjectPart) ? subjectPart : 'physics';
    const allowed = course.modules.some(module => module.id === moduleId && (subject === 'math' ? module.id === 'sequences' : module.id !== 'sequences'));
    return {page, subject, moduleId:allowed ? moduleId : null};
  }
  if (page === 'practice') {
    const subject = ['math','physics','chemistry'].includes(subjectPart) ? subjectPart : null;
    return {page, subject};
  }
  if (page === 'summary' && subjectPart) return {page, id:subjectPart};
  if (page === 'present' && subjectPart) return {page, id:subjectPart};
  if (page === 'classroom') return {page, tab:['board','materials','programme','groups','teach'].includes(subjectPart) ? subjectPart : null};
  if (['profile','program','formulas','triangles','shortcuts','algebra','chemistry','summaries','planner'].includes(page)) return {page};
  return {page:'home'};
};
const href = (path) => `#${path}`;
const progressRing = (pct) => `<span class="progress-ring" style="--progress:${pct}%"><span>${pct}%</span></span>`;

function renderHeader(active) {
  const pct = percentage();
  const isPt = lang() === 'pt';
  const studyActive = ['summaries','summary','planner'].includes(active);
  const classActive = ['classroom','present'].includes(active);
  topbar.innerHTML = `<a class="brand" href="${href('home')}" aria-label="Ingenium 2.0 · ${e(ui('home'))}"><span class="brand-mark" aria-hidden="true"><svg viewBox="0 0 32 32"><path d="M16 4.5 27.2 24H4.8Z" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"/><path d="M11 14h10" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><path d="M11 14h5v10H6.5Z" fill="currentColor"/></svg></span><span><strong>INGENIUM</strong><small>${e(isPt?'2.0 · ESTUDO VISUAL':'2.0 · VISUAL LEARNING')}</small></span></a><div class="topbar-actions"><a class="top-class ${classActive?'is-active':''}" href="${href('classroom')}" aria-label="${e(isPt?'Turma e modo aula':'Class and class mode')}" ${classActive?'aria-current="page"':''}>${icon('users',17)}<span>${e(isPt?'Turma':'Class')}</span></a><a class="top-study ${studyActive?'is-active':''}" href="${href('summaries')}" aria-label="${e(isPt?'Resumos e plano de estudo':'Summaries and study plan')}" ${studyActive?'aria-current="page"':''}>${icon('book',17)}<span>${e(isPt?'Estudo':'Study')}</span></a><div class="lang-switch" role="group" aria-label="${e(ui('language'))}"><button data-action="language" data-language="pt" aria-pressed="${lang()==='pt'}">PT</button><button data-action="language" data-language="en" aria-pressed="${lang()==='en'}">EN</button></div><button type="button" class="theme-toggle" data-action="theme-toggle" aria-pressed="${currentTheme()==='purple'}" aria-label="${e(themeActionLabel(currentTheme(), isPt))}" title="${e(themeActionLabel(currentTheme(), isPt))}">${icon('palette',17)}</button><a class="top-progress" href="${href('profile')}" aria-label="${e(ui('progress'))}: ${pct}%">${progressRing(pct)}<span>${e(ui('progress'))}</span></a><a class="avatar" href="${href('profile')}" aria-label="${e(ui('profile'))}">${icon('user',18)}</a></div>`;
  bottomNav.innerHTML = `<a href="${href('home')}" class="${active==='home'?'active':''}">${icon('home',18)}<span>${e(ui('home'))}</span></a><a href="${href('program')}" class="${active==='program'?'active':''}">${icon('layers',18)}<span>${e(lang()==='pt'?'Programa':'Programme')}</span></a><a href="${href('formulas')}" class="${['formulas','triangles','shortcuts'].includes(active)?'active':''}">${icon('sigma',18)}<span>${e(lang()==='pt'?'Fórmulas':'Formulas')}</span></a><a href="${href('practice')}" class="${active==='practice'?'active':''}">${icon('target',18)}<span>${e(ui('practice'))}</span></a><a href="${href('classroom')}" class="${classActive?'active':''}">${icon('users',18)}<span>${e(lang()==='pt'?'Turma':'Class')}</span></a><a href="${href('profile')}" class="${active==='profile'?'active':''}">${icon('user',18)}<span>${e(ui('profile'))}</span></a>`;
}

function lessonCard(lesson, index, compact=false) {
  const done = state.completed.includes(lesson.id);
  const mark = done ? icon('check',15) : `<span>${String(index+1).padStart(2,'0')}</span>`;
  return `<a class="lesson-row ${done?'is-done':''} ${compact?'compact':''}" href="${href(`lesson/${lesson.id}`)}"><span class="lesson-number">${mark}</span><span class="lesson-row-copy"><strong>${e(t(lesson.title))}</strong><small>${e(t(lesson.kicker))}</small></span><span class="lesson-row-meta">${e(String(lesson.duration))} ${e(ui('minutes'))}</span>${icon('chevron',17)}</a>`;
}

function moduleCard(module, index, subject='physics') {
  const done = module.lessonIds.filter(id => state.completed.includes(id)).length;
  const count = module.lessonIds.length;
  const selected = route().moduleId === module.id;
  return `<a class="module-card ${selected?'selected':''}" href="${href(`topic/${subject}/${module.id}`)}" ${selected?'aria-current="page"':''}><span class="module-icon module-color-${index%5}">${icon(module.icon,22)}</span><span class="module-copy"><strong>${e(t(module.title))}</strong><small>${count} ${e(ui('lessons'))} · ${done}/${count} ${e(ui('done'))}</small><span class="tiny-progress"><i style="width:${count?Math.round(done/count*100):0}%"></i></span></span>${icon('chevron',18)}</a>`;
}

function renderHome() {
  const nextEvent = getUpcomingEvents(state.programme, new Date(), { limit: 1 })[0] || null;
  renderHomePage({ app, lang, t, ui, e, icon, href, course, algebraSyllabus, homeSubjectDiagram, summaryCount: state.summaries.length, nextEvent });
}
function renderTopic() {
  const current = route();
  const subject = current.subject || 'physics';
  const subjectModules = course.modules.filter(module => subject === 'math' ? module.id === 'sequences' : module.id !== 'sequences');
  const isMath = subject === 'math';
  const subjectTitle = lang()==='pt'?(isMath?'Matemática':'Física'):(isMath?'Mathematics':'Physics');

  if (!current.moduleId) {
    const topicCards = subjectModules.map((module,index) => {
      const lessons = module.lessonIds.map(id => lessonById[id]).filter(Boolean);
      const done = lessons.filter(lesson => state.completed.includes(lesson.id)).length;
      return `<button type="button" class="topic-choice-card topic-choice-trigger" data-action="topic-lessons" data-module="${e(module.id)}" aria-haspopup="dialog" aria-controls="topic-lessons-dialog">
        <span class="topic-choice-icon module-color-${index%5}">${icon(module.icon,29)}</span>
        <span class="topic-choice-copy"><strong>${e(t(module.title))}</strong><small>${e(t(module.description))}</small></span>
        <span class="topic-choice-bottom"><span>${lessons.length} ${e(ui('lessons'))}</span><span>${done}/${lessons.length} ${e(ui('done'))}</span></span>
        <span class="topic-choice-progress"><i style="width:${lessons.length?Math.round(done/lessons.length*100):0}%"></i></span>
        <span class="topic-choice-arrow">${icon('chevron',20)}</span>
      </button>`;
    }).join('');

    const totalLessons = subjectModules.reduce((sum,module)=>sum+module.lessonIds.length,0);
    const totalDone = subjectModules.reduce((sum,module)=>sum+module.lessonIds.filter(id=>state.completed.includes(id)).length,0);
    const lessonDialog = `<div class="topic-dialog-backdrop" data-action="close-topic-dialog" hidden><section class="topic-dialog" id="topic-lessons-dialog" role="dialog" aria-modal="true" aria-labelledby="topic-dialog-title"><div class="topic-dialog-head"><div><h2 id="topic-dialog-title">${e(t(subjectModules[0]?.title || (lang()==='pt'?'Lições':'Lessons')))}</h2></div><button class="topic-dialog-close" data-action="close-topic-dialog" aria-label="${e(lang()==='pt'?'Fechar':'Close')}">${icon('close',20)}</button></div><div class="topic-dialog-lessons" id="topic-dialog-lessons"></div></section></div>`;
    app.innerHTML = `<section class="page topic-page subject-course-overview">
      <div class="subject-back-row"><a class="text-link" href="${href('home')}">${icon('back',16)} ${e(ui('home'))}</a></div>
      <div class="topic-head topic-overview-head"><div><h1>${e(subjectTitle)}<span class="title-period" aria-hidden="true">.</span></h1></div>
      <div class="topic-progress">${progressRing(Math.round(totalDone/Math.max(1,totalLessons)*100))}<span><strong>${totalDone} / ${totalLessons}</strong><small>${e(ui('lessons'))} ${e(ui('done'))}</small></span></div></div>
      <div class="topic-choice-grid">${topicCards}</div>
      ${lessonDialog}
    </section>`;
    return;
  }

  const module = moduleById[current.moduleId];
  if (!module || !subjectModules.some(item=>item.id===module.id)) { location.hash = `#topic/${subject}`; return; }
  state.activeModule = module.id;
  const lessons = module.lessonIds.map(id => lessonById[id]).filter(Boolean);
  const moduleIndex = subjectModules.findIndex(item => item.id === module.id);
  const done = lessons.filter(item => state.completed.includes(item.id)).length;
  const cards = subjectModules.map((item,index) => moduleCard(item,index,subject)).join('');
  const rows = lessons.map((lesson,i) => lessonCard(lesson,i)).join('');
  const first = lessons.find(item => !state.completed.includes(item.id)) || lessons[0];

  app.innerHTML = `<section class="page topic-page topic-detail-page">
  <div class="subject-back-row"><a class="text-link" href="${href(`topic/${subject}`)}">${icon('back',16)} ${e(lang()==='pt'?'Todas as secções':'All topics')}</a></div>
  <div class="course-layout"><aside class="module-rail"><div class="rail-heading"><p class="eyebrow">${e(ui('studyPath'))}</p><span>${String(subjectModules.length).padStart(2,'0')}</span></div>${cards}</aside>
  <div class="module-content"><div class="module-banner"><div class="module-banner-icon module-color-${moduleIndex%5}">${icon(module.icon,27)}</div><div><h1>${e(t(module.title))}<span class="title-period" aria-hidden="true">.</span></h1><p>${e(t(module.description))}</p></div><div class="module-donut">${progressRing(Math.round(done/Math.max(1,lessons.length)*100))}</div></div>
  <div class="section-heading lesson-list-heading"><div><h2>${e(ui('lessons'))}</h2></div><span class="stat-pill"><strong>${done}/${lessons.length}</strong> ${e(ui('done'))}</span></div><div class="lesson-list">${rows}</div><a class="button button-lime module-start" href="${href(`lesson/${first.id}`)}">${e(ui('continue'))}${icon('arrow',17)}</a></div></div></section>`;
}function exampleCard(lesson) {
  const example = lesson.example;
  const visible = Math.max(1, Math.min(example.steps.length, Number(state.stepAt[lesson.id] || 1)));
  const steps = example.steps.slice(0, visible).map((step,i) => `<div class="example-step"><span>${String(i+1).padStart(2,'0')}</span><div class="example-step-copy">${renderTeachingCopy(t(step))}</div></div>`).join('');
  const complete = visible >= example.steps.length;
  return `<section class="card example-card"><div class="card-topline"><span class="card-stamp coral-stamp">${icon('spark',15)} ${e(ui('worked'))}</span><span class="tag">${e(ui('problem'))}</span></div><h2>${e(t(example.prompt))}</h2><div class="example-steps">${steps}</div>${complete?`<div class="example-answer"><span>${icon('check',16)} ${e(ui('solution'))}</span><div class="example-answer-copy">${renderTeachingCopy(t(example.answer))}</div></div>`:''}<div class="example-controls">${complete?`<button class="button button-ghost button-small" data-action="restart-example" data-lesson="${e(lesson.id)}">${icon('reset',15)} ${e(ui('restart'))}</button>`:`<button class="button button-primary button-small" data-action="next-step" data-lesson="${e(lesson.id)}">${e(ui('showStep'))}${icon('arrow',15)}</button>`}</div></section>`;
}

function checkCard(lesson) {
  const selected = state.answers[lesson.id];
  const answered = Number.isInteger(selected);
  const check = lesson.check;
  const checkOptions = Array.isArray(check?.options) ? check.options : [];
  return `<section class="card check-card"><div class="card-topline"><span class="card-stamp blue-stamp">${icon('target',15)} ${e(ui('check'))}</span><span class="tag">${e(ui('checkQuestion'))}</span></div><h2>${e(t(check.question))}</h2><p class="muted check-hint">${e(ui('choose'))}</p><div class="answer-options">${checkOptions.map((option,i)=>`<button type="button" class="answer-option ${answered&&selected===i?'picked':''} ${answered&&i===check.correct?'is-correct':''} ${answered&&selected===i&&i!==check.correct?'is-wrong':''}" data-action="answer" data-lesson="${e(lesson.id)}" data-choice="${i}" ${answered?'disabled':''}><span class="answer-letter">${String.fromCharCode(65+i)}</span><span>${e(t(option))}</span>${answered&&i===check.correct?icon('check',16):''}</button>`).join('')}</div>${answered?`<div class="answer-feedback ${selected===check.correct?'good':'try-again'}"><strong>${e(selected===check.correct?ui('correct'):ui('incorrect'))}</strong><div class="check-feedback-copy"><b>${e(ui('why'))}</b>${renderTeachingCopy(t(check.why))}</div>${selected!==check.correct?`<button class="text-link" data-action="retry-answer" data-lesson="${e(lesson.id)}">${e(lang()==='pt'?'Tentar outra vez':'Try again')}</button>`:''}</div>`:''}</section>`;
}

function intuitionCard(lesson) {
  if (!lesson.analogy) return '';
  return `<section class="intuition-card"><div class="intuition-label">${icon('spark',17)} ${e(lang()==='pt'?'COMEÇA PELA INTUIÇÃO':'START WITH INTUITION')}</div><h2>${e(lang()==='pt'?'Imagina isto…':'Imagine this…')}</h2><div class="intuition-copy">${renderTeachingCopy(t(lesson.analogy))}</div></section>`;
}


function sequenceViewSwitch() {
  return `<div class="sequence-view-switch" role="group" aria-label="${e(lang()==='pt'?'Formato da lição':'Lesson layout')}"><span>${e(lang()==='pt'?'VISTA':'VIEW')}</span><button type="button" data-action="sequence-view" data-view="split" aria-pressed="${state.sequenceView==='split'}">${e(lang()==='pt'?'Subtemas separados':'Separate topics')}</button><button type="button" data-action="sequence-view" data-view="continuous" aria-pressed="${state.sequenceView==='continuous'}">${e(lang()==='pt'?'Uma página':'One page')}</button></div>`;
}
function compactSequenceCopy(value, max = 100) {
  const text = String(value || '').replace(/\s+/g, ' ').trim();
  if (text.length <= max) return text;
  const firstSentence = text.match(/^.{1,100}?[.!?](?:\s|$)/);
  if (firstSentence && firstSentence[0].trim().length <= max) return firstSentence[0].trim();
  const cut = text.slice(0, max - 1);
  const boundary = cut.lastIndexOf(' ');
  return cut.slice(0, boundary > 70 ? boundary : max - 1).replace(/[,:;\s]+$/, '') + '…';
}
function renderTeachingCopy(value, extraClass = '') {
  const text = String(value || '').replace(/\s+/g, ' ').trim();
  if (!text) return '';
  const rawParts = text.split(/(?<=[.!?])["”»']?\s+|;\s+/u).map(part => part.trim()).filter(Boolean);
  const parts = [];
  for (const raw of rawParts) {
    let remaining = raw;
    while (remaining.length > 250) {
      const comma = remaining.lastIndexOf(', ', 220);
      if (comma < 150) break;
      parts.push(remaining.slice(0, comma + 1).trim());
      remaining = remaining.slice(comma + 2).trim();
    }
    if (remaining) parts.push(remaining);
  }
  const terms = lang() === 'pt'
    ? /(posição final|posição inicial|ideia-chave|uma sucessão|uma regra|um vetor|deslocamento|velocidade|aceleração|componente(?:s)?|gravidade|direção|magnitude|diferença|sucessão|vetor|escalar|posição|regra|termo|tempo|eixo|origem|movimento|alcance|trajetória|sinal)/gi
    : /(final position|initial position|key idea|a sequence|a rule|a vector|displacement|velocity|acceleration|components?|gravity|direction|magnitude|difference|sequence|vector|scalar|position|rule|term|time|axis|origin|motion|range|trajectory|sign)/gi;
  const renderHighlighted = sentence => {
    let count = 0;
    return e(sentence).replace(terms, match => count++ < 2 ? `<mark class="teaching-highlight">${match}</mark>` : match);
  };
  const notePattern = /^(A grande ideia|The big idea|Atenção|Attention|Importante|Important|Lembra-te|Remember|Em resumo|In short)\b/i;
  return `<div class="teaching-copy ${e(extraClass)}">${parts.map(sentence => {
    const note = notePattern.test(sentence);
    if (note) {
      const label = /^(Atenção|Attention|Importante|Important)/i.test(sentence)
        ? (lang() === 'pt' ? 'ATENÇÃO' : 'PAY ATTENTION')
        : (lang() === 'pt' ? 'IDEIA-CHAVE' : 'KEY IDEA');
      return `<aside class="teaching-note"><span class="teaching-note-label">${label}</span><p class="teaching-sentence">${renderHighlighted(sentence)}</p></aside>`;
    }
    return `<p class="teaching-sentence">${renderHighlighted(sentence)}</p>`;
  }).join('')}</div>`;
}

function sequenceVisual(item, number=1) {
  const title=t(item.diagram.title), caption=t(item.diagram.caption);
  const ref=`MV-${String(number).padStart(3,'0')}`;
  const heading=`<div class="diagram-heading"><div><span class="diagram-kicker">${lang()==='pt'?'MAPA VISUAL':'VISUAL MAP'}</span><h3>${e(title)}</h3></div><span class="diagram-index" aria-label="${lang()==='pt'?'Referência do mapa visual':'Visual map reference'} ${ref}">${ref}</span></div>`;
  const frame='';
  const text=(x,y,value,color='#132238',size=16,weight=700,anchor='middle')=>`<text x="${x}" y="${y}" fill="${color}" font-family="Plus Jakarta Sans,sans-serif" font-size="${Math.round(size*1.8)}" font-weight="${weight}" text-anchor="${anchor}">${e(value)}</text>`;
  const chip=(x,y,value,fill='#e6f7ce',ink='#416f32',w=74)=>`<rect x="${x}" y="${y}" width="${w}" height="62" rx="13" fill="${fill}"/>${text(x+w/2,y+40,value,ink,22,800)}`;
  let drawing='';
  if(item.id==='sequence-basics') {
    drawing=frame+[2,4,6,8,10].map((v,i)=>chip(38+i*124,56,String(v),['#e6f7ce','#e7edff','#ffebe6','#fff1c1','#dff4ef'][i],['#416f32','#4167c2','#c95443','#8a6c16','#24796e'][i],82)).join('')+[1,2,3,4,5].map((v,i)=>text(79+i*124,136,'a'+['₁','₂','₃','₄','₅'][i],'#5e6b7d',12,600)).join('')+text(340,176,lang()==='pt'?'Uma lista ordenada de termos':'An ordered list of terms','#5e6b7d',13,600);
  } else if(item.id==='sequence-patterns') {
    drawing=frame+[4,7,10,13].map((v,i)=>chip(44+i*155,65,String(v),['#e6f7ce','#e7edff','#ffebe6','#fff1c1'][i],['#416f32','#4167c2','#c95443','#8a6c16'][i],82)).join('')+[0,1,2].map(i=>`<path d="M${128+i*155} 95H${194+i*155}" stroke="#5c8d36" stroke-width="3" marker-end="url(#sequence-arrow)"/>${text(161+i*155,59,'+3','#416f32',14,800)}`).join('')+text(340,160,lang()==='pt'?'Compara termos vizinhos para encontrar o salto':'Compare neighbouring terms to find the jump','#5e6b7d',13,600);
  } else if(item.id==='sequence-terms') {
    drawing=frame+[["a₁","5"],["a₂","8"],["a₃","11"]].map((a,i)=>`<rect x="${74+i*180}" y="44" width="132" height="100" rx="15" fill="${['#e6f7ce','#e7edff','#ffebe6'][i]}"/>${text(140+i*180,78,a[0],['#416f32','#4167c2','#c95443'][i],16,800)}${text(140+i*180,123,a[1],['#416f32','#4167c2','#c95443'][i],27,800)}`).join('')+text(340,174,lang()==='pt'?'Índice = posição · número = valor':'Index = position · number = value','#5e6b7d',13,600);
  } else if(item.id==='sequence-finite-infinite') {
    drawing=frame+text(175,43,lang()==='pt'?'POSIÇÃO':'POSITION','#5e6b7d',12,800)+text(485,43,lang()==='pt'?'VALOR':'VALUE','#5e6b7d',12,800)+[1,2,3].map((v,i)=>`<rect x="70" y="${54+i*40}" width="210" height="35" rx="8" fill="#e7edff"/>${text(175,75+i*40,String(v),'#4167c2',15,800)}<rect x="380" y="${54+i*40}" width="210" height="35" rx="8" fill="#e6f7ce"/>${text(485,75+i*40,['5','8','11'][i],'#416f32',15,800)}`).join('');
  } else if(item.id==='sequence-types') {
    drawing=frame+text(175,43,lang()==='pt'?'FINITA · TEM FIM':'FINITE · HAS AN END','#4167c2',12,800)+[2,4,6,8].map((v,i)=>chip(46+i*68,57,String(v),'#e7edff','#4167c2',52)).join('')+text(510,85,'■','#4167c2',13,800)+text(175,132,lang()==='pt'?'INFINITA · CONTINUA':'INFINITE · CONTINUES','#416f32',12,800)+[2,4,6,8].map((v,i)=>chip(46+i*68,145,String(v),'#e6f7ce','#416f32',52)).join('')+text(356,171,'…','#416f32',24,800);
  } else if(item.id==='arithmetic-sequences') {
    drawing=frame+text(42,44,lang()==='pt'?'TIPO':'TYPE','#5e6b7d',11,800,'start')+text(165,44,lang()==='pt'?'TERMOS':'TERMS','#5e6b7d',11,800,'start')+text(535,44,lang()==='pt'?'REGRA':'RULE','#5e6b7d',11,800,'start')+[['Aritmética','Arithmetic','2 · 5 · 8 · 11','+3','#e7edff','#4167c2'],['Geométrica','Geometric','2 · 4 · 8 · 16','×2','#e6f7ce','#416f32'],['Frações','Fractions','1 · ½ · ⅓ · ¼','divide','#ffebe6','#c95443']].map((r,i)=>`<rect x="28" y="${54+i*45}" width="624" height="41" rx="9" fill="${r[4]}"/>${text(42,78+i*45,lang()==='pt'?r[0]:r[1],r[5],12,800,'start')}${text(310,78+i*45,r[2],r[5],15,800)}${text(565,78+i*45,r[3],r[5],12,800)}`).join('');
  } else if(item.id==='sequence-general-term') {
    drawing=frame+chip(44,78,'n','#e7edff','#4167c2',88)+`<path d="M135 99H211" stroke="#132238" stroke-width="2.5" marker-end="url(#sequence-arrow)"/>`+chip(220,78,'a₁ + (n−1)d','#e6f7ce','#416f32',220)+`<path d="M444 99H508" stroke="#132238" stroke-width="2.5" marker-end="url(#sequence-arrow)"/>`+chip(516,78,'aₙ','#ffebe6','#c95443',88)+text(340,166,lang()==='pt'?'Posição → número de saltos → termo':'Position → number of jumps → term','#5e6b7d',13,600);
  } else if(item.id==='sequence-notebook-formula') {
    drawing=frame+text(340,48,'5 + 3(n − 1)','#4167c2',23,800)+`<path d="M340 61V83" stroke="#8795a8" stroke-width="2" marker-end="url(#sequence-arrow)"/>`+text(340,111,'5 + 3n − 3','#c95443',20,800)+`<path d="M340 124V145" stroke="#8795a8" stroke-width="2" marker-end="url(#sequence-arrow)"/>`+text(340,175,'2 + 3n','#416f32',24,800)+text(340,194,lang()==='pt'?'Forma diferente, mesmos valores':'Different form, same values','#5e6b7d',11,600);
  } else if(item.id==='sequence-decreasing') {
    drawing=frame+[13,10,7,4,1].map((v,i)=>chip(36+i*126,60,String(v),['#e6f7ce','#e7edff','#ffebe6','#fff1c1','#dff4ef'][i],['#416f32','#4167c2','#c95443','#8a6c16','#24796e'][i],82)).join('')+[0,1,2,3].map(i=>`<path d="M${118+i*126} 83H${154+i*126}" stroke="#c95443" stroke-width="2.5" marker-end="url(#sequence-down-arrow)"/>${text(132+i*126,48,'−3','#c95443',13,800)}`).join('')+text(340,153,lang()==='pt'?'Cada termo é 3 unidades menor':'Each term is 3 smaller','#5e6b7d',13,600);
  } else if(item.id==='sequence-fractions') {
    drawing=frame+[["n=1","1"],["n=2","⅔"],["n=3","½"],["n=4","⅖"]].map((r,i)=>`<rect x="${43+i*153}" y="44" width="124" height="103" rx="13" fill="${['#e6f7ce','#e7edff','#ffebe6','#fff1c1'][i]}"/>${text(105+i*153,70,r[0],'#5e6b7d',12,700)}${text(105+i*153,116,r[1],['#416f32','#4167c2','#c95443','#8a6c16'][i],27,800)}`).join('')+text(340,173,'aₙ = 2 / (n + 1)','#132238',16,800);
  } else if(item.id==='sequence-geometric') {
    drawing=frame+[3,6,12,24,48].map((v,i)=>chip(34+i*126,64,String(v),['#e6f7ce','#e7edff','#ffebe6','#fff1c1','#dff4ef'][i],['#416f32','#4167c2','#c95443','#8a6c16','#24796e'][i],82)).join('')+[0,1,2,3].map(i=>`<path d="M${116+i*126} 86H${153+i*126}" stroke="#416f32" stroke-width="2.5" marker-end="url(#sequence-arrow)"/>${text(130+i*126,49,'×2','#416f32',13,800)}`).join('')+text(340,156,lang()==='pt'?'Multiplica sempre pela mesma razão':'Multiply by the same ratio each time','#5e6b7d',13,600);
  } else if(item.id==='sequence-method') {
    drawing=frame+[['01',lang()==='pt'?'Ler':'Read'],['02',lang()==='pt'?'Identificar':'Identify'],['03',lang()==='pt'?'Substituir':'Substitute'],['04',lang()==='pt'?'Calcular':'Calculate'],['05',lang()==='pt'?'Verificar':'Check']].map((r,i)=>`<rect x="${24+i*127}" y="62" width="118" height="82" rx="13" fill="${['#e7edff','#e6f7ce','#ffebe6','#fff1c1','#dff4ef'][i]}"/>${text(83+i*127,88,r[0],'#5e6b7d',11,800)}${text(83+i*127,116,r[1],['#4167c2','#416f32','#c95443','#8a6c16','#24796e'][i],12,800)}`).join('')+text(340,174,lang()==='pt'?'Uma rotina simples para não saltar passos':'A simple routine that prevents skipped steps','#5e6b7d',12,600);
  } else if(item.id==='sequence-checkpoint') {
    drawing=frame+text(340,49,'aₙ = 2n + 1','#4167c2',23,800)+`<path d="M340 61V88" stroke="#8795a8" stroke-width="2.5" marker-end="url(#sequence-arrow)"/>`+chip(228,97,'n = 2','#e7edff','#4167c2',90)+`<path d="M322 118H358" stroke="#8795a8" stroke-width="2.5" marker-end="url(#sequence-arrow)"/>`+chip(368,97,'5','#e6f7ce','#416f32',72)+text(340,174,lang()==='pt'?'Substitui, calcula e verifica':'Substitute, calculate, and check','#5e6b7d',13,600);
  } else { return renderDiagram(item.diagram,lang(),number); }
  const markers='<defs><marker id="sequence-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto"><path d="M0 0 6 3 0 6" fill="#132238"/></marker><marker id="sequence-down-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto"><path d="M0 0 6 3 0 6" fill="#c95443"/></marker></defs>';
  const visual=`<svg class="physics-svg sequence-matched-svg" viewBox="0 24 680 188" role="img" aria-label="${e(title)}">${markers}${drawing}</svg>`;
  return `<figure class="diagram-card sequence-block-diagram">${heading}${visual}<figcaption>${e(caption)}</figcaption></figure>`;
}


function renderSequenceLesson(lesson) {
  state.lastLesson = lesson.id; save();
  const list = moduleById.sequences.lessonIds.map(id=>lessonById[id]).filter(Boolean);
  const completed = list.filter(item=>state.completed.includes(item.id)).length;
  const renderOne = (item,idx) => {
    const done=state.completed.includes(item.id), answered=Number.isInteger(state.answers[item.id]);
    const checkOptions = Array.isArray(item.check?.options) ? item.check.options : [];
    const story=item.sections.map((section,i)=>`<section class="sequence-reading-section ${/^(A grande ideia|The big idea|Atenção|Attention|Importante|Important)/i.test(t(section.heading))?'section-highlight':''}"><h3><span>${String(i+1).padStart(2,'0')}</span>${e(t(section.heading))}</h3>${renderTeachingCopy(t(section.body),'sequence-section-copy')}</section>`).join('');
    const steps=item.example.steps.map((step,i)=>`<div class="sequence-work-step"><span>${String(i+1).padStart(2,'0')}</span><div class="sequence-work-copy">${renderTeachingCopy(t(step))}</div></div>`).join('');
    return `<article class="sequence-chapter" id="sequence-${e(item.id)}"><header class="sequence-chapter-head"><div class="sequence-chapter-index">${String(idx+1).padStart(2,'0')}</div><div><p class="sequence-mini-label">${e(t(item.kicker))}</p><h2>${e(t(item.title))}</h2><p class="sequence-chapter-meta">${item.duration} ${e(lang()==='pt'?'minutos de leitura':'min read')}${done?' · ✓ '+e(lang()==='pt'?'Concluída':'Completed'):''}</p></div></header>
    <div class="sequence-chapter-body"><div class="sequence-analogy">${renderTeachingCopy(t(item.analogy),'sequence-analogy-copy')}</div>
    <div class="sequence-visual">${sequenceVisual(item,lessonIndex(item.id)+1)}</div><div class="sequence-explain">${renderTeachingCopy(t(item.concept),'sequence-concept-copy')}</div><div class="sequence-story">${story}</div>
    <section class="sequence-worked"><p class="sequence-mini-label">${e(lang()==='pt'?'EXEMPLO GUIADO':'GUIDED EXAMPLE')}</p><h3>${e(t(item.example.prompt))}</h3><div class="sequence-work-steps">${steps}</div><div class="sequence-work-answer"><span>${e(lang()==='pt'?'A IDEIA-CHAVE':'THE KEY IDEA')}</span><div class="sequence-work-answer-copy">${renderTeachingCopy(t(item.example.answer))}</div></div></section>
    <section class="sequence-check"><p class="sequence-mini-label">${e(lang()==='pt'?'VERIFICA SE PERCEBESTE':'CHECK YOUR UNDERSTANDING')}</p><h3>${e(t(item.check.question))}</h3><div class="answer-options">${checkOptions.map((option,i)=>`<button type="button" class="answer-option ${answered&&state.answers[item.id]===i?'picked':''} ${answered&&i===item.check.correct?'is-correct':''} ${answered&&state.answers[item.id]===i&&i!==item.check.correct?'is-wrong':''}" data-action="answer" data-lesson="${e(item.id)}" data-choice="${i}" ${answered?'disabled':''}><span class="answer-letter">${String.fromCharCode(65+i)}</span><span>${e(t(option))}</span>${answered&&i===item.check.correct?icon('check',16):''}</button>`).join('')}</div>${answered?`<div class="answer-feedback ${state.answers[item.id]===item.check.correct?'good':'try-again'}"><strong>${e(state.answers[item.id]===item.check.correct?ui('correct'):ui('incorrect'))}</strong>${renderTeachingCopy(t(item.check.why))}${state.answers[item.id]!==item.check.correct?`<button class="text-link" data-action="retry-answer" data-lesson="${e(item.id)}">${e(lang()==='pt'?'Tentar outra vez':'Try again')}</button>`:''}</div>`:''}</section>
    <section class="sequence-independent"><p class="sequence-mini-label">${e(lang()==='pt'?'AGORA EXPERIMENTA TU':'NOW TRY IT YOURSELF')}</p><h3>${e(t(item.exercise))}</h3><details><summary>${e(ui('showAnswer'))}</summary>${renderTeachingCopy(t(item.hint)||(lang()==='pt'?'Usa o mesmo raciocínio do exemplo e verifica cada passo.':'Use the same reasoning as the example and check each step.'))}</details></section>
    <div class="sequence-chapter-actions"><button type="button" class="button ${done?'button-ghost':'button-lime'}" data-action="complete" data-lesson="${e(item.id)}">${icon('check',16)} ${e(done?ui('markUndone'):ui('markDone'))}</button><span>${done?e(lang()==='pt'?'Esta parte está concluída':'This part is complete'):e(lang()==='pt'?'Marca como concluída quando estiveres pronto.':'Mark this part complete when you’re ready.')}</span></div></div></article>`;
  };
  app.innerHTML = `<section class="page sequence-page sequence-course-page">${sequenceViewSwitch()}<nav class="sequence-breadcrumb"><a href="${href('topic/math')}">${e(lang()==='pt'?'Matemática':'Mathematics')}</a><span>›</span><span>${e(lang()==='pt'?'Sucessões':'Sequences')}</span></nav>
  <header class="sequence-hero sequence-course-hero"><p class="sequence-eyebrow">INGENIUM · ${e(lang()==='pt'?'APRENDER MATEMÁTICA':'LEARN MATHEMATICS')}</p><h1>${e(lang()==='pt'?'Sucessões, do zero':'Sequences, from zero')}<span class="title-period" aria-hidden="true">.</span></h1><p class="sequence-lead">${e(lang()==='pt'?'Uma explicação visual, passo a passo. Lê, observa, experimenta e avança ao teu ritmo.':'A visual, step-by-step explanation. Read, observe, try, and move at your own pace.')}</p><div class="sequence-course-progress"><span><strong>${completed} / ${list.length}</strong> ${e(lang()==='pt'?'subtemas concluídos':'subtopics completed')}</span><div><i style="width:${Math.round(completed/list.length*100)}%"></i></div></div></header>
  <nav class="sequence-topic-nav" aria-label="${e(lang()==='pt'?'Subtemas':'Subtopics')}"><span class="sequence-nav-label">${e(lang()==='pt'?'IR PARA UM SUBTEMA':'JUMP TO A SUBTOPIC')}</span><div>${list.map((item,i)=>`<button type="button" data-action="jump-sequence" data-target="sequence-${e(item.id)}" class="${state.completed.includes(item.id)?'is-done':''}"><span>${String(i+1).padStart(2,'0')}</span>${e(t(item.title))}${state.completed.includes(item.id)?' ✓':''}</button>`).join('')}</div></nav>
  <div class="sequence-course-intro"><span class="sequence-tutor-mark">${icon('spark',20)}</span><div><strong>${e(lang()==='pt'?'Vamos aprender sem saltar etapas.':'Let’s learn without skipping steps.')}</strong><p>${e(lang()==='pt'?'Cada subtema começa com uma analogia, mostra a ideia, resolve um exemplo contigo e termina com uma pequena experiência. Não precisas de decorar tudo de uma vez.':'Each subtopic starts with an analogy, makes the idea visible, works through an example with you, and ends with a small challenge. You do not need to memorise everything at once.')}</p></div></div><div class="sequence-chapters">${list.map(renderOne).join('')}</div>
  <footer class="sequence-course-end"><span>${icon('check-circle',20)}</span><div><strong>${e(lang()==='pt'?'O importante é perceber o porquê.':'Understanding why is what matters.')}</strong><p>${e(lang()==='pt'?'Se uma ideia ainda não estiver clara, volta ao exemplo visual e percorre os passos com calma.':'If an idea is still unclear, return to the visual example and work through the steps slowly.')}</p></div></footer></section>`;
  if (lesson.id !== list[0]?.id) setTimeout(()=>document.getElementById(`sequence-${lesson.id}`)?.scrollIntoView({behavior:'smooth',block:'start'}),0);
}
const helpMap = {"scalars-vectors":{"pt":{"read":"Um escalar dá valor e unidade; um vetor também indica para onde.","why":"O tempo faz sentido sem direção. Um deslocamento não: 5 m para leste e 5 m para oeste terminam em lugares diferentes.","example":"“5 m” diz quanto; “5 m para norte” diz quanto e para onde.","parts":[["12 s","tempo: valor e unidade bastam"],["12 m para leste","deslocamento com direção"]]},"en":{"read":"A scalar gives value and unit; a vector also tells which way.","why":"Time makes sense without direction. Displacement does not: 5 m east and 5 m west end in different places.","example":"“5 m” tells how much; “5 m north” tells how much and which way.","parts":[["12 s","time: value and unit are enough"],["12 m east","displacement with direction"]]}},"components":{"pt":{"read":"Lê o vetor como dois números: o primeiro é horizontal; o segundo é vertical.","why":"A seta inclinada pode ser descrita pelas duas partes. Juntas, elas reconstroem a seta. Os símbolos î e ĵ são abreviaturas para direções e podem esperar.","example":"A = (3, 4) significa 3 unidades na horizontal e 4 na vertical.","parts":[["Aₓ","parte horizontal"],["Aᵧ","parte vertical"],["(Aₓ, Aᵧ)","as duas partes juntas"]]},"en":{"read":"Read the vector as two numbers: the first is horizontal; the second is vertical.","why":"A tilted arrow can be described by its two parts. Together they reconstruct the arrow. î and ĵ are shorthand for directions and can wait.","example":"A = (3, 4) means 3 units horizontally and 4 vertically.","parts":[["Aₓ","horizontal part"],["Aᵧ","vertical part"],["(Aₓ, Aᵧ)","both parts together"]]}},"vector-operations":{"pt":{"read":"Junta horizontal com horizontal e vertical com vertical.","why":"Cada posição do par descreve um tipo de movimento. Somar posições correspondentes combina o mesmo tipo de movimento.","example":"(3, 2) + (1, 4): 3+1=4 para a direita; 2+4=6 para cima. Resultado (4, 6).","parts":[["(3, 2)","3 para a direita, 2 para cima"],["(1, 4)","1 para a direita, 4 para cima"],["(4, 6)","combined movement"]]},"en":{"read":"Add horizontal to horizontal and vertical to vertical.","why":"Each position in the pair describes a type of movement. Adding matching positions combines the same type of movement.","example":"(3, 2) + (1, 4): 3+1=4 right; 2+4=6 up. Result (4, 6).","parts":[["(3, 2)","3 right, 2 up"],["(1, 4)","1 right, 4 up"],["(4, 6)","combined movement"]]}},"dot-product":{"pt":{"read":"O ponto entre os vetores indica uma operação especial cujo resultado é um número, não uma seta.","why":"Multiplicamos as partes correspondentes e somamos. Isto resume o alinhamento entre vetores; a versão com cos θ pode ser estudada mais tarde.","example":"A=(3,2), B=(1,−1): 3×1 + 2×(−1) = 1.","parts":[["AₓBₓ","multiplica partes horizontais"],["AᵧBᵧ","multiplica partes verticais"],["+","soma os resultados"]]},"en":{"read":"The dot between vectors means a special operation whose result is a number, not an arrow.","why":"Multiply matching components and add them. This summarises alignment between vectors; the cos θ version can be studied later.","example":"A=(3,2), B=(1,−1): 3×1 + 2×(−1) = 1.","parts":[["AₓBₓ","multiply horizontal parts"],["AᵧBᵧ","multiply vertical parts"],["+","add the results"]]}},"reference-frames":{"pt":{"read":"Cada coordenada diz quanto avançar num dos eixos a partir da origem.","why":"Uma posição no espaço precisa de uma coordenada por cada direção independente.","example":"Num mapa, (3, 2) pode significar 3 unidades para leste e 2 para norte.","parts":[["x, y","coordenadas horizontal e vertical"],["posição","localização medida a partir da origem"]]},"en":{"read":"Each coordinate tells how far to move along an axis from the origin.","why":"A position in space needs one coordinate for each independent direction.","example":"On a map, (3, 2) can mean 3 units east and 2 north.","parts":[["x, y","horizontal and vertical coordinates"],["position","location measured from the origin"]]}},"position-displacement":{"pt":{"read":"Δ significa “mudança”. Deslocamento é posição final menos posição inicial.","why":"Subtrair a posição inicial da final mostra a mudança e preserva o sentido do movimento.","example":"Começa em 2 m e termina em 7 m: Δx = 7 − 2 = 5 m.","parts":[["Δx","mudança de posição"],["x_f","posição final"],["x_i","posição inicial"]]},"en":{"read":"Δ means “change”. Displacement is final position minus initial position.","why":"Subtracting initial position from final position shows the change and preserves its direction.","example":"Start at 2 m and finish at 7 m: Δx = 7 − 2 = 5 m.","parts":[["Δx","change in position"],["x_f","final position"],["x_i","initial position"]]}},"velocity":{"pt":{"read":"Velocidade média é mudança de posição dividida pelo tempo decorrido.","why":"A divisão responde: quanto mudou a posição em cada segundo? A notação dx/dt é avançada e descreve um instante específico.","example":"12 m em 3 s dá 12 ÷ 3 = 4 m/s.","parts":[["Δx","mudança de posição"],["Δt","tempo decorrido"],["÷","mudança por segundo"]]},"en":{"read":"Average velocity is change in position divided by elapsed time.","why":"Division answers: how much did position change each second? dx/dt is advanced notation for a specific instant.","example":"12 m in 3 s gives 12 ÷ 3 = 4 m/s.","parts":[["Δx","change in position"],["Δt","elapsed time"],["÷","change per second"]]}},"motion-graphs":{"pt":{"read":"A inclinação de um gráfico posição-tempo mostra a rapidez com que a posição muda.","why":"Inclinação compara mudança vertical com mudança horizontal. No gráfico x-t, isso significa mudança de posição por tempo: velocidade.","example":"Uma linha mais inclinada no gráfico posição-tempo indica maior velocidade.","parts":[["inclinação x-t","velocidade"],["área sob v-t","deslocamento acumulado"]]},"en":{"read":"The slope of a position-time graph shows how quickly position changes.","why":"Slope compares vertical change with horizontal change. On an x-t graph, that is position change per time: velocity.","example":"A steeper line on a position-time graph means greater velocity.","parts":[["slope of x-t","velocity"],["area under v-t","accumulated displacement"]]}},"acceleration":{"pt":{"read":"A aceleração diz quanto a velocidade muda por segundo.","why":"Dividimos a mudança de velocidade pelo tempo para encontrar a mudança média por segundo.","example":"De 2 m/s para 8 m/s em 2 s: (8−2)÷2 = 3 m/s².","parts":[["Δv","mudança de velocidade"],["Δt","tempo decorrido"],["Δv/Δt","mudança por segundo"]]},"en":{"read":"Acceleration tells how much velocity changes each second.","why":"We divide velocity change by time to find the average change per second.","example":"From 2 m/s to 8 m/s in 2 s: (8−2)÷2 = 3 m/s².","parts":[["Δv","change in velocity"],["Δt","elapsed time"],["Δv/Δt","change per second"]]}},"constant-acceleration":{"pt":{"read":"Estas regras são para aceleração constante. Cada uma responde a uma pergunta diferente.","why":"A primeira calcula velocidade; a segunda, deslocamento; a terceira liga velocidade e deslocamento sem usar o tempo. Aprende uma de cada vez.","example":"Começa a 2 m/s, acelera a 3 m/s² durante 4 s: v = 2 + 3×4 = 14 m/s.","parts":[["v₀","velocidade inicial"],["a","aceleração"],["t","tempo"]]},"en":{"read":"These rules apply to constant acceleration. Each answers a different question.","why":"The first finds velocity; the second displacement; the third links velocity and displacement without time. Learn one at a time.","example":"Start at 2 m/s, accelerate at 3 m/s² for 4 s: v = 2 + 3×4 = 14 m/s.","parts":[["v₀","initial velocity"],["a","acceleration"],["t","time"]]}},"free-fall-basics":{"pt":{"read":"A gravidade altera a velocidade vertical cerca de 9,8 m/s em cada segundo.","why":"O sinal depende de como escolhemos os eixos. Se cima é positivo, a gravidade aponta para baixo e é negativa.","example":"Com cima positivo: a = −9,8 m/s². Com baixo positivo, seria +9,8 m/s².","parts":[["g","magnitude da gravidade"],["−","indica direção para baixo nesta escolha de eixo"]]},"en":{"read":"Gravity changes vertical velocity by about 9.8 m/s each second.","why":"The sign depends on our axis choice. If up is positive, gravity points down and is negative.","example":"With up positive: a = −9.8 m/s². With down positive, it would be +9.8 m/s².","parts":[["g","magnitude of gravity"],["−","indicates downward direction with this axis choice"]]}},"vertical-launch":{"pt":{"read":"Estas expressões estimam o tempo até ao ponto mais alto e a altura máxima.","why":"No ponto mais alto, a velocidade vertical é zero por um instante. Usamos isso nas regras de aceleração constante.","example":"Se v₀ᵧ = 9,8 m/s para cima, o tempo até ao topo é cerca de 1 s.","parts":[["tₘₐₓ","tempo até ao topo"],["hₘₐₓ","altura máxima"],["g","gravidade"]]},"en":{"read":"These expressions estimate time to the highest point and maximum height.","why":"At the highest point, vertical velocity is zero for an instant. We use this in the constant-acceleration rules.","example":"If v₀ᵧ = 9.8 m/s upward, time to the top is about 1 s.","parts":[["tₘₐₓ","time to the top"],["hₘₐₓ","maximum height"],["g","gravity"]]}},"vector-motion":{"pt":{"read":"A posição, velocidade e aceleração descrevem coisas diferentes ao longo do tempo.","why":"Velocidade é a mudança da posição; aceleração é a mudança da velocidade. d/dt é notação matemática para mudança instantânea.","example":"Se a posição muda 2 m a cada segundo, a velocidade é 2 m/s.","parts":[["r⃗(t)","posição em cada instante"],["dr⃗/dt","velocidade"],["dv⃗/dt","aceleração"]]},"en":{"read":"Position, velocity and acceleration describe different things over time.","why":"Velocity is change in position; acceleration is change in velocity. d/dt is mathematical notation for instantaneous change.","example":"If position changes by 2 m each second, velocity is 2 m/s.","parts":[["r⃗(t)","position at each instant"],["dr⃗/dt","velocity"],["dv⃗/dt","acceleration"]]}},"components-motion":{"pt":{"read":"Cada par separa uma quantidade em parte horizontal e parte vertical.","why":"Analisar os eixos separadamente simplifica o movimento em duas dimensões.","example":"v⃗ = (5, 2) m/s significa 5 m/s na horizontal e 2 m/s na vertical.","parts":[["vₓ, vᵧ","velocidade horizontal e vertical"],["aₓ, aᵧ","aceleração horizontal e vertical"]]},"en":{"read":"Each pair splits a quantity into horizontal and vertical parts.","why":"Analysing axes separately simplifies two-dimensional motion.","example":"v⃗ = (5, 2) m/s means 5 m/s horizontally and 2 m/s vertically.","parts":[["vₓ, vᵧ","horizontal and vertical velocity"],["aₓ, aᵧ","horizontal and vertical acceleration"]]}},"horizontal-launch":{"pt":{"read":"A velocidade horizontal mantém-se; a gravidade altera o movimento vertical.","why":"Ignorando o ar, o movimento horizontal é velocidade × tempo. Verticalmente, a gravidade acelera o objeto para baixo.","example":"Se v₀ₓ = 4 m/s e t = 2 s, x = 4×2 = 8 m.","parts":[["v₀ₓt","distância horizontal"],["½gt²","efeito da gravidade ao longo do tempo"],["−","para baixo se cima é positivo"]]},"en":{"read":"Horizontal velocity stays constant; gravity changes vertical motion.","why":"Ignoring air resistance, horizontal motion is velocity × time. Vertically, gravity accelerates the object downward.","example":"If v₀ₓ = 4 m/s and t = 2 s, x = 4×2 = 8 m.","parts":[["v₀ₓt","horizontal distance"],["½gt²","gravity's effect over time"],["−","downward if up is positive"]]}},"angled-launch":{"pt":{"read":"Uma velocidade inclinada pode ser separada em componente horizontal e vertical.","why":"As componentes são os lados de um triângulo retângulo. Seno e cosseno ligam os lados ao ângulo; primeiro olha para o triângulo, depois para a regra.","example":"A 10 m/s a 30° tem componente horizontal ≈ 8,66 m/s e vertical = 5 m/s.","parts":[["θ","ângulo desde a horizontal"],["cos θ","componente horizontal"],["sin θ","componente vertical"]]},"en":{"read":"An angled velocity can be split into horizontal and vertical components.","why":"The components are sides of a right triangle. Sine and cosine connect the sides to the angle; look at the triangle before the rule.","example":"At 10 m/s and 30°, horizontal component ≈ 8.66 m/s and vertical = 5 m/s.","parts":[["θ","angle from horizontal"],["cos θ","horizontal component"],["sin θ","vertical component"]]}},"flight-and-range":{"pt":{"read":"O movimento vertical dá o tempo de voo; o horizontal dá o alcance.","why":"Depois de encontrar o tempo total, multiplica-o pela velocidade horizontal constante para calcular o alcance.","example":"A 6 m/s na horizontal durante 3 s: R = 6×3 = 18 m.","parts":[["H","altura máxima"],["R","alcance horizontal"],["v₀ₓt","velocidade horizontal × tempo"]]},"en":{"read":"Vertical motion gives flight time; horizontal motion gives range.","why":"After finding total time, multiply it by constant horizontal velocity to calculate range.","example":"At 6 m/s horizontally for 3 s: R = 6×3 = 18 m.","parts":[["H","maximum height"],["R","horizontal range"],["v₀ₓt","horizontal velocity × time"]]}},"unequal-heights":{"pt":{"read":"A expressão vertical combina a velocidade inicial com o efeito da gravidade; a horizontal usa velocidade horizontal e tempo.","why":"O primeiro termo descreve o movimento inicial. O segundo corrige esse movimento devido à aceleração. Os sinais dependem do eixo escolhido.","example":"Se o objeto começa a descer e cima é positivo, v₀ᵧ pode ser negativo.","parts":[["v₀ᵧt","efeito da velocidade vertical inicial"],["½gt²","efeito da gravidade"],["x = v₀ₓt","movimento horizontal"]]},"en":{"read":"The vertical expression combines initial velocity with gravity's effect; the horizontal one uses horizontal velocity and time.","why":"The first term describes initial motion. The second adjusts it for acceleration. Signs depend on the chosen axis.","example":"If the object starts moving down and up is positive, v₀ᵧ can be negative.","parts":[["v₀ᵧt","effect of initial vertical velocity"],["½gt²","effect of gravity"],["x = v₀ₓt","horizontal motion"]]}},"relative-velocity":{"pt":{"read":"A velocidade de A vista por B é a velocidade de A relativamente ao chão menos a velocidade de B relativamente ao chão.","why":"Retiramos o movimento do observador para descrever o que ele vê. O sentido é representado pelos sinais.","example":"A vai a 10 m/s e B a 6 m/s no mesmo sentido: A parece ir a 4 m/s relativamente a B.","parts":[["v⃗A/B","velocidade de A vista por B"],["−","retira o movimento de B"]]},"en":{"read":"A's velocity as seen by B is A's ground velocity minus B's ground velocity.","why":"Subtract the observer's motion to describe what they see. Direction is represented by signs.","example":"A moves at 10 m/s and B at 6 m/s in the same direction: A appears to move at 4 m/s relative to B.","parts":[["v⃗A/B","velocity of A as seen by B"],["−","subtract B's motion"]]}},"relative-example":{"pt":{"read":"A velocidade em relação ao chão combina o movimento do objeto no meio com o movimento do próprio meio.","why":"Somamos velocidades quando os sentidos coincidem; se forem opostos, os sinais representam a diferença.","example":"Barco a 4 m/s na água, corrente a 1 m/s no mesmo sentido: 5 m/s em relação à margem.","parts":[["objeto/meio","movimento dentro da água ou do ar"],["meio/chão","movimento da água ou do ar"],["+","combina movimentos"]]},"en":{"read":"Velocity relative to the ground combines the object's motion through a medium with the medium's own motion.","why":"We add velocities when directions match; if they oppose, signs represent the difference.","example":"Boat at 4 m/s in water, current at 1 m/s in the same direction: 5 m/s relative to shore.","parts":[["object/medium","motion through water or air"],["medium/ground","motion of water or air"],["+","combine movements"]]}}};

function buildGuideMarkup(lesson) {
 const guide=helpMap[lesson.id]?.[lang()] || {
  read:lang()==='pt'?'Esta é uma forma compacta de escrever a relação física descrita nesta lição.':'This is a compact way to write the physical relationship described in this lesson.',
  parts:[[t(lesson.formula),lang()==='pt'?'Lê a expressão da esquerda para a direita e identifica as quantidades conhecidas.':'Read the expression from left to right and identify the quantities you know.']],
  why:lang()==='pt'?'A expressão junta as relações descritas na explicação. Cada símbolo representa uma quantidade ou uma operação; as unidades ajudam a verificar se o resultado faz sentido.':'The expression combines the relationships described in the lesson. Each symbol represents a quantity or operation; units help check whether the result makes sense.',
  example:t(lesson.example.answer)
 };
 return `<div class="expression-help-backdrop" data-action="close-expression-help" hidden><section class="expression-help-dialog" role="dialog" aria-modal="true" aria-labelledby="expression-help-title"><header class="expression-help-header"><div><p class="eyebrow">${e(lang()==='pt'?'GUIA DE EXPRESSÃO':'EXPRESSION GUIDE')}</p><h2 id="expression-help-title">${e(t(lesson.title))}</h2></div><button type="button" class="expression-help-close" data-action="close-expression-help" aria-label="${e(lang()==='pt'?'Fechar explicação':'Close explanation')}">${icon('close',19)}</button></header><div class="expression-help-content"><div class="expression-help-intro">${renderTeachingCopy(guide.read)}</div><div class="expression-help-equation" id="expression-help-equation">${formulaMarkup(String(t(lesson.formula)).split(/\s{2,}·\s{2,}/)[0])}</div><h3>${e(lang()==='pt'?'O que significa cada parte':'What each part means')}</h3><div class="expression-help-parts">${guide.parts.map(([symbol,meaning])=>`<div class="expression-help-part"><strong>${e(symbol)}</strong>${renderTeachingCopy(meaning,'expression-part-copy')}</div>`).join('')}</div><h3>${e(lang()==='pt'?'Porque está escrita assim':'Why it is written this way')}</h3>${renderTeachingCopy(guide.why)}<div class="expression-help-example"><span>${icon('lightbulb',16)} ${e(lang()==='pt'?'EXEMPLO CONCRETO':'CONCRETE EXAMPLE')}</span>${renderTeachingCopy(guide.example)}</div></div></section></div>`;
}

function renderLesson(id) {
  const lesson = lessonById[id];
  if (!lesson) return renderTopic();
  if (lesson.module === 'sequences' && state.sequenceView === 'continuous') return renderSequenceLesson(lesson);
  state.lastLesson = lesson.id;
  save();
  const module = moduleById[lesson.module];
  const list = module.lessonIds.map(lessonId=>lessonById[lessonId]).filter(Boolean);
  const idx = list.findIndex(item=>item.id===id);
  const overall = lessonIndex(id);
  const done = state.completed.includes(id);
  const sections = lesson.sections.map((section,i)=>`<section class="lesson-section ${/^(A grande ideia|The big idea|Atenção|Attention|Importante|Important)/i.test(t(section.heading))?'section-highlight':''}"><h3><span>${String(i+1).padStart(2,'0')}</span>${e(t(section.heading))}</h3>${renderTeachingCopy(t(section.body),'lesson-section-copy')}</section>`).join('');
  const previous = list[idx-1];
  const next = list[idx+1];
  const otherLessons = list.map((item,i)=>`<a class="side-lesson ${item.id===id?'current':''} ${state.completed.includes(item.id)?'done':''}" href="${href(`lesson/${item.id}`)}"><span>${state.completed.includes(item.id)?icon('check',13):String(i+1).padStart(2,'0')}</span><strong>${e(t(item.title))}</strong></a>`).join('');
  app.innerHTML = `<section class="page lesson-page">${module.id==='sequences' ? sequenceViewSwitch() : ''}<div class="breadcrumb"><a href="${href(`topic/${module.id==='sequences'?'math':'physics'}`)}">${e(module.id==='sequences'?(lang()==='pt'?'Matemática':'Mathematics'):(lang()==='pt'?'Física':'Physics'))}</a>${icon('chevron',13)}<button data-action="back-module" data-module="${e(module.id)}" data-subject="${module.id==='sequences'?'math':'physics'}">${e(t(module.title))}</button>${icon('chevron',13)}<span>${e(ui('lesson'))} ${String(overall+1).padStart(2,'0')}</span></div><div class="lesson-heading"><div><p class="eyebrow">${e(ui('section'))} ${String(course.modules.findIndex(item=>item.id===module.id)+1).padStart(2,'0')} <span class="eyebrow-dot"></span> ${e(ui('lesson'))} ${String(overall+1).padStart(2,'0')} / ${course.lessons.length}</p><h1>${e(t(lesson.title))}</h1><p class="lead">${e(t(lesson.kicker))} · ${lesson.duration} ${e(ui('readTime'))}</p></div><div class="lesson-completion-badge ${done?'is-done':''}">${done?icon('check',18):`${String(idx+1).padStart(2,'0')}<small>/${String(list.length).padStart(2,'0')}</small>`}</div></div><div class="lesson-layout"><article class="lesson-main">${intuitionCard(lesson)}<section class="concept-card"><div class="concept-card-top"><span class="card-stamp lime-stamp">${icon('spark',15)} ${e(ui('keyIdea'))}</span><span class="mono concept-mark">01</span></div><h2>${e(t(lesson.concept))}</h2></section>${module.id==='sequences'?sequenceVisual(lesson,lessonIndex(id)+1):renderDiagram(lesson.diagram,lang(),lessonIndex(id)+1)}<section class="lesson-explanation"><div class="lesson-explanation-heading"><div><p class="eyebrow">${e(ui('inWords'))}</p><h2>${e(ui('lessonText'))}</h2><p>${e(lang()==='pt'?'Uma ideia de cada vez.':'One idea at a time.')}</p></div><span class="notes-mark">${icon('book',18)}</span></div><div class="lesson-section-list">${sections}</div></section>${module.id==='sequences'?'':`<section class="formula-card" aria-label="${e(lang()==='pt'?'Expressão com explicação opcional':'Expression with optional explanation')}"><div class="formula-card-heading"><span class="formula-card-label">${e(lang()==='pt'?'A EXPRESSÃO':'THE EXPRESSION')}</span><span class="expression-index" aria-label="${e(lang()==='pt'?'Referência da expressão':'Expression reference')} EX-${String(lessonIndex(id)+1).padStart(3,'0')}">EX-${String(lessonIndex(id)+1).padStart(3,'0')}</span></div><p class="formula-intro">${e(lang()==='pt'?'Já viste a ideia. Esta é uma forma curta de a escrever. Toca no (i) se quiseres perceber os símbolos e porquê.':'You have seen the idea. This is a compact way to write it. Tap (i) to unpack the symbols and why it works.')}</p><div class="formula-list">${String(t(lesson.formula)).split(/\s{2,}·\s{2,}/).map((part,index)=>`<div class="formula-row"><div class="formula">${formulaMarkup(part)}</div><button type="button" class="formula-help-trigger" data-action="open-expression-help" data-expression="${e(part)}" aria-label="${e(lang()==='pt'?'Explicar esta expressão':'Explain this expression')}" title="${e(lang()==='pt'?'Explicar esta expressão':'Explain this expression')}">${icon('info',19)}</button></div>`).join('')}</div></section>${buildGuideMarkup(lesson)}`}${exampleCard(lesson)}${checkCard(lesson)}<section class="exercise-card"><div class="exercise-head"><span class="card-stamp yellow-stamp">${icon('target',15)} ${e(ui('exercise'))}</span><span class="exercise-doodle">✳</span></div><h2>${e(t(lesson.exercise))}</h2><p>${e(ui('tryIt'))}</p><details><summary>${e(ui('showAnswer'))}</summary><div class="hint-copy">${e(ui('emptyExercise'))}</div></details></section><div class="lesson-actions"><button type="button" class="button ${done?'button-ghost':'button-lime'}" data-action="complete" data-lesson="${e(id)}">${done?icon('check',17):icon('check',17)} ${e(done?ui('markUndone'):ui('markDone'))}</button><a class="text-link" href="${href(`topic/${module.id==='sequences'?'math':'physics'}`)}">${e(ui('backCourse'))}</a></div><div class="lesson-pagination">${previous?`<a href="${href(`lesson/${previous.id}`)}" class="pagination-link prev">${icon('back',16)}<span><small>${e(ui('previous'))}</small><strong>${e(t(previous.title))}</strong></span></a>`:'<span></span>'}${next?`<a href="${href(`lesson/${next.id}`)}" class="pagination-link next"><span><small>${e(ui('next'))}</small><strong>${e(t(next.title))}</strong></span>${icon('arrow',17)}</a>`:`<a href="${href(`topic/${module.id==='sequences'?'math':'physics'}`)}" class="pagination-link next"><span><small>${e(ui('next'))}</small><strong>${e(ui('completeCourse'))}</strong></span>${icon('arrow',17)}</a>`}</div></article><aside class="lesson-aside"><div class="aside-progress">${progressRing(percentage())}<span><strong>${completedCount()} / ${course.lessons.length}</strong><small>${e(ui('progress'))}</small></span></div><div class="aside-module"><p class="eyebrow">${e(ui('section'))} ${String(course.modules.findIndex(item=>item.id===module.id)+1).padStart(2,'0')}</p><h3>${e(t(module.title))}</h3><div class="side-lesson-list">${otherLessons}</div><a href="${href(`topic/${module.id==='sequences'?'math':'physics'}`)}" class="aside-all">${e(ui('allSections'))}${icon('arrow',14)}</a></div><div class="aside-note"><span>${icon('spark',18)}</span><p>${e(lang()==='pt'?'A aprendizagem ganha velocidade quando ligas desenho, unidade e sinal.':'Learning gains momentum when you connect diagrams, units and signs.')}</p></div></aside></div></section>`;
}


function formulaTriangleEquation(triangle, cell='top') {
  const { top, left, right } = triangle;
  if (cell === 'left') return `${left.symbol} = ${top.symbol} ÷ ${right.symbol}`;
  if (cell === 'right') return `${right.symbol} = ${top.symbol} ÷ ${left.symbol}`;
  return `${top.symbol} = ${left.symbol} × ${right.symbol}`;
}

function formulaTriangleInstruction(triangle, cell='') {
  const { top, left, right } = triangle;
  if (!cell) return lang() === 'pt'
    ? 'Toca numa grandeza para ver como a isolar.'
    : 'Select a quantity to see how to isolate it.';
  if (cell === 'top') return lang() === 'pt'
    ? `Tapa ${t(top.spoken)}. Então ${top.symbol} é ${t(left.label)} vezes ${t(right.label)}.`
    : `Cover ${t(top.spoken)}. Then ${top.symbol} equals ${t(left.label)} times ${t(right.label)}.`;
  if (cell === 'left') return lang() === 'pt'
    ? `Tapa ${t(left.spoken)}. Para isolar ${left.symbol}, divide ${top.symbol} por ${right.symbol}.`
    : `Cover ${t(left.spoken)}. To isolate ${left.symbol}, divide ${top.symbol} by ${right.symbol}.`;
  return lang() === 'pt'
    ? `Tapa ${t(right.spoken)}. Para isolar ${right.symbol}, divide ${top.symbol} por ${left.symbol}.`
    : `Cover ${t(right.spoken)}. To isolate ${right.symbol}, divide ${top.symbol} by ${left.symbol}.`;
}

function formulaTriangleCell(triangle, key) {
  const field = triangle[key];
  return `<button type="button" class="triangle-cell triangle-cell-${key}" data-action="triangle-cell" data-triangle-id="${e(triangle.id)}" data-cell="${key}" aria-pressed="false" aria-label="${e(lang()==='pt'?'Selecionar':'Select')} ${e(t(field.label))}"><strong>${e(field.symbol)}</strong><small>${e(t(field.label))}</small></button>`;
}

function formulaTriangleCard(triangle) {
  const index = triangleFormulas.indexOf(triangle) + 1;
  const subjectLabel = triangle.subject === 'math'
    ? (lang() === 'pt' ? 'Matemática' : 'Mathematics')
    : (lang() === 'pt' ? 'Física' : 'Physics');
  const equation = formulaTriangleEquation(triangle, 'top');
  return `<article class="triangle-card" data-triangle-card="${e(triangle.id)}">
    <div class="triangle-card-top"><span class="tool-subject-tag ${triangle.subject}">${e(subjectLabel)}</span><span class="tool-reference">TR-${String(index).padStart(2,'0')}</span></div>
    <h3>${e(t(triangle.title))}</h3>
    <div class="formula-triangle-diagram" role="group" aria-label="${e(lang()==='pt'?'Triângulo de fórmula interactivo':'Interactive formula triangle')}">
      <svg viewBox="0 0 320 208" aria-hidden="true"><path d="M160 9 L12 197 L308 197 Z"/><path d="M84 103 Q160 101 236 103"/></svg>
      ${formulaTriangleCell(triangle, 'top')}${formulaTriangleCell(triangle, 'left')}${formulaTriangleCell(triangle, 'right')}
    </div>
    <div class="triangle-solution">
      <p class="eyebrow">${e(lang()==='pt'?'A EXPRESSÃO':'THE RELATIONSHIP')}</p>
      <strong data-triangle-equation>${e(equation)}</strong>
      <p data-triangle-instruction>${e(formulaTriangleInstruction(triangle))}</p>
    </div>
    <p class="triangle-base-copy">${e(t(triangle.base))}</p>
    <details class="triangle-deep-details">
      <summary><span>${e(lang()==='pt'?'Explorar a explicação':'Explore the explanation')}</span><span aria-hidden="true">+</span></summary>
      <div class="triangle-deep-list">${triangle.details.map(detail => `<div class="triangle-deep-block"><h4>${e(t(detail.title))}</h4><p>${e(t(detail.text))}</p></div>`).join('')}</div>
    </details>
  </article>`;
}

function renderTriangles() {
  const math = triangleFormulas.filter(item => item.subject === 'math');
  const physics = triangleFormulas.filter(item => item.subject === 'physics');
  const section = (title, subject, items) => `<section class="tools-section"><div class="tools-section-heading"><div><p class="eyebrow">${e(subject === 'math' ? '01 · MATEMÁTICA' : '02 · FÍSICA')}</p><h2>${e(title)}</h2></div><span class="tools-section-count">${items.length} ${e(lang()==='pt'?'triângulos':'triangles')}</span></div><div class="triangle-grid">${items.map(formulaTriangleCard).join('')}</div></section>`;
  app.innerHTML = `<section class="page tools-page triangles-page">
    <div class="tools-back-row"><a class="text-link" href="${href('formulas')}">${icon('back',15)} ${e(lang()==='pt'?'Fórmulas':'Formulas')}</a><span class="tools-kicker">${e(lang()==='pt'?'FORMULÁRIO VISUAL':'VISUAL FORMULA SHEET')}</span></div>
    <div class="tools-heading"><div><p class="eyebrow">${e(lang()==='pt'?'FERRAMENTAS DE ESTUDO':'STUDY TOOLS')}</p><h1>${e(lang()==='pt'?'Triângulos':'Formula triangles')}<span class="title-period" aria-hidden="true">.</span></h1><p class="lead">${e(lang()==='pt'?'Toca na grandeza que queres descobrir. O triângulo mostra a operação certa; abre a explicação para aprofundar.':'Tap the quantity you need to find. The triangle reveals the right operation; expand the explanation to go deeper.')}</p></div><div class="tools-heading-actions"><span class="tools-total"><strong>${triangleFormulas.length}</strong><small>${e(lang()==='pt'?'fórmulas':'formulas')}</small></span><a class="tool-switch-link" href="${href('shortcuts')}">${e(lang()==='pt'?'Ver atalhos':'View shortcuts')} ${icon('arrow',15)}</a></div></div>
    ${section(lang()==='pt'?'Matemática':'Mathematics','math',math)}
    ${section(lang()==='pt'?'Física':'Physics','physics',physics)}
    <nav class="tools-footer-links" aria-label="${e(lang()==='pt'?'Mais ferramentas':'More tools')}"><a href="${href('shortcuts')}">${icon('spark',17)}<span><strong>${e(lang()==='pt'?'Atalhos e truques':'Shortcuts & tricks')}</strong><small>${e(lang()==='pt'?'40 referências rápidas':'40 quick references')}</small></span>${icon('arrow',16)}</a><a href="${href('practice')}">${icon('target',17)}<span><strong>${e(ui('practice'))}</strong><small>${e(lang()==='pt'?'Revê o que aprendeste':'Review what you learned')}</small></span>${icon('arrow',16)}</a></nav>
  </section>`;
}

function shortcutCard(item) {
  const index = studyShortcuts.indexOf(item) + 1;
  const subjectLabel = item.subject === 'math'
    ? (lang() === 'pt' ? 'Matemática' : 'Mathematics')
    : (lang() === 'pt' ? 'Física' : 'Physics');
  return `<article class="shortcut-card ${item.subject}">
    <div class="shortcut-card-top"><span class="tool-subject-tag ${item.subject}">${e(subjectLabel)}</span><span class="shortcut-kind">${e(t(shortcutKindNames[item.kind]))}</span></div>
    <h3>${e(t(item.title))}</h3>
    <div class="shortcut-formula">${e(t(item.formula))}</div>
    <p class="shortcut-note">${e(t(item.note))}</p>
    <span class="tool-reference">AT-${String(index).padStart(2,'0')}</span>
  </article>`;
}

function filteredShortcuts() {
  const query = shortcutFilters.search.trim().toLocaleLowerCase();
  return studyShortcuts.filter(item => {
    if (shortcutFilters.subject !== 'all' && item.subject !== shortcutFilters.subject) return false;
    if (shortcutFilters.kind !== 'all' && item.kind !== shortcutFilters.kind) return false;
    if (!query) return true;
    const searchable = [t(item.title), t(item.formula), t(item.note), t(shortcutKindNames[item.kind])]
      .join(' ').toLocaleLowerCase();
    return searchable.includes(query);
  });
}

function updateShortcutResults() {
  const results = document.querySelector('.shortcut-results');
  if (!results) return;
  const items = filteredShortcuts();
  results.innerHTML = items.length
    ? items.map(shortcutCard).join('')
    : `<div class="shortcut-empty"><strong>${e(lang()==='pt'?'Nada encontrado.':'Nothing found.')}</strong><p>${e(lang()==='pt'?'Experimenta outra palavra ou limpa os filtros.':'Try another search term or clear the filters.')}</p><button type="button" class="button button-ghost button-small" data-action="shortcut-reset">${e(lang()==='pt'?'Limpar filtros':'Clear filters')}</button></div>`;
  const count = document.querySelector('[data-shortcut-count]');
  if (count) count.textContent = String(items.length);
}

function updateShortcutFilters() {
  document.querySelectorAll('[data-action="shortcut-subject"]').forEach(button => {
    const active = button.dataset.value === shortcutFilters.subject;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  document.querySelectorAll('[data-action="shortcut-kind"]').forEach(button => {
    const active = button.dataset.value === shortcutFilters.kind;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
}

function renderShortcuts() {
  const kindChips = [
    ['all', lang()==='pt'?'Todos os tipos':'All types'],
    ['mnemonic', t(shortcutKindNames.mnemonic)],
    ['shortcut', t(shortcutKindNames.shortcut)],
    ['formula', t(shortcutKindNames.formula)]
  ];
  const subjectChips = [
    ['all', lang()==='pt'?'Tudo':'All'],
    ['math', lang()==='pt'?'Matemática':'Mathematics'],
    ['physics', lang()==='pt'?'Física':'Physics']
  ];
  app.innerHTML = `<section class="page tools-page shortcuts-page">
    <div class="tools-back-row"><a class="text-link" href="${href('formulas')}">${icon('back',15)} ${e(lang()==='pt'?'Fórmulas':'Formulas')}</a><span class="tools-kicker">${e(lang()==='pt'?'REFERÊNCIA RÁPIDA':'QUICK REFERENCE')}</span></div>
    <div class="tools-heading"><div><p class="eyebrow">${e(lang()==='pt'?'FERRAMENTAS DE ESTUDO':'STUDY TOOLS')}</p><h1>${e(lang()==='pt'?'Atalhos':'Shortcuts')}<span class="title-period" aria-hidden="true">.</span></h1><p class="lead">${e(t(shortcutIntro))}</p></div><div class="tools-heading-actions"><span class="tools-total"><strong data-shortcut-count>${studyShortcuts.length}</strong><small>${e(lang()==='pt'?'referências':'references')}</small></span><a class="tool-switch-link" href="${href('triangles')}">${e(lang()==='pt'?'Ver triângulos':'View triangles')} ${icon('arrow',15)}</a></div></div>
    <div class="shortcut-controls">
      <label class="shortcut-search"><span aria-hidden="true">${icon('search',18)}</span><input type="search" data-shortcut-search value="${e(shortcutFilters.search)}" placeholder="${e(lang()==='pt'?'Pesquisar fórmula, tema ou truque…':'Search a formula, topic or shortcut…')}" aria-label="${e(lang()==='pt'?'Pesquisar atalhos':'Search shortcuts')}"></label>
      <div class="shortcut-filter-group"><span class="shortcut-filter-label">${e(lang()==='pt'?'MATÉRIA':'SUBJECT')}</span><div class="shortcut-filter-row">${subjectChips.map(([value,label])=>`<button type="button" class="filter-chip ${shortcutFilters.subject===value?'active':''}" data-action="shortcut-subject" data-value="${value}" aria-pressed="${shortcutFilters.subject===value}">${e(label)}</button>`).join('')}</div></div>
      <div class="shortcut-filter-group"><span class="shortcut-filter-label">${e(lang()==='pt'?'TIPO':'TYPE')}</span><div class="shortcut-filter-row">${kindChips.map(([value,label])=>`<button type="button" class="filter-chip ${shortcutFilters.kind===value?'active':''}" data-action="shortcut-kind" data-value="${value}" aria-pressed="${shortcutFilters.kind===value}">${e(label)}</button>`).join('')}</div></div>
    </div>
    <div class="shortcut-results" aria-live="polite">${filteredShortcuts().map(shortcutCard).join('')}</div>
    <nav class="tools-footer-links" aria-label="${e(lang()==='pt'?'Mais ferramentas':'More tools')}"><a href="${href('triangles')}">${icon('spark',17)}<span><strong>${e(lang()==='pt'?'Triângulos de fórmulas':'Formula triangles')}</strong><small>${e(lang()==='pt'?'Isola uma grandeza sem decorar tudo':'Isolate a quantity without memorizing everything')}</small></span>${icon('arrow',16)}</a><a href="${href('practice')}">${icon('target',17)}<span><strong>${e(ui('practice'))}</strong><small>${e(lang()==='pt'?'Revê o que aprendeste':'Review what you learned')}</small></span>${icon('arrow',16)}</a></nav>
  </section>`;
}

function shuffleList(items) {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index--) {
    const swap = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swap]] = [shuffled[swap], shuffled[index]];
  }
  return shuffled;
}

function makeLevelPieceShapeMap(question) {
  // Shapes are randomised independently from each answer's correct target.
  // Text length only limits how narrow a silhouette may be, keeping long expressions readable.
  const shuffledPieces = shuffleList(question.pieces);
  const usedCounts = {};
  const shapeMap = {};
  shuffledPieces.forEach(piece => {
    const textLength = Math.max(String(piece.text?.pt || '').length, String(piece.text?.en || '').length);
    const options = textLength <= 4
      ? ['triangle', 'diamond', 'octagon', 'hexagon', 'cut-corner']
      : textLength <= 8
        ? ['octagon', 'hexagon', 'cut-corner', 'ticket']
        : textLength <= 18
          ? ['octagon', 'hexagon', 'cut-corner', 'ticket']
          : ['hexagon', 'cut-corner', 'ticket'];
    const unused = options.filter(shape => !usedCounts[shape]);
    const shape = shuffleList(unused.length ? unused : options)[0];
    shapeMap[piece.id] = shape;
    usedCounts[shape] = (usedCounts[shape] || 0) + 1;
  });
  return shapeMap;
}

function startLevel(levelId) {
  const level = gameLevels.find(item => item.id === levelId);
  if (!level) return;
  if (isLevelLocked(level.id)) {
    toast(lang() === 'pt' ? 'Passa o nível anterior para desbloquear este.' : 'Pass the previous level to unlock this one.');
    return;
  }
  if ([1, 2].includes(levelId)) {
    state.levelRun = createLevelConstructorPrototype({ levelId });
    save();
    render();
    return;
  }
  const tileOrders = level.questions.map(question => shuffleList(question.pieces.map(piece => piece.id)));
  const pieceShapes = level.questions.map(question => makeLevelPieceShapeMap(question));
  state.levelRun = {
    type: 'matching', levelId, tileOrders, pieceShapes,
    order: shuffleList(level.questions.map((question, index) => index)),
    index: 0, answers: Array(level.questions.length).fill(null), matches: {},
    selectedPair: null, selectedPiece: null, submitted: false, currentCorrect: false, finished: false
  };
  save();
  render();
}

function placeLevelPiece(run, pairId, pieceId) {
  if (!run || run.type !== 'matching' || run.submitted || run.finished) return false;
  const level = gameLevels.find(item => item.id === run.levelId);
  const question = level && level.questions[run.order[run.index]];
  if (!question || !question.pairs.some(pair => pair.id === pairId) ||
      !question.pieces.some(piece => piece.id === pieceId)) return false;
  Object.keys(run.matches).forEach(existingPairId => {
    if (run.matches[existingPairId] === pieceId) delete run.matches[existingPairId];
  });
  run.matches[pairId] = pieceId;
  run.selectedPair = null;
  run.selectedPiece = null;
  return true;
}

function scoreLevelRun(level) {
  return state.levelRun ? state.levelRun.answers.filter(answer => answer === true).length : 0;
}

function renderLevelSubjectPicker() {
  const isPt = lang() === 'pt';
  const subjects = [
    {
      id: 'math',
      title: isPt ? 'Matemática' : 'Mathematics',
      description: isPt ? 'Álgebra, sucessões, funções e cálculo.' : 'Algebra, sequences, functions and calculus.',
      detail: gameLevels.length + (isPt ? ' níveis existentes' : ' existing levels'),
      status: isPt ? 'Disponível' : 'Available',
      statusClass: 'is-ready'
    },
    {
      id: 'physics',
      title: isPt ? 'Física' : 'Physics',
      description: isPt ? 'Movimento, forças, energia e sistemas eléctricos.' : 'Motion, forces, energy and electrical systems.',
      detail: isPt ? 'Ficha de lançamento vertical' : 'Vertical-launch worksheet',
      status: isPt ? 'Nível 1 disponível' : 'Level 1 available',
      statusClass: 'is-ready'
    },
    {
      id: 'chemistry',
      title: isPt ? 'Química' : 'Chemistry',
      description: isPt ? 'Mol, massas moleculares, gases e fórmulas químicas.' : 'Moles, molecular masses, gases and chemical formulae.',
      detail: isPt ? 'Capítulo 0 · 21 exercícios' : 'Chapter 0 · 21 exercises',
      status: isPt ? 'Nível 1 disponível' : 'Level 1 available',
      statusClass: 'is-ready'
    }
  ];
  const cards = subjects.map(subject => `
    <a class="level-subject-card level-subject-${subject.id}" href="${href('practice/' + subject.id)}" aria-label="${e(subject.title)}">
      <span class="level-subject-card-heading">
        <strong class="level-subject-card-title">${e(subject.title)}</strong>
        <span class="level-subject-card-arrow" aria-hidden="true">${icon('arrow', 20)}</span>
      </span>
      <span class="level-subject-card-visual">${homeSubjectDiagram(subject.id)}</span>
      <span class="level-subject-card-description">${e(subject.description)}</span>
      <span class="level-subject-card-footer">
        <span class="level-subject-card-detail">${e(subject.detail)}</span>
        <span class="level-subject-status ${subject.statusClass}"><i></i>${e(subject.status)}</span>
      </span>
    </a>`).join('');
  app.innerHTML = `<section class="page levels-page level-subject-picker">
    <header class="level-subject-picker-heading">
      <p class="eyebrow"><span class="eyebrow-dot"></span>${isPt ? 'TREINO POR DISCIPLINA' : 'PRACTICE BY SUBJECT'}</p>
      <h1>${isPt ? 'O que vamos praticar?' : 'What shall we practise?'}<span class="title-period" aria-hidden="true">.</span></h1>
      <p class="lead">${isPt ? 'Escolhe uma disciplina para veres os seus níveis e desafios.' : 'Choose a subject to see its levels and challenges.'}</p>
    </header>
    <div class="level-subject-grid" aria-label="${isPt ? 'Disciplinas disponíveis' : 'Available subjects'}">${cards}</div>
    <footer class="level-subject-picker-footer">
      <span class="level-subject-footer-mark" aria-hidden="true">↗</span>
      <span>${isPt ? 'Cada disciplina terá os seus próprios exercícios, progresso e critérios de correcção.' : 'Each subject will have its own exercises, progress and marking criteria.'}</span>
    </footer>
  </section>`;
}

function renderPendingSubjectLevels(subject) {
  const isPt = lang() === 'pt';
  const physics = subject === 'physics';
  const chemistry = subject === 'chemistry';
  const info = physics ? {
    title: isPt ? 'Lançamento vertical' : 'Vertical launch',
    kicker: isPt ? 'CINEMÁTICA · FICHA 01' : 'KINEMATICS · WORKSHEET 01',
    description: isPt
      ? 'Resolve as duas questões da ficha: altura máxima, tempo de subida e de voo, velocidade média e aceleração no ponto mais alto.'
      : 'Solve both worksheet problems: maximum height, ascent and flight time, average velocity, and acceleration at the highest point.',
    detail: isPt ? '11 alíneas · g = 9,8 m/s²' : '11 parts · g = 9.8 m/s²',
    tags: isPt ? ['Altura máxima', 'Tempo de voo', 'Velocidade média', 'Aceleração'] : ['Maximum height', 'Flight time', 'Average velocity', 'Acceleration']
  } : {
    title: isPt ? 'Conceitos e leis fundamentais da Química' : 'Fundamental concepts and laws of Chemistry',
    kicker: isPt ? 'QUÍMICA GERAL · CAPÍTULO 0' : 'GENERAL CHEMISTRY · CHAPTER 0',
    description: isPt
      ? 'A ficha completa de 2026/2027: massas moleculares, mol, gases, número de partículas, composição centesimal e fórmulas químicas.'
      : 'The complete 2026/2027 worksheet: molecular masses, moles, gases, particle counts, percentage composition and chemical formulae.',
    detail: isPt ? '21 exercícios · várias alíneas' : '21 exercises · multiple parts',
    tags: isPt ? ['Massas moleculares', 'Mol e massa molar', 'Gases e CNTP', 'Composição centesimal', 'Fórmulas empíricas'] : ['Molecular masses', 'Moles and molar mass', 'Gases and STP', 'Percentage composition', 'Empirical formulae']
  };
  const subjectTitle = physics ? (isPt ? 'Física' : 'Physics') : (isPt ? 'Química' : 'Chemistry');
  const topics = info.tags.map(topic => '<span class="subject-level-topic">' + e(topic) + '</span>').join('');
  const run = state.levelRun;
  const completed = run?.type === 'science-level-one' && run.subject === subject && run.checked;
  app.innerHTML = '<section class="page levels-page level-subject-detail">' +
    '<div class="level-subject-detail-toolbar"><a class="text-link" href="' + href('practice') + '">' + icon('back', 16) + ' ' + (isPt ? 'Todas as disciplinas' : 'All subjects') + '</a><span class="level-subject-status is-ready"><i></i>' + (isPt ? 'Nível 1 disponível' : 'Level 1 available') + '</span></div>' +
    '<header class="level-subject-detail-heading"><p class="eyebrow">' + e(info.kicker) + '</p><h1>' + e(subjectTitle) + '<span class="title-period" aria-hidden="true">.</span></h1><p class="lead">' + (isPt ? 'O primeiro nível parte directamente da ficha que recebeste na faculdade.' : 'The first level is built directly from your university worksheet.') + '</p></header>' +
    '<article class="level-subject-preview level-subject-preview-' + subject + '"><div class="level-subject-preview-visual">' + homeSubjectDiagram(subject) + '</div><div class="level-subject-preview-copy">' +
    '<p class="eyebrow">' + (isPt ? 'NÍVEL 01 · FICHA ORIGINAL' : 'LEVEL 01 · ORIGINAL WORKSHEET') + '</p><h2>' + e(info.title) + '</h2><p class="level-subject-preview-description">' + e(info.description) + '</p><div class="level-subject-topic-list">' + topics + '</div>' +
    '<div class="level-subject-preview-detail"><span class="level-subject-preview-count">' + icon('layers', 17) + '<strong>' + e(info.detail) + '</strong></span><span class="level-subject-status is-ready"><i></i>' + (isPt ? 'Pronto para resolver' : 'Ready to solve') + '</span></div></div></article>' +
    '<div class="science-level-start-row"><div><strong>' + (isPt ? 'Preparado para começar?' : 'Ready to begin?') + '</strong><p>' + (isPt ? 'Responde às perguntas, corrige no fim e revê cada resposta.' : 'Answer the questions, check your work, and review each response.') + '</p></div><button type="button" class="button button-lime" data-action="level-science-start" data-subject="' + subject + '">' + (isPt ? 'Começar nível 1' : 'Start Level 1') + ' ' + icon('arrow', 17) + '</button></div>' +
    '</section>';
}
function renderLevels() {
  const isPt = lang() === 'pt';
  const completed = state.levelProgress.completed;
  const run = state.levelRun;
  const currentSubject = route().subject;
  if (currentSubject && ['physics','chemistry'].includes(currentSubject) && run?.type === 'science-level-one' && run.subject === currentSubject) {
    app.innerHTML = renderScienceLevelOne(run, isPt);
    return;
  }
  if (currentSubject === 'math' && run && run.type === 'matching' && [1, 2].includes(run.levelId)) {
    state.levelRun = createLevelConstructorPrototype({ levelId: run.levelId });
    save();
    return renderLevels();
  }
  if (currentSubject === 'math' && run && run.type === 'construct-prototype') {
    if (run.version !== 6) {
      const legacy = state.levelRun;
      const fresh = createLevelConstructorPrototype({ levelId: legacy.levelId ?? null });
      state.levelRun = {
        ...fresh,
        ...legacy,
        version: 6,
        levelId: [1, 2].includes(Number(legacy.levelId)) ? Number(legacy.levelId) : null,
        sourceTokens: legacy.sourceTokens || fresh.sourceTokens,
        restrictedRoot: legacy.restrictedRoot ?? fresh.restrictedRoot,
        targetTokens: legacy.targetTokens || fresh.targetTokens,
        restrictionLabel: legacy.restrictionLabel || fresh.restrictionLabel,
        selectedTokenIndex: null,
        selectedTokenSlot: "line",
        selectedTokenFractionId: null,
        gaveUp: false
      };
      save();
    }
    app.innerHTML = renderLevelConstructorPrototype(state.levelRun, isPt);
    return;
  }
  if (!currentSubject) return renderLevelSubjectPicker();
  if (currentSubject !== 'math') return renderPendingSubjectLevels(currentSubject);
  const activeLevel = run && run.type === 'matching' && gameLevels.find(item => item.id === run.levelId);
  if (activeLevel && !run.finished) return renderLevelQuestion(activeLevel);
  if (activeLevel && run.finished) return renderLevelResult(activeLevel);

  const levelCards = gameLevels.map(level => {
    const earned = completed.includes(level.id);
    const locked = isLevelLocked(level.id);
    const isWorkspaceLevel = [1, 2].includes(level.id);
    const levelQuestionCount = isWorkspaceLevel ? 1 : level.questions.length;
    const levelPassMark = isWorkspaceLevel ? 1 : level.passMark;
    const levelTitle = isWorkspaceLevel
      ? (level.id === 1
        ? (isPt ? 'Factorizar e simplificar' : 'Factor and simplify')
        : (isPt ? 'Simplificar mantendo o domínio' : 'Simplify while preserving the domain'))
      : t(level.title);
    const subtitle = isWorkspaceLevel
      ? (level.id === 1
        ? (isPt ? 'Constrói a simplificação, passo a passo.' : 'Build the simplification, one step at a time.')
        : (isPt ? 'Repete o método com uma nova expressão.' : 'Use the same method with a new expression.'))
      : t(level.subtitle);
    const label = isPt ? 'NÍVEL ' : 'LEVEL ';
    const action = locked ? (isPt ? 'Bloqueado' : 'Locked') : earned ? (isPt ? 'Jogar novamente' : 'Play again') : (isPt ? 'Começar' : 'Start level');
    const status = earned ? (isPt ? 'Distintivo conquistado' : 'Badge earned') : locked ? (isPt ? 'Passa o nível anterior para desbloquear' : 'Pass the previous level to unlock') : hasFullAccess() ? (isPt ? 'Acesso total activo · distintivo por conquistar' : 'Full access active · badge still to earn') : (isPt ? 'Distintivo por conquistar' : 'Badge to earn');
    return '<article class="level-card ' + (locked ? 'is-locked ' : '') + (earned ? 'is-earned' : '') + '">' +
      '<span class="level-card-mark ' + (earned ? 'is-earned' : locked ? 'is-locked' : '') + '">' +
      (earned ? icon('star', 21) : locked ? icon('lock', 18) : String(level.id).padStart(2, '0')) + '</span>' +
      '<div class="level-card-copy"><span class="level-card-kicker">' + label + String(level.id).padStart(2, '0') + ' · ' +
      (isWorkspaceLevel ? (isPt ? 'QUADRO DE RESOLUÇÃO' : 'WORKING BOARD') : level.questions.length + ' ' + (isPt ? 'perguntas' : 'questions')) + '</span><h2>' + e(levelTitle) + '</h2><p>' +
      e(subtitle) + '</p><div class="level-card-reward">' + icon('star', 15) + '<strong>' + e(t(level.badge)) +
      '</strong><span>' + e(status) + '</span></div><span class="level-card-passmark">' + (isPt ? 'Para passar' : 'Pass mark') +
      ': <strong>' + levelPassMark + '/' + levelQuestionCount + '</strong></span></div>' +
      '<button type="button" class="button ' + (earned ? 'button-ghost' : 'button-lime') +
      ' level-start-button" data-action="level-start" data-level-id="' + level.id + '" ' + (locked ? 'disabled' : '') + '>' +
      action + (locked ? '' : icon('arrow', 16)) + '</button></article>';
  }).join('');
  const earnedCount = completed.length;
  app.innerHTML = '<section class="page tools-page levels-page">' +
    '<div class="tools-back-row"><a class="text-link" href="' + href('practice') + '">' + icon('back', 15) + ' ' + (isPt ? 'Todas as disciplinas' : 'All subjects') +
    '</a><span class="levels-earned-pill">' + icon('star', 16) + '<strong>' + earnedCount + '/' + gameLevels.length +
    '</strong> ' + (isPt ? 'distintivos' : 'badges') + '</span></div>' +
    '<div class="tools-heading levels-heading"><div><p class="eyebrow">' + (isPt ? 'MATEMÁTICA · DESAFIOS' : 'MATHEMATICS · CHALLENGES') + '</p><h1>' + (isPt ? 'Níveis de Matemática' : 'Mathematics levels') +
    '<span class="title-period" aria-hidden="true">.</span></h1><p class="lead">' + (isPt ? 'Escolhe um nível e resolve cada desafio no teu quadro de trabalho.' : 'Choose a level and solve each challenge on your working board.') + '</p></div></div>' +
    (hasFullAccess() ? '<div class="full-access-banner" role="status">' + icon('unlock', 16) + '<span>' + (isPt ? 'Acesso total activo: todos os níveis e bloqueios por progresso estão libertados.' : 'Full access is on: all levels and progression locks are lifted.') + '</span></div>' : '') +
    '<div class="levels-grid">' + levelCards + '</div></section>';
}

function renderLevelQuestion(level) {
  const isPt = lang() === 'pt';
  const run = state.levelRun;
  const questionIndex = run.order[run.index];
  const question = level.questions[questionIndex];
  if (!run.pieceShapes || !run.pieceShapes[questionIndex]) {
    // Upgrade an in-progress saved puzzle without clearing its answers or progression.
    run.pieceShapes = level.questions.map(item => makeLevelPieceShapeMap(item));
    save();
  }
  const matches = run.matches || {};
  const matchedCount = question.pairs.filter(pair => !!matches[pair.id]).length;
  const allPlaced = matchedCount === question.pairs.length &&
    new Set(question.pairs.map(pair => matches[pair.id])).size === question.pairs.length;
  const progress = Math.round(((run.index + 1) / level.questions.length) * 100);
  const independentCanvas = ['L1-01','L2-01','L1-06','L2-06','L1-07','L2-07','L1-08','L2-08'].includes(question.id);
  const targetMarkup = question.pairs.map((pair, index) => {
    const pieceId = matches[pair.id];
    const assigned = question.pieces.find(piece => piece.id === pieceId);
    const expected = question.pieces.find(piece => piece.id === pair.pieceId);
    const right = run.submitted && pieceId === pair.pieceId;
    const wrong = run.submitted && pieceId !== pair.pieceId;
    const current = run.selectedPair === pair.id;
    const status = right ? icon('check', 18) : wrong ? '<span class="match-cross">×</span>' : '';
    const connector = !independentCanvas && index < question.pairs.length - 1
      ? '<div class="match-sequence-connector" aria-hidden="true"><svg viewBox="0 0 64 42"><path d="M12 2 C 9 10, 18 14, 30 19 S 43 29, 48 35" fill="none" stroke="#3e6bdc" stroke-width="2.4" stroke-linecap="round"/><path d="M15 1 C 12 10, 20 14, 31 20 S 41 30, 47 34" fill="none" stroke="#3e6bdc" stroke-width=".85" stroke-linecap="round" opacity=".48"/><path d="M39 28 L48 35 L47 24" fill="none" stroke="#3e6bdc" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>'
      : '';
    return '<div class="match-sequence-item"><button type="button" class="match-target ' + (right ? 'is-correct' : wrong ? 'is-wrong' : '') +
      (current ? ' is-selected' : '') + '" data-action="level-select-pair" data-pair-id="' + e(pair.id) + '" ' +
      (run.submitted ? 'disabled' : '') + '><span class="match-target-number">' + String(index + 1).padStart(2, '0') + '</span>' +
      '<span class="match-target-main"><span class="match-target-label">' + levelMathMarkup(t(pair.left)) + '</span>' +
      '<span class="match-target-work"><span class="match-target-arrow" aria-hidden="true">↳</span>' +
      '<span class="match-target-answer ' + (assigned ? 'is-filled' : '') + '">' +
      (assigned ? levelMathMarkup(t(assigned.text)) : (isPt ? 'resultado…' : 'result…')) + '</span></span>' +
      (wrong && expected ? '<span class="match-correct-answer">' + (isPt ? 'Resultado correcto: ' : 'Correct result: ') + levelMathMarkup(t(expected.text)) + '</span>' : '') +
      '</span><span class="match-target-status">' + status + '</span></button>' + connector + '</div>';
  }).join('');
  const tileOrder = run.tileOrders && run.tileOrders[questionIndex] ? run.tileOrders[questionIndex] : question.pieces.map(piece => piece.id);
  const tileMarkup = tileOrder.map((pieceId, tileIndex) => {
    const piece = question.pieces.find(item => item.id === pieceId);
    if (!piece) return '';
    const usedBy = Object.keys(matches).find(pairId => matches[pairId] === piece.id);
    const selected = run.selectedPiece === piece.id;
    const shape = run.pieceShapes?.[questionIndex]?.[piece.id] || 'octagon';
    const tilt = [-1.1, 0.65, -0.35, 1.05, -0.7, 0.3][tileIndex % 6];
    return '<button type="button" class="match-piece shape-' + e(shape) + ' ' + (selected ? 'is-selected' : '') + (usedBy ? ' is-used' : '') +
      '" style="--tile-tilt:' + tilt + 'deg" data-action="level-select-piece" data-piece-id="' + e(piece.id) + '" draggable="' + (!run.submitted) + '" ' +
      (run.submitted ? 'disabled' : '') + ' aria-grabbed="' + selected + '"><span class="match-piece-seam" aria-hidden="true"></span><span class="match-piece-label">' + levelMathMarkup(t(piece.text)) + '</span></button>';
  }).join('');
  const resultMarkup = run.submitted
    ? '<div class="match-result ' + (run.currentCorrect ? 'is-correct' : 'is-wrong') + '"><strong>' +
      (run.currentCorrect ? (isPt ? 'Puzzle correcto.' : 'Puzzle solved.') : (isPt ? 'Há correspondências incorrectas.' : 'Some matches were incorrect.')) +
      '</strong><p>' + levelMathMarkup(t(question.explanation)) + '</p></div>'
    : '';
  const worksheetSketch = question.id === 'L2-13'
    ? '<svg class="worksheet-triangle-sketch" viewBox="0 0 180 100" role="img" aria-label="' +
      e(isPt ? 'Esboço de um triângulo sob a recta y igual a 2x' : 'Sketch of a triangle under the line y equals 2x') + '">' +
      '<path d="M12 78H160 M22 78L142 18V78Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="M128 78V64H142" fill="none" stroke="currentColor" stroke-width="1.6"/>' +
      '<path d="M45 78A23 23 0 0 0 41 66" fill="none" stroke="currentColor" stroke-width="1.5"/>' +
      '<text x="18" y="94" fill="currentColor" font-size="10">0</text><text x="137" y="94" fill="currentColor" font-size="10">2</text>' +
      '<text x="52" y="48" fill="currentColor" font-size="11">y = 2x</text></svg>'
    : '';
  const selectionHint = run.submitted
    ? (isPt ? 'Vê as correspondências assinaladas e lê a explicação.' : 'Review the marked matches and read the explanation.')
    : run.selectedPair
      ? (isPt ? 'Agora escolhe ou arrasta a peça que resolve este passo.' : 'Now choose or drag the piece that solves this step.')
      : run.selectedPiece
        ? (isPt ? 'Agora arrasta a peça para o passo correspondente, ou toca no passo.' : 'Now drag the piece to its matching step, or tap the step.')
        : (isPt ? 'Arrasta cada resultado para o passo correspondente. A forma não indica a resposta — usa a matemática.' : 'Drag each result to its matching step. The shape does not indicate the answer — use the mathematics.');
  app.innerHTML = '<section class="page tools-page levels-page level-play-page">' +
    '<div class="tools-back-row"><button type="button" class="text-link level-back-link" data-action="level-overview">' + icon('back', 15) + ' ' +
    (isPt ? 'Todos os níveis' : 'All levels') + '</button><span class="tools-kicker">' + (isPt ? 'MATEMÁTICA · NÍVEL ' : 'MATHEMATICS · LEVEL ') +
    String(level.id).padStart(2, '0') + '</span></div><div class="level-play-heading"><div><p class="eyebrow">' + e(t(level.badge)) +
    ' · ' + (isPt ? 'DESAFIO' : 'PUZZLE') + '</p><h1>' + e(t(level.title)) + '<span class="title-period" aria-hidden="true">.</span></h1></div>' +
    '<div class="level-question-count"><strong>' + (run.index + 1) + '</strong><span>/ ' + level.questions.length + '</span></div></div>' +
    '<div class="level-progress"><span style="width:' + progress + '%"></span></div><article class="worksheet-question">' +
    '<div class="worksheet-paper-header"><span>' + (isPt ? 'Ficha de Exercícios de Matemática' : 'Mathematics Exercise Sheet') + '</span>' +
    '<span>' + (isPt ? 'QUESTÃO ' : 'QUESTION ') + String(Number(question.id.split('-').pop()) || run.index + 1).padStart(2, '0') + '</span></div>' +
    '<div class="worksheet-paper-content"><div class="worksheet-original">' + levelMathMarkup(t(question.worksheet || question.prompt)) + '</div>' + worksheetSketch + '</div></article><article class="matching-canvas ' + (independentCanvas ? 'is-independent' : 'is-sequential') + '">' +
    '<div class="matching-canvas-top"><span>' + (isPt ? 'QUADRO · PASSO A PASSO ' : 'WORKING BOARD · STEP BY STEP ') + String(run.index + 1).padStart(2, '0') +
    '</span><span>' + e(t(question.topic)) + '</span></div><h2 class="matching-prompt">' + levelMathMarkup(t(question.prompt)) + '</h2>' +
    '<p class="matching-instruction">' + e(selectionHint) + '</p><div class="level-board-start"><div class="level-board-start-head"><span>' + (isPt ? 'PONTO DE PARTIDA' : 'STARTING EXPRESSION') + '</span><span class="level-board-start-mark">✎</span></div><div class="level-board-start-equation">' + levelMathMarkup(t(question.boardStart || question.worksheet || question.prompt)) + '</div><svg class="level-board-start-ink" viewBox="0 0 700 18" preserveAspectRatio="none" aria-hidden="true"><path d="M8 10 C 90 3, 134 15, 213 9 S 335 12, 406 8 S 541 14, 692 7" fill="none" stroke="#e2604b" stroke-width="2.2" stroke-linecap="round"/><path d="M11 13 C 130 10, 174 17, 271 11 S 472 16, 688 10" fill="none" stroke="#e2604b" stroke-width=".7" stroke-linecap="round" opacity=".5"/></svg></div><div class="matching-progress">' + matchedCount + ' / ' + question.pairs.length +
    ' ' + (isPt ? 'correspondências montadas' : 'matches placed') + '</div><div class="matching-board"><section class="matching-column matching-solution-column">' +
    '<h3>' + (isPt ? 'A resolução' : 'Working, step by step') + '</h3><div class="match-target-list">' + targetMarkup + '</div></section>' +
    '<section class="matching-column matching-piece-column"><div class="piece-bank-heading"><h3>' + (isPt ? 'Peças matemáticas' : 'Mathematical pieces') + '</h3><span>' + (isPt ? 'ARRASTA PARA CONTINUAR' : 'DRAG TO CONTINUE') + '</span></div><div class="match-piece-pool">' + tileMarkup + '</div></section></div>' + resultMarkup +
    '<div class="matching-canvas-footer"><span>' + (isPt ? 'Pontuação para passar' : 'Pass mark') + ': <strong>' + level.passMark + '/' +
    level.questions.length + '</strong></span><div class="matching-actions"><button type="button" class="button button-ghost" data-action="level-clear" ' +
    (run.submitted || matchedCount === 0 ? 'disabled' : '') + '>' + (isPt ? 'Limpar puzzle' : 'Clear puzzle') +
    '</button><button type="button" class="button button-lime" data-action="' + (run.submitted ? 'level-next' : 'level-verify') + '" ' +
    ((!run.submitted && !allPlaced) ? 'disabled' : '') + '>' +
    (run.submitted ? (run.index === level.questions.length - 1 ? (isPt ? 'Ver resultado' : 'See result') : (isPt ? 'Próximo desafio' : 'Next puzzle')) :
      (isPt ? 'Verificar correspondências' : 'Check matches')) + (run.submitted ? icon('arrow', 16) : icon('check', 16)) +
    '</button></div></div></article></section>';
}

function renderLevelResult(level) {
  const isPt = lang() === 'pt';
  const run = state.levelRun;
  const score = Number.isInteger(run.score) ? run.score : scoreLevelRun(level);
  const passed = !!run.passed;
  const badgeEarned = state.levelProgress.completed.includes(level.id);
  const percent = Math.round(score / level.questions.length * 100);
  app.innerHTML = '<section class="page tools-page levels-page level-result-page"><div class="tools-back-row">' +
    '<button type="button" class="text-link" data-action="level-overview">' + icon('back', 15) + ' ' +
    (isPt ? 'Todos os níveis' : 'All levels') + '</button><span class="tools-kicker">' +
    (isPt ? 'RESULTADO DO NÍVEL' : 'LEVEL RESULT') + '</span></div><div class="level-result-card ' + (passed ? 'is-passed' : 'is-failed') +
    '"><div class="level-result-medal ' + (badgeEarned ? 'has-badge' : '') + '">' + (badgeEarned ? icon('star', 32) : icon('target', 32)) +
    '</div><p class="eyebrow">' + (isPt ? 'MATEMÁTICA · NÍVEL ' : 'MATHEMATICS · LEVEL ') + String(level.id).padStart(2, '0') +
    ' · ' + e(t(level.title)) + '</p><h1>' + (passed ? (isPt ? 'Nível concluído!' : 'Level complete!') :
    (isPt ? 'Tenta outra vez.' : 'Try again.')) + '<span class="title-period" aria-hidden="true">.</span></h1><p class="level-result-copy">' +
    (passed ? (isPt ? 'Conseguiste! O distintivo foi adicionado à tua colecção.' : 'You did it! The badge has been added to your collection.') :
    badgeEarned ? (isPt ? 'Desta vez faltou pouco. O teu distintivo continua guardado.' : 'You did not reach the pass mark this time. Your earned badge is still saved.') :
    (isPt ? 'Conta um puzzle por cada pergunta completamente correcta. Revê as explicações e tenta outra vez.' : 'A puzzle counts only when every match is correct. Review the explanations and try again.')) +
    '</p><div class="level-score-display"><strong>' + score + '<span>/' + level.questions.length + '</span></strong><span>' + percent +
    '% ' + (isPt ? 'de puzzles certos' : 'puzzles solved') + '</span></div><div class="level-score-track"><span style="width:' + percent + '%"></span></div>' +
    ((passed || badgeEarned) ? '<div class="level-earned-badge">' + icon('star', 21) + '<span><strong>' + e(t(level.badge)) +
    '</strong><small>' + (isPt ? 'DISTINTIVO DE NÍVEL' : 'LEVEL BADGE') + '</small></span></div>' : '') +
    '<div class="level-result-actions"><button type="button" class="button button-lime" data-action="level-retry" data-level-id="' + level.id +
    '">' + (isPt ? 'Repetir nível' : 'Replay level') + icon('arrow', 16) + '</button><button type="button" class="button button-ghost" data-action="level-overview">' +
    (isPt ? 'Voltar aos níveis' : 'Back to levels') + '</button></div></div></section>';
}
function renderProfile() {
  const pct = percentage();
  const hours = completedCount() ? `${Math.floor(completedCount()*8/60)}h ${String((completedCount()*8)%60).padStart(2,'0')}m` : '0 min';
  app.innerHTML = `<section class="page profile-page"><div class="profile-cover"><div class="profile-avatar">${icon('user',29)}</div><div><p class="eyebrow">INGENIUM 2.0 · ${e(ui('profile'))}</p><h1>${e(ui('pathProgress'))}</h1><p>${e(ui('profileLead'))}</p></div>${progressRing(pct)}</div><div class="profile-metrics"><div class="metric-card"><span>${icon('check',17)}</span><strong>${completedCount()}</strong><small>${e(ui('lessons'))} ${e(ui('done'))}</small></div><div class="metric-card"><span>${icon('clock',17)}</span><strong>${e(hours)}</strong><small>${e(ui('time'))}</small></div><div class="metric-card"><span>${icon('target',17)}</span><strong>${state.levelProgress.completed.length}</strong><small>${e(lang()==='pt'?'distintivos':'badges')}</small></div></div><section class="card profile-course"><div><p class="eyebrow">${e(ui('onlySubject'))}</p><h2>${e(t(course.title))}</h2><p>${e(t(course.subtitle))}</p></div><div class="profile-course-score">${progressRing(pct)}<small>${e(ui('progress'))}</small></div><a class="button button-primary" href="${href('topic')}">${e(ui('studyPath'))}${icon('arrow',16)}</a></section><div class="profile-settings"><div><span class="settings-icon">${icon('book',18)}</span><span><strong>${e(ui('saved'))}</strong><small>${e(lang()==='pt'?'Sem conta, sem stress: o progresso fica neste dispositivo.':'No account needed: progress stays on this device.')}</small></span></div><button class="button button-ghost button-small" data-action="reset-progress">${icon('reset',15)} ${e(ui('reset'))}</button></div><div class="profile-settings access-mode-setting ${state.fullAccess?'is-active':''}"><div><span class="settings-icon access-settings-icon">${icon(state.fullAccess?'unlock':'lock',18)}</span><span><strong>${e(lang()==='pt'?'Acesso total':'Full access')}</strong><small>${e(state.fullAccess?(lang()==='pt'?'Activo: todos os níveis e bloqueios por progresso estão libertados.':'On: all levels and progression locks are lifted.'):(lang()==='pt'?'Liberta todos os níveis e funcionalidades bloqueadas por progresso neste dispositivo.':'Unlock every level and progression-gated feature on this device.'))}</small></span></div><button type="button" class="button ${state.fullAccess?'button-ghost':'button-primary'} button-small access-toggle-button" data-action="toggle-full-access" aria-pressed="${state.fullAccess}">${e(state.fullAccess?(lang()==='pt'?'Desactivar acesso total':'Turn off full access'):(lang()==='pt'?'Activar acesso total':'Enable full access'))}</button></div><p class="profile-foot">${e(ui('courseOnly'))} · ${e(ui('lessonCount'))}</p></section>`;
}

const summaryAnalysisCache = new Map();
let lessonSearchCache = { lang: null, entries: [] };
function lessonSearchEntries() {
  if (lessonSearchCache.lang === lang()) return lessonSearchCache.entries;
  const entries = course.lessons.map((lesson) => ({
    id: lesson.id,
    searchText: [
      t(lesson.title), t(lesson.kicker), t(lesson.concept), t(lesson.analogy),
      ...(Array.isArray(lesson.sections) ? lesson.sections.flatMap((section) => [t(section.heading), t(section.body)]) : []),
    ].filter(Boolean).join(' '),
  }));
  lessonSearchCache = { lang: lang(), entries };
  return entries;
}
function analyzeRecord(record) {
  const key = `${record.id}:${lang()}:${record.text.length}:${record.title}`;
  if (!summaryAnalysisCache.has(key)) {
    summaryAnalysisCache.set(key, analyzeSummary({ text: record.text, title: record.title, subject: record.subject, lessons: lessonSearchEntries() }));
  }
  return summaryAnalysisCache.get(key);
}
function studyTasks() {
  const isPt = lang() === 'pt';
  const lessons = course.lessons
    .filter((lesson) => !state.completed.includes(lesson.id))
    .map((lesson) => ({
      key: `lesson:${lesson.id}`,
      subject: lesson.module === 'sequences' ? 'math' : 'physics',
      kind: 'task',
      title: `${isPt ? 'Lição' : 'Lesson'}: ${t(lesson.title)}`,
      detail: t(lesson.kicker),
      href: `#lesson/${lesson.id}`,
      duration: Math.max(10, Number(lesson.duration) || 12),
    }));
  const units = algebraSyllabus.units.map((unit) => ({
    key: `alga:${unit.id}`,
    subject: 'algebra',
    kind: 'review',
    title: `ALGA · ${t(unit.title)}`,
    detail: isPt ? `Rever ${unit.topics.length} tópicos e resolver exercícios.` : `Review ${unit.topics.length} topics and solve exercises.`,
    href: '#algebra',
    duration: 35,
  }));
  return [...lessons, ...units];
}
const summaryPlanInputs = () => state.summaries.map((record) => ({ id: record.id, title: record.title, subject: record.subject, href: `#summary/${record.id}` }));
const currentPlan = () => buildStudyPlan({
  programme: state.programme,
  now: new Date(),
  tasks: studyTasks(),
  summaries: summaryPlanInputs(),
  lang: lang(),
});
function summaryExampleText(isPt) {
  return isPt
    ? 'A velocidade média é a razão entre o deslocamento e o intervalo de tempo. Mede-se em metros por segundo (m/s) e indica o ritmo com que a posição muda. Por exemplo, um ciclista que percorre 120 m em 20 s tem uma velocidade média de 6 m/s.\n\nA aceleração média é a variação da velocidade por unidade de tempo. Se a velocidade de um corpo passa de 2 m/s para 10 m/s em 4 s, a aceleração média é 2 m/s². Logo, a aceleração descreve como a velocidade muda, porque relaciona a variação da velocidade com o tempo.\n\nEm resumo, a cinemática descreve o movimento com posição, velocidade e aceleração, porque estas grandezas ligam o percurso ao tempo.'
    : 'Average velocity is the ratio between displacement and the time interval. It is measured in metres per second (m/s) and describes how quickly position changes. For example, a cyclist who covers 120 m in 20 s has an average velocity of 6 m/s.\n\nAverage acceleration is the change in velocity per unit of time. If a body’s velocity goes from 2 m/s to 10 m/s in 4 s, the average acceleration is 2 m/s². Therefore acceleration describes how velocity changes, because it relates the change in velocity to time.\n\nIn summary, kinematics describes motion with position, velocity and acceleration, because these quantities connect the path to time.';
}
function updateSummaryCounter() {
  const counter = document.querySelector('[data-summary-counter]');
  if (!counter) return;
  const isPt = lang() === 'pt';
  const length = drafts.summaryText.trim().length;
  counter.textContent = length >= 120
    ? (isPt ? `${length} caracteres. Pronto para organizar.` : `${length} characters. Ready to organise.`)
    : (isPt ? `${length}/120 caracteres — mínimo 120.` : `${length}/120 characters — 120 minimum.`);
  counter.classList.toggle('is-ready', length >= 120);
}
function updatePlanCounter() {
  const counter = document.querySelector('[data-plan-counter]');
  if (!counter) return;
  const isPt = lang() === 'pt';
  const lines = drafts.programmeText.split('\n').filter((line) => line.trim()).length;
  const parsed = state.programme.parsedAt ? state.programme.events.length + state.programme.weekly.length : 0;
  counter.textContent = lines
    ? (isPt ? `${lines} linha(s) por ler${parsed ? ` · ${parsed} itens guardados` : ''}.` : `${lines} line(s) to read${parsed ? ` · ${parsed} saved items` : ''}.`)
    : (isPt ? 'As datas ficam guardadas neste navegador.' : 'Dates are stored in this browser.');
  counter.classList.toggle('is-ready', parsed > 0);
}
function importPhaseLabel(phase) {
  const isPt = lang() === 'pt';
  const labels = {
    reading: isPt ? 'A ler o ficheiro…' : 'Reading the file…',
    text: isPt ? 'A extrair texto…' : 'Extracting text…',
    'ocr-init': isPt ? 'A preparar o reconhecimento de texto…' : 'Preparing text recognition…',
    ocr: isPt ? 'A reconhecer texto…' : 'Recognising text…',
    done: isPt ? 'Texto pronto.' : 'Text ready.',
  };
  return labels[phase] || (isPt ? 'A processar…' : 'Processing…');
}
function setImportProgress(label, progress = 0) {
  const wrap = document.querySelector('[data-import-progress]');
  if (!wrap) return;
  wrap.hidden = false;
  const text = wrap.querySelector('[data-import-status-text]');
  if (text && label) text.textContent = label;
  const value = Math.max(0, Math.min(1, Number(progress) || 0));
  const percent = Math.round(value * 100);
  const bar = wrap.querySelector('[data-import-bar]');
  if (bar) bar.style.width = `${percent}%`;
  const track = wrap.querySelector('[data-import-track]');
  if (track) track.setAttribute('aria-valuenow', String(percent));
  const percentNode = wrap.querySelector('[data-import-percent]');
  if (percentNode) percentNode.textContent = `${percent}%`;
}
function setImportBusy(busy) {
  document.querySelectorAll('[data-action="summary-import-open"], [data-action="summary-import-camera"], [data-action="summary-create"]').forEach((button) => {
    button.disabled = busy;
    button.setAttribute('aria-busy', String(busy));
  });
  document.querySelector('.study-composer')?.classList.toggle('is-importing', busy);
}
async function handleImportFiles(fileList) {
  const isPt = lang() === 'pt';
  const files = Array.from(fileList || []).slice(0, 8);
  if (!files.length) return;
  if (summaryImportBusy) {
    toast(isPt ? 'Já estou a ler um ficheiro. Espera um instante.' : 'I am already reading a file. Wait a moment.');
    return;
  }
  summaryImportBusy = true;
  setImportBusy(true);
  const successes = [];
  const errors = [];
  let totalChars = 0;

  try {
    for (let index = 0; index < files.length; index += 1) {
      const file = files[index];
      const check = validateImportFile(file);
      if (!check.ok) {
        errors.push(`${file.name}: ${importErrorMessage(check.code, lang(), check.detail)}`);
        continue;
      }
      const prefix = files.length > 1 ? `(${index + 1}/${files.length}) ` : '';
      setImportProgress(`${prefix}${file.name} · ${importPhaseLabel('reading')}`, 0.02);
      try {
        const buffer = await file.arrayBuffer();
        const hash = await sha256Hex(buffer);
        const duplicate = [...state.summaries.flatMap((record) => record.sources || []), ...drafts.summarySources]
          .find((source) => source.hash && source.hash === hash);
        if (duplicate) {
          errors.push(isPt
            ? `«${file.name}» já foi importado como «${duplicate.name}».`
            : `“${file.name}” was already imported as “${duplicate.name}”.`);
          continue;
        }
        setImportProgress(`${prefix}${file.name} · ${importPhaseLabel('text')}`, 0.06);
        const result = await extractFileText(file, {
          hash,
          buffer,
          onProgress: ({ phase, progress }) => setImportProgress(`${prefix}${file.name} · ${importPhaseLabel(phase)}`, progress),
        });
        const separator = drafts.summaryText.trim() ? '\n\n' : '';
        const available = IMPORT_LIMITS.maxChars - drafts.summaryText.length - separator.length;
        if (available < 80) {
          errors.push(importErrorMessage('limit', lang()));
          break;
        }
        const chunk = result.text.slice(0, available);
        drafts.summaryText = `${drafts.summaryText.trimEnd()}${separator}${chunk}`;
        drafts.summarySources = [...drafts.summarySources, {
          name: result.fileName,
          kind: result.kind,
          method: result.method,
          size: result.fileSize,
          pages: result.pages,
          ocrPages: result.ocrPages,
          hash: result.hash,
          importedAt: new Date().toISOString(),
        }].slice(-8);
        if (!drafts.summaryTitle.trim()) drafts.summaryTitle = result.title;
        if (drafts.summarySubject === 'general') {
          const suggested = suggestSubject(result.text);
          if (suggested !== 'general') drafts.summarySubject = suggested;
        }
        successes.push({ ...result, chunkLength: chunk.length });
        totalChars += chunk.length;
      } catch (error) {
        errors.push(`${file.name}: ${importErrorMessage(error?.code || 'unknown', lang())}`);
      }
    }
  } finally {
    summaryImportBusy = false;
    setImportBusy(false);
  }

  if (!successes.length) {
    summaryNoticeState.value = { tone: 'error', message: errors.slice(0, 3).join(' ') };
    if (route().page === 'summaries') render();
    else toast(errors[0] || importErrorMessage('unknown', lang()));
    return;
  }

  const truncated = successes.some((result) => result.truncated || result.chunkLength < result.text.length);
  const skipped = successes.reduce((total, result) => total + (result.skippedPages || 0), 0);
  const ocrFailures = successes.reduce((total, result) => total + (result.ocrFailures || 0), 0);
  const warnings = [];
  if (truncated) warnings.push(isPt ? 'O texto foi cortado no limite de 20 000 caracteres.' : 'Text was cut at the 20,000-character limit.');
  if (skipped) warnings.push(isPt ? `${skipped} página(s) ficaram por ler.` : `${skipped} page(s) were not read.`);
  if (ocrFailures) warnings.push(isPt ? `${ocrFailures} página(s) sem OCR utilizável.` : `${ocrFailures} page(s) had no usable OCR.`);
  const summary = isPt
    ? `${successes.length} ${successes.length === 1 ? 'ficheiro lido' : 'ficheiros lidos'} · ${totalChars} caracteres extraídos. Revê o texto e clica em «Organizar resumo».`
    : `${successes.length} ${successes.length === 1 ? 'file read' : 'files read'} · ${totalChars} characters extracted. Review the text and click “Organise summary”.`;
  const combined = [...warnings, ...errors.slice(0, 2)].join(' ');
  summaryNoticeState.value = { tone: errors.length ? 'error' : 'ok', message: `${summary}${combined ? ` ${combined}` : ''}` };

  if (route().page === 'summaries') {
    render();
    document.querySelector('.study-composer')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    document.querySelector('[data-summary-text]')?.focus({ preventScroll: true });
  } else {
    toast(isPt ? 'Texto importado. Abre os resumos para o rever.' : 'Text imported. Open summaries to review it.');
  }
}
function renderStudySummaries() {
  const summaries = state.summaries.map((record) => ({ record, analysis: analyzeRecord(record) }));
  const thread = buildSummaryThread(summaries);
  renderSummariesPage({
    app, lang: lang(), ui, e, icon, href,
    summaries, thread,
    draft: { title: drafts.summaryTitle, subject: drafts.summarySubject, text: drafts.summaryText, sources: drafts.summarySources },
    notice: summaryNoticeState.value,
  });
  updateSummaryCounter();
}
function renderStudySummary(id) {
  const record = state.summaries.find((item) => item.id === id);
  if (!record) {
    const isPt = lang() === 'pt';
    app.innerHTML = `<section class="page tools-page study-page"><div class="tools-back-row"><a class="text-link" href="${href('summaries')}">${icon('back', 15)} ${e(isPt ? 'Resumos' : 'Summaries')}</a></div><div class="study-empty"><span class="study-empty-icon">${icon('book', 28)}</span><h3>${e(isPt ? 'Resumo não encontrado.' : 'Summary not found.')}</h3><p>${e(isPt ? 'Pode ter sido apagado neste dispositivo.' : 'It may have been deleted on this device.')}</p><a class="button button-primary" href="${href('summaries')}">${e(isPt ? 'Voltar aos resumos' : 'Back to summaries')}</a></div></section>`;
    return;
  }
  const analysis = analyzeRecord(record);
  const relatedLessons = (analysis.related || [])
    .map((item) => lessonById[item.lessonId])
    .filter(Boolean)
    .map((lesson) => ({ id: lesson.id, title: t(lesson.title) }));
  const summaries = state.summaries.map((item) => ({ record: item, analysis: analyzeRecord(item) }));
  const entry = buildSummaryThread(summaries).positions[record.id];
  const tab = summaryTabs[record.id] || 'explain';
  renderSummaryDetailPage({
    app, lang: lang(), ui, e, icon, href,
    record, analysis, relatedLessons,
    continuity: entry?.continuity || null,
    external: record.external || null,
    wikiBusy: summaryWikiState[record.id] || null,
    tab,
  });
  if (tab === 'world') {
    const labRoot = app.querySelector('[data-concept-lab]');
    if (labRoot) {
      const lens = buildConceptLens(analysis, { lang: lang(), title: record.title });
      mountConceptLab(labRoot, { nodes: lens.lab.nodes, lang: lang(), rootLabel: record.title, subject: record.subject });
    }
  }
  if (tab === 'audio') {
    const audioRoot = app.querySelector('[data-audio-lesson]');
    if (audioRoot) mountAudioLesson(audioRoot, { analysis, lang: lang(), title: record.title, record });
  }
}
async function loadSummaryWikipedia(id, term) {
  const record = state.summaries.find((item) => item.id === id);
  const cleanTerm = String(term || '').replace(/\s+/g, ' ').trim().slice(0, 100);
  if (!record || !cleanTerm || summaryWikiState[id]?.status === 'loading') return;
  summaryWikiState[id] = { status: 'loading', term: cleanTerm };
  summaryTabs[id] = 'world';
  if (route().page === 'summary' && route().id === id) render();
  const requestLang = lang();
  try {
    const result = await fetchWikipediaConcept(cleanTerm, { lang: requestLang });
    const current = state.summaries.find((item) => item.id === id);
    if (!current) {
      delete summaryWikiState[id];
      return;
    }
    const previous = current.external;
    const normalized = normalizeSummaryExternal(result);
    current.external = normalized;
    if (!save()) {
      current.external = previous;
      summaryWikiState[id] = { status: 'error', term: cleanTerm, message: requestLang === 'pt' ? 'A Wikipédia respondeu, mas o navegador recusou guardar o conteúdo. Liberta espaço e tenta outra vez.' : 'Wikipedia responded, but the browser refused to save the content. Free some space and try again.' };
    } else {
      delete summaryWikiState[id];
      toast(requestLang === 'pt' ? `Conteúdo da Wikipédia carregado para «${result.title}».` : `Wikipedia content loaded for “${result.title}”.`);
    }
  } catch (error) {
    const code = error instanceof WikiLookupError ? error.code : 'network';
    summaryWikiState[id] = { status: 'error', term: cleanTerm, message: wikiLookupErrorMessage(code, requestLang) };
  }
  if (route().page === 'summary' && route().id === id) render();
}
function renderStudyPlanner() {
  const plan = currentPlan();
  renderPlannerPage({
    app, lang: lang(), ui, e, icon, href,
    draft: { text: drafts.programmeText, done: state.planDone },
    notice: planNoticeState.value,
    programme: state.programme,
    plan,
    summaryCount: state.summaries.length,
  });
  updatePlanCounter();
}

function renderClassHub() {
  const current = route();
  if (current.tab && current.tab !== classroomTab) classroomTab = current.tab;
  const summaries = state.summaries.map((record) => ({ record, analysis: analyzeRecord(record) }));
  renderClassroomPage({
    app, lang: lang(), ui, e, icon, href,
    classroom: state.classroom,
    tab: classroomTab,
    notice: classroomNoticeState.value,
    busy: classroomBusy,
    canShare: typeof navigator !== 'undefined' && typeof navigator.share === 'function',
    summaries,
    programme: state.classroom.programme,
  });
}
function renderPresentation() {
  const current = route();
  const record = state.summaries.find((item) => item.id === current.id);
  if (!record) {
    const isPt = lang() === 'pt';
    app.innerHTML = `<section class="page tools-page study-page"><div class="tools-back-row"><a class="text-link" href="${href('classroom')}">${icon('back', 15)} ${e(isPt ? 'Turma' : 'Class')}</a></div><div class="study-empty"><span class="study-empty-icon">${icon('projector', 28)}</span><h3>${e(isPt ? 'Resumo não encontrado.' : 'Summary not found.')}</h3><p>${e(isPt ? 'Pode ter sido apagado neste dispositivo.' : 'It may have been deleted on this device.')}</p><a class="button button-primary" href="${href('classroom')}">${e(isPt ? 'Voltar à turma' : 'Back to class')}</a></div></section>`;
    return;
  }
  if (presentationRecordId !== record.id) {
    presentationRecordId = record.id;
    presentationSlide = 0;
  }
  const analysis = analyzeRecord(record);
  const result = renderPresentationPage({
    app, lang: lang(), ui, e, icon, href, record, analysis, slide: presentationSlide,
  });
  presentationSlideCount = result.slides.length;
  presentationSlide = Math.max(0, Math.min(result.slides.length - 1, presentationSlide));
  const currentSlide = result.slides[presentationSlide];
  if (currentSlide?.kind === 'lab') {
    const labRoot = app.querySelector('[data-concept-lab]');
    if (labRoot) mountConceptLab(labRoot, { nodes: result.lens.lab.nodes, lang: lang(), rootLabel: record.title, subject: record.subject });
  }
}

function classroomStorageMessage() {
  return lang() === 'pt'
    ? 'O navegador recusou guardar a turma. Liberta espaço ou permite dados deste site e tenta outra vez.'
    : 'The browser refused to save the class. Free some space or allow site data and try again.';
}
function commitClassroom(next, message) {
  const previous = state.classroom;
  const room = normalizeClassroom(next);
  room.updatedAt = new Date().toISOString();
  state.classroom = room;
  if (!save()) {
    state.classroom = previous;
    classroomNoticeState.value = { tone: 'error', message: classroomStorageMessage() };
    render();
    return false;
  }
  classroomNoticeState.value = message ? { tone: 'ok', message } : null;
  render();
  return true;
}
function downloadClassFile(content, fileName, type = 'application/json') {
  const blob = new Blob([content], { type: `${type};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch { ok = false; }
    area.remove();
    return ok;
  }
}
async function shareClassPack() {
  const isPt = lang() === 'pt';
  const pack = buildClassPack(state.classroom);
  const json = JSON.stringify(pack, null, 2);
  const fileName = packFileName(state.classroom);
  const file = typeof File === 'function' ? new File([json], fileName, { type: 'application/json' }) : null;
  if (file && typeof navigator.share === 'function' && typeof navigator.canShare === 'function' && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        files: [file],
        title: state.classroom.name || 'Ingenium 2.0',
        text: isPt ? 'Pacote da turma do Ingenium 2.0. Importa-o no separador Turma.' : 'Ingenium 2.0 class pack. Import it in the Class tab.',
      });
      toast(isPt ? 'Pacote partilhado.' : 'Pack shared.');
      return;
    } catch (error) {
      if (error?.name === 'AbortError') return;
    }
  }
  downloadClassFile(json, fileName);
  toast(isPt
    ? 'Este navegador não partilha ficheiros diretamente. Transferi o pacote .json — envia-o aos colegas.'
    : 'This browser cannot share files directly. I downloaded the .json pack — send it to classmates.');
}
function openClassFile(target) {
  const input = document.querySelector(`[data-class-file="${target}"]`);
  if (input) input.click();
}
function setClassroomBusy(title, detail = '', progress = 4) {
  classroomBusy = { title, detail, progress };
  render();
}
function updateClassroomBusy(detail, progress = 0) {
  if (!classroomBusy) return;
  classroomBusy.detail = detail;
  classroomBusy.progress = Math.max(4, Math.min(100, Math.round(progress * 100)));
  const node = document.querySelector('.class-busy');
  if (!node) return;
  const detailNode = node.querySelector('span');
  if (detailNode) detailNode.textContent = detail;
  const bar = node.querySelector('.class-busy-track i');
  if (bar) bar.style.width = `${classroomBusy.progress}%`;
}
async function importClassPack(file) {
  const isPt = lang() === 'pt';
  if (!file) return;
  if (file.size > CLASS_LIMITS.packBytes) {
    classroomNoticeState.value = { tone: 'error', message: classPackErrorMessage('size', lang()) };
    render();
    return;
  }
  let raw = '';
  try {
    raw = await file.text();
  } catch {
    classroomNoticeState.value = { tone: 'error', message: classPackErrorMessage('parse', lang()) };
    render();
    return;
  }
  try {
    const pack = parseClassPack(raw);
    const wasConfigured = Boolean(state.classroom.name);
    const previous = state.classroom;
    const merged = mergeClassPack(state.classroom, pack.classroom);
    if (!wasConfigured) {
      merged.classroom.owner = '';
      merged.classroom.role = 'student';
    }
    merged.classroom.updatedAt = new Date().toISOString();
    state.classroom = normalizeClassroom(merged.classroom);
    if (!save()) {
      state.classroom = previous;
      classroomNoticeState.value = { tone: 'error', message: classPackErrorMessage('save', lang()) };
      render();
      return;
    }
    const stats = merged.stats;
    const parts = [];
    if (stats.notices) parts.push(`${stats.notices} ${isPt ? 'aviso(s)' : 'notice(s)'}`);
    if (stats.materials) parts.push(`${stats.materials} ${isPt ? 'material(is)' : 'material(s)'}`);
    if (stats.groups) parts.push(`${stats.groups} ${isPt ? 'grupo(s)' : 'group(s)'}`);
    if (stats.members) parts.push(`${stats.members} ${isPt ? 'colega(s)' : 'classmate(s)'}`);
    const skipped = stats.skipped ? (isPt ? ` ${stats.skipped} repetido(s) ignorado(s).` : ` ${stats.skipped} duplicate(s) skipped.`) : '';
    const first = !wasConfigured
      ? (isPt ? ' Escreve o teu nome em «Editar turma» para entrares nos grupos.' : ' Add your name in “Edit class” so you can join groups.')
      : '';
    classroomNoticeState.value = {
      tone: 'ok',
      message: parts.length
        ? `${isPt ? 'Pacote importado' : 'Pack imported'}: ${parts.join(', ')}.${skipped}${first}`
        : `${isPt ? 'Pacote lido. Confirma os dados em «Editar turma».' : 'Pack read. Check the details in “Edit class”.'}${first}`,
    };
    classroomTab = 'board';
    render();
  } catch (error) {
    const code = error instanceof ClassPackError ? error.code : 'parse';
    classroomNoticeState.value = { tone: 'error', message: classPackErrorMessage(code, lang()) };
    render();
  }
}
function applyClassProgramme(text, sourceName = '') {
  const isPt = lang() === 'pt';
  const parsed = parseProgramme(text, { now: new Date() });
  if (!parsed.events.length && !parsed.weekly.length) {
    return {
      error: isPt
        ? 'Não encontrei datas nem horários reconhecíveis. Usa, por exemplo, «Exame de Física — 05/11/2026 às 09:00» ou «segunda 08:00-10:00».'
        : 'I found no recognisable dates or timetables. Try “Physics exam — 05/11/2026 at 09:00” or “Monday 08:00-10:00”.',
    };
  }
  const previous = state.classroom;
  const room = normalizeClassroom({
    ...state.classroom,
    programme: {
      text,
      sourceName,
      updatedAt: new Date().toISOString(),
      events: parsed.events,
      weekly: parsed.weekly,
      stats: parsed.stats,
      parsedAt: parsed.parsedAt,
    },
  });
  room.updatedAt = new Date().toISOString();
  state.classroom = room;
  if (!save()) {
    state.classroom = previous;
    return { error: classroomStorageMessage() };
  }
  return { parsed };
}
async function handleClassMaterialFile(file) {
  const isPt = lang() === 'pt';
  if (!file || classroomFileBusy) return;
  const check = validateImportFile(file);
  if (!check.ok) {
    classroomNoticeState.value = { tone: 'error', message: importErrorMessage(check.code, lang(), check.detail) };
    render();
    return;
  }
  classroomFileBusy = true;
  const form = document.querySelector('[data-class-form="material"]');
  const data = form ? new FormData(form) : new FormData();
  setClassroomBusy(isPt ? 'A ler o ficheiro para os materiais…' : 'Reading the file into materials…', file.name, 4);
  let failure = '';
  try {
    const buffer = await file.arrayBuffer();
    const hash = await sha256Hex(buffer);
    if (state.classroom.materials.some((material) => material.hash === hash)) {
      failure = isPt ? 'Este ficheiro já está nos materiais da turma.' : 'This file is already in the class materials.';
    } else {
      const result = await extractFileText(file, {
        hash,
        buffer,
        onProgress: ({ phase, progress }) => updateClassroomBusy(`${file.name} · ${importPhaseLabel(phase)}`, progress),
      });
      const text = result.text.slice(0, CLASS_LIMITS.materialText);
      const material = normalizeMaterial({
        id: newId(),
        kind: data.get('kind') || 'apontamento',
        subject: data.get('subject') || suggestSubject(text),
        title: String(data.get('title') || '').trim() || result.title || file.name,
        description: String(data.get('description') || '').trim(),
        link: String(data.get('link') || '').trim(),
        text,
        fileName: result.fileName,
        size: result.fileSize,
        hash: result.hash,
        createdAt: new Date().toISOString(),
        author: state.classroom.owner,
        role: state.classroom.role,
      });
      if (!material) {
        failure = isPt ? 'O ficheiro foi lido, mas não produziu texto utilizável.' : 'The file was read but produced no usable text.';
      } else {
        const previous = state.classroom;
        const room = normalizeClassroom({ ...state.classroom, materials: [material, ...state.classroom.materials] });
        room.updatedAt = new Date().toISOString();
        state.classroom = room;
        if (!save()) {
          state.classroom = previous;
          failure = classroomStorageMessage();
        } else {
          const warnings = [];
          if (result.truncated || text.length < result.text.length) warnings.push(isPt ? 'texto cortado no limite de 12 000 caracteres' : 'text cut at the 12,000-character limit');
          if (result.ocrFailures) warnings.push(isPt ? `${result.ocrFailures} página(s) sem OCR utilizável` : `${result.ocrFailures} page(s) with no usable OCR`);
          classroomNoticeState.value = {
            tone: 'ok',
            message: `${isPt ? 'Material importado' : 'Material imported'}: «${material.title}» · ${text.length} ${isPt ? 'caracteres' : 'characters'}.${warnings.length ? ` ${warnings.join('; ')}.` : ''}`,
          };
          classroomTab = 'materials';
        }
      }
    }
  } catch (error) {
    failure = importErrorMessage(error?.code || 'unknown', lang());
  } finally {
    classroomFileBusy = false;
    classroomBusy = null;
  }
  if (failure) classroomNoticeState.value = { tone: 'error', message: failure };
  render();
}
async function handleClassProgrammeFile(file) {
  const isPt = lang() === 'pt';
  if (!file || classroomFileBusy) return;
  const check = validateImportFile(file);
  if (!check.ok) {
    classroomNoticeState.value = { tone: 'error', message: importErrorMessage(check.code, lang(), check.detail) };
    render();
    return;
  }
  classroomFileBusy = true;
  setClassroomBusy(isPt ? 'A ler o programa da turma…' : 'Reading the class programme…', file.name, 4);
  let failure = '';
  try {
    const buffer = await file.arrayBuffer();
    const result = await extractFileText(file, {
      buffer,
      onProgress: ({ phase, progress }) => updateClassroomBusy(`${file.name} · ${importPhaseLabel(phase)}`, progress),
    });
    const applied = applyClassProgramme(result.text, result.fileName);
    if (applied.error) failure = applied.error;
    else {
      const parsed = applied.parsed;
      classroomNoticeState.value = {
        tone: 'ok',
        message: isPt
          ? `Programa lido de «${result.fileName}»: ${parsed.events.length} datas e ${parsed.weekly.length} aulas semanais. Confirma sempre as datas oficiais.`
          : `Programme read from “${result.fileName}”: ${parsed.events.length} dates and ${parsed.weekly.length} weekly classes. Always confirm official dates.`,
      };
      classroomTab = 'programme';
    }
  } catch (error) {
    failure = importErrorMessage(error?.code || 'unknown', lang());
  } finally {
    classroomFileBusy = false;
    classroomBusy = null;
  }
  if (failure) classroomNoticeState.value = { tone: 'error', message: failure };
  render();
}

function render(shouldScroll = false) {
  if (!booted) return;
  const oldLab = app.querySelector('[data-concept-lab]');
  if (oldLab?.__labCleanup) {
    oldLab.__labCleanup();
    oldLab.__labCleanup = null;
  }
  const oldAudio = app.querySelector('[data-audio-lesson]');
  if (oldAudio?.__audioCleanup) {
    oldAudio.__audioCleanup();
    oldAudio.__audioCleanup = null;
  } else if (window.speechSynthesis?.speaking) {
    window.speechSynthesis.cancel();
  }
  document.documentElement.lang = lang();
  const current = route();
  document.body.classList.toggle('is-presenting', current.page === 'present');
  const active = ['formulas','triangles','shortcuts'].includes(current.page) ? 'formulas' : current.page === 'lesson' ? 'lesson' : current.page;
  renderHeader(active);
  if (current.page==='home') renderHome();
  else if (current.page==='topic') renderTopic();
  else if (current.page==='lesson') renderLesson(current.id);
  else if (current.page==='practice') renderLevels();
  else if (current.page==='program') renderProgrammePage({ app, lang, t, ui, e, icon, href, course, algebraSyllabus, homeSubjectDiagram });
  else if (current.page==='formulas') renderFormulasPage({ app, lang, t, ui, e, icon, href });
  else if (current.page==='triangles') renderTriangles();
  else if (current.page==='shortcuts') renderShortcuts();
  else if (current.page==='algebra') renderAlgebraPage({ app, lang, t, ui, e, icon, href, algebraSyllabus, homeSubjectDiagram });
  else if (current.page==='chemistry') renderChemistryPage({ app, lang, ui, e, icon, href, homeSubjectDiagram });
  else if (current.page==='summaries') renderStudySummaries();
  else if (current.page==='summary') renderStudySummary(current.id);
  else if (current.page==='planner') renderStudyPlanner();
  else if (current.page==='classroom') renderClassHub();
  else if (current.page==='present') renderPresentation();
  else renderProfile();
  save();
  if (shouldScroll) window.scrollTo({top:0,behavior:'auto'});
}

function toast(message) {
  const node = document.querySelector('#toast');
  node.textContent = message;
  node.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>node.classList.remove('show'),2300);
}

document.addEventListener('keydown', event => {
  if (route().page === 'present') {
    if (event.key === 'ArrowRight' || event.key === 'PageDown' || event.key === ' ') {
      event.preventDefault();
      presentationSlide = Math.min(Math.max(0, presentationSlideCount - 1), presentationSlide + 1);
      render();
      return;
    }
    if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
      event.preventDefault();
      presentationSlide = Math.max(0, presentationSlide - 1);
      render();
      return;
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      location.hash = '#classroom';
      return;
    }
  }
  if (event.key === 'Escape') {
    const expressionDialog = document.querySelector('.expression-help-backdrop');
    if (expressionDialog && !expressionDialog.hidden) { expressionDialog.hidden = true; document.body.classList.remove('dialog-open'); document.querySelector('[data-action="open-expression-help"]')?.focus(); return; }
    const dialog = document.querySelector('.topic-dialog-backdrop');
    if (dialog && !dialog.hidden) { dialog.hidden = true; document.body.classList.remove('dialog-open'); }
  }
});

let suppressLevelClickUntil = 0;

let touchLevelDrag = null;
function clearTouchLevelDrag() {
  if (touchLevelDrag) {
    touchLevelDrag.piece.classList.remove('is-dragging');
    touchLevelDrag.ghost?.remove();
  }
  document.querySelectorAll('.match-target.is-drop-ready').forEach(target => target.classList.remove('is-drop-ready'));
  touchLevelDrag = null;
}

document.addEventListener('pointerdown', event => {
  if (event.pointerType !== 'touch' && event.pointerType !== 'pen') return;
  const piece = event.target.closest?.('[data-action="level-select-piece"]');
  if (!piece || piece.disabled || !state.levelRun || state.levelRun.submitted || state.levelRun.finished) return;
  const rect = piece.getBoundingClientRect();
  touchLevelDrag = {
    piece, pieceId: piece.dataset.pieceId, pointerId: event.pointerId,
    startX: event.clientX, startY: event.clientY, rect, moved: false, ghost: null, target: null
  };
});

document.addEventListener('pointermove', event => {
  const drag = touchLevelDrag;
  if (!drag || drag.pointerId !== event.pointerId) return;
  const distance = Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY);
  if (!drag.moved && distance < 8) return;
  if (!drag.moved) {
    drag.moved = true;
    drag.piece.classList.add('is-dragging');
    const ghost = drag.piece.cloneNode(true);
    ghost.className = drag.piece.className + ' level-drag-ghost';
    ghost.removeAttribute('data-action');
    ghost.removeAttribute('data-piece-id');
    ghost.removeAttribute('draggable');
    ghost.disabled = true;
    ghost.setAttribute('aria-hidden', 'true');
    ghost.style.width = drag.rect.width + 'px';
    document.body.appendChild(ghost);
    drag.ghost = ghost;
  }
  event.preventDefault();
  drag.ghost.style.left = (event.clientX - drag.rect.width / 2) + 'px';
  drag.ghost.style.top = (event.clientY - drag.rect.height / 2) + 'px';
  const underPointer = document.elementFromPoint(event.clientX, event.clientY);
  const nextTarget = underPointer?.closest?.('.match-target[data-action="level-select-pair"]') || null;
  const validTarget = nextTarget && !nextTarget.disabled ? nextTarget : null;
  if (drag.target !== validTarget) {
    drag.target?.classList.remove('is-drop-ready');
    validTarget?.classList.add('is-drop-ready');
    drag.target = validTarget;
  }
}, {passive:false});

document.addEventListener('pointerup', event => {
  const drag = touchLevelDrag;
  if (!drag || drag.pointerId !== event.pointerId) return;
  let placed = false;
  if (drag.moved) {
    event.preventDefault();
    const underPointer = document.elementFromPoint(event.clientX, event.clientY);
    const target = underPointer?.closest?.('.match-target[data-action="level-select-pair"]');
    if (target && !target.disabled) {
      placed = placeLevelPiece(state.levelRun, target.dataset.pairId, drag.pieceId);
    }
  }
  clearTouchLevelDrag();
  if (placed) {
    suppressLevelClickUntil = Date.now() + 450;
    save();
    render();
  }
});

document.addEventListener('pointercancel', event => {
  if (touchLevelDrag && touchLevelDrag.pointerId === event.pointerId) clearTouchLevelDrag();
});

document.addEventListener('dragstart', event => {
  const piece = event.target.closest?.('[data-action="level-select-piece"]');
  if (!piece || piece.disabled || !state.levelRun || state.levelRun.submitted) {
    if (event.dataTransfer) event.dataTransfer.effectAllowed = 'none';
    return;
  }
  if (!event.dataTransfer) return;
  event.dataTransfer.setData('text/plain', piece.dataset.pieceId || '');
  event.dataTransfer.effectAllowed = 'move';
  piece.classList.add('is-dragging');
});

document.addEventListener('dragover', event => {
  const target = event.target.closest?.('.match-target[data-action="level-select-pair"]');
  if (!target || target.disabled || !state.levelRun || state.levelRun.submitted) return;
  event.preventDefault();
  if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
  target.classList.add('is-drop-ready');
});

document.addEventListener('dragenter', event => {
  const target = event.target.closest?.('.match-target[data-action="level-select-pair"]');
  if (target && !target.disabled && state.levelRun && !state.levelRun.submitted) target.classList.add('is-drop-ready');
});

document.addEventListener('dragleave', event => {
  const target = event.target.closest?.('.match-target[data-action="level-select-pair"]');
  if (target && !target.contains(event.relatedTarget)) target.classList.remove('is-drop-ready');
});

document.addEventListener('drop', event => {
  const target = event.target.closest?.('.match-target[data-action="level-select-pair"]');
  if (!target || target.disabled || !state.levelRun || state.levelRun.submitted) return;
  event.preventDefault();
  const pieceId = event.dataTransfer?.getData('text/plain');
  if (!pieceId) return;
  const placed = placeLevelPiece(state.levelRun, target.dataset.pairId, pieceId);
  document.querySelectorAll('.match-target.is-drop-ready').forEach(item => item.classList.remove('is-drop-ready'));
  document.querySelectorAll('.match-piece.is-dragging').forEach(item => item.classList.remove('is-dragging'));
  if (placed) {
    suppressLevelClickUntil = Date.now() + 400;
    save();
    render();
  }
});

document.addEventListener('dragend', event => {
  const piece = event.target.closest?.('[data-action="level-select-piece"]');
  if (piece) piece.classList.remove('is-dragging');
  document.querySelectorAll('.match-target.is-drop-ready').forEach(target => target.classList.remove('is-drop-ready'));
});

function appendPrototypeToken(tokenId, slotElement = null) {
  const run = state.levelRun;
  if (!run || run.type !== 'construct-prototype' || run.checked || run.finished || !tokenId) return;
  if (slotElement?.dataset?.prototypeSlot && slotElement?.dataset?.fractionId) {
    selectPrototypeSlot(run, slotElement.dataset.prototypeSlot, slotElement.dataset.fractionId);
  }
  if (!insertPrototypeToken(run, tokenId)) return;
  save(); render();
}

app.addEventListener('input', (event) => {
  const field = event.target.closest?.('[data-science-answer]');
  const run = state.levelRun;
  if (!field || !run || run.type !== 'science-level-one' || run.checked) return;
  updateScienceAnswer(run, field.dataset.scienceAnswer, field.value);
  save();
});
app.addEventListener('keydown', (event) => {
  const slot = event.target.closest?.('.construct-fraction-slot[role="button"], .construct-step-action[role="button"]');
  if (!slot || !['Enter', ' '].includes(event.key)) return;
  event.preventDefault();
  const run = state.levelRun;
  if (!run || run.type !== 'construct-prototype' || run.checked || run.finished) return;
  selectPrototypeSlot(run, slot.dataset.prototypeSlot, slot.dataset.fractionId);
  save(); render();
});
app.addEventListener('dragstart', (event) => {
  const token = event.target.closest?.('[data-action="prototype-add-token"]');
  if (!token || token.disabled || !state.levelRun || state.levelRun.type !== 'construct-prototype') return;
  const tokenId = token.dataset.prototypeToken || token.dataset.token;
  if (!tokenId || !event.dataTransfer) return;
  event.dataTransfer.setData('text/plain', tokenId);
  event.dataTransfer.effectAllowed = 'copy';
});
app.addEventListener('dragover', (event) => {
  const slot = event.target.closest?.('[data-prototype-slot-zone]');
  const zone = slot || event.target.closest?.('[data-prototype-dropzone]');
  if (!zone || state.levelRun?.type !== 'construct-prototype' || state.levelRun.checked) return;
  event.preventDefault();
  zone.classList.add('is-drag-over');
});
app.addEventListener('dragleave', (event) => {
  const zone = event.target.closest?.('[data-prototype-slot-zone], [data-prototype-dropzone]');
  if (zone && !zone.contains(event.relatedTarget)) zone.classList.remove('is-drag-over');
});
app.addEventListener('drop', (event) => {
  const slot = event.target.closest?.('[data-prototype-slot-zone]');
  const zone = slot || event.target.closest?.('[data-prototype-dropzone]');
  if (!zone || state.levelRun?.type !== 'construct-prototype' || state.levelRun.checked) return;
  event.preventDefault();
  const tokenId = event.dataTransfer?.getData('text/plain');
  if (!tokenId) return;
  appendPrototypeToken(tokenId, slot);
});
document.addEventListener('click', (event) => {
  const themeButton = event.target.closest('[data-action="theme-toggle"]');
  if (themeButton) {
    const next = applyTheme(currentTheme() === 'purple' ? 'classic' : 'purple');
    const nextLabel = themeActionLabel(next, lang() === 'pt');
    themeButton.setAttribute('aria-pressed', String(next === 'purple'));
    themeButton.setAttribute('aria-label', nextLabel);
    themeButton.title = nextLabel;
    return;
  }
  const languageButton = event.target.closest('[data-action="language"]');
  if (languageButton) { state.language = languageButton.dataset.language; save(); render(); return; }
  const moduleButton = event.target.closest('[data-module]');
  if (moduleButton && moduleButton.dataset.action !== 'topic-lessons') {
    if (moduleButton.dataset.action === 'back-module') { state.activeModule = moduleButton.dataset.module; location.hash = `#topic/${moduleButton.dataset.subject || (moduleButton.dataset.module === 'sequences' ? 'math' : 'physics')}/${moduleButton.dataset.module}`; return; }
    if (moduleById[moduleButton.dataset.module]) { state.activeModule = moduleButton.dataset.module; save(); render(); return; }
  }
  const action = event.target.closest('[data-action]');
  if (!action) return;
  if (Date.now() < suppressLevelClickUntil && ['level-select-pair', 'level-select-piece'].includes(action.dataset.action)) return;
  if (action.dataset.action === 'toggle-full-access') {
    state.fullAccess = !state.fullAccess;
    save();
    render();
    toast(state.fullAccess
      ? (lang() === 'pt' ? 'Acesso total activado neste dispositivo.' : 'Full access enabled on this device.')
      : (lang() === 'pt' ? 'Acesso total desactivado. Os bloqueios normais voltaram.' : 'Full access disabled. Normal locks are back.'));
    return;
  }
  if (action.dataset.action === 'level-science-start') {
    const subject = action.dataset.subject;
    if (!['physics','chemistry'].includes(subject)) return;
    state.levelRun = createScienceRun(subject);
    save(); render(); return;
  }
  if (action.dataset.action === 'science-back') {
    state.levelRun = null; save(); location.hash = '#practice'; return;
  }
  if (action.dataset.action === 'science-check') {
    const run = state.levelRun;
    if (!run || run.type !== 'science-level-one') return;
    checkScienceRun(run); save(); render(); return;
  }
  if (action.dataset.action === 'science-retry') {
    const subject = state.levelRun?.subject;
    if (!['physics','chemistry'].includes(subject)) return;
    state.levelRun = createScienceRun(subject); save(); render(); return;
  }
  if (action.dataset.action === 'level-prototype-start') {
    state.levelRun = createLevelConstructorPrototype();
    save(); render(); return;
  }
  if (action.dataset.action === 'prototype-back') {
    state.levelRun = null; save(); render(); return;
  }
  if (action.dataset.action === 'prototype-restart') {
    state.levelRun = createLevelConstructorPrototype({ levelId: state.levelRun?.levelId ?? null });
    save(); render(); return;
  }
  if (action.dataset.action === 'prototype-add-token') {
    const run = state.levelRun;
    const token = action.dataset.prototypeToken || action.dataset.token;
    if (!run || run.type !== 'construct-prototype' || !insertPrototypeToken(run, token)) return;
    save(); render(); return;
  }
  if (action.dataset.action === 'prototype-select-slot') {
    const run = state.levelRun;
    if (!run || run.type !== 'construct-prototype' || run.checked || run.finished) return;
    selectPrototypeSlot(run, action.dataset.prototypeSlot, action.dataset.fractionId);
    run.feedback = '';
    save(); render(); return;
  }
  if (action.dataset.action === 'prototype-select-token') {
    const run = state.levelRun;
    if (!run || run.type !== 'construct-prototype' || run.checked || run.finished) return;
    selectPrototypeToken(run, Number(action.dataset.tokenIndex), action.dataset.slot || 'line', action.dataset.fractionId || null);
    save(); render(); return;
  }
  if (action.dataset.action === 'prototype-delete-selected') {
    const run = state.levelRun;
    if (!run || run.type !== 'construct-prototype' || run.checked || run.finished ||
        !Number.isInteger(run.selectedTokenIndex)) return;
    removePrototypeToken(run, run.selectedTokenIndex, run.selectedTokenSlot || 'line', run.selectedTokenFractionId || null);
    save(); render(); return;
  }
  if (action.dataset.action === 'prototype-give-up') {
    const run = state.levelRun;
    if (!run || run.type !== 'construct-prototype' || run.finished || ![1, 2].includes(run.levelId)) return;
    const solution = getPrototypeSolutionLines(run);
    if (!solution.length) return;
    run.completedLines = JSON.parse(JSON.stringify(solution));
    run.builtTokens = [];
    run.editingLineIndex = null;
    run.activeSlot = 'line';
    run.activeFractionId = null;
    run.selectedTokenIndex = null;
    run.selectedTokenSlot = 'line';
    run.selectedTokenFractionId = null;
    run.checked = false;
    run.finished = true;
    run.gaveUp = true;
    run.feedback = 'gave-up';
    run.showHint = false;
    save(); render(); return;
  }
  if (action.dataset.action === 'prototype-category') {
    const run = state.levelRun;
    if (!run || run.type !== 'construct-prototype' || run.finished) return;
    run.category = ['numbers', 'structures'].includes(action.dataset.category) ? action.dataset.category : 'symbols';
    save(); render(); return;
  }
  if (action.dataset.action === 'prototype-remove-token') {
    const run = state.levelRun;
    if (!run || run.type !== 'construct-prototype') return;
    removePrototypeToken(run, Number(action.dataset.tokenIndex), action.dataset.slot || 'line', action.dataset.fractionId || null);
    save(); render(); return;
  }
  if (action.dataset.action === 'prototype-undo') {
    const run = state.levelRun;
    if (!run || run.type !== 'construct-prototype' || !undoPrototypeToken(run)) return;
    save(); render(); return;
  }
  if (action.dataset.action === 'prototype-clear') {
    const run = state.levelRun;
    if (!run || run.type !== 'construct-prototype' || !clearPrototypeLine(run)) return;
    save(); render(); return;
  }
  if (action.dataset.action === 'prototype-hint') {
    const run = state.levelRun;
    if (!run || run.type !== 'construct-prototype' || run.finished) return;
    run.showHint = !run.showHint;
    save(); render(); return;
  }
  if (action.dataset.action === 'prototype-check') {
    const run = state.levelRun;
    if (!run || run.type !== 'construct-prototype' || run.finished || run.checked || !run.builtTokens.length) return;
    run.selectedTokenIndex = null;
    run.selectedTokenSlot = 'line';
    run.selectedTokenFractionId = null;
    const validation = validatePrototypeLine(run);
    run.checked = validation === 'correct';
    run.feedback = run.checked ? (isPrototypeFinalAnswer(run.builtTokens, run) ? 'final' : 'correct') : validation;
    save(); render(); return;
  }
  if (action.dataset.action === 'prototype-continue') {
    const run = state.levelRun;
    if (!run || run.type !== 'construct-prototype' || !run.checked || run.finished || run.editingLineIndex !== null) return;
    run.selectedTokenIndex = null;
    run.selectedTokenSlot = 'line';
    run.selectedTokenFractionId = null;
    run.completedLines.push(JSON.parse(JSON.stringify(run.builtTokens)));
    run.step = run.completedLines.length;
    run.builtTokens = [];
    run.activeSlot = 'line';
    run.activeFractionId = null;
    run.checked = false;
    run.feedback = '';
    run.showHint = false;
    save(); render(); return;
  }
  if (action.dataset.action === 'prototype-edit-line') {
    const run = state.levelRun;
    const index = Number(action.dataset.lineIndex);
    if (!run || run.type !== 'construct-prototype' || run.finished || run.checked ||
        !Number.isInteger(index) || index < 0 || index >= run.completedLines.length) return;
    run.selectedTokenIndex = null;
    run.selectedTokenSlot = 'line';
    run.selectedTokenFractionId = null;
    run.editingLineIndex = index;
    run.builtTokens = JSON.parse(JSON.stringify(run.completedLines[index]));
    run.activeSlot = 'line';
    run.activeFractionId = null;
    run.feedback = '';
    run.showHint = false;
    save(); render(); return;
  }
  if (action.dataset.action === 'prototype-delete-line') {
    const run = state.levelRun;
    const index = Number(action.dataset.lineIndex);
    if (!run || run.type !== 'construct-prototype' || run.finished || run.checked ||
        !Number.isInteger(index) || index < 0 || index >= run.completedLines.length) return;
    run.completedLines.splice(index, 1);
    if (run.editingLineIndex === index) {
      run.editingLineIndex = null;
      run.builtTokens = [];
    } else if (run.editingLineIndex !== null && run.editingLineIndex > index) {
      run.editingLineIndex -= 1;
    }
    run.step = run.completedLines.length;
    run.feedback = '';
    save(); render(); return;
  }
  if (action.dataset.action === 'prototype-cancel-edit') {
    const run = state.levelRun;
    if (!run || run.type !== 'construct-prototype' || run.editingLineIndex === null) return;
    run.editingLineIndex = null;
    run.builtTokens = [];
    run.activeSlot = 'line';
    run.activeFractionId = null;
    run.checked = false;
    run.feedback = '';
    save(); render(); return;
  }
  if (action.dataset.action === 'prototype-save-edit') {
    const run = state.levelRun;
    if (!run || run.type !== 'construct-prototype' || !run.checked ||
        run.editingLineIndex === null || !run.completedLines[run.editingLineIndex]) return;
    run.completedLines[run.editingLineIndex] = JSON.parse(JSON.stringify(run.builtTokens));
    run.editingLineIndex = null;
    run.builtTokens = [];
    run.activeSlot = 'line';
    run.activeFractionId = null;
    run.checked = false;
    run.feedback = 'correct';
    run.showHint = false;
    save(); render(); return;
  }
  if (action.dataset.action === 'prototype-finish') {
    const run = state.levelRun;
    if (!run || run.type !== 'construct-prototype' || !run.checked || !isPrototypeFinalAnswer(run.builtTokens, run)) return;
    if (run.editingLineIndex !== null && run.editingLineIndex >= 0) {
      run.completedLines[run.editingLineIndex] = JSON.parse(JSON.stringify(run.builtTokens));
    } else {
      run.completedLines.push(JSON.parse(JSON.stringify(run.builtTokens)));
    }
    run.editingLineIndex = null;
    run.builtTokens = [];
    run.activeSlot = 'line';
    run.activeFractionId = null;
    run.checked = false;
    run.finished = true;
    run.feedback = 'final';
    run.showHint = false;
    if (run.levelId && [1, 2].includes(run.levelId)) {
      if (!state.levelProgress.completed.includes(run.levelId)) state.levelProgress.completed.push(run.levelId);
      state.levelProgress.completed.sort((a, b) => a - b);
      state.levelProgress.bestScores[run.levelId] = 1;
    }
    save(); render(); return;
  }
  if (action.dataset.action === 'level-start') {
    startLevel(Number(action.dataset.levelId)); return;
  }
  if (action.dataset.action === 'level-select-pair') {
    const run = state.levelRun;
    if (!run || run.type !== 'matching' || run.submitted || run.finished) return;
    const pairId = action.dataset.pairId;
    if (run.selectedPiece) {
      placeLevelPiece(run, pairId, run.selectedPiece);
    } else {
      run.selectedPair = run.selectedPair === pairId ? null : pairId;
    }
    save(); render(); return;
  }
  if (action.dataset.action === 'level-select-piece') {
    const run = state.levelRun;
    if (!run || run.type !== 'matching' || run.submitted || run.finished) return;
    const pieceId = action.dataset.pieceId;
    if (run.selectedPair) {
      placeLevelPiece(run, run.selectedPair, pieceId);
    } else {
      run.selectedPiece = run.selectedPiece === pieceId ? null : pieceId;
    }
    save(); render(); return;
  }
  if (action.dataset.action === 'level-verify') {
    const run = state.levelRun;
    const level = run && gameLevels.find(item => item.id === run.levelId);
    if (!run || run.type !== 'matching' || !level || run.submitted || run.finished) return;
    const question = level.questions[run.order[run.index]];
    const complete = question.pairs.every(pair => !!run.matches[pair.id]) &&
      new Set(question.pairs.map(pair => run.matches[pair.id])).size === question.pairs.length;
    if (!complete) return;
    run.currentCorrect = question.pairs.every(pair => run.matches[pair.id] === pair.pieceId);
    run.answers[run.index] = run.currentCorrect;
    run.submitted = true;
    run.selectedPair = null;
    run.selectedPiece = null;
    save(); render(); return;
  }
  if (action.dataset.action === 'level-clear') {
    const run = state.levelRun;
    if (!run || run.type !== 'matching' || run.submitted) return;
    run.matches = {};
    run.selectedPair = null;
    run.selectedPiece = null;
    save(); render(); return;
  }
  if (action.dataset.action === 'level-next') {
    const run = state.levelRun;
    const level = run && gameLevels.find(item => item.id === run.levelId);
    if (!run || run.type !== 'matching' || !level || !run.submitted) return;
    if (run.index < level.questions.length - 1) {
      run.index += 1;
      run.matches = {};
      run.selectedPair = null;
      run.selectedPiece = null;
      run.submitted = false;
      run.currentCorrect = false;
      save(); render(); return;
    }
    run.score = scoreLevelRun(level);
    run.passed = run.score >= level.passMark;
    run.finished = true;
    state.levelProgress.bestScores[level.id] = Math.max(Number(state.levelProgress.bestScores[level.id] || 0), run.score);
    if (run.passed && !state.levelProgress.completed.includes(level.id)) state.levelProgress.completed.push(level.id);
    state.levelProgress.completed.sort((a, b) => a - b);
    save(); render(); return;
  }
  if (action.dataset.action === 'level-retry') {
    startLevel(Number(action.dataset.levelId)); return;
  }
  if (action.dataset.action === 'level-overview') {
    state.levelRun = null; save(); render(); return;
  }
  if (action.dataset.action === 'toggle-nav') {
    if (bottomNav.classList.contains('nav-hidden')) showBottomNav(true);
    else { clearTimeout(navHideTimer); hideBottomNav(); }
    return;
  }
  if (action.dataset.action === 'triangle-cell') {
    const card = action.closest('[data-triangle-card]');
    const triangle = triangleFormulas.find(item => item.id === action.dataset.triangleId);
    if (!card || !triangle) return;
    const alreadySelected = action.getAttribute('aria-pressed') === 'true';
    card.querySelectorAll('[data-action="triangle-cell"]').forEach(button => {
      const selected = !alreadySelected && button === action;
      button.classList.toggle('is-selected', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    const cell = alreadySelected ? '' : action.dataset.cell;
    const equation = card.querySelector('[data-triangle-equation]');
    const instruction = card.querySelector('[data-triangle-instruction]');
    if (equation) equation.textContent = formulaTriangleEquation(triangle, cell || 'top');
    if (instruction) instruction.textContent = formulaTriangleInstruction(triangle, cell);
    return;
  }
  if (action.dataset.action === 'shortcut-subject') {
    shortcutFilters.subject = action.dataset.value;
    updateShortcutFilters(); updateShortcutResults(); return;
  }
  if (action.dataset.action === 'shortcut-kind') {
    shortcutFilters.kind = action.dataset.value;
    updateShortcutFilters(); updateShortcutResults(); return;
  }
  if (action.dataset.action === 'shortcut-reset') {
    shortcutFilters = { subject: 'all', kind: 'all', search: '' };
    const search = document.querySelector('[data-shortcut-search]');
    if (search) search.value = '';
    updateShortcutFilters(); updateShortcutResults(); return;
  }
  if (action.dataset.action === 'open-expression-help') {
    const dialog=document.querySelector('.expression-help-backdrop');
    if(dialog){const equation=dialog.querySelector('#expression-help-equation');if(equation && action.dataset.expression) equation.innerHTML=formulaMarkup(action.dataset.expression);dialog.hidden=false;document.body.classList.add('dialog-open');dialog.querySelector('.expression-help-close')?.focus();}
    return;
  }
  if (action.dataset.action === 'close-expression-help') {
    const dialog=document.querySelector('.expression-help-backdrop');
    if(dialog && (event.target===dialog || event.target.closest('.expression-help-close'))){dialog.hidden=true;document.body.classList.remove('dialog-open');document.querySelector('[data-action="open-expression-help"]')?.focus();}
    return;
  }
  if (action.dataset.action === 'sequence-view') {
    state.sequenceView = action.dataset.view === 'continuous' ? 'continuous' : 'split';
    save(); render(); return;
  }
  if (action.dataset.action === 'jump-sequence') {
    document.getElementById(action.dataset.target)?.scrollIntoView({behavior:'smooth',block:'start'});
    return;
  }
  if (action.dataset.action === 'topic-lessons') {
    const module = moduleById[action.dataset.module];
    const dialog = document.querySelector('.topic-dialog-backdrop');
    const list = document.querySelector('#topic-dialog-lessons');
    if (!module || !dialog || !list) return;
    const lessons = module.lessonIds.map(id=>lessonById[id]).filter(Boolean);
    const dialogTitle = document.querySelector('#topic-dialog-title');
    if (dialogTitle) dialogTitle.textContent = t(module.title);
    const subject = module.id === 'sequences' ? 'math' : 'physics';
    list.innerHTML = lessons.map((lesson,index)=>`<a class="topic-dialog-lesson" href="${href(`lesson/${lesson.id}`)}"><span class="topic-dialog-number">${String(index+1).padStart(2,'0')}</span><span class="topic-dialog-copy"><strong>${e(t(lesson.title))}</strong><small>${e(t(lesson.kicker))}</small></span><span class="topic-dialog-time">${lesson.duration} ${e(ui('minutes'))}</span>${icon('arrow',17)}</a>`).join('');
    dialog.hidden = false;
    document.body.classList.add('dialog-open');
    dialog.querySelector('.topic-dialog-close')?.focus();
    return;
  }
  if (action.dataset.action === 'close-topic-dialog') {
    const dialog = document.querySelector('.topic-dialog-backdrop');
    if (dialog) dialog.hidden = true;
    document.body.classList.remove('dialog-open');
    document.querySelector('[data-action="topic-lessons"]')?.focus();
    return;
  }
  if (action.dataset.action === 'summary-import-open') {
    if (summaryImportBusy) return;
    document.querySelector('[data-import-input]')?.click();
    return;
  }
  if (action.dataset.action === 'summary-import-camera') {
    if (summaryImportBusy) return;
    document.querySelector('[data-import-camera]')?.click();
    return;
  }
  if (action.dataset.action === 'summary-example') {
    const isPt = lang() === 'pt';
    if (!drafts.summaryTitle.trim()) drafts.summaryTitle = isPt ? 'Cinemática — velocidade e aceleração' : 'Kinematics — velocity and acceleration';
    drafts.summarySubject = 'physics';
    drafts.summaryText = summaryExampleText(isPt);
    drafts.summarySources = [];
    summaryNoticeState.value = { tone: 'ok', message: isPt ? 'Exemplo preenchido. Revê o texto e clica em «Organizar resumo».' : 'Example filled. Review the text and click “Organise summary”.' };
    render();
    const composer = document.querySelector('.study-composer');
    composer?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    document.querySelector('[data-summary-text]')?.focus({ preventScroll: true });
    return;
  }
  if (action.dataset.action === 'summary-reset') {
    drafts.summaryTitle = '';
    drafts.summarySubject = 'general';
    drafts.summaryText = '';
    drafts.summarySources = [];
    summaryNoticeState.value = null;
    render();
    document.querySelector('[data-summary-text]')?.focus({ preventScroll: true });
    return;
  }
  if (action.dataset.action === 'summary-create') {
    const isPt = lang() === 'pt';
    const text = drafts.summaryText.trim();
    summaryNoticeState.value = null;
    if (text.length < 120) {
      summaryNoticeState.value = { tone: 'error', message: isPt ? `Faltam caracteres: tens ${text.length} de 120. Escreve pelo menos duas frases completas.` : `Not enough text: you have ${text.length} of 120. Write at least two full sentences.` };
      render();
      document.querySelector('[data-summary-text]')?.focus({ preventScroll: true });
      return;
    }
    const subject = SUMMARY_SUBJECTS.includes(drafts.summarySubject) ? drafts.summarySubject : 'general';
    const analysis = analyzeSummary({ text, title: drafts.summaryTitle.trim(), subject, lessons: lessonSearchEntries() });
    if (analysis.insufficient) {
      summaryNoticeState.value = { tone: 'error', message: isPt ? 'Preciso de pelo menos duas frases completas. Separa as ideias com pontos finais e tenta outra vez.' : 'I need at least two full sentences. Separate ideas with full stops and try again.' };
      render();
      document.querySelector('[data-summary-text]')?.focus({ preventScroll: true });
      return;
    }
    const id = `s-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
    const record = {
      id,
      title: String(drafts.summaryTitle.trim() || analysis.title || (isPt ? 'Resumo sem título' : 'Untitled summary')).slice(0, 90),
      subject,
      text,
      sources: drafts.summarySources.slice(0, 8),
      createdAt: new Date().toISOString(),
      progress: { cardIndex: 0, reveal: false, known: [], review: [], quizAnswers: {}, quizChecked: false },
    };
    state.summaries.unshift(record);
    if (state.summaries.length > 40) state.summaries = state.summaries.slice(0, 40);
    if (!save()) {
      state.summaries = state.summaries.filter((item) => item.id !== id);
      summaryNoticeState.value = { tone: 'error', message: isPt ? 'O navegador recusou o armazenamento local. Liberta espaço ou permite dados deste site e tenta outra vez.' : 'The browser refused local storage. Free some space or allow site data and try again.' };
      render();
      return;
    }
    summaryTabs[id] = 'explain';
    drafts.summaryTitle = '';
    drafts.summarySubject = 'general';
    drafts.summaryText = '';
    drafts.summarySources = [];
    summaryNoticeState.value = null;
    planNoticeState.value = null;
    location.hash = `#summary/${id}`;
    toast(isPt ? 'Resumo guardado neste dispositivo.' : 'Summary saved on this device.');
    return;
  }
  if (action.dataset.action === 'summary-delete') {
    const isPt = lang() === 'pt';
    const record = state.summaries.find((item) => item.id === action.dataset.id);
    if (!record) return;
    if (!window.confirm(isPt ? `Apagar «${record.title}» deste dispositivo? Esta acção não pode ser desfeita.` : `Delete “${record.title}” from this device? This cannot be undone.`)) return;
    const previous = state.summaries;
    state.summaries = state.summaries.filter((item) => item.id !== record.id);
    state.planDone = state.planDone.filter((key) => !key.includes(`summary:${record.id}`));
    if (!save()) {
      state.summaries = previous;
      toast(isPt ? 'Não foi possível apagar. Tenta outra vez.' : 'Could not delete. Try again.');
      return;
    }
    delete summaryTabs[record.id];
    delete summaryWikiState[record.id];
    if (route().page === 'summary' && route().id === record.id) location.hash = '#summaries';
    else render();
    toast(isPt ? 'Resumo apagado.' : 'Summary deleted.');
    return;
  }
  if (action.dataset.action === 'summary-tab') {
    const id = route().id;
    const tab = ['explain', 'world', 'map', 'cards', 'methods', 'quiz', 'audio'].includes(action.dataset.tab) ? action.dataset.tab : 'explain';
    if (!state.summaries.some((record) => record.id === id)) return;
    summaryTabs[id] = tab;
    render();
    document.querySelector(`#summary-tab-${tab}`)?.focus({ preventScroll: true });
    return;
  }
  if (action.dataset.action === 'summary-open-audio') {
    const id = route().id;
    if (!state.summaries.some((record) => record.id === id)) return;
    summaryTabs[id] = 'audio';
    render();
    document.querySelector('.summary-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    document.querySelector('#summary-tab-audio')?.focus({ preventScroll: true });
    return;
  }
  if (action.dataset.action === 'summary-wiki-load') {
    const id = route().id;
    if (!state.summaries.some((record) => record.id === id)) return;
    loadSummaryWikipedia(id, action.dataset.term || '');
    return;
  }
  if (action.dataset.action === 'summary-wiki-remove') {
    const record = state.summaries.find((item) => item.id === route().id);
    if (!record || !record.external) return;
    const previous = record.external;
    record.external = null;
    if (!save()) {
      record.external = previous;
      toast(lang() === 'pt' ? 'Não foi possível remover o conteúdo guardado.' : 'Could not remove the saved content.');
      return;
    }
    render();
    toast(lang() === 'pt' ? 'Conteúdo da Wikipédia removido deste dispositivo.' : 'Wikipedia content removed from this device.');
    return;
  }
  if (action.dataset.action === 'summary-map-download') {
    const record = state.summaries.find((item) => item.id === route().id);
    if (!record) return;
    const isPt = lang() === 'pt';
    const map = buildMindMap(analyzeRecord(record), { title: record.title, lang: lang() });
    const svg = `<?xml version="1.0" encoding="UTF-8"?>\n${mindMapSvg(map, { e, lang: lang() })}`;
    const slug = record.title.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'mapa-mental';
    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${slug}-mapa.svg`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
    toast(isPt ? 'Mapa mental descarregado em SVG.' : 'Mind map downloaded as SVG.');
    return;
  }
  if (['summary-card-reveal', 'summary-card-known', 'summary-card-review', 'summary-card-reset'].includes(action.dataset.action)) {
    const record = state.summaries.find((item) => item.id === route().id);
    if (!record) return;
    if (action.dataset.action === 'summary-card-reset') {
      record.progress = { ...record.progress, cardIndex: 0, reveal: false, known: [], review: [] };
      save(); render(); return;
    }
    if (action.dataset.action === 'summary-card-reveal') {
      record.progress.reveal = true;
      save(); render();
      document.querySelector('[data-action="summary-card-known"]')?.focus({ preventScroll: true });
      return;
    }
    const cards = analyzeRecord(record).cards || [];
    const index = Math.max(0, Number(record.progress.cardIndex) || 0);
    if (index >= cards.length) return;
    const isKnown = action.dataset.action === 'summary-card-known';
    const keep = isKnown ? record.progress.known : record.progress.review;
    const other = isKnown ? record.progress.review : record.progress.known;
    if (!keep.includes(index)) keep.push(index);
    const removeAt = other.indexOf(index);
    if (removeAt !== -1) other.splice(removeAt, 1);
    record.progress.cardIndex = index + 1;
    record.progress.reveal = false;
    save(); render();
    return;
  }
  if (['summary-quiz-option', 'summary-quiz-check', 'summary-quiz-reset'].includes(action.dataset.action)) {
    const record = state.summaries.find((item) => item.id === route().id);
    if (!record) return;
    if (action.dataset.action === 'summary-quiz-reset') {
      record.progress.quizAnswers = {};
      record.progress.quizChecked = false;
      save(); render(); return;
    }
    if (action.dataset.action === 'summary-quiz-check') {
      if (record.progress.quizChecked) return;
      const quiz = analyzeRecord(record).quiz || [];
      if (quiz.some((question) => !Number.isInteger(record.progress.quizAnswers[question.id]))) return;
      record.progress.quizChecked = true;
      save(); render(); return;
    }
    if (record.progress.quizChecked) return;
    const questionId = action.dataset.question;
    const optionIndex = Number(action.dataset.option);
    if (!questionId || !Number.isInteger(optionIndex)) return;
    record.progress.quizAnswers[questionId] = optionIndex;
    save(); render();
    document.querySelector(`[data-action="summary-quiz-option"][data-question="${questionId}"][data-option="${optionIndex}"]`)?.focus({ preventScroll: true });
    return;
  }
  if (action.dataset.action === 'plan-example') {
    const isPt = lang() === 'pt';
    drafts.programmeText = programmeExample(lang());
    planNoticeState.value = { tone: 'ok', message: isPt ? 'Exemplo preenchido. Clica em «Ler calendário» para gerar o plano.' : 'Example filled. Click “Read calendar” to build the plan.' };
    render();
    document.querySelector('[data-plan-text]')?.focus({ preventScroll: true });
    return;
  }
  if (action.dataset.action === 'plan-parse') {
    const isPt = lang() === 'pt';
    const text = drafts.programmeText.trim();
    if (!text) {
      planNoticeState.value = { tone: 'error', message: isPt ? 'Cola pelo menos uma linha com uma data ou um horário semanal.' : 'Paste at least one line with a date or weekly timetable.' };
      render();
      document.querySelector('[data-plan-text]')?.focus({ preventScroll: true });
      return;
    }
    const parsed = parseProgramme(text, { now: new Date() });
    if (!parsed.events.length && !parsed.weekly.length) {
      planNoticeState.value = { tone: 'error', message: isPt ? 'Não encontrei datas nem horários reconhecíveis. Usa, por exemplo, «Exame de Física — 05/11/2026 às 09:00» ou «segunda 08:00-10:00».' : 'I found no recognisable dates or timetables. Try “Physics exam — 05/11/2026 at 09:00” or “Monday 08:00-10:00”.' };
      render();
      document.querySelector('[data-plan-text]')?.focus({ preventScroll: true });
      return;
    }
    const previousProgramme = state.programme;
    const previousDone = state.planDone;
    state.programme = {
      text,
      events: parsed.events,
      weekly: parsed.weekly,
      unparsed: parsed.unparsed,
      stats: parsed.stats,
      parsedAt: parsed.parsedAt,
    };
    const plan = currentPlan();
    const validKeys = new Set(plan.sessions.map((session) => session.key));
    state.planDone = state.planDone.filter((key) => validKeys.has(key));
    if (!save()) {
      state.programme = previousProgramme;
      state.planDone = previousDone;
      planNoticeState.value = { tone: 'error', message: isPt ? 'O navegador recusou o armazenamento local. Tenta novamente com menos texto.' : 'The browser refused local storage. Try again with less text.' };
      render();
      return;
    }
    planNoticeState.value = {
      tone: 'ok',
      message: isPt
        ? `${parsed.events.length} datas e ${parsed.weekly.length} aulas semanais lidas. ${plan.sessions.length} sessões sugeridas. Confirma sempre as datas oficiais.`
        : `${parsed.events.length} dates and ${parsed.weekly.length} weekly classes read. ${plan.sessions.length} suggested sessions. Always confirm official dates.`,
    };
    render();
    document.querySelector('.plan-workspace')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }
  if (action.dataset.action === 'plan-clear') {
    const isPt = lang() === 'pt';
    if (!state.programme.parsedAt && !drafts.programmeText.trim()) return;
    if (!window.confirm(isPt ? 'Limpar o calendário colado e o plano gerado? Os resumos e o progresso das lições mantêm-se.' : 'Clear the pasted calendar and generated plan? Summaries and lesson progress stay.')) return;
    const previousProgramme = state.programme;
    const previousDone = state.planDone;
    state.programme = emptyProgramme();
    state.planDone = [];
    drafts.programmeText = '';
    if (!save()) {
      state.programme = previousProgramme;
      state.planDone = previousDone;
      toast(isPt ? 'Não foi possível guardar a alteração.' : 'Could not save the change.');
      return;
    }
    planNoticeState.value = { tone: 'ok', message: isPt ? 'Calendário removido. O plano volta a seguir as lições por concluir.' : 'Calendar cleared. The plan follows your unfinished lessons again.' };
    render();
    return;
  }
  if (action.dataset.action === 'plan-toggle-session') {
    const key = action.dataset.key;
    if (!key) return;
    if (state.planDone.includes(key)) state.planDone = state.planDone.filter((item) => item !== key);
    else state.planDone.push(key);
    save(); render();
    return;
  }
  if (action.dataset.action === 'plan-export') {
    const plan = currentPlan();
    const ics = buildIcs({ events: state.programme.events, weekly: state.programme.weekly, sessions: plan.sessions, now: new Date() });
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ingenium-plano.ics';
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
    toast(lang() === 'pt' ? 'Ficheiro .ics gerado. Abre-o no teu calendário.' : '.ics file generated. Open it in your calendar.');
    return;
  }
  if (action.dataset.action === 'class-tab') {
    const tab = ['board', 'materials', 'programme', 'groups', 'teach'].includes(action.dataset.tab) ? action.dataset.tab : 'board';
    classroomTab = tab;
    classroomNoticeState.value = null;
    if (location.hash !== `#classroom/${tab}`) history.replaceState(null, '', `#classroom/${tab}`);
    render();
    document.querySelector(`#class-tab-${tab}`)?.focus({ preventScroll: true });
    return;
  }
  if (action.dataset.action === 'class-pack-open') {
    if (classroomFileBusy) return;
    openClassFile('pack');
    return;
  }
  if (action.dataset.action === 'class-file-open') {
    if (classroomFileBusy) return;
    openClassFile(action.dataset.target === 'programme' ? 'programme' : 'material');
    return;
  }
  if (action.dataset.action === 'class-pack-export') {
    const isPt = lang() === 'pt';
    downloadClassFile(JSON.stringify(buildClassPack(state.classroom), null, 2), packFileName(state.classroom));
    toast(isPt ? 'Pacote .json transferido. Envia-o aos colegas.' : '.json pack downloaded. Send it to classmates.');
    return;
  }
  if (action.dataset.action === 'class-pack-share') {
    shareClassPack();
    return;
  }
  if (action.dataset.action === 'class-code-copy') {
    const isPt = lang() === 'pt';
    if (!state.classroom.code) {
      toast(isPt ? 'Ainda não há código. Guarda a turma para gerar um.' : 'No code yet. Save the class to generate one.');
      return;
    }
    copyToClipboard(state.classroom.code).then((ok) => {
      toast(ok
        ? (isPt ? `Código ${state.classroom.code} copiado.` : `Code ${state.classroom.code} copied.`)
        : (isPt ? 'Não consegui copiar. Seleciona o código manualmente.' : 'Could not copy. Select the code manually.'));
    });
    return;
  }
  if (action.dataset.action === 'class-notice-pin') {
    const notice = state.classroom.notices.find((item) => item.id === action.dataset.id);
    if (!notice) return;
    const isPt = lang() === 'pt';
    commitClassroom({
      ...state.classroom,
      notices: state.classroom.notices.map((item) => item.id === notice.id ? { ...item, pinned: !item.pinned } : item),
    }, isPt
      ? (notice.pinned ? 'Aviso desafixado.' : 'Aviso fixado no topo.')
      : (notice.pinned ? 'Notice unpinned.' : 'Notice pinned to the top.'));
    return;
  }
  if (action.dataset.action === 'class-notice-delete') {
    const isPt = lang() === 'pt';
    const notice = state.classroom.notices.find((item) => item.id === action.dataset.id);
    if (!notice) return;
    if (!window.confirm(isPt ? `Apagar o aviso «${notice.title}»?` : `Delete the notice “${notice.title}”?`)) return;
    commitClassroom({ ...state.classroom, notices: state.classroom.notices.filter((item) => item.id !== notice.id) }, isPt ? 'Aviso apagado.' : 'Notice deleted.');
    return;
  }
  if (action.dataset.action === 'class-material-delete') {
    const isPt = lang() === 'pt';
    const material = state.classroom.materials.find((item) => item.id === action.dataset.id);
    if (!material) return;
    if (!window.confirm(isPt ? `Apagar «${material.title}» dos materiais?` : `Delete “${material.title}” from materials?`)) return;
    commitClassroom({ ...state.classroom, materials: state.classroom.materials.filter((item) => item.id !== material.id) }, isPt ? 'Material apagado.' : 'Material deleted.');
    return;
  }
  if (action.dataset.action === 'class-material-copy') {
    const isPt = lang() === 'pt';
    const material = state.classroom.materials.find((item) => item.id === action.dataset.id);
    if (!material?.text) return;
    copyToClipboard(material.text).then((ok) => {
      toast(ok ? (isPt ? 'Texto copiado.' : 'Text copied.') : (isPt ? 'Não consegui copiar o texto.' : 'Could not copy the text.'));
    });
    return;
  }
  if (action.dataset.action === 'class-material-summarize') {
    const isPt = lang() === 'pt';
    const material = state.classroom.materials.find((item) => item.id === action.dataset.id);
    if (!material?.text) return;
    drafts.summaryTitle = material.title;
    drafts.summarySubject = SUMMARY_SUBJECTS.includes(material.subject) ? material.subject : 'general';
    drafts.summaryText = material.text;
    drafts.summarySources = material.fileName ? [{
      name: material.fileName,
      kind: /\.pdf$/i.test(material.fileName) ? 'pdf' : 'image',
      method: 'text',
      size: material.size,
      hash: material.hash,
      importedAt: material.createdAt,
    }] : [];
    summaryNoticeState.value = {
      tone: 'ok',
      message: isPt
        ? 'Material da turma carregado. Revê o texto e clica em «Organizar resumo» — fica só neste dispositivo.'
        : 'Class material loaded. Review the text and click “Organise summary” — it stays on this device.',
    };
    if (route().page === 'summaries') render();
    else location.hash = '#summaries';
    setTimeout(() => document.querySelector('[data-summary-text]')?.focus({ preventScroll: true }), 60);
    return;
  }
  if (action.dataset.action === 'class-programme-plan') {
    const isPt = lang() === 'pt';
    const roomProgramme = state.classroom.programme;
    if (!roomProgramme?.events?.length && !roomProgramme?.weekly?.length) {
      classroomNoticeState.value = { tone: 'error', message: isPt ? 'Ainda não há datas lidas no programa da turma.' : 'There are no dates read from the class programme yet.' };
      render();
      return;
    }
    if (state.programme.parsedAt && state.programme.text.trim() && state.programme.text.trim() !== roomProgramme.text.trim()
      && !window.confirm(isPt ? 'Substituir o plano de estudo atual pelo programa da turma?' : 'Replace the current study plan with the class programme?')) return;
    const previousProgramme = state.programme;
    const previousDone = state.planDone;
    state.programme = {
      text: roomProgramme.text,
      events: roomProgramme.events,
      weekly: roomProgramme.weekly,
      unparsed: [],
      stats: roomProgramme.stats,
      parsedAt: roomProgramme.parsedAt || new Date().toISOString(),
    };
    state.planDone = [];
    drafts.programmeText = roomProgramme.text;
    if (!save()) {
      state.programme = previousProgramme;
      state.planDone = previousDone;
      classroomNoticeState.value = { tone: 'error', message: classroomStorageMessage() };
      render();
      return;
    }
    planNoticeState.value = {
      tone: 'ok',
      message: isPt ? 'Programa da turma aberto no plano de estudo. Confirma sempre as datas oficiais.' : 'Class programme opened in the study plan. Always confirm official dates.',
    };
    location.hash = '#planner';
    return;
  }
  if (action.dataset.action === 'class-programme-clear') {
    const isPt = lang() === 'pt';
    if (!state.classroom.programme?.text) return;
    if (!window.confirm(isPt ? 'Limpar o programa da turma? O plano de estudo pessoal não é alterado.' : 'Clear the class programme? The personal study plan is not changed.')) return;
    commitClassroom({
      ...state.classroom,
      programme: { text: '', sourceName: '', updatedAt: null, events: [], weekly: [], stats: { events: 0, weekly: 0 }, parsedAt: null },
    }, isPt ? 'Programa da turma limpo.' : 'Class programme cleared.');
    return;
  }
  if (action.dataset.action === 'class-group-join') {
    const isPt = lang() === 'pt';
    const owner = String(state.classroom.owner || '').trim();
    const group = state.classroom.groups.find((item) => item.id === action.dataset.id);
    if (!group) return;
    if (!owner) {
      classroomNoticeState.value = { tone: 'error', message: isPt ? 'Escreve o teu nome em «Editar turma» antes de entrares num grupo.' : 'Add your name in “Edit class” before joining a group.' };
      render();
      return;
    }
    const key = owner.toLowerCase();
    const joined = group.members.some((name) => name.toLowerCase() === key);
    let members;
    if (joined) members = group.members.filter((name) => name.toLowerCase() !== key);
    else if (group.members.length >= group.capacity) {
      toast(isPt ? 'Este grupo já está cheio.' : 'This group is already full.');
      return;
    } else members = [...group.members, owner];
    commitClassroom({
      ...state.classroom,
      groups: state.classroom.groups.map((item) => item.id === group.id ? { ...item, members } : item),
    }, joined
      ? (isPt ? `Saíste de «${group.title}».` : `You left “${group.title}”.`)
      : (isPt ? `Entraste em «${group.title}».` : `You joined “${group.title}”.`));
    return;
  }
  if (action.dataset.action === 'class-group-delete') {
    const isPt = lang() === 'pt';
    const group = state.classroom.groups.find((item) => item.id === action.dataset.id);
    if (!group) return;
    if (!window.confirm(isPt ? `Apagar o grupo «${group.title}»?` : `Delete the group “${group.title}”?`)) return;
    commitClassroom({ ...state.classroom, groups: state.classroom.groups.filter((item) => item.id !== group.id) }, isPt ? 'Grupo apagado.' : 'Group deleted.');
    return;
  }
  if (action.dataset.action === 'class-member-delete') {
    const isPt = lang() === 'pt';
    const name = action.dataset.name || '';
    if (!name) return;
    commitClassroom({ ...state.classroom, members: state.classroom.members.filter((member) => member.name !== name) }, isPt ? 'Colega removido da lista.' : 'Classmate removed from the list.');
    return;
  }
  if (action.dataset.action === 'present-prev' || action.dataset.action === 'present-next') {
    if (route().page !== 'present') return;
    const delta = action.dataset.action === 'present-next' ? 1 : -1;
    presentationSlide = Math.max(0, Math.min(Math.max(0, presentationSlideCount - 1), presentationSlide + delta));
    render();
    return;
  }
  if (action.dataset.action === 'present-exit') {
    if (route().page === 'present') {
      event.preventDefault();
      location.hash = '#classroom';
    }
    return;
  }
  const lessonId = action.dataset.lesson || route().id;
  if (action.dataset.action === 'next-step') {
    const lesson = lessonById[lessonId];
    if (!lesson) return;
    state.stepAt[lessonId] = Math.min(lesson.example.steps.length, Number(state.stepAt[lessonId] || 1) + 1);
    save(); render();
  } else if (action.dataset.action === 'restart-example') {
    state.stepAt[lessonId] = 1; save(); render();
  } else if (action.dataset.action === 'answer') {
    if (!Number.isInteger(state.answers[lessonId])) {
      state.answers[lessonId] = Number(action.dataset.choice); save(); render();
    }
  } else if (action.dataset.action === 'retry-answer') {
    delete state.answers[lessonId]; save(); render();
  } else if (action.dataset.action === 'complete') {
    if (state.completed.includes(lessonId)) state.completed = state.completed.filter(id=>id!==lessonId);
    else state.completed.push(lessonId);
    save(); render(); toast(state.completed.includes(lessonId)?(lang()==='pt'?'Lição concluída. Mais um nó na rota.':'Lesson complete. One more node on the path.'):(lang()==='pt'?'Lição reaberta para revisão.':'Lesson reopened for review.'));
  } else if (action.dataset.action === 'reset-progress') {
    if (window.confirm(ui('resetConfirm'))) {
      state.completed=[]; state.answers={}; state.stepAt={}; state.lastLesson=course.lessons[0].id; save(); render(); toast(ui('resetDone'));
    }
  }
});

document.addEventListener('input', event => {
  const target = event.target;
  if (target.matches('[data-shortcut-search]')) {
    shortcutFilters.search = target.value;
    updateShortcutResults();
    return;
  }
  if (target.matches('[data-summary-title]')) {
    drafts.summaryTitle = target.value;
    return;
  }
  if (target.matches('[data-summary-text]')) {
    drafts.summaryText = target.value;
    if (!target.value.trim()) drafts.summarySources = [];
    updateSummaryCounter();
    return;
  }
  if (target.matches('[data-plan-text]')) {
    drafts.programmeText = target.value;
    updatePlanCounter();
  }
});
document.addEventListener('submit', (event) => {
  const form = event.target.closest?.('[data-class-form]');
  if (!form) return;
  event.preventDefault();
  const kind = form.dataset.classForm;
  const isPt = lang() === 'pt';
  const data = new FormData(form);
  const value = (name) => String(data.get(name) ?? '').trim();

  if (kind === 'profile') {
    const name = value('name');
    const owner = value('owner');
    if (!name || !owner) {
      classroomNoticeState.value = { tone: 'error', message: isPt ? 'Preenche o nome da turma e o teu nome.' : 'Fill in the class name and your name.' };
      render();
      return;
    }
    const codeRaw = value('code').toUpperCase().replace(/[^A-Z0-9-]/g, '').slice(0, 24);
    const code = /^[A-Z0-9-]{3,24}$/.test(codeRaw) ? codeRaw : makeClassCode(name);
    const previousOwner = state.classroom.owner.trim().toLowerCase();
    const nextOwnerKey = owner.toLowerCase();
    const groups = state.classroom.groups.map((group) => {
      if (!previousOwner || previousOwner === nextOwnerKey) return group;
      return { ...group, members: group.members.map((member) => member.toLowerCase() === previousOwner ? owner : member) };
    });
    commitClassroom({
      ...state.classroom,
      name,
      institution: value('institution'),
      course: value('course'),
      year: value('year'),
      owner,
      role: data.get('role') === 'teacher' ? 'teacher' : 'student',
      code,
      groups,
    }, isPt ? 'Turma guardada neste dispositivo.' : 'Class saved on this device.');
    return;
  }

  if (kind === 'notice') {
    const notice = normalizeNotice({
      id: newId(),
      kind: data.get('kind'),
      title: value('title'),
      body: value('body'),
      dueAt: value('dueAt') || null,
      pinned: data.get('pinned') === 'on',
      createdAt: new Date().toISOString(),
      author: state.classroom.owner,
      role: state.classroom.role,
    });
    if (!notice) {
      classroomNoticeState.value = { tone: 'error', message: isPt ? 'O aviso precisa de um título.' : 'The notice needs a title.' };
      render();
      return;
    }
    commitClassroom({ ...state.classroom, notices: [notice, ...state.classroom.notices] }, isPt ? 'Aviso publicado no mural.' : 'Notice posted to the board.');
    return;
  }

  if (kind === 'material') {
    const material = normalizeMaterial({
      id: newId(),
      kind: data.get('kind'),
      subject: data.get('subject'),
      title: value('title'),
      description: value('description'),
      link: value('link'),
      text: value('text'),
      createdAt: new Date().toISOString(),
      author: state.classroom.owner,
      role: state.classroom.role,
    });
    if (!material) {
      classroomNoticeState.value = { tone: 'error', message: isPt ? 'O material precisa de um título e de texto ou um link válido (https://).' : 'The material needs a title and text or a valid link (https://).' };
      render();
      return;
    }
    commitClassroom({ ...state.classroom, materials: [material, ...state.classroom.materials] }, isPt ? 'Material adicionado à turma.' : 'Material added to the class.');
    return;
  }

  if (kind === 'programme') {
    const text = String(data.get('programme') ?? '').trim();
    if (text.length < 6) {
      classroomNoticeState.value = { tone: 'error', message: isPt ? 'Cola o programa do semestre antes de o ler.' : 'Paste the semester programme before reading it.' };
      render();
      return;
    }
    const applied = applyClassProgramme(text, state.classroom.programme?.sourceName || '');
    if (applied.error) {
      classroomNoticeState.value = { tone: 'error', message: applied.error };
      render();
      return;
    }
    const parsed = applied.parsed;
    classroomNoticeState.value = {
      tone: 'ok',
      message: isPt
        ? `Programa lido: ${parsed.events.length} datas e ${parsed.weekly.length} aulas semanais. Confirma sempre as datas oficiais.`
        : `Programme read: ${parsed.events.length} dates and ${parsed.weekly.length} weekly classes. Always confirm official dates.`,
    };
    classroomTab = 'programme';
    render();
    return;
  }

  if (kind === 'group') {
    const owner = state.classroom.owner.trim();
    const group = normalizeStudyGroup({
      id: newId(),
      title: value('title'),
      topic: value('topic'),
      when: value('when'),
      place: value('place'),
      capacity: value('capacity'),
      members: owner ? [owner] : [],
      createdAt: new Date().toISOString(),
      author: owner,
    });
    if (!group) {
      classroomNoticeState.value = { tone: 'error', message: isPt ? 'O grupo precisa de um nome.' : 'The group needs a name.' };
      render();
      return;
    }
    commitClassroom({ ...state.classroom, groups: [group, ...state.classroom.groups] }, isPt ? `Grupo «${group.title}» criado.` : `Group “${group.title}” created.`);
    return;
  }

  if (kind === 'member') {
    const member = normalizeMember({ name: value('name'), role: data.get('role'), joinedAt: new Date().toISOString() });
    if (!member) {
      classroomNoticeState.value = { tone: 'error', message: isPt ? 'Escreve o nome do colega.' : 'Write the classmate’s name.' };
      render();
      return;
    }
    if (state.classroom.members.some((item) => item.name.toLowerCase() === member.name.toLowerCase())) {
      classroomNoticeState.value = { tone: 'error', message: isPt ? 'Esse colega já está na lista.' : 'That classmate is already on the list.' };
      render();
      return;
    }
    commitClassroom({ ...state.classroom, members: [...state.classroom.members, member] }, isPt ? 'Colega adicionado à lista da turma.' : 'Classmate added to the class list.');
  }
});

document.addEventListener('change', event => {
  if (event.target.matches('[data-class-file]')) {
    const [file] = [...(event.target.files || [])];
    const target = event.target.dataset.classFile;
    event.target.value = '';
    if (!file) return;
    if (target === 'pack') importClassPack(file);
    else if (target === 'material') handleClassMaterialFile(file);
    else if (target === 'programme') handleClassProgrammeFile(file);
    return;
  }
  if (event.target.matches('[data-import-input], [data-import-camera]')) {
    const files = [...(event.target.files || [])];
    event.target.value = '';
    if (files.length) handleImportFiles(files);
    return;
  }
  if (event.target.matches('[data-summary-subject]')) {
    drafts.summarySubject = SUMMARY_SUBJECTS.includes(event.target.value) ? event.target.value : 'general';
  }
});
document.addEventListener('dragover', (event) => {
  const zone = event.target.closest?.('[data-import-drop]');
  if (!zone) return;
  event.preventDefault();
  if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy';
  zone.classList.add('is-dragging');
});
document.addEventListener('dragleave', (event) => {
  const zone = event.target.closest?.('[data-import-drop]');
  if (!zone) return;
  if (event.relatedTarget && zone.contains(event.relatedTarget)) return;
  zone.classList.remove('is-dragging');
});
document.addEventListener('drop', (event) => {
  const files = [...(event.dataTransfer?.files || [])];
  if (!files.length) return;
  const zone = event.target.closest?.('[data-import-drop]');
  event.preventDefault();
  if (!zone) return;
  zone.classList.remove('is-dragging');
  handleImportFiles(files);
});
app.addEventListener('keydown', (event) => {
  const tab = event.target.closest?.('[data-action="summary-tab"]');
  if (!tab || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
  const tabs = [...tab.closest('[role="tablist"]').querySelectorAll('[data-action="summary-tab"]')];
  if (!tabs.length) return;
  const index = tabs.indexOf(tab);
  const nextIndex = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
  event.preventDefault();
  tabs[nextIndex].focus();
  tabs[nextIndex].click();
});

window.addEventListener('hashchange', () => { render(true); showBottomNav(true); });

// Reveal navigation only after a deliberate double-tap/click on a non-interactive surface.
// Scrolling and ordinary taps on lesson content should never bring it back.
let lastPlainTapAt = 0;
let lastPlainTapX = 0;
let lastPlainTapY = 0;
const isPlainSurface = (target) => target instanceof Element
  && !target.closest('a, button, input, textarea, select, summary, label, [role="button"], [role="link"], [data-action], .bottom-nav, .topbar, .nav-toggle');
function handlePlainDoubleTap(event) {
  if (!isPlainSurface(event.target)) {
    lastPlainTapAt = 0;
    return;
  }
  const touch = event.changedTouches?.[0];
  const x = touch ? touch.clientX : event.clientX;
  const y = touch ? touch.clientY : event.clientY;
  const now = Date.now();
  const closeToPreviousTap = Math.hypot(x - lastPlainTapX, y - lastPlainTapY) < 34;
  if (now - lastPlainTapAt < 360 && closeToPreviousTap) {
    showBottomNav(true);
    lastPlainTapAt = 0;
  } else {
    lastPlainTapAt = now;
    lastPlainTapX = x;
    lastPlainTapY = y;
  }
}
window.addEventListener('touchend', handlePlainDoubleTap, {passive:true});
window.addEventListener('dblclick', (event) => {
  if (isPlainSurface(event.target)) showBottomNav(true);
});

window.addEventListener('resize', () => showBottomNav(false));
if (!location.hash) history.replaceState(null,'','#home');
setTimeout(() => { booted=true; render(true); showBottomNav(true); }, 360);
