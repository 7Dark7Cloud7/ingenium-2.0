import { buildConceptLens } from '../study/concept-lens.js';
import { subjectLabel } from './summaries-page.js';

function slideList({ lang, analysis }) {
  const isPt = lang !== 'en';
  const ideas = (analysis.keyIdeas || []).filter(Boolean).slice(0, 5);
  const questions = (analysis.guidingQuestions || []).filter(Boolean).slice(0, 4);
  const keywords = (analysis.keywords || []).map((item) => item.term).filter(Boolean).slice(0, 5);
  const slides = [{ kind: 'cover' }];
  if (ideas.length || keywords.length) {
    slides.push({ kind: 'ideas', items: ideas.length ? ideas : keywords, usingKeywords: !ideas.length });
  }
  slides.push({ kind: 'concepts' });
  slides.push({ kind: 'applications' });
  slides.push({ kind: 'lab', title: isPt ? 'Laboratório prático 3D' : 'Practical 3D lab' });
  if (questions.length) slides.push({ kind: 'questions', items: questions });
  slides.push({ kind: 'close' });
  return slides;
}

function coverSlide({ lang, e, icon, record, analysis }) {
  const isPt = lang !== 'en';
  return `<div class="present-slide present-cover">
    <div class="present-cover-tags"><span class="study-subject-tag ${e(record.subject)}">${e(subjectLabel(record.subject, lang))}</span><span class="present-cover-mode">${icon('target', 13)} ${e(isPt ? 'MODO AULA' : 'CLASS MODE')}</span></div>
    <h1>${e(record.title)}<span class="title-period" aria-hidden="true">.</span></h1>
    ${analysis.centralIdea ? `<p class="present-cover-idea">${e(analysis.centralIdea)}</p>` : ''}
    <div class="present-cover-meta">
      <span>${icon('clock', 14)} ${e(`${analysis.stats?.readingMinutes || 0} min`)}</span>
      <span>${icon('book', 14)} ${(analysis.definitions || []).length} ${e(isPt ? 'conceitos' : 'concepts')}</span>
      <span>${icon('check', 14)} ${(analysis.coverage || []).filter((item) => item.ok).length}/${(analysis.coverage || []).length} ${e(isPt ? 'critérios' : 'checks')}</span>
    </div>
    <p class="present-cover-hint">${icon('arrow', 14)} ${e(isPt ? 'Usa as setas ← → para avançar. Esc para sair.' : 'Use the ← → keys to move. Esc to exit.')}</p>
  </div>`;
}

function ideasSlide({ lang, e, items, usingKeywords }) {
  const isPt = lang !== 'en';
  return `<div class="present-slide">
    <span class="present-eyebrow">${e(isPt ? 'O QUE FICA' : 'WHAT STAYS')}</span>
    <h2>${e(isPt ? (usingKeywords ? 'Palavras que sustentam a aula.' : 'As ideias que sustentam a aula.') : (usingKeywords ? 'The words holding the lesson together.' : 'The ideas holding the lesson together.'))}</h2>
    <ol class="present-idea-list">${items.map((item, index) => `<li><span>${String(index + 1).padStart(2, '0')}</span><p>${e(item)}</p></li>`).join('')}</ol>
  </div>`;
}

function conceptsSlide({ lang, e, icon, lens }) {
  const isPt = lang !== 'en';
  const concepts = lens.concepts.slice(0, 3);
  return `<div class="present-slide">
    <span class="present-eyebrow">${e(isPt ? 'CONCEITOS' : 'CONCEPTS')}</span>
    <h2>${e(isPt ? 'Cada conceito, explicado devagar.' : 'Each concept, explained slowly.')}</h2>
    <div class="present-concept-grid">${concepts.map((concept) => `<article class="present-concept">
      <span class="present-concept-icon">${icon(concept.icon, 22)}</span>
      <h3>${e(concept.term)}</h3>
      <p>${e(concept.definition)}</p>
      ${concept.analogy ? `<blockquote>${e(concept.analogy)}</blockquote>` : ''}
      ${concept.mistake ? `<small>${icon('warning', 13)} ${e(concept.mistake)}</small>` : ''}
    </article>`).join('')}</div>
  </div>`;
}

function applicationsSlide({ lang, e, icon, lens }) {
  const isPt = lang !== 'en';
  return `<div class="present-slide">
    <span class="present-eyebrow">${e(isPt ? 'MUNDO REAL' : 'REAL WORLD')}</span>
    <h2>${e(isPt ? 'Onde isto aparece lá fora.' : 'Where this shows up out there.')}</h2>
    <div class="present-app-grid">${lens.applications.slice(0, 3).map((app) => `<article class="present-app">
      <span class="present-app-icon">${icon(app.icon, 26)}</span>
      <small>${e(app.kicker)}</small>
      <h3>${e(app.title)}</h3>
      <p>${e(app.text)}</p>
    </article>`).join('')}</div>
  </div>`;
}

function labSlide({ lang, e, icon, title }) {
  const isPt = lang !== 'en';
  return `<div class="present-slide present-slide-lab">
    <span class="present-eyebrow">${e(isPt ? 'LABORATÓRIO 3D' : '3D LAB')}</span>
    <h2>${e(title)}</h2>
    <p class="present-lab-intro">${e(isPt ? 'Arrasta o cenário, seleciona um ponto e mostra à turma onde o conceito é usado no mundo real.' : 'Drag the scene, select a point and show the class where the concept is used in the real world.')}</p>
    <div class="summary-lab-root" data-concept-lab></div>
    <p class="present-lab-note">${icon('info', 13)} ${e(isPt ? 'Se o projetor não desenhar o cenário, usa a lista de conceitos no resumo.' : 'If the projector cannot draw the scene, use the concept list in the summary.')}</p>
  </div>`;
}

