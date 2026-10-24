const formulaToolDiagram = (type) => {
  if (type === 'triangles') return `<svg viewBox="0 0 420 180" role="img" aria-label="Formula triangle">
    <path d="M210 12 54 162H366Z" fill="none" stroke="#91a7a1" stroke-width="2.5" stroke-dasharray="5 7" stroke-linejoin="round"/>
    <path d="M132 87H288" stroke="#c5d0c8" stroke-width="2" stroke-dasharray="4 6"/>
    <rect x="160" y="39" width="100" height="38" rx="11" fill="#e6f7ce" stroke="#d5e8c3"/><text x="210" y="64" text-anchor="middle" fill="#416f32" font-family="DM Mono,monospace" font-size="19" font-weight="800">A</text>
    <rect x="86" y="105" width="100" height="38" rx="11" fill="#e7edff" stroke="#d7e0ff"/><text x="136" y="130" text-anchor="middle" fill="#4167c2" font-family="DM Mono,monospace" font-size="19" font-weight="800">b</text>
    <rect x="234" y="105" width="100" height="38" rx="11" fill="#ffebe6" stroke="#f5d9d2"/><text x="284" y="130" text-anchor="middle" fill="#c95443" font-family="DM Mono,monospace" font-size="19" font-weight="800">h</text>
  </svg>`;
  return `<svg viewBox="0 0 420 180" role="img" aria-label="Quick formula references">
    <g><rect x="20" y="23" width="380" height="38" rx="10" fill="#f7f8ff" stroke="#d8e0ef" stroke-dasharray="4 4"/><text x="40" y="47" fill="#334a7e" font-family="DM Mono,monospace" font-size="17" font-weight="800">a² + b² = c²</text><circle cx="370" cy="42" r="7" fill="#e7edff" stroke="#6d86d8"/></g>
    <g><rect x="20" y="72" width="380" height="38" rx="10" fill="#f4fbf8" stroke="#d7e9e3" stroke-dasharray="4 4"/><text x="40" y="96" fill="#286a61" font-family="DM Mono,monospace" font-size="17" font-weight="800">v = Δs / Δt</text><circle cx="370" cy="91" r="7" fill="#dff4ef" stroke="#398e83"/></g>
    <g><rect x="20" y="121" width="380" height="38" rx="10" fill="#fffaf0" stroke="#f0e3c6" stroke-dasharray="4 4"/><text x="40" y="145" fill="#8a6c16" font-family="DM Mono,monospace" font-size="17" font-weight="800">F = m · a</text><circle cx="370" cy="140" r="7" fill="#fff1c1" stroke="#c19d3d"/></g>
  </svg>`;
};

export function renderFormulasPage({ app, lang, ui, e, icon, href }) {
  const cards = [
    { id: 'triangles', title: lang() === 'pt' ? 'Triângulos de fórmulas' : 'Formula triangles', count: lang() === 'pt' ? '10 fórmulas' : '10 formulas', subtitle: lang() === 'pt' ? 'Tapa a grandeza que falta e vê a operação certa. Abre a explicação quando precisares de aprofundar.' : 'Cover the missing quantity to reveal the right operation. Expand the explanation when you need more detail.', klass: 'formula-tool-triangles', chip: lang() === 'pt' ? 'INTERACTIVO' : 'INTERACTIVE', tone: 'math' },
    { id: 'shortcuts', title: lang() === 'pt' ? 'Atalhos e truques' : 'Shortcuts & tricks', count: lang() === 'pt' ? '40 referências' : '40 references', subtitle: lang() === 'pt' ? 'Uma referência rápida de fórmulas, mnemónicas e truques de Matemática e Física.' : 'A quick-reference library of formulas, mnemonics and tricks for Mathematics and Physics.', klass: 'formula-tool-shortcuts', chip: lang() === 'pt' ? 'CONSULTA RÁPIDA' : 'QUICK REFERENCE', tone: 'physics' }
  ];
  app.innerHTML = `<section class="page tools-page formulas-home-page">
    <div class="tools-back-row"><a class="text-link" href="${href('home')}">${icon('back',15)} ${e(ui('home'))}</a></div>
    <div class="tools-heading formulas-hub-heading"><div><h1>${e(lang() === 'pt' ? 'Fórmulas' : 'Formulas')}<span class="title-period" aria-hidden="true">.</span></h1></div></div>
    <div class="formula-tool-grid">${cards.map((card, index) => `<a href="${href(card.id)}" class="formula-tool-card ${card.klass}">
      <div class="formula-tool-visual">${formulaToolDiagram(card.id)}</div>
      <div class="formula-tool-copy"><div class="formula-tool-card-meta"><span class="tool-subject-tag ${card.tone}">${e(card.chip)}</span><span class="tool-reference">FT-${String(index + 1).padStart(2, '0')}</span></div><h2>${e(card.title)}</h2><p>${e(card.subtitle)}</p><div class="formula-tool-card-foot"><strong>${e(card.count)}</strong><span class="subject-card-arrow">${icon('arrow',18)}</span></div></div>
    </a>`).join('')}</div>
    <div class="tools-footer-links"><a href="${href('practice')}">${icon('target',17)}<span><strong>${e(ui('practice'))}</strong><small>${e(lang() === 'pt' ? 'Ganha distintivos ao superar níveis' : 'Earn badges by passing levels')}</small></span>${icon('arrow',16)}</a><a href="${href('home')}">${icon('home',17)}<span><strong>${e(ui('home'))}</strong><small>${e(lang() === 'pt' ? 'Volta às matérias' : 'Back to your subjects')}</small></span>${icon('arrow',16)}</a></div>
  </section>`;
}

