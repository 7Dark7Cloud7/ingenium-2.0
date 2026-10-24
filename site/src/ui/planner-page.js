import { addDaysIso, toIsoDate, fromIsoDate } from "../study/planner-engine.js";
import { subjectLabel } from "./summaries-page.js";

const TYPE_LABELS = {
  pt: { exam: 'Avaliação', deadline: 'Entrega', class: 'Aula', other: 'Evento' },
  en: { exam: 'Assessment', deadline: 'Deadline', class: 'Class', other: 'Event' },
};

const KIND_LABELS = {
  pt: { final: 'Revisão final', deliverable: 'Entrega', review: 'Revisão', practice: 'Prática', test: 'Teste', summary: 'Resumo', urgent: 'Hoje', task: 'Estudo' },
  en: { final: 'Final review', deliverable: 'Submission', review: 'Review', practice: 'Practice', test: 'Self-test', summary: 'Summary', urgent: 'Today', task: 'Study' },
};

const WEEKDAY_NAMES = {
  pt: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
  en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
};

const MONTHS = {
  pt: ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
};

function dateFromIso(value) {
  return fromIsoDate(value);
}

function dayLabel(value, lang, options = {}) {
  const date = dateFromIso(value);
  return new Intl.DateTimeFormat(lang === 'en' ? 'en-GB' : 'pt-PT', {
    weekday: options.short ? 'short' : 'long',
    day: 'numeric',
    month: options.short ? 'short' : 'long',
  }).format(date);
}

function monthShort(value, lang) {
  return new Intl.DateTimeFormat(lang === 'en' ? 'en-GB' : 'pt-PT', { month: 'short' }).format(dateFromIso(value)).replace('.', '');
}

function dayNumber(value) {
  return String(dateFromIso(value).getDate()).padStart(2, '0');
}

function relativeLabel(days, lang) {
  const isPt = lang !== 'en';
  if (!Number.isFinite(days)) return '';
  if (days === 0) return isPt ? 'Hoje' : 'Today';
  if (days === 1) return isPt ? 'Amanhã' : 'Tomorrow';
  if (days < 0) return isPt ? `${Math.abs(days)} dias atrás` : `${Math.abs(days)} days ago`;
  return isPt ? `Em ${days} dias` : `In ${days} days`;
}

function typeLabel(type, lang) {
  return TYPE_LABELS[lang === 'en' ? 'en' : 'pt'][type] || TYPE_LABELS.pt.other;
}

function kindLabel(kind, lang) {
  return KIND_LABELS[lang === 'en' ? 'en' : 'pt'][kind] || KIND_LABELS.pt.task;
}

export function programmeExample(lang = 'pt') {
  const now = new Date();
  const today = toIsoDate(now);
  const exam = addDaysIso(today, 14);
  const deadline = addDaysIso(today, 8);
  const secondExam = addDaysIso(today, 21);
  const numeric = (iso) => { const [year, month, day] = iso.split('-'); return `${day}/${month}/${year}`; };
  const written = (iso) => { const date = dateFromIso(iso); return `${date.getDate()} de ${MONTHS.pt[date.getMonth()]} de ${date.getFullYear()}`; };
  if (lang === 'en') {
    const month = (iso) => { const date = dateFromIso(iso); return `${date.getDate()} ${MONTHS.en[date.getMonth()]} ${date.getFullYear()}`; };
    return [
      `Physics exam — ${numeric(exam)} at 09:00`,
      `Chemistry report deadline: ${numeric(deadline)} at 23:59`,
      `Mathematics test ${month(secondExam)}`,
      `ALGA lecture — Monday 08:00-10:00`,
      `Chemistry lab — Wednesday 14:00-16:00`,
    ].join('\n');
  }
  return [
    `Exame de Física — ${numeric(exam)} às 09:00`,
    `Entrega do relatório de Química: ${numeric(deadline)} às 23:59`,
    `Prova de Matemática ${written(secondExam)}`,
    `Aula de ALGA — segunda-feira 08:00-10:00`,
    `Laboratório de Química — quarta-feira 14:00-16:00`,
  ].join('\n');
}

