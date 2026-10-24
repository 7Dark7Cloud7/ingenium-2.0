import { buildConceptLens } from '../study/concept-lens.js';

const VOICE_KEY = 'ingenium2-audio-voice-v1';
const RATE_KEY = 'ingenium2-audio-rate-v1';

function clean(value, max = 1200) {
  return String(value ?? '').replace(/\s+/g, ' ').trim().slice(0, max);
}

function make(tag, className = '', text = '') {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
}

export function buildAudioScript(analysis, { lang = 'pt', title = '', record = null } = {}) {
  const isPt = lang !== 'en';
  const lens = buildConceptLens(analysis, { lang, title });
  const sections = [];
  const central = clean(analysis.centralIdea, 900);
  if (central) {
    sections.push({
      id: 'intro',
      label: isPt ? 'Abertura' : 'Opening',
      title: title || (isPt ? 'A ideia central' : 'The central idea'),
      text: isPt
        ? `Vamos ouvir este resumo. ${central} Enquanto ouves, tenta explicar esta ideia por palavras tuas.`
        : `Let us listen to this summary. ${central} While listening, try explaining this idea in your own words.`,
    });
  }

  const keyIdeas = (analysis.keyIdeas || []).map((idea) => clean(idea, 700)).filter(Boolean).slice(0, 6);
  if (keyIdeas.length) {
    sections.push({
      id: 'ideas',
      label: isPt ? 'Ideias-chave' : 'Key ideas',
      title: isPt ? 'As ideias, uma a uma' : 'The ideas, one by one',
      text: `${isPt ? 'Ideias-chave.' : 'Key ideas.'} ${keyIdeas.map((idea, index) => `${index + 1}. ${idea}`).join(' ')}`,
    });
  }

  const concepts = (lens.concepts || []).slice(0, 5);
  if (concepts.length) {
    const parts = concepts.map((concept) => {
      const bits = [`${concept.term}. ${clean(concept.definition, 600)}`];
      if (concept.analogy) bits.push(`${isPt ? 'Pensa assim' : 'Think of it this way'}: ${clean(concept.analogy, 500)}`);
      if (concept.application?.text) bits.push(`${isPt ? 'No mundo real' : 'In the real world'}: ${clean(concept.application.title, 120)}. ${clean(concept.application.text, 600)}`);
      if (concept.mistake) bits.push(`${isPt ? 'Erro comum' : 'Common mistake'}: ${clean(concept.mistake, 500)}`);
      return bits.join(' ');
    });
    sections.push({
      id: 'concepts',
      label: isPt ? 'Conceitos' : 'Concepts',
      title: isPt ? 'Entender, não decorar' : 'Understand, do not memorise',
      text: `${isPt ? 'Agora os conceitos explicados.' : 'Now the explained concepts.'} ${parts.join(' ')}`,
    });
  }

  const questions = (analysis.guidingQuestions || []).map((question) => clean(question, 400)).filter(Boolean).slice(0, 5);
  if (questions.length) {
    const intro = isPt
      ? 'Pausa aqui se precisares. Tenta responder em voz alta antes de continuares.'
      : 'Pause here if you need to. Answer out loud before continuing.';
    sections.push({
      id: 'questions',
      label: isPt ? 'Perguntas' : 'Questions',
      title: isPt ? 'Pergunta-te' : 'Ask yourself',
      text: `${intro} ${questions.join(' ')}`,
    });
  }

  const outline = (analysis.outline || []).flatMap((block) => block.points || []).map((point) => clean(point, 500)).filter(Boolean).slice(0, 5);
  if (outline.length) {
    sections.push({
      id: 'structure',
      label: isPt ? 'Estrutura' : 'Structure',
      title: isPt ? 'O percurso do texto' : 'The path through the text',
      text: `${isPt ? 'Para fechar, o percurso do resumo.' : 'To close, the path through the summary.'} ${outline.join(' ')}`,
    });
  }

  if (!sections.length) {
    sections.push({
      id: 'empty',
      label: isPt ? 'Sem guião' : 'No script',
      title: isPt ? 'Este resumo ainda não tem texto suficiente.' : 'This summary does not have enough text yet.',
      text: isPt
        ? 'Acrescenta frases completas ao resumo e volta a organizar. Só depois vale a pena ouvir.'
        : 'Add complete sentences to the summary and organise it again. Only then is listening useful.',
    });
  }

  const totalChars = sections.reduce((sum, section) => sum + section.text.length, 0);
  return {
    lang: isPt ? 'pt' : 'en',
    title: title || (isPt ? 'Resumo' : 'Summary'),
    sections,
    estimateMinutes: Math.max(1, Math.round(totalChars / 900)),
    subject: record?.subject || 'general',
  };
}

