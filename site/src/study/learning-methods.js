const PLACES = {
  pt: ['Porta do quarto', 'Corredor', 'Cozinha', 'Janela', 'Mesa de estudo'],
  en: ['Bedroom door', 'Hallway', 'Kitchen', 'Window', 'Study desk'],
};

const CUE_IDEAS = {
  pt: [
    'um cartaz enorme com a palavra escrita',
    'um objeto que apita sempre que pensas na ideia',
    'um cheiro forte que te faz lembrar do conceito',
    'uma janela onde a ideia aparece escrita',
  ],
  en: [
    'a huge poster with the word written on it',
    'an object that beeps whenever you think of the idea',
    'a strong smell that reminds you of the concept',
    'a window where the idea appears written',
  ],
};

export function shortenText(value, max = 64) {
  const text = String(value ?? '').replace(/\s+/g, ' ').trim();
  if (!text || text.length <= max) return text;
  const slice = text.slice(0, Math.max(1, max - 1));
  const lastSpace = slice.lastIndexOf(' ');
  const cut = lastSpace > max * 0.55 ? slice.slice(0, lastSpace) : slice;
  return `${cut.replace(/[\s.,;:–—-]+$/, '')}…`;
}

function uniqueTerms(values) {
  const seen = new Set();
  const result = [];
  for (const value of values) {
    const text = String(value ?? '').trim();
    if (!text) continue;
    const key = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(text);
  }
  return result;
}

function joinList(items, lang = 'pt') {
  const list = items.filter(Boolean);
  if (!list.length) return '';
  if (list.length === 1) return list[0];
  const last = list[list.length - 1];
  const rest = list.slice(0, -1).join(', ');
  return `${rest} ${lang === 'en' ? 'and' : 'e'} ${last}`;
}

function localIsoDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function addDays(date, days) {
  const copy = new Date(date.getTime());
  copy.setDate(copy.getDate() + days);
  copy.setHours(18, 0, 0, 0);
  return copy;
}

function conceptsOf(analysis) {
  const definitions = (analysis.definitions || []).map((item) => item.term);
  const keywords = (analysis.keywords || []).map((item) => item.term);
  return uniqueTerms([...definitions, ...keywords]);
}

export function buildMindMap(analysis = {}, { title = '', lang = 'pt' } = {}) {
  const isPt = lang !== 'en';
  const branches = [];
  const definitions = (analysis.definitions || []).filter((item) => item?.term).slice(0, 3);
  if (definitions.length) {
    branches.push({
      id: 'concepts',
      label: isPt ? 'Conceitos' : 'Concepts',
      color: 'teal',
      children: definitions.map((item) => ({
        label: shortenText(item.term, 34),
        detail: shortenText(item.predicate, 52),
      })),
    });
  }

  const ideas = (analysis.keyIdeas || []).filter(Boolean).slice(0, definitions.length < 2 ? 4 : 3);
  if (ideas.length) {
    branches.push({
      id: 'ideas',
      label: isPt ? 'Ideias-chave' : 'Key ideas',
      color: 'rust',
      children: ideas.map((idea) => ({ label: shortenText(idea, 62), detail: '' })),
    });
  }

  const headings = (analysis.outline || []).filter((block) => block?.heading).slice(0, 3);
  if (headings.length >= 2) {
    branches.push({
      id: 'structure',
      label: isPt ? 'Estrutura' : 'Structure',
      color: 'blue',
      children: headings.map((block) => ({
        label: shortenText(block.heading, 36),
        detail: shortenText(block.points?.[0], 52),
      })),
    });
  }

  const known = new Set(definitions.map((item) => String(item.term).toLowerCase()));
  const keywords = (analysis.keywords || [])
    .filter((item) => item?.term && !known.has(String(item.term).toLowerCase()))
    .slice(0, 3);
  if (keywords.length) {
    branches.push({
      id: 'words',
      label: isPt ? 'Palavras-chave' : 'Key words',
      color: 'purple',
      children: keywords.map((item) => ({
        label: shortenText(item.term, 32),
        detail: `${item.count}×`,
      })),
    });
  }

  const questions = (analysis.guidingQuestions || []).filter(Boolean).slice(0, 2);
  if (questions.length && branches.length < 5) {
    branches.push({
      id: 'practice',
      label: isPt ? 'Para treinar' : 'To practise',
      color: 'ochre',
      children: questions.map((question) => ({ label: shortenText(question, 64), detail: '' })),
    });
  }

  if (!branches.length) {
    const fallback = shortenText(analysis.centralIdea || analysis.text || title, 80);
    branches.push({
      id: 'idea',
      label: isPt ? 'Ideia central' : 'Central idea',
      color: 'teal',
      children: [{ label: fallback || (isPt ? 'Sem conteúdo suficiente' : 'Not enough content'), detail: '' }],
    });
  }

  const capped = branches.slice(0, 5).map((branch) => ({ ...branch, children: branch.children.slice(0, 3) }));
  const rootTitle = title || analysis.title || analysis.centralIdea || (isPt ? 'Resumo' : 'Summary');
  return {
    root: {
      label: shortenText(rootTitle, 48),
      detail: shortenText(analysis.centralIdea || analysis.title || '', 120),
    },
    branches: capped,
    nodeCount: 1 + capped.reduce((total, branch) => total + branch.children.length, 0),
  };
}