function renderEventList({ lang, e, icon, programme, todayIso }) {
  const isPt = lang !== 'en';
  if (!programme.events.length) return '';
  return `<div class="plan-event-list">${programme.events.map((event) => {
    const past = event.date < todayIso;
    return `<article class="plan-event-row ${past ? 'is-past' : ''} ${event.type}">
      <div class="plan-event-date"><strong>${e(dayNumber(event.date))}</strong><span>${e(monthShort(event.date, lang))}</span></div>
      <div class="plan-event-copy"><div class="plan-event-top"><span class="plan-type-chip ${e(event.type)}">${e(typeLabel(event.type, lang))}</span><span class="study-subject-tag ${e(event.subject)}">${e(subjectLabel(event.subject, lang))}</span></div><strong>${e(event.title)}</strong><small>${e(event.time ? `${event.time} · ` : '')}${e(past ? (isPt ? 'já passou' : 'past') : dayLabel(event.date, lang, { short: true }))}${event.yearAssumed ? ` · ${e(isPt ? 'ano inferido' : 'year inferred')}` : ''}</small></div>
    </article>`;
  }).join('')}</div>`;
}

function renderWeekly({ lang, e, icon, programme }) {
  const isPt = lang !== 'en';
  if (!programme.weekly.length) return '';
  const order = [1, 2, 3, 4, 5, 6, 0];
  const names = WEEKDAY_NAMES[lang === 'en' ? 'en' : 'pt'];
  const groups = order.map((weekday) => ({ weekday, items: programme.weekly.filter((item) => item.weekday === weekday) })).filter((group) => group.items.length);
  return `<div class="plan-weekly"><div class="plan-subheading"><span class="study-eyebrow">${e(isPt ? 'HORÁRIO SEMANAL' : 'WEEKLY TIMETABLE')}</span><span>${e(`${programme.weekly.length} ${isPt ? 'aulas' : 'classes'}`)}</span></div>${groups.map((group) => `<div class="plan-weekly-day"><span class="plan-weekday">${e(names[group.weekday])}</span><div>${group.items.map((item) => `<div class="plan-weekly-item"><strong>${e(item.start)}${item.end ? `–${e(item.end)}` : ''}</strong><span>${e(item.title)}</span><span class="study-subject-tag ${e(item.subject)}">${e(subjectLabel(item.subject, lang))}</span></div>`).join('')}</div></div>`).join('')}</div>`;
}

function sessionRow({ lang, e, icon, session, done }) {
  const isPt = lang !== 'en';
  return `<article class="plan-session ${done ? 'is-done' : ''} ${session.kind}">
    <button type="button" class="plan-session-check" data-action="plan-toggle-session" data-key="${e(session.key)}" aria-pressed="${done}" aria-label="${e(done ? (isPt ? `Reabrir sessão: ${session.title}` : `Reopen session: ${session.title}`) : (isPt ? `Marcar sessão como feita: ${session.title}` : `Mark session complete: ${session.title}`))}">${done ? icon('check', 15) : ''}</button>
    <div class="plan-session-copy">
      <div class="plan-session-meta"><span class="plan-kind-chip ${e(session.kind)}">${e(kindLabel(session.kind, lang))}</span><span class="study-subject-tag ${e(session.subject || 'general')}">${e(subjectLabel(session.subject || 'general', lang))}</span><span>${e(`${session.duration} ${isPt ? 'min' : 'min'}`)}</span></div>
      <strong>${e(session.title)}</strong>
      ${session.detail ? `<small>${e(session.detail)}</small>` : ''}
      ${session.eventTitle && session.kind !== 'final' ? `<span class="plan-session-event">${icon('target', 12)} ${e(session.eventTitle)}</span>` : ''}
    </div>
    ${session.href ? `<a class="plan-session-open" href="${e(session.href)}" aria-label="${e(isPt ? `Abrir ${session.title}` : `Open ${session.title}`)}">${icon('arrow', 16)}</a>` : ''}
  </article>`;
}