export function renderAlgebraPage({ app, lang, t, ui, e, icon, href, algebraSyllabus, homeSubjectDiagram }) {
  app.innerHTML = '<section class="page tools-page algebra-page subject-cover-page">' +
    '<div class="tools-back-row"><a class="text-link" href="' + href('home') + '">' + icon('back',15) + ' ' + e(ui('home')) + '</a></div>' +
    '<header class="subject-cover-heading algebra-cover-heading">' +
      '<h1>' + e(t(algebraSyllabus.title)) + '<span class="title-period" aria-hidden="true">.</span></h1>' +
      '<div class="alga-term-badge"><span>ALGA</span><strong>' + e(t(algebraSyllabus.semester)) + '</strong></div>' +
    '</header>' +
    '<section class="subject-cover-art algebra-cover-art"><div class="subject-cover-illustration">' + homeSubjectDiagram('algebra') + '</div></section>' +
    '<a class="subject-cover-link algebra-cover-link" href="' + href('program') + '">' + icon('layers',18) + '<span>' + e(lang()==='pt'?'Ver programa':'View syllabus') + '</span>' + icon('arrow',16) + '</a>' +
  '</section>';
}

export function renderChemistryPage({ app, lang, ui, e, icon, href, homeSubjectDiagram }) {
  app.innerHTML = '<section class="page tools-page chemistry-page subject-cover-page">' +
    '<div class="tools-back-row"><a class="text-link" href="' + href('home') + '">' + icon('back',15) + ' ' + e(ui('home')) + '</a></div>' +
    '<header class="subject-cover-heading chemistry-cover-heading"><h1>' + e(lang()==='pt'?'Química':'Chemistry') + '<span class="title-period" aria-hidden="true">.</span></h1></header>' +
    '<section class="subject-cover-art chemistry-cover-art"><div class="subject-cover-illustration">' + homeSubjectDiagram('chemistry') + '</div></section>' +
  '</section>';
}