export function buildMemoryPalace(analysis = {}, { lang = 'pt' } = {}) {
  const isPt = lang !== 'en';
  const places = PLACES[isPt ? 'pt' : 'en'];
  const cues = CUE_IDEAS[isPt ? 'pt' : 'en'];
  const candidates = uniqueTerms([
    ...conceptsOf(analysis),
    ...(analysis.keyIdeas || []).map((idea) => shortenText(idea, 46)),
    shortenText(analysis.centralIdea || '', 46),
  ]);
  const selected = candidates.slice(0, 4);
  return selected.map((concept, index) => ({
    place: places[index % places.length],
    concept,
    cue: isPt
      ? `Coloca «${concept}» em ${places[index % places.length].toLowerCase()} — imagina ${cues[index % cues.length]}.`
      : `Place “${concept}” at the ${places[index % places.length].toLowerCase()} — picture ${cues[index % cues.length]}.`,
  }));
}

export function buildLearningMethods(analysis = {}, { now = new Date(), lang = 'pt' } = {}) {
  const isPt = lang !== 'en';
  const concepts = conceptsOf(analysis);
  const focus = concepts[0] || shortenText(analysis.centralIdea || analysis.title || '', 48);
  const cards = analysis.cards?.length || 0;
  const quiz = analysis.quiz?.length || 0;
  const gaps = (analysis.coverage || []).filter((item) => !item.ok).map((item) => item.hint).filter(Boolean);
  const palace = buildMemoryPalace(analysis, { lang });
  const schedule = [
    { key: 'd0', days: 0, date: localIsoDate(addDays(now, 0)), task: isPt ? 'Lê uma vez, fecha o resumo e escreve a ideia central de memória.' : 'Read once, close the summary and write the central idea from memory.' },
    { key: 'd1', days: 1, date: localIsoDate(addDays(now, 1)), task: isPt ? 'Cartões + teste rápido, sem consultar.' : 'Cards + quick test, without checking.' },
    { key: 'd3', days: 3, date: localIsoDate(addDays(now, 3)), task: isPt ? 'Reescreve a ideia central em cinco linhas.' : 'Rewrite the central idea in five lines.' },
    { key: 'd7', days: 7, date: localIsoDate(addDays(now, 7)), task: isPt ? 'Explica em voz alta e responde às perguntas do resumo.' : 'Explain out loud and answer the summary questions.' },
    { key: 'd14', days: 14, date: localIsoDate(addDays(now, 14)), task: isPt ? 'Teste misturado com outra disciplina.' : 'Mixed test with another subject.' },
  ];

  const methods = [
    {
      id: 'recall',
      icon: 'target',
      category: isPt ? 'MEMÓRIA' : 'MEMORY',
      title: isPt ? 'Recordação ativa' : 'Active recall',
      summary: isPt
        ? 'Tenta lembrar antes de rever. O esforço de recuperar a ideia é o que a fixa.'
        : 'Try to remember before reviewing. The effort of retrieving the idea is what makes it stick.',
      steps: [
        isPt ? `Fecha o resumo e escreve tudo o que te lembras sobre «${focus}».` : `Close the summary and write everything you remember about “${focus}”.`,
        concepts.length > 1
          ? (isPt ? `Define ${joinList(concepts.slice(0, 3), 'pt')} sem consultar.` : `Define ${joinList(concepts.slice(0, 3), 'en')} without checking.`)
          : (isPt ? 'Escreve duas frases com um exemplo teu.' : 'Write two sentences with an example of your own.'),
        isPt ? 'Abre o texto e marca o que faltou ou estava errado.' : 'Open the text and mark what was missing or wrong.',
        isPt ? 'Repete amanhã, antes de abrir os cartões.' : 'Repeat tomorrow, before opening the cards.',
      ],
      meta: `${cards} ${isPt ? 'cartões' : 'cards'} · ${quiz} ${isPt ? 'perguntas' : 'questions'}`,
    },
    {
      id: 'spaced',
      icon: 'clock',
      category: isPt ? 'REVISÃO' : 'REVIEW',
      title: isPt ? 'Repetição espaçada' : 'Spaced repetition',
      summary: isPt
        ? 'Volta ao mesmo conteúdo em intervalos crescentes. É mais eficaz do que ler tudo na véspera.'
        : 'Return to the same content at growing intervals. It beats cramming the night before.',
      steps: schedule.map((item) => (item.days === 0
        ? (isPt ? 'Hoje: lê uma vez e fecha o resumo.' : 'Today: read once and close the summary.')
        : (isPt ? `Dia ${item.days}: ${item.task}` : `Day ${item.days}: ${item.task}`))),
      meta: isPt ? '5 revisões em 14 dias' : '5 reviews in 14 days',
      schedule,
    },
    {
      id: 'feynman',
      icon: 'spark',
      category: isPt ? 'COMPREENSÃO' : 'UNDERSTANDING',
      title: isPt ? 'Técnica de Feynman' : 'Feynman technique',
      summary: isPt
        ? `Explica «${focus}» como se fosse para alguém que nunca ouviu falar disto.`
        : `Explain “${focus}” to someone who has never heard of it.`,
      steps: [
        isPt ? 'Escreve a explicação em quatro frases, sem termos técnicos.' : 'Write the explanation in four sentences, without technical terms.',
        isPt ? 'Usa uma analogia do dia a dia.' : 'Use an everyday analogy.',
        isPt ? 'Marca os pontos em que tiveste de consultar o texto: são as tuas lacunas.' : 'Mark the points where you had to check the text: those are your gaps.',
        isPt ? 'Reescreve só essas partes e repete em voz alta.' : 'Rewrite only those parts and repeat them out loud.',
      ],
      meta: focus ? `«${shortenText(focus, 34)}»` : '',
    },
    {
      id: 'dual',
      icon: 'layers',
      category: isPt ? 'VISUAL' : 'VISUAL',
      title: isPt ? 'Codificação dupla' : 'Dual coding',
      summary: isPt
        ? 'Junta palavras e imagens. Desenhar a estrutura obriga-te a decidir o que liga a quê.'
        : 'Combine words and images. Drawing the structure forces you to decide what connects to what.',
      steps: [
        isPt ? 'Desenha o mapa do resumo numa folha A4, sem copiar o texto.' : 'Draw the summary map on an A4 page without copying the text.',
        isPt ? 'Usa uma cor por ramo e setas para causas, exemplos e conclusões.' : 'Use one colour per branch and arrows for causes, examples and conclusions.',
        isPt ? 'Compara com o teu mapa no separador «Mapa» e corrige as ligações em falta.' : 'Compare it with the “Map” tab and fix missing links.',
        isPt ? 'Explica o desenho em 60 segundos.' : 'Explain the drawing in 60 seconds.',
      ],
      meta: isPt ? 'Mapa + desenho à mão' : 'Map + hand drawing',
    },
    {
      id: 'palace',
      icon: 'home',
      category: isPt ? 'MEMÓRIA' : 'MEMORY',
      title: isPt ? 'Palácio da memória' : 'Memory palace',
      summary: isPt
        ? 'Associa cada ideia a um lugar que conheces bem. Ao percorreres o caminho, as ideias aparecem por ordem.'
        : 'Attach each idea to a place you know well. Walking the route brings the ideas back in order.',
      steps: [
        isPt ? 'Escolhe um caminho que conheces de cor: quarto → corredor → cozinha.' : 'Choose a route you know by heart: bedroom → hallway → kitchen.',
        ...palace.slice(0, 4).map((station) => station.cue),
        isPt ? 'Percorre o caminho em voz alta sem olhar. Amanhã faz o percurso ao contrário.' : 'Walk the route out loud without looking. Tomorrow do it backwards.',
      ].slice(0, 6),
      meta: palace.length ? `${palace.length} ${isPt ? 'paragens' : 'stops'}` : '',
      palace,
    },
    {
      id: 'interleave',
      icon: 'relative',
      category: isPt ? 'RITMO' : 'RHYTHM',
      title: isPt ? 'Intercalação' : 'Interleaving',
      summary: isPt
        ? 'Alterna matérias e tipos de treino. O cérebro aprende melhor quando tem de escolher a estratégia.'
        : 'Alternate subjects and practice types. Your brain learns better when it has to choose a strategy.',
      steps: [
        isPt ? 'Estuda 20 minutos deste resumo e fecha-o.' : 'Study this summary for 20 minutes, then close it.',
        isPt ? 'Muda 10 minutos para outra disciplina, como ALGA ou Química.' : 'Switch for 10 minutes to another subject, such as ALGA or Chemistry.',
        isPt ? 'Volta 20 minutos e faz o teste rápido sem consultar.' : 'Return for 20 minutes and take the quick test without checking.',
        isPt ? 'No fim, escreve uma ligação entre as duas matérias.' : 'At the end, write one connection between the two subjects.',
      ],
      meta: isPt ? 'Blocos de 20 / 10 / 20 min' : '20 / 10 / 20 min blocks',
    },
  ];

  if (gaps.length) {
    methods.push({
      id: 'gaps',
      icon: 'compass',
      category: isPt ? 'LACUNAS' : 'GAPS',
      title: isPt ? 'Fechar lacunas' : 'Close the gaps',
      summary: isPt
        ? 'O teu resumo ainda não cobre tudo. Cada frase que acrescentares torna o próximo teste mais fiável.'
        : 'Your summary does not cover everything yet. Every sentence you add makes the next test more reliable.',
      steps: [
        ...gaps.slice(0, 4),
        isPt ? 'Acrescenta uma frase para cada ponto e volta a organizar o resumo.' : 'Add one sentence for each point and organise the summary again.',
      ].slice(0, 5),
      meta: `${gaps.length} ${isPt ? (gaps.length === 1 ? 'critério em falta' : 'critérios em falta') : (gaps.length === 1 ? 'missing check' : 'missing checks')}`,
    });
  }

  return { focus, schedule, palace, methods };
}