function renderPlanSessions({ lang, e, icon, plan, doneKeys }) {
  const isPt = lang !== 'en';
  if (!plan.sessions.length) {
    return `<div class="plan-sessions-empty"><span class="study-empty-icon">${icon('route', 26)}</span><h3>${e(isPt ? 'Sem sessões para mostrar.' : 'No sessions to show.')}</h3><p>${e(isPt ? 'Conclui ou reabre lições para gerar um percurso. Também podes colar avaliações datadas.' : 'Complete or reopen lessons to generate a path. You can also paste dated assessments.')}</p></div>`;
  }
  const groups = [];
  for (const session of plan.sessions) {
    const last = groups[groups.length - 1];
    if (last && last.date === session.date) last.items.push(session);
    else groups.push({ date: session.date, items: [session] });
  }
  const doneCount = plan.sessions.filter((session) => doneKeys.has(session.key)).length;
  return `<div class="plan-progress-line"><span><strong>${doneCount}</strong> / ${plan.sessions.length} ${e(isPt ? 'sessões feitas' : 'sessions done')}</span><div class="plan-progress-track"><i style="width:${Math.round(doneCount / plan.sessions.length * 100)}%"></i></div></div>
  <div class="plan-timeline">${groups.map((group) => {
    const isToday = group.date === plan.generatedFor;
    return `<div class="plan-day ${isToday ? 'is-today' : ''}"><div class="plan-day-label"><strong>${e(isToday ? (isPt ? 'Hoje' : 'Today') : dayLabel(group.date, lang, { short: true }))}</strong><span>${e(group.date)}</span></div><div class="plan-day-sessions">${group.items.map((session) => sessionRow({ lang, e, icon, session, done: doneKeys.has(session.key) })).join('')}</div></div>`;
  }).join('')}</div>`;
}