export function renderHomePage({ app, lang, t, ui, e, icon, href, course, algebraSyllabus, homeSubjectDiagram, summaryCount = 0, nextEvent = null }) {
  const isPt = lang() === 'pt';
  const subjectCard = (id, title, subtitle) => {
    const path = id === 'math' || id === 'physics' ? `topic/${id}` : id;
    return `<a href="${href(path)}" class="subject-card subject-${id}">
      <span class="subject-card-visual">${homeSubjectDiagram(id)}</span>
      <span class="subject-card-heading"><strong class="subject-card-title">${e(title)}</strong><span class="subject-card-arrow">${icon('arrow',19)}</span></span>
      ${subtitle ? `<span class="subject-card-description">${e(subtitle)}</span>` : ''}
    </a>`;
  };
  const nextWhen = nextEvent
    ? nextEvent.daysUntil === 0
      ? (isPt ? 'Hoje' : 'Today')
      : nextEvent.daysUntil === 1
        ? (isPt ? 'Amanhã' : 'Tomorrow')
        : (isPt ? `Em ${nextEvent.daysUntil} dias` : `In ${nextEvent.daysUntil} days`)
    : null;
  app.innerHTML = `<section class="page home-page">
    <div class="home-intro"><div><h1>${e(isPt ? 'O que vamos aprender hoje?' : 'What will we learn today?')}</h1></div></div>
    <div class="subject-grid" aria-label="${e(isPt ? 'Áreas de estudo' : 'Study areas')}">
      ${subjectCard('math', isPt ? 'Matemática' : 'Mathematics', isPt ? 'Sucessões.' : 'Sequences.')}
      ${subjectCard('physics', isPt ? 'Física' : 'Physics', isPt ? 'Movimento e vectores.' : 'Motion and vectors.')}
      ${subjectCard('algebra', t(algebraSyllabus.title), isPt ? 'Coordenadas, vectores e matrizes.' : 'Coordinates, vectors and matrices.')}
      ${subjectCard('chemistry', isPt ? 'Química' : 'Chemistry', isPt ? 'Moléculas e reacções.' : 'Molecules and reactions.')}
    </div>
    <div class="home-study-dock" aria-label="${e(isPt ? 'Ferramentas de estudo' : 'Study tools')}">
      <a href="${href('summaries')}" class="home-study-card home-study-summaries">
        <span class="home-study-icon">${icon('book', 19)}</span>
        <span class="home-study-copy"><small>${e(isPt ? 'RESUMOS' : 'SUMMARIES')}</small><strong>${e(isPt ? 'Cola as tuas notas. Ele explica e testa.' : 'Paste your notes. It explains and quizzes.')}</strong></span>
        <span class="home-study-meta">${summaryCount ? `${summaryCount} ${e(isPt ? (summaryCount === 1 ? 'guardado' : 'guardados') : 'saved')}` : e(isPt ? 'Começar' : 'Start')}${icon('arrow', 15)}</span>
      </a>
      <a href="${href('planner')}" class="home-study-card home-study-planner">
        <span class="home-study-icon">${icon('clock', 19)}</span>
        <span class="home-study-copy"><small>${e(isPt ? 'PLANO' : 'PLAN')}</small><strong>${e(nextEvent ? nextEvent.title : (isPt ? 'Cola o calendário do semestre.' : 'Paste the semester calendar.'))}</strong></span>
        <span class="home-study-meta">${e(nextWhen || (isPt ? 'Adaptar' : 'Adapt'))}${icon('arrow', 15)}</span>
      </a>
    </div>
    <p class="sig"><span>RAFAEL BULEZI · INGENIUM 2.0</span><strong>${e(isPt ? 'Uma ideia de cada vez.' : 'One idea at a time.')}</strong></p>
  </section>`;
}



const programmeKeywords = [
  'sistemas de coordenadas','coordenadas cartesianas','projecções ortogonais','produtos internos','produtos externos','produtos mistos',
  'equações lineares','equação característica','polinómio característico','matriz inversa','valores próprios','vectores próprios',
  'matrizes semelhantes','matrizes diagonalizáveis','método de gauss–jordan','gauss–jordan','gaussian elimination',
  'cartesian coordinate systems','orthogonal projections','characteristic polynomial','characteristic equation','linear equations','diagonalização','eliminação','resolução','representações','coordenadas','propriedades','característica','inversa','projecções',
  'linear systems','eigenvectors','eigenvalues','diagonalization','determinants','matrices','matrix rank','inner products',
  'coordinate systems','vectors','distâncias','ângulos','paralelismo','incidência','determinantes','cofactores','laplace',
  'matrizes','vectores','rectas','planos','superfícies','bases','gauss','diagonalizáveis','cartesianas','polares',
  'cilíndricas','esféricas','perímetro','área','distance','angles','lines','planes','polar','cylindrical','spherical',
  'rank','operations','projections','similar matrices','matrix'
];
const programmeKeywordPattern = new RegExp('(' + programmeKeywords.slice().sort((a,b)=>b.length-a.length).join('|') + ')','giu');
function programmeTopicMarkup(value, t, e) {
  const content = String(t(value));
  const parts = content.split(programmeKeywordPattern);
  const keywordSet = new Set(programmeKeywords.map(value=>value.toLocaleLowerCase()));
  return parts.map(part=>keywordSet.has(part.toLocaleLowerCase()) ? '<strong class="teaching-highlight">' + e(part) + '</strong>' : e(part)).join('');
}

