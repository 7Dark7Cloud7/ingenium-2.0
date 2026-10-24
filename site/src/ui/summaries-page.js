import { buildLearningMethods, buildMindMap } from '../study/learning-methods.js';
import { formatFileSize, sourceLabel } from '../study/file-import.js';
import { buildConceptLens } from '../study/concept-lens.js';
import { continuityCopy } from '../study/summary-thread.js';
import { mindMapSvg } from './mind-map.js';

const SUBJECTS = ['general', 'math', 'physics', 'algebra', 'chemistry'];

export function subjectLabel(subject, lang = 'pt') {
  const labels = {
    pt: { general: 'Geral', math: 'Matemática', physics: 'Física', algebra: 'ALGA', chemistry: 'Química' },
    en: { general: 'General', math: 'Mathematics', physics: 'Physics', algebra: 'ALGA', chemistry: 'Chemistry' },
  };
  return labels[lang === 'en' ? 'en' : 'pt'][subject] || labels.pt.general;
}

function formatDate(value, lang) {
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat(lang === 'en' ? 'en-GB' : 'pt-PT', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
}

function plural(value, one, many, lang) {
  return lang === 'en' ? (value === 1 ? one : many) : (value === 1 ? one : many);
}

function summaryCardMeta(analysis, lang) {
  const isPt = lang !== 'en';
  return [
    `${analysis.stats.words} ${isPt ? 'palavras' : 'words'}`,
    `${analysis.stats.readingMinutes} ${isPt ? 'min' : 'min'}`,
    `${analysis.cards.length} ${isPt ? 'cartões' : 'cards'}`,
    `${analysis.quiz.length} ${isPt ? 'perguntas' : 'questions'}`,
  ];
}

function sourceChip(source, { lang, e, icon, detailed = false }) {
  const isPt = lang !== 'en';
  const pages = Number(source.pages) > 0 ? ` · ${source.pages} ${isPt ? 'pág.' : 'pp.'}` : '';
  const size = detailed && source.size ? ` · ${formatFileSize(source.size)}` : '';
  return `<span class="study-source-chip" title="${e(source.name)}"><span class="study-source-chip-icon">${icon(source.kind === 'image' ? 'camera' : 'file', 13)}</span><strong>${e(source.name)}</strong><small>${e(sourceLabel(source.method, lang))}${e(`${pages}${size}`)}</small></span>`;
}

function importZone({ lang, e, icon, sources = [] }) {
  const isPt = lang !== 'en';
  return `<div class="study-import">
    <div class="study-import-main">
      <span class="study-import-icon">${icon('file', 20)}</span>
      <div class="study-import-copy"><strong>${e(isPt ? 'Importar PDF ou foto' : 'Import PDF or photo')}</strong><span>${e(isPt ? 'Arrasta para o compositor ou escolhe um ficheiro. O texto é extraído neste navegador.' : 'Drop it on the composer or choose a file. Text is extracted in this browser.')}</span></div>
      <div class="study-import-actions">
        <button type="button" class="button button-ghost button-small" data-action="summary-import-open">${icon('file', 14)} ${e(isPt ? 'Ficheiros' : 'Files')}</button>
        <button type="button" class="button button-ghost button-small" data-action="summary-import-camera">${icon('camera', 14)} ${e(isPt ? 'Tirar foto' : 'Take photo')}</button>
      </div>
    </div>
    ${sources.length ? `<div class="study-import-sources" aria-label="${e(isPt ? 'Ficheiros importados' : 'Imported files')}">${sources.map((source) => sourceChip(source, { lang, e, icon })).join('')}</div>` : ''}
    <div class="study-import-progress" data-import-progress hidden>
      <div class="study-import-progress-head"><span data-import-status-text></span><strong data-import-percent>0%</strong></div>
      <div class="study-import-track" data-import-track role="progressbar" aria-label="${e(isPt ? 'Progresso da importação' : 'Import progress')}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><i data-import-bar></i></div>
    </div>
    <p class="study-import-privacy">${icon('lock', 13)} ${e(isPt ? 'PDF, PDF digitalizado, PNG, JPEG ou WebP · máx. 20 MB. O ficheiro não é enviado. Na primeira utilização, o leitor de PDF e o OCR são descarregados da internet.' : 'PDF, scanned PDF, PNG, JPEG or WebP · max. 20 MB. The file is not uploaded. On first use, the PDF reader and OCR engine are downloaded from the internet.')}</p>
    <input type="file" hidden data-import-input accept="application/pdf,image/png,image/jpeg,image/webp,.pdf,.png,.jpg,.jpeg,.webp" multiple>
    <input type="file" hidden data-import-camera accept="image/*" capture="environment">
  </div>`;
}

function scheduleDate(value, lang) {
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(lang === 'en' ? 'en-GB' : 'pt-PT', { day: '2-digit', month: 'short' }).format(date);
}

function orderLabel(continuity, lang) {
  const isPt = lang !== 'en';
  if (!continuity) return '';
  return continuity.isFirst
    ? (isPt ? 'Primeiro resumo' : 'First summary')
    : (isPt ? `Continuação ${continuity.position}` : `Continuation ${continuity.position}`);
}

function renderThreadPath({ lang, e, icon, href, thread }) {
  const isPt = lang !== 'en';
  if (!thread?.groups?.length) return '';
  const groups = thread.groups.map((group) => {
    const steps = group.entries.map((entry) => {
      const shared = entry.continuity.shared.slice(0, 3).map((item) => item.term);
      const meta = entry.isFirst
        ? (isPt ? 'Ponto de partida desta matéria' : 'Starting point for this subject')
        : shared.length
          ? `${isPt ? 'Liga a' : 'Links to'} ${shared.join(' · ')}`
          : (isPt ? 'Ainda sem conceitos em comum' : 'No shared concepts yet');
      return `<li class="study-thread-step${entry.isFirst ? ' is-first' : ''}${entry.isLatest ? ' is-latest' : ''}">
        <a href="${href(`summary/${entry.record.id}`)}">
          <span class="study-thread-marker">${String(entry.position).padStart(2, '0')}</span>
          <span class="study-thread-copy">
            <small>${e(orderLabel(entry.continuity, lang))}${entry.isLatest ? ` · ${e(isPt ? 'agora' : 'now')}` : ''}</small>
            <strong>${e(entry.record.title)}</strong>
            <em>${e(meta)}</em>
          </span>
        </a>
      </li>`;
    }).join('');
    return `<article class="study-thread-group">
      <div class="study-thread-group-head"><span class="study-subject-tag ${e(group.subject)}">${e(subjectLabel(group.subject, lang))}</span><strong>${group.entries.length} ${e(isPt ? (group.entries.length === 1 ? 'resumo' : 'resumos') : (group.entries.length === 1 ? 'summary' : 'summaries'))}</strong></div>
      <ol class="study-thread-track">${steps}</ol>
    </article>`;
  }).join('');
  return `<section class="study-thread" aria-labelledby="study-thread-title">
    <div class="study-section-heading"><div><span class="study-eyebrow">${e(isPt ? 'PERCURSO DE APRENDIZAGEM' : 'LEARNING PATH')}</span><h2 id="study-thread-title">${e(isPt ? 'Primeiro resumo, depois continuação.' : 'First summary, then continuation.')}</h2></div><span class="study-thread-count">${icon('route', 14)} ${thread.entries.length} ${e(isPt ? 'na sequência' : 'in sequence')}</span></div>
    <p class="study-thread-lead">${e(isPt ? 'Cada matéria tem a sua sequência. Lemos os resumos pela ordem em que os escreveste e ligamos os conceitos que voltam. Assim vês o que é novo e o que já devias saber.' : 'Each subject has its own sequence. Summaries are read in the order you wrote them and returning concepts are linked. You can see what is new and what you should already know.')}</p>
    <div class="study-thread-groups">${groups}</div>
  </section>`;
}

export function renderSummariesPage({ app, lang, ui, e, icon, href, summaries = [], draft = {}, notice = null, thread = null }) {
  const isPt = lang !== 'en';
  const titles = summaries.length;
  const saved = summaries.length
    ? `<div class="study-summary-grid">${summaries.map(({ record, analysis }) => {
      const coverageDone = analysis.coverage?.filter((item) => item.ok).length ?? 0;
      const coverageTotal = analysis.coverage?.length ?? 0;
      const entry = thread?.positions?.[record.id];
      const continuity = entry?.continuity || null;
      return `<article class="study-summary-card">
        <a class="study-summary-link" href="${href(`summary/${record.id}`)}">
          <div class="study-summary-top"><div class="study-summary-top-tags"><span class="study-subject-tag ${e(record.subject)}">${e(subjectLabel(record.subject, lang))}</span>${continuity ? `<span class="study-summary-order${continuity.isFirst ? ' is-first' : ''}">${e(orderLabel(continuity, lang))}</span>` : ''}</div><span class="study-summary-date">${e(formatDate(record.createdAt, lang))}</span></div>
          <h3>${e(record.title)}</h3>
          <p>${e(analysis.centralIdea ? `${analysis.centralIdea.slice(0, 150)}${analysis.centralIdea.length > 150 ? '…' : ''}` : record.text.slice(0, 150))}</p>
          <div class="study-summary-stats">${summaryCardMeta(analysis, lang).map((item) => `<span>${e(item)}</span>`).join('')}</div>
          <div class="study-summary-foot"><span class="study-coverage-mini">${icon('check', 13)} ${coverageDone}/${coverageTotal} ${e(isPt ? 'critérios' : 'checks')}</span>${continuity && !continuity.isFirst ? `<span class="study-summary-shared" title="${e(isPt ? 'Conceitos ligados ao resumo anterior' : 'Concepts linked to the previous summary')}">${icon('link', 12)} ${continuity.shared.length}</span>` : ''}${record.sources?.length ? `<span class="study-summary-imported">${icon(record.sources.some((source) => source.kind === 'image') ? 'camera' : 'file', 12)} ${record.sources.length} ${e(isPt ? (record.sources.length === 1 ? 'ficheiro' : 'ficheiros') : (record.sources.length === 1 ? 'file' : 'files'))}</span>` : ''}<span class="subject-card-arrow">${icon('arrow', 17)}</span></div>
        </a>
        <button type="button" class="study-icon-button study-summary-delete" data-action="summary-delete" data-id="${e(record.id)}" aria-label="${e(isPt ? `Apagar o resumo ${record.title}` : `Delete summary ${record.title}`)}">${icon('close', 15)}</button>
      </article>`;
    }).join('')}</div>`
    : `<div class="study-empty">
        <span class="study-empty-icon">${icon('book', 28)}</span>
        <h3>${e(isPt ? 'Ainda não há resumos.' : 'No summaries yet.')}</h3>
        <p>${e(isPt ? 'Cola um resumo acima ou abre um exemplo para veres o que o Ingenium consegue organizar.' : 'Paste a summary above or open an example to see what Ingenium can organise.')}</p>
        <button type="button" class="button button-ghost button-small" data-action="summary-example">${icon('spark', 15)} ${e(isPt ? 'Ver exemplo' : 'See an example')}</button>
      </div>`;
  const path = renderThreadPath({ lang, e, icon, href, thread });

  const noticeMarkup = notice
    ? `<div class="study-notice ${notice.tone === 'ok' ? 'is-ok' : ''}" role="status">${icon(notice.tone === 'ok' ? 'check' : 'info', 16)}<span>${e(notice.message)}</span></div>`
    : '';

  app.innerHTML = `<section class="page tools-page study-page summaries-page">
    <div class="tools-back-row"><a class="text-link" href="${href('home')}">${icon('back', 15)} ${e(ui('home'))}</a><span class="tools-kicker">${e(isPt ? 'ESTUDO LOCAL · RESUMOS' : 'LOCAL STUDY · SUMMARIES')}</span></div>
    <header class="tools-heading study-heading">
      <div>
        <h1>${e(isPt ? 'Resumos' : 'Summaries')}<span class="title-period" aria-hidden="true">.</span></h1>
        <p class="lead">${e(isPt ? 'Cola o que escreveste. O Ingenium organiza as ideias, liga cada resumo ao anterior da mesma matéria e treina-te com o teu próprio texto. Nada sai deste dispositivo sem dares autorização.' : 'Paste what you wrote. Ingenium organises the ideas, links each summary to the previous one in the same subject, and trains you on your own text. Nothing leaves this device without your permission.')}</p>
      </div>
      <div class="study-heading-count"><strong>${titles}</strong><span>${e(plural(titles, isPt ? 'resumo guardado' : 'saved summary', isPt ? 'resumos guardados' : 'saved summaries', lang))}</span></div>
    </header>
    ${noticeMarkup}
    <div class="study-compose-layout">
      <section class="study-composer" aria-labelledby="summary-compose-title" data-import-drop>
        <div class="study-section-heading"><div><span class="study-eyebrow">${e(isPt ? 'NOVO RESUMO' : 'NEW SUMMARY')}</span><h2 id="summary-compose-title">${e(isPt ? 'O que estudaste?' : 'What did you study?')}</h2></div><span class="study-local-chip">${icon('lock', 13)} ${e(isPt ? 'SÓ NESTE DISPOSITIVO' : 'THIS DEVICE ONLY')}</span></div>
        <div class="study-field-row">
          <label class="study-field"><span>${e(isPt ? 'Título (opcional)' : 'Title (optional)')}</span><input type="text" id="summary-title" name="summary-title" data-summary-title maxlength="90" value="${e(draft.title || '')}" placeholder="${e(isPt ? 'Ex.: Cinemática — primeira lei' : 'E.g. Kinematics — first law')}" autocomplete="off"></label>
          <label class="study-field"><span>${e(isPt ? 'Matéria' : 'Subject')}</span><select id="summary-subject" name="summary-subject" data-summary-subject>${SUBJECTS.map((subject) => `<option value="${subject}" ${draft.subject === subject ? 'selected' : ''}>${e(subjectLabel(subject, lang))}</option>`).join('')}</select></label>
        </div>
        ${importZone({ lang, e, icon, sources: draft.sources || [] })}
        <label class="study-field study-field-text"><span>${e(isPt ? 'Cola o teu resumo (ou usa o texto importado)' : 'Paste your summary (or use the imported text)')}</span><textarea id="summary-text" name="summary-text" data-summary-text rows="9" placeholder="${e(isPt ? 'Escreve ou cola aqui as tuas notas. Usa frases completas: «X é …», exemplos e uma conclusão.' : 'Write or paste your notes here. Use full sentences: “X is …”, examples and a conclusion.')}">${e(draft.text || '')}</textarea></label>
        <div class="study-compose-foot"><span class="study-counter" data-summary-counter>${e(isPt ? 'Mínimo 120 caracteres. O teu texto fica neste navegador.' : 'At least 120 characters. Your text stays in this browser.')}</span><div class="study-compose-actions"><button type="button" class="button button-ghost button-small" data-action="summary-reset">${e(isPt ? 'Limpar' : 'Clear')}</button><button type="button" class="button button-ghost button-small" data-action="summary-example">${icon('spark', 14)} ${e(isPt ? 'Exemplo' : 'Example')}</button><button type="button" class="button button-primary" data-action="summary-create">${e(isPt ? 'Organizar resumo' : 'Organise summary')} ${icon('arrow', 15)}</button></div></div>
        <p class="study-honesty">${icon('info', 14)} ${e(isPt ? 'Isto não é IA generativa. É uma leitura determinística do teu texto: as definições e perguntas são extraídas das tuas frases.' : 'This is not generative AI. It is a deterministic reading of your text: definitions and questions are extracted from your sentences.')}</p>
      </section>
      <aside class="study-guide" aria-label="${e(isPt ? 'Como funciona' : 'How it works')}">
        <span class="study-eyebrow">${e(isPt ? 'COMO FUNCIONA' : 'HOW IT WORKS')}</span>
        <ol class="study-guide-steps">
          <li><span>01</span><div><strong>${e(isPt ? 'Cola sem medo' : 'Paste freely')}</strong><p>${e(isPt ? 'Frases completas ajudam. O mínimo são 120 caracteres.' : 'Full sentences help. The minimum is 120 characters.')}</p></div></li>
          <li><span>02</span><div><strong>${e(isPt ? 'Lê na sequência' : 'Read in sequence')}</strong><p>${e(isPt ? 'Marca o primeiro resumo e as continuações, ligando os conceitos que voltam.' : 'Marks the first summary and its continuations, linking returning concepts.')}</p></div></li>
          <li><span>03</span><div><strong>${e(isPt ? 'Treina, não só leias' : 'Train, don’t just read')}</strong><p>${e(isPt ? 'Cartões e perguntas usam as tuas próprias frases.' : 'Cards and questions use your own sentences.')}</p></div></li>
        </ol>
        <div class="study-guide-note">${icon('target', 17)}<span>${e(isPt ? 'Um resumo bom define, exemplifica e fecha a ideia. A lista de critérios mostra o que ainda falta.' : 'A good summary defines, gives examples and closes the idea. The checklist shows what is missing.')}</span></div>
        <a class="text-link" href="${href('planner')}">${e(isPt ? 'Ligar ao plano de estudo' : 'Connect to the study plan')} ${icon('arrow', 14)}</a>
      </aside>
    </div>
    <section class="study-library" aria-labelledby="summary-library-title">
      <div class="study-section-heading"><div><span class="study-eyebrow">${e(isPt ? 'BIBLIOTECA' : 'LIBRARY')}</span><h2 id="summary-library-title">${e(isPt ? 'Os teus resumos' : 'Your summaries')}</h2></div>${summaries.length ? `<a class="text-link" href="${href('planner')}">${e(isPt ? 'Abrir plano' : 'Open plan')} ${icon('arrow', 14)}</a>` : ''}</div>
      ${path}
      ${saved}
    </section>
    <div class="tools-footer-links"><a href="${href('planner')}">${icon('clock', 17)}<span><strong>${e(isPt ? 'Plano de estudo' : 'Study plan')}</strong><small>${e(isPt ? 'Cola o calendário e adapta as semanas' : 'Paste the calendar and adapt your weeks')}</small></span>${icon('arrow', 16)}</a><a href="${href('program')}">${icon('layers', 17)}<span><strong>${e(isPt ? 'Programa' : 'Programme')}</strong><small>${e(isPt ? 'Vê o semestre e os tópicos' : 'See the semester and topics')}</small></span>${icon('arrow', 16)}</a></div>
  </section>`;
}

function tabButton({ e, lang, current, tab, label, iconName, icon }) {
  return `<button type="button" role="tab" id="summary-tab-${tab}" aria-selected="${current === tab}" aria-controls="summary-panel-${tab}" tabindex="${current === tab ? '0' : '-1'}" data-action="summary-tab" data-tab="${tab}">${icon(iconName, 16)}<span>${e(label)}</span></button>`;
}

function renderContinuity({ lang, e, icon, href, continuity }) {
  if (!continuity) return '';
  const isPt = lang !== 'en';
  const copy = continuityCopy(continuity, lang);
  const shared = continuity.shared || [];
  const fresh = continuity.fresh || [];
  return `<section class="summary-continuity" aria-label="${e(isPt ? 'Posição deste resumo na sequência' : 'Position of this summary in the sequence')}">
    <div class="summary-continuity-main">
      <span class="summary-continuity-badge${continuity.isFirst ? ' is-first' : ''}">${icon(continuity.isFirst ? 'star' : 'link', 14)} ${e(copy.label)} <strong>${continuity.position}/${continuity.total}</strong></span>
      <p>${e(copy.detail)}</p>
      <div class="summary-continuity-links">
        ${continuity.previous ? `<a href="${href(`summary/${continuity.previous.id}`)}">${icon('back', 14)}<span><small>${e(isPt ? 'Resumo anterior' : 'Previous summary')}</small><strong>${e(continuity.previous.title)}</strong></span></a>` : ''}
        ${continuity.next ? `<a href="${href(`summary/${continuity.next.id}`)}">${icon('arrow', 14)}<span><small>${e(isPt ? 'Próximo resumo' : 'Next summary')}</small><strong>${e(continuity.next.title)}</strong></span></a>` : ''}
      </div>
    </div>
    ${shared.length || fresh.length ? `<div class="summary-continuity-terms">
      ${shared.length ? `<div><span class="summary-continuity-label">${e(isPt ? 'Rever antes de avançar' : 'Review before moving on')}</span><div class="summary-continuity-chips">${shared.map((item) => `<span class="is-shared">${icon('link', 11)} ${e(item.term)}</span>`).join('')}</div></div>` : ''}
      ${fresh.length ? `<div><span class="summary-continuity-label">${e(isPt ? 'Novo neste resumo' : 'New in this summary')}</span><div class="summary-continuity-chips">${fresh.map((term) => `<span>${e(term)}</span>`).join('')}</div></div>` : ''}
    </div>` : ''}
  </section>`;
}

function renderGuided({ lang, e, icon, record, analysis }) {
  const isPt = lang !== 'en';
  const lens = buildConceptLens(analysis, { lang, title: record.title });
  if (!lens.concepts.length) return '';
  const cards = lens.concepts.slice(0, 3).map((concept, index) => `<article class="summary-guided-card">
    <span class="summary-guided-number">${String(index + 1).padStart(2, '0')}</span>
    <div class="summary-guided-copy">
      <h4>${e(concept.term)}</h4>
      <p>${e(concept.definition)}</p>
      ${concept.analogy ? `<div class="summary-guided-analogy"><span>${e(isPt ? 'Pensa assim' : 'Think of it this way')}</span><p>${e(concept.analogy)}</p></div>` : ''}
      <div class="summary-guided-app"><span>${icon('globe', 13)} ${e(concept.application.title)}</span><p>${e(concept.application.text)}</p></div>
      ${concept.mistake ? `<p class="summary-guided-mistake">${icon('warning', 13)} ${e(isPt ? `Erro comum: ${concept.mistake}` : `Common mistake: ${concept.mistake}`)}</p>` : ''}
    </div>
  </article>`).join('');
  return `<section class="summary-block summary-guided">
    <div class="summary-block-head"><span class="study-eyebrow">${e(isPt ? 'EXPLICAÇÃO GUIADA' : 'GUIDED EXPLANATION')}</span><span class="summary-block-count">${icon('spark', 14)} ${e(isPt ? 'aprender' : 'learn')}</span></div>
    <p class="summary-guided-lead">${e(isPt ? 'Lê pela ordem: o que é, como pensar nele, onde aparece e que erro evitar. Se não conseguires explicar uma destas ideias em voz alta, volta a essa ideia antes de avançar.' : 'Read in order: what it is, how to think about it, where it appears and which mistake to avoid. If you cannot explain an idea out loud, return to it before moving on.')}</p>
    <div class="summary-guided-list">${cards}</div>
    <div class="summary-guided-check"><span>${icon('target', 16)}</span><p>${e(isPt ? 'Testa-te agora: fecha esta secção e explica estas ideias a um colega em dois minutos. O que não conseguires explicar é o que precisas de rever.' : 'Test yourself now: close this section and explain these ideas to a classmate in two minutes. Whatever you cannot explain is what you need to review.')}</p><button type="button" class="button button-ghost button-small" data-action="summary-open-audio">${icon('headphones', 14)} ${e(isPt ? 'Ouvir explicação' : 'Listen to explanation')}</button></div>
  </section>`;
}

function renderExplain({ lang, e, icon, href, record, analysis, relatedLessons, continuity = null }) {
  const isPt = lang !== 'en';
  const definitions = analysis.definitions || [];
  const outline = analysis.outline || [];
  const keywords = analysis.keywords || [];
  const coverage = analysis.coverage || [];
  const questions = analysis.guidingQuestions || [];
  const keyIdeas = analysis.keyIdeas || [];
  return `<div class="summary-explain-grid">
    ${renderContinuity({ lang, e, icon, href, continuity })}
    <section class="summary-central-card">
      <span class="study-eyebrow">${e(isPt ? 'IDEIA CENTRAL' : 'CENTRAL IDEA')}</span>
      <p>${e(analysis.centralIdea || '')}</p>
      <div class="summary-central-meta"><span>${e(`${analysis.stats.words} ${isPt ? 'palavras' : 'words'}`)}</span><span>${e(`${analysis.stats.sentences} ${isPt ? 'frases' : 'sentences'}`)}</span><span>${e(`${analysis.stats.readingMinutes} ${isPt ? 'min de leitura' : 'min read'}`)}</span></div>
    </section>
    <section class="summary-block">
      <div class="summary-block-head"><span class="study-eyebrow">${e(isPt ? 'IDEIAS-CHAVE' : 'KEY IDEAS')}</span><span class="summary-block-count">${keyIdeas.length}</span></div>
      <ol class="summary-key-list">${keyIdeas.map((idea) => `<li>${e(idea)}</li>`).join('')}</ol>
    </section>
    ${renderGuided({ lang, e, icon, record, analysis })}
    ${definitions.length ? `<section class="summary-block summary-definitions"><div class="summary-block-head"><span class="study-eyebrow">${e(isPt ? 'CONCEITOS' : 'CONCEPTS')}</span><span class="summary-block-count">${definitions.length}</span></div><div class="summary-definition-list">${definitions.map((item) => `<article><strong>${e(item.term)}</strong><p>${e(item.predicate)}</p><small>${e(isPt ? 'Fonte' : 'Source')} · ${e(item.sentence)}</small></article>`).join('')}</div></section>` : ''}
    ${outline.length ? `<section class="summary-block"><div class="summary-block-head"><span class="study-eyebrow">${e(isPt ? 'ESTRUTURA' : 'STRUCTURE')}</span><span class="summary-block-count">${outline.length}</span></div><div class="summary-outline">${outline.map((block, index) => `<div class="summary-outline-block"><span>${String(index + 1).padStart(2, '0')}</span><div>${block.heading ? `<strong>${e(block.heading)}</strong>` : ''}<ul>${block.points.map((point) => `<li>${e(point)}</li>`).join('')}</ul></div></div>`).join('')}</div></section>` : ''}
    <section class="summary-block summary-coverage"><div class="summary-block-head"><span class="study-eyebrow">${e(isPt ? 'O QUE JÁ TENS' : 'WHAT YOU COVERED')}</span><span class="summary-block-count">${coverage.filter((item) => item.ok).length}/${coverage.length}</span></div><ul>${coverage.map((item) => `<li class="${item.ok ? 'is-ok' : ''}"><span class="summary-coverage-mark">${item.ok ? icon('check', 14) : icon('info', 14)}</span><span>${e(item.hint)}</span></li>`).join('')}</ul></section>
    ${keywords.length ? `<section class="summary-block"><div class="summary-block-head"><span class="study-eyebrow">${e(isPt ? 'PALAVRAS QUE VOLTAM' : 'RECURRING WORDS')}</span></div><div class="summary-keywords">${keywords.map((keyword) => `<span>${e(keyword.term)}<strong>${keyword.count}</strong></span>`).join('')}</div></section>` : ''}
    ${questions.length ? `<section class="summary-block summary-questions"><div class="summary-block-head"><span class="study-eyebrow">${e(isPt ? 'PERGUNTAS PARA TI' : 'QUESTIONS FOR YOU')}</span></div><ul>${questions.map((question) => `<li>${e(question)}</li>`).join('')}</ul></section>` : ''}
    ${relatedLessons.length ? `<section class="summary-block summary-related"><div class="summary-block-head"><span class="study-eyebrow">${e(isPt ? 'LIGAÇÕES NO CURSO' : 'LINKS IN THE COURSE')}</span></div><div class="summary-related-list">${relatedLessons.map((lesson) => `<a href="${href(`lesson/${lesson.id}`)}"><span>${icon('book', 16)}<strong>${e(lesson.title)}</strong></span>${icon('arrow', 15)}</a>`).join('')}</div></section>` : ''}
  </div>`;
}

function renderCards({ lang, e, icon, analysis, progress }) {
  const isPt = lang !== 'en';
  const cards = analysis.cards || [];
  if (!cards.length) {
    return `<div class="study-empty study-empty-inline"><span class="study-empty-icon">${icon('book', 26)}</span><h3>${e(isPt ? 'Ainda não há cartões.' : 'No cards yet.')}</h3><p>${e(isPt ? 'O resumo precisa de frases com conceitos claros para gerar cartões.' : 'The summary needs sentences with clear concepts to generate cards.')}</p></div>`;
  }
  const known = new Set(progress.known || []);
  const review = new Set(progress.review || []);
  const index = Math.min(Math.max(Number(progress.cardIndex) || 0, 0), cards.length);
  if (index >= cards.length) {
    return `<div class="summary-card-finish"><span class="study-empty-icon">${icon('star', 28)}</span><span class="study-eyebrow">${e(isPt ? 'VOLTA COMPLETA' : 'ROUND COMPLETE')}</span><h3>${e(isPt ? 'Cartões terminados.' : 'Cards complete.')}</h3><p>${e(isPt ? `Marcaste ${known.size} como sabidos e ${review.size} para rever.` : `You marked ${known.size} as known and ${review.size} to review.`)}</p><div class="summary-finish-counts"><div><strong>${known.size}</strong><span>${e(isPt ? 'sabidos' : 'known')}</span></div><div><strong>${review.size}</strong><span>${e(isPt ? 'a rever' : 'to review')}</span></div><div><strong>${cards.length}</strong><span>${e(isPt ? 'total' : 'total')}</span></div></div><button type="button" class="button button-primary" data-action="summary-card-reset">${icon('reset', 15)} ${e(isPt ? 'Repetir cartões' : 'Repeat cards')}</button></div>`;
  }
  const card = cards[index];
  const revealed = progress.reveal === true;
  return `<div class="summary-card-trainer">
    <div class="summary-trainer-top"><span class="study-eyebrow">${e(isPt ? 'CARTÃO' : 'CARD')} ${index + 1} / ${cards.length}</span><div class="summary-trainer-progress"><i style="width:${Math.round(index / cards.length * 100)}%"></i></div><button type="button" class="study-icon-button" data-action="summary-card-reset" aria-label="${e(isPt ? 'Recomeçar cartões' : 'Restart cards')}">${icon('reset', 15)}</button></div>
    <div class="summary-flashcard ${card.kind === 'definition' ? 'is-definition' : 'is-cloze'}" aria-live="polite">
      <span class="summary-card-kind">${e(card.kind === 'definition' ? (isPt ? 'DEFINIÇÃO' : 'DEFINITION') : (isPt ? 'COMPLETA A FRASE' : 'FILL THE GAP'))}</span>
      <p class="summary-card-front">${e(card.front)}</p>
      <div class="summary-card-answer ${revealed ? 'is-visible' : ''}">${revealed ? `<span>${e(isPt ? 'RESPOSTA' : 'ANSWER')}</span><strong>${e(card.back)}</strong>` : `<span class="summary-card-hint">${e(isPt ? 'Tenta responder em voz alta antes de virar.' : 'Try answering out loud before flipping.')}</span>`}</div>
    </div>
    <div class="summary-card-actions">${revealed
      ? `<button type="button" class="button button-ghost" data-action="summary-card-review">${e(isPt ? 'Ainda não sei' : 'Not yet')}</button><button type="button" class="button button-primary" data-action="summary-card-known">${icon('check', 15)} ${e(isPt ? 'Já sei' : 'I know it')}</button>`
      : `<button type="button" class="button button-lime" data-action="summary-card-reveal">${e(isPt ? 'Mostrar resposta' : 'Show answer')} ${icon('arrow', 15)}</button>`}</div>
    <p class="summary-card-source">${e(isPt ? 'Fonte' : 'Source')} · ${e(card.sentence || '')}</p>
  </div>`;
}

function renderQuiz({ lang, e, icon, analysis, progress }) {
  const isPt = lang !== 'en';
  const quiz = analysis.quiz || [];
  if (!quiz.length) {
    return `<div class="study-empty study-empty-inline"><span class="study-empty-icon">${icon('target', 26)}</span><h3>${e(isPt ? 'Este resumo ainda não dá um teste fiável.' : 'This summary cannot support a reliable quiz yet.')}</h3><p>${e(isPt ? 'São precisos pelo menos três conceitos distintos. Acrescenta definições e exemplos.' : 'At least three distinct concepts are needed. Add definitions and examples.')}</p></div>`;
  }
  const answers = progress.quizAnswers && typeof progress.quizAnswers === 'object' ? progress.quizAnswers : {};
  const checked = progress.quizChecked === true;
  const answeredCount = quiz.filter((question) => Number.isInteger(answers[question.id])).length;
  const score = quiz.filter((question) => answers[question.id] === question.correct).length;
  return `<div class="summary-quiz">
    <div class="summary-quiz-head"><div><span class="study-eyebrow">${e(isPt ? 'TESTE RÁPIDO' : 'QUICK TEST')}</span><h3>${e(isPt ? 'Reconheces a ideia?' : 'Do you recognise the idea?')}</h3><p>${e(isPt ? 'Escolhe uma opção em cada pergunta. As explicações usam sempre o teu texto.' : 'Choose one option per question. Explanations always use your text.')}</p></div><div class="summary-quiz-score"><strong>${answeredCount}/${quiz.length}</strong><span>${e(isPt ? 'respondidas' : 'answered')}</span></div></div>
    ${checked ? `<div class="summary-quiz-result ${score === quiz.length ? 'is-perfect' : ''}" role="status">${icon(score === quiz.length ? 'star' : 'target', 18)}<span><strong>${score}/${quiz.length}</strong> ${e(isPt ? 'certas' : 'correct')} · ${e(isPt ? 'teste de treino, não uma nota oficial' : 'practice only, not an official grade')}</span></div>` : ''}
    <ol class="summary-quiz-list">${quiz.map((question, questionIndex) => {
      const selected = answers[question.id];
      const isCorrect = checked && selected === question.correct;
      return `<li class="summary-quiz-question ${checked ? (isCorrect ? 'is-correct' : 'is-wrong') : ''}">
        <div class="summary-quiz-prompt"><span>${String(questionIndex + 1).padStart(2, '0')}</span><p>${e(question.prompt)}</p></div>
        <div class="summary-quiz-options" role="group" aria-label="${e(isPt ? `Opções da pergunta ${questionIndex + 1}` : `Options for question ${questionIndex + 1}`)}">${question.options.map((option, optionIndex) => {
          const selectedOption = selected === optionIndex;
          const revealCorrect = checked && optionIndex === question.correct;
          return `<button type="button" class="${selectedOption ? 'is-selected' : ''} ${revealCorrect ? 'is-answer' : ''}" data-action="summary-quiz-option" data-question="${e(question.id)}" data-option="${optionIndex}" aria-pressed="${selectedOption}" ${checked ? 'disabled' : ''}><span>${String.fromCharCode(65 + optionIndex)}</span>${e(option)}</button>`;
        }).join('')}</div>
        ${checked ? `<p class="summary-quiz-explanation">${icon(isCorrect ? 'check' : 'info', 14)}<span>${isCorrect ? e(isPt ? 'Certo.' : 'Correct.') : e(isPt ? `A resposta certa é «${question.answer}».` : `The correct answer is “${question.answer}”.`)} ${e(question.explanation)}</span></p>` : ''}
      </li>`;
    }).join('')}</ol>
    <div class="summary-quiz-actions">${checked
      ? `<button type="button" class="button button-primary" data-action="summary-quiz-reset">${icon('reset', 15)} ${e(isPt ? 'Repetir teste' : 'Retry test')}</button>`
      : `<button type="button" class="button button-primary" data-action="summary-quiz-check" ${answeredCount < quiz.length ? 'disabled' : ''}>${icon('check', 15)} ${e(isPt ? 'Corrigir respostas' : 'Check answers')}</button><span class="summary-quiz-wait">${e(isPt ? 'Responde a todas para corrigir.' : 'Answer all questions to check.')}</span>`}</div>
  </div>`;
}

function renderMindMapPanel({ lang, e, icon, record, analysis }) {
  const isPt = lang !== 'en';
  const map = buildMindMap(analysis, { title: record.title, lang });
  const list = map.branches.map((branch) => `<li><strong>${e(branch.label)}</strong><ul>${branch.children.map((child) => `<li>${e(child.label)}${child.detail ? `<span> — ${e(child.detail)}</span>` : ''}</li>`).join('')}</ul></li>`).join('');
  return `<div class="summary-map">
    <div class="summary-map-head">
      <div><span class="study-eyebrow">${e(isPt ? 'MAPA MENTAL' : 'MIND MAP')}</span><h3>${e(isPt ? 'A estrutura num só olhar.' : 'The whole structure at a glance.')}</h3><p>${e(isPt ? 'Ramos construídos a partir das tuas definições, ideias-chave e perguntas. Não inventa ligações que não estejam no texto.' : 'Branches built from your definitions, key ideas and questions. It does not invent links that are not in the text.')}</p></div>
      <button type="button" class="button button-ghost button-small" data-action="summary-map-download">${icon('download', 15)} ${e(isPt ? 'Descarregar SVG' : 'Download SVG')}</button>
    </div>
    <figure class="summary-map-figure">
      <div class="summary-map-canvas" tabindex="0" role="group" aria-label="${e(isPt ? 'Mapa mental. Desliza horizontalmente se o ecrã for pequeno.' : 'Mind map. Scroll horizontally on a small screen.')}">${mindMapSvg(map, { e, lang })}</div>
      <figcaption>${icon('compass', 13)} ${e(isPt ? 'Desenha este mapa de memória antes de abrires os cartões.' : 'Redraw this map from memory before opening the cards.')}</figcaption>
    </figure>
    <details class="summary-map-list">
      <summary>${icon('layers', 15)} ${e(isPt ? 'Ver em lista' : 'View as list')} · ${map.nodeCount} ${e(isPt ? 'ideias' : 'ideas')}</summary>
      <p class="summary-map-rootline"><strong>${e(map.root.label)}</strong>${map.root.detail ? `<span>${e(map.root.detail)}</span>` : ''}</p>
      <ul>${list}</ul>
    </details>
    <p class="summary-map-note">${icon('info', 14)} ${e(isPt ? 'O mapa é uma leitura automática do resumo. Se uma ligação não fizer sentido, corrige o texto e volta a organizar.' : 'The map is an automatic reading of the summary. If a link does not make sense, fix the text and organise it again.')}</p>
  </div>`;
}

function renderMethodsPanel({ lang, e, icon, analysis }) {
  const isPt = lang !== 'en';
  const { methods, schedule } = buildLearningMethods(analysis, { lang, now: new Date() });
  const cards = methods.map((method, index) => `<article class="study-method-card method-${method.id}">
    <div class="study-method-top"><span class="study-method-icon">${icon(method.icon, 18)}</span><div class="study-method-titles"><span>${e(method.category)}</span><h4>${e(method.title)}</h4></div><span class="study-method-number">${String(index + 1).padStart(2, '0')}</span></div>
    <p class="study-method-summary">${e(method.summary)}</p>
    <ol class="study-method-steps">${method.steps.map((step) => `<li>${e(step)}</li>`).join('')}</ol>
    ${method.schedule ? `<div class="study-method-schedule">${method.schedule.map((item) => `<span class="${item.days === 0 ? 'is-today' : ''}"><strong>${e(item.days === 0 ? (isPt ? 'Hoje' : 'Today') : `+${item.days}d`)}</strong><small>${e(scheduleDate(item.date, lang))}</small></span>`).join('')}</div>` : ''}
    ${method.palace?.length ? `<div class="study-method-route">${method.palace.map((station, stationIndex) => `<span><i>${stationIndex + 1}</i><strong>${e(station.place)}</strong><small>${e(station.concept)}</small></span>`).join('')}</div>` : ''}
    ${method.meta ? `<span class="study-method-meta">${icon('check', 12)} ${e(method.meta)}</span>` : ''}
  </article>`).join('');
  return `<div class="summary-methods">
    <div class="summary-methods-head">
      <div><span class="study-eyebrow">${e(isPt ? 'MÉTODOS DE ESTUDO' : 'STUDY METHODS')}</span><h3>${e(isPt ? 'Não estudes sempre da mesma maneira.' : 'Do not always study the same way.')}</h3><p>${e(isPt ? 'Formas diferentes de trabalhar este resumo, da recordação ativa ao palácio da memória. Usa duas ou três por semana.' : 'Different ways to work through this summary, from active recall to a memory palace. Use two or three each week.')}</p></div>
      <div class="summary-methods-plan"><span>${icon('repeat', 15)} ${e(isPt ? 'Revisões' : 'Reviews')}</span><strong>${schedule.length}</strong><small>${e(isPt ? '14 dias' : '14 days')}</small></div>
    </div>
    <div class="summary-methods-grid">${cards}</div>
    <p class="summary-methods-note">${icon('info', 14)} ${e(isPt ? 'Estas sugestões são geradas a partir da estrutura do resumo. Não substituem orientação do professor nem avaliação oficial.' : 'These suggestions are generated from the summary structure. They do not replace teacher guidance or official assessment.')}</p>
  </div>`;
}

function renderWorldPanel({ lang, e, icon, record, analysis, external = null, wikiBusy = null }) {
  const isPt = lang !== 'en';
  const lens = buildConceptLens(analysis, { lang, title: record.title });
  const loading = wikiBusy?.status === 'loading';
  const error = wikiBusy?.status === 'error' ? wikiBusy : null;
  const loadedTerm = external?.term ? external.term.toLowerCase() : '';
  const concepts = lens.concepts.map((concept) => {
    const loaded = loadedTerm && concept.term.toLowerCase() === loadedTerm;
    return `<article class="world-concept-card">
      <div class="world-concept-top"><span class="world-concept-icon">${icon(concept.icon, 19)}</span><div><h4>${e(concept.term)}</h4><span class="world-concept-kind">${e(concept.curated ? (isPt ? 'Tema do curso' : 'Course topic') : (isPt ? 'Do teu texto' : 'From your text'))}</span></div></div>
      <p class="world-concept-def">${e(concept.definition)}</p>
      ${concept.why ? `<p class="world-concept-why">${icon('book', 12)}<span>${e(concept.why)}</span></p>` : ''}
      ${concept.analogy ? `<div class="world-concept-analogy"><span>${e(isPt ? 'Pensa assim' : 'Think of it this way')}</span><p>${e(concept.analogy)}</p></div>` : ''}
      <div class="world-concept-app"><span>${icon('globe', 13)} ${e(isPt ? 'No mundo real' : 'In the real world')}</span><strong>${e(concept.application.title)}</strong><p>${e(concept.application.text)}</p></div>
      <p class="world-concept-mistake">${icon('warning', 13)}<span><strong>${e(isPt ? 'Erro comum' : 'Common mistake')}</strong> ${e(concept.mistake)}</span></p>
      <button type="button" class="button button-ghost button-small world-wiki-button" data-action="summary-wiki-load" data-term="${e(concept.wikiTerm || concept.term)}" ${loading ? 'disabled' : ''}>${icon('globe', 14)} ${e(loaded ? (isPt ? 'Ver outra vez na Wikipédia' : 'Look up on Wikipedia again') : (isPt ? 'Ler na Wikipédia' : 'Read on Wikipedia'))}</button>
    </article>`;
  }).join('');

  let wiki = '';
  if (external) {
    wiki = `<article class="world-wiki-card">
      <div class="world-wiki-head"><span class="world-wiki-source">${icon('globe', 16)}<strong>${e(external.source || 'Wikipédia')}</strong><small>${e(String(external.lang || 'pt').toUpperCase())} · ${e(external.license || 'CC BY-SA')}</small></span><a class="button button-ghost button-small" href="${e(external.url)}" target="_blank" rel="noopener noreferrer">${e(isPt ? 'Abrir artigo' : 'Open article')} ${icon('external', 13)}</a></div>
      <h4>${e(external.title || external.term)}</h4>
      ${external.description ? `<p class="world-wiki-desc">${e(external.description)}</p>` : ''}
      <p class="world-wiki-extract">${e(external.extract)}</p>
      <div class="world-wiki-foot"><small>${e(isPt ? 'Texto da Wikipédia sob licença CC BY-SA. Confirma sempre com o professor antes de uma avaliação.' : 'Wikipedia text under CC BY-SA. Always confirm with your teacher before an assessment.')}</small><button type="button" class="world-link-button" data-action="summary-wiki-remove">${icon('close', 12)} ${e(isPt ? 'Remover' : 'Remove')}</button></div>
    </article>`;
  } else if (error) {
    wiki = `<div class="world-wiki-empty is-error" role="alert">${icon('warning', 18)}<div><strong>${e(isPt ? 'A busca online não funcionou.' : 'The online lookup did not work.')}</strong><p>${e(error.message || '')}</p><p class="world-wiki-privacy">${e(isPt ? 'Só o termo escolhido é enviado. O teu resumo nunca é enviado.' : 'Only the chosen term is sent. Your summary is never uploaded.')}</p></div></div>`;
  } else if (loading) {
    wiki = `<div class="world-wiki-empty is-loading" role="status">${icon('clock', 18)}<div><strong>${e(isPt ? `A procurar «${wikiBusy.term}» na Wikipédia…` : `Looking up “${wikiBusy.term}” on Wikipedia…`)}</strong><p class="world-wiki-privacy">${e(isPt ? 'Só o termo escolhido é enviado. O teu resumo nunca é enviado.' : 'Only the chosen term is sent. Your summary is never uploaded.')}</p></div></div>`;
  } else {
    wiki = `<div class="world-wiki-empty">${icon('globe', 18)}<div><strong>${e(isPt ? 'Queres contexto externo?' : 'Want outside context?')}</strong><p>${e(isPt ? 'Escolhe um conceito acima e carrega em «Ler na Wikipédia». Só o termo da pesquisa sai deste dispositivo — o teu resumo fica aqui.' : 'Pick a concept above and press “Read on Wikipedia”. Only the search term leaves this device — your summary stays here.')}</p></div></div>`;
  }

  return `<div class="summary-world">
    <header class="world-head">
      <div><span class="study-eyebrow">${e(isPt ? 'MUNDO REAL · EXPLICAR MELHOR' : 'REAL WORLD · EXPLAIN BETTER')}</span><h3>${e(isPt ? 'Percebe o conceito, depois vê-o a funcionar.' : 'Understand the concept, then see it at work.')}</h3><p>${e(isPt ? 'Cada conceito do resumo ganha uma explicação, uma analogia e uma aplicação real. No fim, podes explorar as ideias numa sala 3D.' : 'Every concept in the summary gets an explanation, an analogy and a real application. At the end, you can explore the ideas in a 3D room.')}</p></div>
      <span class="world-head-badge">${icon('spark', 15)} ${e(isPt ? 'Aprender, não decorar' : 'Learn, don’t memorise')}</span>
    </header>
    <section class="world-concepts" aria-label="${e(isPt ? 'Conceitos explicados' : 'Explained concepts')}">
      <div class="world-section-head"><span class="study-eyebrow">${e(isPt ? 'CONCEITOS' : 'CONCEPTS')}</span><span class="world-section-note">${e(isPt ? 'Definição do texto + contexto do tema' : 'Definition from your text + topic context')}</span></div>
      <div class="world-concept-grid">${concepts}</div>
    </section>
    <section class="world-wiki" aria-labelledby="world-wiki-title">
      <div class="world-section-head"><span class="study-eyebrow" id="world-wiki-title">${e(isPt ? 'CONTEÚDO ONLINE (OPCIONAL)' : 'ONLINE CONTENT (OPTIONAL)')}</span><span class="world-section-note">${icon('lock', 11)} ${e(isPt ? 'Só por tua escolha' : 'Only when you choose')}</span></div>
      ${wiki}
    </section>
    <section class="world-lab" aria-labelledby="world-lab-title">
      <div class="world-section-head"><div><span class="study-eyebrow">${e(isPt ? 'LABORATÓRIO 3D' : '3D LAB')}</span><h3 id="world-lab-title">${e(lens.lab.title)}</h3><p>${e(lens.lab.intro)}</p></div><span class="world-section-note">${icon('cube', 13)} ${e(isPt ? 'Arrasta e explora' : 'Drag and explore')}</span></div>
      <div class="summary-lab-root" data-concept-lab data-lab-title="${e(record.title)}"></div>
      <details class="world-lab-list"><summary>${icon('layers', 14)} ${e(isPt ? 'Ver conceitos em lista' : 'View concepts as a list')}</summary><ul>${lens.lab.nodes.map((node) => `<li><strong>${e(node.term)}</strong><span>${e(node.detail)}</span><small>${e(node.application)}</small></li>`).join('')}</ul></details>
    </section>
    <section class="world-applications" aria-labelledby="world-app-title">
      <div class="world-section-head"><div><span class="study-eyebrow">${e(isPt ? 'APLICAÇÕES' : 'APPLICATIONS')}</span><h3 id="world-app-title">${e(isPt ? 'Onde isto aparece na vida real.' : 'Where this shows up in real life.')}</h3></div></div>
      <div class="world-app-grid">${lens.applications.map((app) => `<article class="world-app-card"><span class="world-app-icon">${icon(app.icon, 19)}</span><small>${e(app.kicker)}</small><h4>${e(app.title)}</h4><p>${e(app.text)}</p></article>`).join('')}</div>
    </section>
    <section class="world-online" aria-labelledby="world-online-title">
      <div class="world-online-copy"><span class="study-eyebrow">${e(isPt ? 'IR MAIS LONGE' : 'GO FURTHER')}</span><h3 id="world-online-title">${e(isPt ? `Pesquisar «${lens.online.query}»` : `Search “${lens.online.query}”`)}</h3><p>${e(isPt ? 'Links de pesquisa para explicações e exercícios. Abrem noutro separador. Só o termo de pesquisa é enviado para esses sites, nunca o teu resumo.' : 'Search links for explanations and practice. They open in a new tab. Only the search term is sent to those sites, never your summary.')}</p></div>
      <div class="world-online-links">${lens.online.links.map((link) => `<a href="${e(link.url)}" target="_blank" rel="noopener noreferrer"><span>${icon(link.id === 'wikipedia' ? 'globe' : link.id === 'khan' ? 'book' : 'play', 16)}<strong>${e(link.label)}</strong><small>${e(link.description)}</small></span>${icon('external', 14)}</a>`).join('')}</div>
    </section>
    <p class="world-note">${icon('info', 14)} ${e(lens.note)}</p>
  </div>`;
}

export function renderSummaryDetailPage({ app, lang, ui, e, icon, href, record, analysis, relatedLessons = [], tab = 'explain', continuity = null, external = null, wikiBusy = null }) {
  const isPt = lang !== 'en';
  const progress = record.progress && typeof record.progress === 'object' ? record.progress : {};
  const current = ['explain', 'world', 'map', 'cards', 'methods', 'quiz', 'audio'].includes(tab) ? tab : 'explain';
  const coverageDone = analysis.coverage?.filter((item) => item.ok).length ?? 0;
  const coverageTotal = analysis.coverage?.length ?? 0;
  const tabs = [
    { id: 'explain', label: isPt ? 'Explicação' : 'Explanation', icon: 'book' },
    { id: 'world', label: isPt ? 'Mundo real' : 'Real world', icon: 'globe' },
    { id: 'map', label: isPt ? 'Mapa' : 'Map', icon: 'map' },
    { id: 'cards', label: isPt ? 'Cartões' : 'Cards', icon: 'layers' },
    { id: 'methods', label: isPt ? 'Métodos' : 'Methods', icon: 'spark' },
    { id: 'quiz', label: isPt ? 'Teste' : 'Quiz', icon: 'target' },
    { id: 'audio', label: isPt ? 'Áudio' : 'Audio', icon: 'headphones' },
  ];
  const panel = current === 'cards'
    ? renderCards({ lang, e, icon, analysis, progress })
    : current === 'quiz'
      ? renderQuiz({ lang, e, icon, analysis, progress })
      : current === 'map'
        ? renderMindMapPanel({ lang, e, icon, record, analysis })
        : current === 'methods'
          ? renderMethodsPanel({ lang, e, icon, analysis })
          : current === 'world'
            ? renderWorldPanel({ lang, e, icon, record, analysis, external, wikiBusy })
            : current === 'audio'
              ? `<div class="audio-lesson" data-audio-lesson data-title="${e(record.title)}"><p class="audio-pending">${e(isPt ? 'A preparar a aula em áudio…' : 'Preparing the audio lesson…')}</p></div>`
              : renderExplain({ lang, e, icon, href, record, analysis, relatedLessons, continuity });

  app.innerHTML = `<section class="page tools-page study-page summary-detail-page">
    <div class="tools-back-row"><a class="text-link" href="${href('summaries')}">${icon('back', 15)} ${e(isPt ? 'Resumos' : 'Summaries')}</a><span class="tools-kicker">${e(isPt ? 'RESUMO · LEITURA LOCAL' : 'SUMMARY · LOCAL READING')}</span></div>
    <header class="summary-detail-heading">
      <div class="summary-detail-title"><div class="summary-detail-tags"><span class="study-subject-tag ${e(record.subject)}">${e(subjectLabel(record.subject, lang))}</span>${continuity ? `<span class="summary-detail-order${continuity.isFirst ? ' is-first' : ''}">${icon(continuity.isFirst ? 'star' : 'link', 12)} ${e(orderLabel(continuity, lang))}</span>` : ''}</div><h1>${e(record.title)}<span class="title-period" aria-hidden="true">.</span></h1><div class="summary-detail-meta"><span>${icon('clock', 13)} ${e(`${analysis.stats.readingMinutes} ${isPt ? 'min' : 'min'}`)}</span><span>${icon('check', 13)} ${coverageDone}/${coverageTotal} ${e(isPt ? 'critérios' : 'checks')}</span><span>${e(formatDate(record.createdAt, lang))}</span></div>${record.sources?.length ? `<div class="summary-detail-sources" aria-label="${e(isPt ? 'Ficheiros de origem' : 'Source files')}">${record.sources.map((source) => sourceChip(source, { lang, e, icon, detailed: true })).join('')}</div>` : ''}</div>
      <div class="summary-detail-actions"><button type="button" class="study-icon-button summary-audio-link" data-action="summary-open-audio">${icon('headphones', 15)} ${e(isPt ? 'Ouvir' : 'Listen')}</button><a class="study-icon-button summary-present-link" href="${href(`present/${record.id}`)}">${icon('projector', 15)} ${e(isPt ? 'Modo aula' : 'Class mode')}</a><button type="button" class="study-icon-button study-delete-text" data-action="summary-delete" data-id="${e(record.id)}">${icon('close', 15)} ${e(isPt ? 'Apagar' : 'Delete')}</button></div>
    </header>
    <div class="summary-tabbar" role="tablist" aria-label="${e(isPt ? 'Vistas do resumo' : 'Summary views')}">
      ${tabs.map((item) => tabButton({ e, lang, current, tab: item.id, label: item.label, iconName: item.icon, icon })).join('')}
    </div>
    <div id="summary-panel-${current}" role="tabpanel" aria-labelledby="summary-tab-${current}" class="summary-panel">
      ${analysis.insufficient ? `<div class="study-notice">${icon('info', 16)}<span>${e(isPt ? 'Este resumo é demasiado curto para uma análise completa. Abre um novo resumo com pelo menos duas frases.' : 'This summary is too short for a full analysis. Create a new one with at least two sentences.')}</span></div>` : ''}
      ${panel}
    </div>
    <p class="summary-source-note">${icon('info', 14)} ${e(record.sources?.length ? (isPt ? 'Texto extraído de ficheiros no teu dispositivo. O OCR pode falhar em manuscritos e páginas tortas: revê o texto e confirma sempre com o professor antes de uma avaliação oficial.' : 'Text extracted from files on your device. OCR can fail on handwriting and skewed pages: review the text and always confirm with your teacher before an official assessment.') : (isPt ? 'Conteúdo extraído do teu texto. Confirma sempre com o professor antes de estudar para uma avaliação oficial.' : 'Content extracted from your text. Always confirm with your teacher before studying for an official assessment.'))}</p>
  </section>`;
}