export function renderPlannerPage({ app, lang, ui, e, icon, href, draft = {}, notice = null, programme = {}, plan, summaryCount = 0 }) {
  const isPt = lang !== 'en';
  const hasProgramme = (programme.events?.length || 0) + (programme.weekly?.length || 0) > 0;
  const doneKeys = new Set(Array.isArray(draft.done) ? draft.done : []);
  const upcoming = plan?.nextEvent;
  const noticeMarkup = notice
    ? `<div class="study-notice ${notice.tone === 'ok' ? 'is-ok' : ''}" role="status">${icon(notice.tone === 'ok' ? 'check' : 'info', 16)}<span>${e(notice.message)}</span></div>`
    : '';
  const planNote = plan?.note
    ? `<div class="plan-note">${icon('info', 16)}<span>${e(plan.note)}</span></div>`
    : '';

  const nextCard = upcoming
    ? `<article class="plan-next-card">
        <div class="plan-next-top"><span class="study-eyebrow">${e(isPt ? 'PRÓXIMA AVALIAÇÃO' : 'NEXT ASSESSMENT')}</span><span class="plan-countdown">${e(relativeLabel(upcoming.daysUntil, lang))}</span></div>
        <h3>${e(upcoming.title)}</h3>
        <p>${icon('clock', 14)} ${e(`${dayLabel(upcoming.date, lang, { short: true })}${upcoming.time ? ` · ${upcoming.time}` : ''}`)}</p>
        <div class="plan-next-meta"><span class="plan-type-chip ${e(upcoming.type)}">${e(typeLabel(upcoming.type, lang))}</span><span class="study-subject-tag ${e(upcoming.subject)}">${e(subjectLabel(upcoming.subject, lang))}</span></div>
      </article>`
    : `<article class="plan-next-card is-empty"><div class="plan-next-top"><span class="study-eyebrow">${e(isPt ? 'PRÓXIMA AVALIAÇÃO' : 'NEXT ASSESSMENT')}</span></div><h3>${e(isPt ? 'Sem datas no horizonte.' : 'No dates ahead.')}</h3><p>${e(isPt ? 'O plano usa as lições que ainda não concluíste.' : 'The plan uses the lessons you have not completed yet.')}</p></article>`;

  const unparsed = programme.unparsed?.length
    ? `<details class="plan-unparsed"><summary>${icon('info', 15)} <span>${e(`${programme.unparsed.length} ${isPt ? 'linhas não reconhecidas' : 'lines not recognised'}`)}</span>${icon('chevron', 14)}</summary><div><p>${e(isPt ? 'Estas linhas foram ignoradas. Corrige as datas ou o formato e analisa outra vez.' : 'These lines were ignored. Fix the dates or format and analyse again.')}</p><ul>${programme.unparsed.map((line) => `<li>${e(line)}</li>`).join('')}</ul></div></details>`
    : '';

  const programmeSummary = hasProgramme
    ? `<div class="plan-overview">
        ${nextCard}
        <div class="plan-overview-stats">
          <div><strong>${programme.events?.length || 0}</strong><span>${e(isPt ? 'datas' : 'dates')}</span></div>
          <div><strong>${programme.weekly?.length || 0}</strong><span>${e(isPt ? 'aulas/semana' : 'classes/week')}</span></div>
          <div><strong>${plan?.sessions?.length || 0}</strong><span>${e(isPt ? 'sessões' : 'sessions')}</span></div>
        </div>
      </div>`
    : '';

  app.innerHTML = `<section class="page tools-page study-page planner-page">
    <div class="tools-back-row"><a class="text-link" href="${href('home')}">${icon('back', 15)} ${e(ui('home'))}</a><span class="tools-kicker">${e(isPt ? 'ESTUDO LOCAL · PLANO' : 'LOCAL STUDY · PLAN')}</span></div>
    <header class="tools-heading study-heading">
      <div><h1>${e(isPt ? 'Plano' : 'Plan')}<span class="title-period" aria-hidden="true">.</span></h1><p class="lead">${e(isPt ? 'Cola o calendário do semestre — exames, entregas e horário. O Ingenium lê as datas, cruza-as com as tuas lições por concluir e propõe uma sequência de estudo.' : 'Paste the semester calendar — exams, deadlines and timetable. Ingenium reads the dates, matches them to your unfinished lessons and proposes a study sequence.')}</p></div>
      <div class="study-heading-count"><strong>${plan?.sessions?.length || 0}</strong><span>${e(isPt ? 'sessões sugeridas' : 'suggested sessions')}</span></div>
    </header>
    ${noticeMarkup}
    <div class="study-compose-layout planner-compose-layout">
      <section class="study-composer" aria-labelledby="plan-compose-title">
        <div class="study-section-heading"><div><span class="study-eyebrow">${e(isPt ? 'PROGRAMA E CALENDÁRIO' : 'PROGRAMME & CALENDAR')}</span><h2 id="plan-compose-title">${e(isPt ? 'Cola as tuas datas' : 'Paste your dates')}</h2></div><span class="study-local-chip">${icon('lock', 13)} ${e(isPt ? 'SÓ NESTE DISPOSITIVO' : 'THIS DEVICE ONLY')}</span></div>
        <p class="study-compose-help">${e(isPt ? 'Uma linha por item. Datas aceites: 05/11/2026, 12 de novembro, 2026-11-05, hoje ou amanhã. O horário semanal usa o dia da semana e a hora, por exemplo «segunda 08:00–10:00».' : 'One item per line. Dates accepted: 05/11/2026, 12 November, 2026-11-05, today or tomorrow. Weekly classes use weekday and time, e.g. “Monday 08:00–10:00”.')}</p>
        <label class="study-field study-field-text"><span>${e(isPt ? 'Calendário / programa do semestre' : 'Calendar / semester programme')}</span><textarea id="plan-text" name="plan-text" data-plan-text rows="10" placeholder="${e(isPt ? 'Exame de Física — 05/11/2026 às 09:00…' : 'Physics exam — 05/11/2026 at 09:00…')}">${e(draft.text || '')}</textarea></label>
        <div class="study-compose-foot"><span class="study-counter" data-plan-counter>${e(isPt ? 'As datas ficam guardadas neste navegador.' : 'Dates are stored in this browser.')}</span><div class="study-compose-actions"><button type="button" class="button button-ghost button-small" data-action="plan-clear" ${(!programme.parsedAt && !String(draft.text || '').trim()) ? 'disabled' : ''}>${e(isPt ? 'Limpar' : 'Clear')}</button><button type="button" class="button button-ghost button-small" data-action="plan-example">${icon('spark', 14)} ${e(isPt ? 'Exemplo' : 'Example')}</button><button type="button" class="button button-primary" data-action="plan-parse">${e(isPt ? 'Ler calendário' : 'Read calendar')} ${icon('arrow', 15)}</button></div></div>
        <p class="study-honesty">${icon('info', 14)} ${e(isPt ? 'A leitura é local e determinística. Confirma sempre as datas oficiais na plataforma da escola: isto é um apoio de organização, não uma fonte oficial.' : 'Reading happens locally and deterministically. Always confirm official dates on the school platform: this is an organisation aid, not an official source.')}</p>
      </section>
      <aside class="study-guide" aria-label="${e(isPt ? 'O que o plano faz' : 'What the plan does')}">
        <span class="study-eyebrow">${e(isPt ? 'O QUE ACONTECE A SEGUIR' : 'WHAT HAPPENS NEXT')}</span>
        <ol class="study-guide-steps">
          <li><span>01</span><div><strong>${e(isPt ? 'Lê as datas' : 'Reads the dates')}</strong><p>${e(isPt ? 'Identifica avaliações, entregas e aulas semanais.' : 'Finds assessments, deadlines and weekly classes.')}</p></div></li>
          <li><span>02</span><div><strong>${e(isPt ? 'Cruza com o progresso' : 'Matches your progress')}</strong><p>${e(isPt ? 'Usa as lições que ainda não marcaste como feitas.' : 'Uses the lessons you have not marked complete.')}</p></div></li>
          <li><span>03</span><div><strong>${e(isPt ? 'Distribui o esforço' : 'Spreads the effort')}</strong><p>${e(isPt ? 'Espalha revisões, prática e revisão final antes de cada data.' : 'Spreads reviews, practice and a final review before each date.')}</p></div></li>
        </ol>
        <div class="study-guide-note">${icon('book', 17)}<span>${e(summaryCount ? `${summaryCount} ${isPt ? 'resumo(s) entram no plano quando a matéria coincide.' : 'summary(ies) join the plan when the subject matches.'}` : (isPt ? 'Cria resumos para o plano incluir revisão das tuas próprias notas.' : 'Create summaries so the plan can include reviewing your own notes.'))}</span></div>
        <a class="text-link" href="${href('summaries')}">${e(isPt ? 'Ver resumos' : 'See summaries')} ${icon('arrow', 14)}</a>
      </aside>
    </div>
    ${programmeSummary}
    ${unparsed}
    <section class="plan-workspace">
      <div class="study-section-heading"><div><span class="study-eyebrow">${e(isPt ? 'PLANO ADAPTADO' : 'ADAPTIVE PLAN')}</span><h2>${e(isPt ? 'Quando estudar o quê' : 'When to study what')}</h2></div><div class="plan-toolbar">${(programme.events?.length || programme.weekly?.length || plan?.sessions?.length) ? `<button type="button" class="button button-ghost button-small" data-action="plan-export">${icon('clock', 15)} ${e(isPt ? 'Exportar .ics' : 'Export .ics')}</button>` : ''}</div></div>
      ${planNote}
      ${hasProgramme ? `<div class="plan-detail-grid"><section class="plan-block"><div class="plan-subheading"><span class="study-eyebrow">${e(isPt ? 'AVALIAÇÕES E ENTREGAS' : 'ASSESSMENTS & DEADLINES')}</span><span>${e(`${programme.events?.length || 0} ${isPt ? 'itens' : 'items'}`)}</span></div>${renderEventList({ lang, e, icon, programme, todayIso: plan.generatedFor })}</section><section class="plan-block">${renderWeekly({ lang, e, icon, programme })}</section></div>` : ''}
      ${renderPlanSessions({ lang, e, icon, plan, doneKeys })}
    </section>
    <div class="tools-footer-links"><a href="${href('summaries')}">${icon('book', 17)}<span><strong>${e(isPt ? 'Resumos' : 'Summaries')}</strong><small>${e(isPt ? 'Transforma notas em cartões e testes' : 'Turn notes into cards and quizzes')}</small></span>${icon('arrow', 16)}</a><a href="${href('program')}">${icon('layers', 17)}<span><strong>${e(isPt ? 'Programa' : 'Programme')}</strong><small>${e(isPt ? 'Vê o semestre e os tópicos' : 'See the semester and topics')}</small></span>${icon('arrow', 16)}</a></div>
  </section>`;
}