function loadRate() {
  const raw = Number(localStorage.getItem(RATE_KEY));
  return [0.85, 1, 1.15, 1.3].includes(raw) ? raw : 1;
}

function voicesFor(lang) {
  if (!('speechSynthesis' in window)) return [];
  const all = window.speechSynthesis.getVoices();
  const prefix = lang === 'en' ? 'en' : 'pt';
  const preferred = all.filter((voice) => String(voice.lang || '').toLowerCase().startsWith(prefix));
  return preferred.length ? preferred : all;
}

function clock(seconds) {
  const value = Math.max(0, Math.round(seconds));
  return `${Math.floor(value / 60)}:${String(value % 60).padStart(2, '0')}`;
}

export function mountAudioLesson(root, { analysis, lang = 'pt', title = '', record = null } = {}) {
  if (!root) return null;
  const isPt = lang !== 'en';
  const script = buildAudioScript(analysis, { lang, title, record });
  const supported = typeof window !== 'undefined'
    && 'speechSynthesis' in window
    && typeof window.SpeechSynthesisUtterance === 'function';

  let index = 0;
  let rate = loadRate();
  let voiceUri = '';
  let playing = false;
  let paused = false;
  let currentUtterance = null;
  let startedAt = 0;
  let timer = 0;

  root.replaceChildren();
  root.classList.add('audio-lesson');

  const header = make('div', 'audio-lesson-head');
  const headCopy = make('div', 'audio-lesson-copy');
  headCopy.append(
    make('span', 'study-eyebrow', isPt ? 'AULA EM ÁUDIO' : 'AUDIO LESSON'),
    make('h3', '', isPt ? 'Ouve o resumo como uma aula.' : 'Listen to the summary as a lesson.'),
    make('p', '', isPt
      ? 'A voz é gerada no teu dispositivo. O texto do resumo não é enviado para nenhum servidor.'
      : 'The voice is generated on your device. Your summary text is not sent to any server.'),
  );
  const badge = make('span', `audio-lesson-badge${supported ? '' : ' is-off'}`, supported
    ? (isPt ? 'Voz do dispositivo' : 'Device voice')
    : (isPt ? 'Áudio indisponível' : 'Audio unavailable'));
  header.append(headCopy, badge);

  const card = make('div', 'audio-card');
  const now = make('div', 'audio-now');
  const nowLabel = make('span', 'audio-now-label', isPt ? 'A OUVIR' : 'NOW PLAYING');
  const nowTitle = make('strong', 'audio-now-title', script.sections[0].title);
  const nowMeta = make('span', 'audio-now-meta', script.sections[0].label);
  now.append(nowLabel, nowTitle, nowMeta);

  const visual = make('div', 'audio-visual');
  const bars = Array.from({ length: 16 }, (_, barIndex) => {
    const bar = make('i', 'audio-bar');
    bar.style.setProperty('--i', String(barIndex));
    return bar;
  });
  const orb = make('span', 'audio-orb');
  orb.append(...bars);
  visual.append(orb);

  const progress = make('div', 'audio-progress');
  const track = make('div', 'audio-track');
  track.setAttribute('role', 'progressbar');
  track.setAttribute('aria-label', isPt ? 'Progresso da secção' : 'Section progress');
  track.setAttribute('aria-valuemin', '0');
  track.setAttribute('aria-valuemax', '100');
  track.setAttribute('aria-valuenow', '0');
  const fill = make('i', 'audio-fill');
  track.append(fill);
  const time = make('span', 'audio-time', '0:00');
  progress.append(track, time);

  const controls = make('div', 'audio-controls');
  const prev = make('button', 'audio-button audio-button-small', '');
  prev.type = 'button';
  prev.setAttribute('aria-label', isPt ? 'Secção anterior' : 'Previous section');
  prev.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 5 8 12l10 7z"/><path d="M5 5v14"/></svg>';
  const playButton = make('button', 'audio-button audio-button-play', '');
  playButton.type = 'button';
  playButton.setAttribute('aria-label', isPt ? 'Ouvir aula' : 'Play lesson');
  const next = make('button', 'audio-button audio-button-small', '');
  next.type = 'button';
  next.setAttribute('aria-label', isPt ? 'Secção seguinte' : 'Next section');
  next.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 5 10 7L6 19z"/><path d="M19 5v14"/></svg>';
  controls.append(prev, playButton, next);

  const rateField = make('label', 'audio-field');
  rateField.append(make('span', '', isPt ? 'Velocidade' : 'Speed'));
  const rateSelect = make('select', 'audio-select');
  rateSelect.setAttribute('aria-label', isPt ? 'Velocidade da voz' : 'Voice speed');
  [0.85, 1, 1.15, 1.3].forEach((value) => {
    const option = make('option', '', `${value}×`);
    option.value = String(value);
    option.selected = value === rate;
    rateSelect.append(option);
  });
  rateField.append(rateSelect);

  const voiceField = make('label', 'audio-field audio-field-voice');
  voiceField.append(make('span', '', isPt ? 'Voz' : 'Voice'));
  const voiceSelect = make('select', 'audio-select');
  voiceSelect.setAttribute('aria-label', isPt ? 'Voz da leitura' : 'Reading voice');
  voiceField.append(voiceSelect);

  const fields = make('div', 'audio-fields');
  fields.append(rateField, voiceField);

  const foot = make('div', 'audio-foot');
  const transcriptButton = make('button', 'audio-link-button', isPt ? 'Ver guião completo' : 'View full script');
  transcriptButton.type = 'button';
  const downloadButton = make('button', 'audio-link-button', isPt ? 'Copiar guião' : 'Copy script');
  downloadButton.type = 'button';
  foot.append(transcriptButton, downloadButton);

  card.append(now, visual, progress, controls, fields, foot);

  const playlist = make('div', 'audio-playlist');
  playlist.append(make('span', 'study-eyebrow', isPt ? 'O QUE VAI SER LIDO' : 'WHAT WILL BE READ'));
  const list = make('ol', 'audio-section-list');
  const sectionButtons = script.sections.map((section, sectionIndex) => {
    const item = make('li', '');
    const button = make('button', 'audio-section-button');
    button.type = 'button';
    button.append(
      make('span', 'audio-section-number', String(sectionIndex + 1).padStart(2, '0')),
      make('span', 'audio-section-copy'),
    );
    const copy = button.querySelector('.audio-section-copy');
    copy.append(make('strong', '', section.title), make('small', '', section.label));
    button.addEventListener('click', () => {
      index = sectionIndex;
      stop();
      renderSection();
      if (supported) speak();
    });
    item.append(button);
    list.append(item);
    return button;
  });
  playlist.append(list);

  const transcript = make('details', 'audio-transcript');
  transcript.append(make('summary', '', isPt ? `Guião completo · ${script.sections.length} secções` : `Full script · ${script.sections.length} sections`));
  const transcriptBody = make('div', 'audio-transcript-body');
  script.sections.forEach((section) => {
    const article = make('article', '');
    article.append(make('h4', '', section.title), make('p', '', section.text));
    transcriptBody.append(article);
  });
  transcript.append(transcriptBody);

  const note = make('p', 'audio-note');
  note.textContent = supported
    ? (isPt
      ? `Voz do dispositivo · cerca de ${script.estimateMinutes} min. A qualidade depende das vozes instaladas no sistema. Sem envio de texto.`
      : `Device voice · about ${script.estimateMinutes} min. Quality depends on the voices installed on the system. No text is uploaded.`)
    : (isPt
      ? 'Este navegador não expõe vozes de leitura. O guião completo continua disponível abaixo para leres em voz alta ou usares noutra ferramenta.'
      : 'This browser does not expose reading voices. The full script below is still available to read aloud or use in another tool.');

  root.append(header, card, playlist, transcript, note);
  if (!supported) {
    playButton.disabled = true;
    prev.disabled = true;
    next.disabled = true;
    rateSelect.disabled = true;
    voiceSelect.disabled = true;
    voiceField.classList.add('is-empty');
  }

  function iconMarkup(kind) {
    if (kind === 'play') return '<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true"><path d="m8 5 11 7L8 19z"/></svg>';
    return '<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true"><path d="M7 5h4v14H7zm6 0h4v14h-4z"/></svg>';
  }

  function renderSection() {
    const section = script.sections[index];
    nowTitle.textContent = section.title;
    nowMeta.textContent = `${section.label} · ${index + 1}/${script.sections.length}`;
    sectionButtons.forEach((button, buttonIndex) => {
      const active = buttonIndex === index;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-current', active ? 'true' : 'false');
    });
    fill.style.width = '0%';
    track.setAttribute('aria-valuenow', '0');
    time.textContent = '0:00';
  }

  function setPlaying(value) {
    playing = value;
    card.classList.toggle('is-playing', value && !paused);
    playButton.innerHTML = value && !paused ? iconMarkup('pause') : iconMarkup('play');
    playButton.setAttribute('aria-label', value && !paused ? (isPt ? 'Pausar aula' : 'Pause lesson') : (isPt ? 'Ouvir aula' : 'Play lesson'));
    if (value && !paused) {
      startedAt = performance.now();
      clearInterval(timer);
      timer = window.setInterval(() => {
        if (!playing || paused) return;
        const elapsed = (performance.now() - startedAt) / 1000;
        const estimate = Math.max(6, script.sections[index].text.length / (13.5 * rate));
        const pct = Math.min(96, Math.round((elapsed / estimate) * 100));
        fill.style.width = `${pct}%`;
        track.setAttribute('aria-valuenow', String(pct));
        time.textContent = clock(elapsed);
      }, 450);
    } else {
      clearInterval(timer);
    }
  }

  function stop() {
    if (supported) window.speechSynthesis.cancel();
    currentUtterance = null;
    paused = false;
    setPlaying(false);
  }

  function finish() {
    clearInterval(timer);
    fill.style.width = '100%';
    track.setAttribute('aria-valuenow', '100');
    if (index < script.sections.length - 1) {
      index += 1;
      renderSection();
      speak();
    } else {
      setPlaying(false);
      nowMeta.textContent = isPt ? 'Aula terminada' : 'Lesson finished';
    }
  }

  function speak() {
    if (!supported) return;
    window.speechSynthesis.cancel();
    const section = script.sections[index];
    const utterance = new SpeechSynthesisUtterance(section.text);
    utterance.lang = script.lang === 'en' ? 'en-GB' : 'pt-PT';
    utterance.rate = rate;
    const selectedVoice = voicesFor(script.lang).find((voice) => voice.voiceURI === voiceUri);
    if (selectedVoice) utterance.voice = selectedVoice;
    utterance.onstart = () => {
      paused = false;
      setPlaying(true);
    };
    utterance.onboundary = (event) => {
      if (!Number.isFinite(event.charIndex)) return;
      const pct = Math.min(99, Math.round((event.charIndex / Math.max(1, section.text.length)) * 100));
      fill.style.width = `${pct}%`;
      track.setAttribute('aria-valuenow', String(pct));
    };
    utterance.onend = () => {
      if (currentUtterance !== utterance) return;
      currentUtterance = null;
      finish();
    };
    utterance.onerror = (event) => {
      if (event.error === 'canceled' || event.error === 'interrupted') return;
      currentUtterance = null;
      setPlaying(false);
      nowMeta.textContent = isPt ? 'A voz não conseguiu ler. Tenta outra voz.' : 'The voice could not read. Try another voice.';
    };
    currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }

  function togglePlay() {
    if (!supported) return;
    if (!playing) {
      speak();
      return;
    }
    if (paused) {
      window.speechSynthesis.resume();
      paused = false;
      setPlaying(true);
      return;
    }
    window.speechSynthesis.pause();
    paused = true;
    setPlaying(true);
    card.classList.remove('is-playing');
    playButton.innerHTML = iconMarkup('play');
    playButton.setAttribute('aria-label', isPt ? 'Continuar aula' : 'Resume lesson');
  }

  function changeSection(delta) {
    stop();
    index = Math.max(0, Math.min(script.sections.length - 1, index + delta));
    renderSection();
    if (supported) speak();
  }

  function populateVoices() {
    if (!supported) return;
    const voices = voicesFor(script.lang);
    voiceSelect.replaceChildren();
    if (!voices.length) {
      const option = make('option', '', isPt ? 'Voz padrão' : 'Default voice');
      option.value = '';
      voiceSelect.append(option);
      voiceField.classList.add('is-empty');
      voiceSelect.disabled = true;
      return;
    }
    voiceField.classList.remove('is-empty');
    voiceSelect.disabled = false;
    const stored = localStorage.getItem(VOICE_KEY) || '';
    if (!voiceUri) {
      const match = voices.find((voice) => voice.voiceURI === stored)
        || voices.find((voice) => voice.default)
        || voices[0];
      voiceUri = match?.voiceURI || '';
    }
    voices.forEach((voice) => {
      const option = make('option', '', `${voice.name}${voice.localService ? '' : ` · ${isPt ? 'online' : 'online'}`}`);
      option.value = voice.voiceURI;
      option.selected = voice.voiceURI === voiceUri;
      voiceSelect.append(option);
    });
  }

  playButton.addEventListener('click', togglePlay);
  prev.addEventListener('click', () => changeSection(-1));
  next.addEventListener('click', () => changeSection(1));
  rateSelect.addEventListener('change', () => {
    const nextRate = Number(rateSelect.value);
    rate = [0.85, 1, 1.15, 1.3].includes(nextRate) ? nextRate : 1;
    localStorage.setItem(RATE_KEY, String(rate));
    if (playing) {
      const wasPaused = paused;
      stop();
      if (!wasPaused) speak();
    }
  });
  voiceSelect.addEventListener('change', () => {
    voiceUri = voiceSelect.value;
    localStorage.setItem(VOICE_KEY, voiceUri);
    if (playing) {
      const wasPaused = paused;
      stop();
      if (!wasPaused) speak();
    }
  });
  transcriptButton.addEventListener('click', () => {
    transcript.open = true;
    if (typeof transcript.scrollIntoView === 'function') transcript.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
  downloadButton.addEventListener('click', async () => {
    const text = `${script.title}\n\n${script.sections.map((section) => `${section.title.toUpperCase()}\n${section.text}`).join('\n\n')}\n\nIngenium 2.0 · Rafael Bulezi & Afonso Bulezi`;
    try {
      await navigator.clipboard.writeText(text);
      downloadButton.textContent = isPt ? 'Guião copiado' : 'Script copied';
      window.setTimeout(() => { downloadButton.textContent = isPt ? 'Copiar guião' : 'Copy script'; }, 1800);
    } catch {
      downloadButton.textContent = isPt ? 'Não foi possível copiar' : 'Could not copy';
    }
  });

  window.addEventListener('pagehide', stop, { once: true });

  if (supported) {
    populateVoices();
    window.speechSynthesis.addEventListener?.('voiceschanged', populateVoices, { once: true });
  }
  renderSection();
  setPlaying(false);

  const cleanup = () => {
    clearInterval(timer);
    if (supported) window.speechSynthesis.cancel();
    window.speechSynthesis?.removeEventListener?.('voiceschanged', populateVoices);
  };
  root.__audioCleanup = cleanup;
  return cleanup;
}