function questionsSlide({ lang, e, items }) {
  const isPt = lang !== 'en';
  return `<div class="present-slide">
    <span class="present-eyebrow">${e(isPt ? 'PERGUNTAS PARA A TURMA' : 'QUESTIONS FOR THE CLASS')}</span>
    <h2>${e(isPt ? 'Pensem antes de responder.' : 'Think before answering.')}</h2>
    <ul class="present-question-list">${items.map((item, index) => `<li><span>${index + 1}</span><p>${e(item)}</p></li>`).join('')}</ul>
  </div>`;
}

function closeSlide({ lang, e, icon, href, record }) {
  const isPt = lang !== 'en';
  return `<div class="present-slide present-close">
    <span class="present-eyebrow">${e(isPt ? 'FIM DA AULA' : 'END OF CLASS')}</span>
    <h2>${e(isPt ? 'Agora pratiquem com o vosso próprio resumo.' : 'Now practise with your own summary.')}</h2>
    <p>${e(isPt ? 'O teste é prática, não uma nota oficial. Confirmem sempre com o professor.' : 'The quiz is practice, not an official grade. Always confirm with the teacher.')}</p>
    <div class="present-close-actions">
      <a class="button button-lime" href="${href(`summary/${record.id}`)}">${icon('target', 16)} ${e(isPt ? 'Abrir resumo e teste' : 'Open summary and quiz')}</a>
      <a class="button button-ghost" href="${href('classroom')}">${icon('users', 16)} ${e(isPt ? 'Voltar à turma' : 'Back to class')}</a>
    </div>
    <p class="present-credit">${e(isPt ? 'Ingenium 2.0 · criado pelos irmãos Bulezi — Rafael Bulezi e Afonso Bulezi.' : 'Ingenium 2.0 · created by the Bulezi brothers — Rafael Bulezi and Afonso Bulezi.')}</p>
  </div>`;
}

export function renderPresentationPage({ app, lang, ui, e, icon, href, record, analysis, slide = 0 }) {
  const isPt = lang !== 'en';
  const lens = buildConceptLens(analysis, { lang, title: record.title });
  const slides = slideList({ lang, analysis });
  const index = Math.max(0, Math.min(slides.length - 1, Number(slide) || 0));
  const current = slides[index];
  let content = '';
  if (current.kind === 'cover') content = coverSlide({ lang, e, icon, record, analysis });
  else if (current.kind === 'ideas') content = ideasSlide({ lang, e, items: current.items, usingKeywords: current.usingKeywords });
  else if (current.kind === 'concepts') content = conceptsSlide({ lang, e, icon, lens });
  else if (current.kind === 'applications') content = applicationsSlide({ lang, e, icon, lens });
  else if (current.kind === 'lab') content = labSlide({ lang, e, icon, title: current.title });
  else if (current.kind === 'questions') content = questionsSlide({ lang, e, items: current.items });
  else content = closeSlide({ lang, e, icon, href, record });

  const labels = {
    cover: isPt ? 'Capa' : 'Cover',
    ideas: isPt ? 'Ideias-chave' : 'Key ideas',
    concepts: isPt ? 'Conceitos' : 'Concepts',
    applications: isPt ? 'Aplicações' : 'Applications',
    lab: isPt ? 'Laboratório 3D' : '3D lab',
    questions: isPt ? 'Perguntas' : 'Questions',
    close: isPt ? 'Fecho' : 'Closing',
  };

  app.innerHTML = `<section class="present-page" aria-label="${e(isPt ? 'Modo aula' : 'Class mode')}">
    <header class="present-bar">
      <a class="present-exit" href="${href('classroom')}" data-action="present-exit" aria-label="${e(isPt ? 'Sair do modo aula' : 'Exit class mode')}">${icon('back', 16)} <span>${e(isPt ? 'Sair' : 'Exit')}</span></a>
      <div class="present-bar-main">
        <div class="present-bar-copy"><strong>${e(record.title)}</strong><small>${e(labels[current.kind])} · ${index + 1}/${slides.length}</small></div>
        <div class="present-progress" role="progressbar" aria-valuemin="1" aria-valuemax="${slides.length}" aria-valuenow="${index + 1}" aria-label="${e(isPt ? 'Progresso da aula' : 'Class progress')}"><i style="width:${((index + 1) / slides.length) * 100}%"></i></div>
      </div>
      <div class="present-controls">
        <button type="button" data-action="present-prev" ${index === 0 ? 'disabled' : ''} aria-label="${e(isPt ? 'Diapositivo anterior' : 'Previous slide')}">${icon('back', 17)}</button>
        <button type="button" data-action="present-next" ${index === slides.length - 1 ? 'disabled' : ''} aria-label="${e(isPt ? 'Diapositivo seguinte' : 'Next slide')}">${icon('arrow', 17)}</button>
      </div>
    </header>
    <div class="present-stage" role="region" aria-label="${e(isPt ? 'Diapositivo da aula' : 'Class slide')}" aria-live="polite">${content}</div>
    <footer class="present-foot">
      <span>${e(isPt ? '← → para navegar · Esc para sair' : '← → to navigate · Esc to exit')}</span>
      <span>${e(isPt ? 'Prática, não avaliação oficial.' : 'Practice, not official assessment.')}</span>
    </footer>
  </section>`;
  return { lens, slides };
}