export function renderProgrammePage({ app, lang, t, ui, e, icon, href, course, algebraSyllabus, homeSubjectDiagram }) {
  const isPt = lang() === 'pt';
  const mathModules = course.modules.filter(module=>module.id==='sequences');
  const physicsModules = course.modules.filter(module=>module.id!=='sequences');
  const summaryModules = modules => modules.map(module=>
    '<li><span class="programme-flow-topic-dot"></span><span class="programme-flow-module-copy"><strong>' + e(t(module.title)) + '</strong><small>' + e(t(module.description)) + '</small></span><span class="programme-flow-lesson-count">' + module.lessonIds.length + ' ' + e(isPt?'lições':'lessons') + '</span></li>'
  ).join('');
  const unitCards = algebraSyllabus.units.map((unit,index)=>
    '<details class="programme-flow-unit">' +
      '<summary class="programme-flow-unit-head">' +
        '<span class="programme-flow-unit-no">' + String(index+1).padStart(2,'0') + '</span>' +
        '<span class="programme-flow-unit-name"><strong>' + e(t(unit.title)) + '</strong><small>' + unit.topics.length + ' ' + e(isPt?'tópicos':'topics') + '</small></span>' +
        '<span class="programme-flow-toggle" aria-hidden="true"><span class="programme-toggle-mark"></span></span>' +
      '</summary>' +
      '<ul class="programme-flow-topics">' + unit.topics.map(topic=>'<li><span class="programme-flow-topic-dot"></span><span>' + programmeTopicMarkup(topic,t,e) + '</span></li>').join('') + '</ul>' +
    '</details>'
  ).join('');
  const openingTopics = algebraSyllabus.openingTopics.map((topic,index)=>
    '<li><span class="programme-flow-topic-number">' + String(index+1).padStart(2,'0') + '</span><span>' + programmeTopicMarkup(topic,t,e) + '</span></li>'
  ).join('');
  const nextTopics = algebraSyllabus.nextTopics.map(topic=>programmeTopicMarkup(topic,t,e)).join(' · ');
  const pathCard = (id, title, description, modules, linkText, path) => {
    const topicDisclosure = modules.length
      ? '<details class="programme-flow-path-details"><summary><span>' + e(isPt?'Ver tópicos':'View topics') + '</span><span class="programme-flow-toggle" aria-hidden="true"><span class="programme-toggle-mark"></span></span></summary><ul>' + summaryModules(modules) + '</ul></details>'
      : '';
    return '<article class="programme-flow-path-card programme-flow-path-' + id + '">' +
      '<div class="programme-flow-path-visual">' + homeSubjectDiagram(id) + '</div>' +
      '<div class="programme-flow-path-body">' +
        '<h3>' + e(title) + '</h3>' +
        topicDisclosure +
        '<a class="text-link" href="' + href(path) + '">' + e(linkText) + icon('arrow',15) + '</a>' +
      '</div>' +
    '</article>';
  };

  app.innerHTML =
    '<section class="page tools-page programme-page programme-flow-page">' +
      '<div class="tools-back-row"><a class="text-link" href="' + href('home') + '">' + icon('back',15) + ' ' + e(ui('home')) + '</a></div>' +
      '<header class="programme-page-heading">' +
        '<h1>' + e(isPt?'Mapa do programa':'Programme map') + '<span class="title-period" aria-hidden="true">.</span></h1>' +
        '<p>' + (isPt?'Organizado por <strong class="teaching-highlight">matéria</strong>, semestre e ano lectivo.':'Organised by <strong class="teaching-highlight">subject</strong>, semester and academic year.') + '</p>' +
      '</header>' +
      '<a class="programme-plan-banner" href="' + href('planner') + '"><span class="programme-plan-icon">' + icon('clock',20) + '</span><span class="programme-plan-copy"><small>' + e(isPt?'PLANO ADAPTADO':'ADAPTIVE PLAN') + '</small><strong>' + e(isPt?'Cola exames, entregas e horário. Vê quando estudar o quê.':'Paste exams, deadlines and timetable. See when to study what.') + '</strong></span><span class="programme-plan-cta">' + e(isPt?'Abrir plano':'Open plan') + icon('arrow',16) + '</span></a>' +
      '<section class="programme-year-section programme-flow-year">' +
        '<div class="programme-period-heading"><h2>2026/2027</h2><span class="programme-period-chip">' + e(isPt?'I Semestre':'Semester I') + '</span></div>' +
        '<article class="programme-flow-course programme-flow-alga">' +
            '<div class="programme-flow-alga-visual" aria-hidden="true"><svg viewBox="0 0 260 116" role="img" aria-label="Coordinate plane with point P(3, 2)">' +
              '<g fill="none" stroke="#d7d8d1" stroke-width="1" stroke-dasharray="2 5">' +
                '<path d="M61 22H231M61 42H231M61 62H231M61 82H231M81 14V102M101 14V102M121 14V102M141 14V102M161 14V102M181 14V102M201 14V102M221 14V102"/>' +
              '</g>' +
              '<g fill="none" stroke="#768396" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' +
                '<path d="M42 102H240M61 109V9M233 96L240 102 233 108M55 16L61 9 67 16"/>' +
              '</g>' +
              '<path d="M121 62V102M61 62H121" fill="none" stroke="#7388bd" stroke-width="2" stroke-linecap="round" stroke-dasharray="4 5"/>' +
              '<circle cx="121" cy="62" r="8" fill="#fff4c6" stroke="#b28c2f" stroke-width="2"/>' +
              '<circle cx="121" cy="62" r="2.5" fill="#9a7624"/>' +
              '<g fill="#627287" font-family="DM Mono,monospace" font-size="10" font-weight="700">' +
                '<text x="101" y="114" text-anchor="middle">2</text><text x="121" y="114" text-anchor="middle">3</text><text x="48" y="65" text-anchor="middle">2</text>' +
                '<text x="245" y="99" font-size="12">x</text><text x="72" y="13" font-size="12">y</text>' +
              '</g>' +
              '<text x="134" y="52" fill="#354967" font-family="Plus Jakarta Sans,sans-serif" font-size="11" font-weight="800">P(3, 2)</text>' +
            '</svg></div>' +
          '<div class="programme-flow-course-header">' +
            '<span class="programme-flow-course-code">ALGA</span>' +
            '<div class="programme-flow-course-title"><h3>' + e(t(algebraSyllabus.title)) + '</h3><p><strong class="teaching-highlight">6 ' + e(isPt?'unidades':'units') + '</strong> · ' + e(isPt?'Conteúdo programático':'Course syllabus') + '</p></div>' +
          '</div>' +
          '<details class="programme-course-details">' +
            '<summary class="programme-expand-summary"><span>' + e(isPt?'Ver programa':'View syllabus') + '</span><small>' + e(isPt?'Unidades e tópicos':'Units and topics') + '</small><span class="programme-flow-toggle" aria-hidden="true"><span class="programme-toggle-mark"></span></span></summary>' +
            '<div class="programme-course-content">' +
              '<div class="programme-flow-units">' + unitCards + '</div>' +
              '<details class="programme-flow-opening">' +
                '<summary><span>' + e(isPt?'Primeiras aulas':'Opening topics') + '</span><small>' + e(isPt?'Coordenadas e geometria no plano':'Coordinates and plane geometry') + '</small><span class="programme-flow-toggle" aria-hidden="true"><span class="programme-toggle-mark"></span></span></summary>' +
                '<div class="programme-flow-opening-content"><h4>' + e(isPt?'Coordenadas e geometria no plano':'Coordinates and geometry in the plane') + '</h4><ol>' + openingTopics + '</ol><p class="programme-flow-next"><strong>' + e(isPt?'A seguir':'Next') + '</strong> ' + nextTopics + '</p></div>' +
              '</details>' +
            '</div>' +
          '</details>' +
          '<a class="programme-flow-course-link" href="' + href('algebra') + '">' + e(isPt?'Abrir matéria':'Open subject') + icon('arrow',16) + '</a>' +
        '</article>' +
      '</section>' +
      '<section class="programme-year-section programme-flow-other">' +
        '<div class="programme-flow-section-heading"><h2>' + e(isPt?'Outras matérias':'Other subjects') + '</h2></div>' +
        '<div class="programme-flow-path-grid">' +
          pathCard('math',isPt?'Matemática':'Mathematics',isPt?'Percurso actual.':'Current learning path.',mathModules,isPt?'Abrir Matemática':'Open Mathematics','topic/math') +
          pathCard('physics',isPt?'Física':'Physics',isPt?'Percurso actual.':'Current learning path.',physicsModules,isPt?'Abrir Física':'Open Physics','topic/physics') +
          pathCard('chemistry',isPt?'Química':'Chemistry','',[],isPt?'Abrir Química':'Open Chemistry','chemistry') +
        '</div>' +
      '</section>' +

    '</section>';
}

