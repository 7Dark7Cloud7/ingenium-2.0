const COLORS = ['#c9a7ff', '#8fc9ff', '#ffb4c8', '#ffd48a', '#a7efd8', '#e0b3ff'];
const TAU = Math.PI * 2;

const SCENES = {
  algebra: {
    tag: { pt: 'Álgebra linear · braço robótico', en: 'Linear algebra · robot arm' },
    title: { pt: 'Um braço robótico a mover uma peça', en: 'A robot arm moving a part' },
    body: {
      pt: 'Cada posição da ponta é um vetor. Cada rotação ou escala é uma matriz. Seleciona um ponto para veres onde esta matemática trabalha num robot, num jogo ou num GPS.',
      en: 'Every position of the tip is a vector. Every rotation or scale is a matrix. Select a point to see this maths at work in a robot, a game or a GPS.',
    },
    application: { pt: 'Robótica, gráficos 3D e GPS', en: 'Robotics, 3D graphics and GPS' },
    anchors: [[1.95, 1.35, 0.2], [0.55, 1.95, -0.55], [-1.6, 0.9, 0.9], [1.45, -0.35, 1.2], [-1.8, -0.15, -0.6], [0.2, -0.5, 1.75], [-1.95, 1.55, -0.8], [1.95, -0.45, -1.0]],
  },
  physics: {
    tag: { pt: 'Física · trajetória de um drone', en: 'Physics · drone trajectory' },
    title: { pt: 'Um drone a entregar uma encomenda', en: 'A drone delivering a package' },
    body: {
      pt: 'A curva é a trajetória. A seta verde mostra a velocidade em cada instante; a seta vermelha mostra a aceleração da gravidade. Seleciona um ponto para ligares as grandezas ao movimento real.',
      en: 'The curve is the trajectory. The green arrow shows velocity at each moment; the red arrow shows gravitational acceleration. Select a point to connect the quantities to real motion.',
    },
    application: { pt: 'Drones, desporto e segurança', en: 'Drones, sport and safety' },
    anchors: [[-1.45, 0.35, 0.5], [0.2, 1.9, -0.4], [1.55, 1.05, 0.4], [1.9, -0.3, 0.9], [-1.95, 1.1, -0.7], [0, -0.45, 1.65], [0.95, 0.45, -1.15], [-0.6, 1.15, 1.2]],
  },
  chemistry: {
    tag: { pt: 'Química · molécula de água', en: 'Chemistry · water molecule' },
    title: { pt: 'A forma de uma molécula de água', en: 'The shape of a water molecule' },
    body: {
      pt: 'Esta é uma representação tridimensional de H₂O. A forma e as ligações explicam propriedades que usamos no tratamento de água, nos medicamentos e nos materiais. Seleciona um ponto para explorar.',
      en: 'This is a three-dimensional representation of H₂O. Shape and bonds explain properties used in water treatment, medicines and materials. Select a point to explore.',
    },
    application: { pt: 'Água, medicamentos e materiais', en: 'Water, medicines and materials' },
    anchors: [[-1.45, 1.45, 0.55], [0.2, 1.95, -0.4], [1.5, 1.0, 0.6], [1.7, -0.3, -0.2], [-1.6, -0.05, -0.7], [-0.8, -0.45, 1.4], [1.95, 0.3, 1.05], [-0.35, 1.15, -1.2]],
  },
  math: {
    tag: { pt: 'Matemática · sequências e crescimento', en: 'Mathematics · sequences and growth' },
    title: { pt: 'Uma sequência a crescer, passo a passo', en: 'A sequence growing step by step' },
    body: {
      pt: 'Cada barra é um termo da sequência. Ver o crescimento no espaço ajuda a perceber padrões, progressões e acumulação — do dinheiro poupado à carga de uma bateria.',
      en: 'Each bar is a term in the sequence. Seeing growth in space helps you understand patterns, progressions and accumulation — from savings to battery charge.',
    },
    application: { pt: 'Poupança, baterias e produção', en: 'Savings, batteries and production' },
    anchors: [[-1.55, 1.25, 0.55], [-.5, 1.8, -0.4], [0.5, 1.55, 0.5], [1.55, 1.1, -0.3], [-1.9, -0.2, -0.7], [-0.95, 0.25, 1.35], [1.9, 0.35, 0.95], [-0.1, 1.0, -1.2]],
  },
  general: {
    tag: { pt: 'Sistema · ideias ligadas', en: 'System · linked ideas' },
    title: { pt: 'As ideias do resumo, ligadas num sistema', en: 'The summary’s ideas, linked as a system' },
    body: {
      pt: 'Cada ponto é um conceito do teu texto. Aproxima-te deles para veres a definição e a aplicação prática. O objetivo é explicares as ligações, não decorares nomes.',
      en: 'Each point is a concept from your text. Open them to see the definition and practical application. The goal is to explain the links, not memorise names.',
    },
    application: { pt: 'Estudo e resolução de problemas', en: 'Study and problem solving' },
    anchors: [[-1.5, 1.4, 0.55], [0.2, 1.95, -0.4], [1.55, 1.05, 0.55], [1.7, -0.3, -0.3], [-1.65, -0.05, -0.7], [-0.8, -0.45, 1.4], [1.95, 0.3, 1.05], [-0.35, 1.15, -1.2]],
  },
};

function shorten(value, max = 24) {
  const text = String(value ?? '').replace(/\s+/g, ' ').trim();
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  const space = cut.lastIndexOf(' ');
  return `${(space > max * 0.55 ? cut.slice(0, space) : cut).trim()}…`;
}

function make(tag, className = '', text = '') {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
}

function prefersReducedMotion() {
  return typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function normalise(value) {
  return String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function detectScene(subject, terms = []) {
  const haystack = normalise(`${subject} ${terms.join(' ')}`);
  if (/(algebra|matriz|matrix|vetor|vector|determinante|sistema linear|gauss|equacao linear|reta no plano|plano cartesiano)/.test(haystack)) return 'algebra';
  if (/(fisica|physics|velocidade|aceleracao|forca|energia|cinematica|movimento|queda|torque|atrito|onda)/.test(haystack)) return 'physics';
  if (/(quimica|chemistry|molecula|atomo|reacao|ph|mol|acido|base|ligacao)/.test(haystack)) return 'chemistry';
  if (/(matematica|mathematics|funcao|sequencia|derivada|integral|limite|grafico|progressao)/.test(haystack)) return 'math';
  return 'general';
}

export function mountConceptLab(root, { nodes = [], lang = 'pt', rootLabel = '', subject = 'general' } = {}) {
  if (!root) return null;
  if (root.__labCleanup) {
    root.__labCleanup();
    root.__labCleanup = null;
  }
  const isPt = lang !== 'en';
  const items = (Array.isArray(nodes) ? nodes : []).filter((node) => node?.term).slice(0, 8);
  if (!items.length) return null;

  const sceneKey = detectScene(subject, items.map((item) => item.term));
  const scene = SCENES[sceneKey] || SCENES.general;

  root.replaceChildren();
  root.classList.add('summary-lab');
  root.classList.remove('is-fallback');

  const stage = make('div', 'summary-lab-stage');
  const canvas = make('canvas', 'summary-lab-canvas');
  canvas.width = 900;
  canvas.height = 460;
  canvas.tabIndex = 0;
  const sceneLabel = isPt ? scene.tag.pt : scene.tag.en;
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', isPt
    ? `Cenário prático: ${sceneLabel}. Toca nos pontos para ver onde os conceitos aparecem. Arrasta para rodar ou usa as setas.`
    : `Practical scene: ${sceneLabel}. Tap the points to see where the concepts appear. Drag to rotate or use the arrow keys.`);
  const toolbar = make('div', 'summary-lab-toolbar');
  const toggle = make('button', 'summary-lab-button', isPt ? 'Pausar cena' : 'Pause scene');
  toggle.type = 'button';
  toggle.setAttribute('aria-pressed', 'false');
  const reset = make('button', 'summary-lab-button', isPt ? 'Repor vista' : 'Reset view');
  reset.type = 'button';
  toolbar.append(toggle, reset);
  const sceneTag = make('span', 'summary-lab-scene', sceneLabel);
  const hint = make('p', 'summary-lab-hint', isPt
    ? 'Arrasta para rodar · toca num ponto para ver a aplicação prática'
    : 'Drag to rotate · tap a point to see the practical application');
  stage.append(canvas, toolbar, sceneTag, hint);

  const detail = make('div', 'summary-lab-detail');
  detail.setAttribute('aria-live', 'polite');
  const chips = make('div', 'summary-lab-chips');
  chips.setAttribute('role', 'group');
  chips.setAttribute('aria-label', isPt ? 'Conceitos no cenário 3D' : 'Concepts in the 3D scene');

  root.append(stage, detail, chips);

  const context = canvas.getContext('2d');
  if (!context) {
    stage.classList.add('is-fallback');
    hint.textContent = isPt ? 'O teu navegador não conseguiu desenhar o cenário 3D. Usa a lista de conceitos abaixo.' : 'Your browser could not draw the 3D scene. Use the concept list below.';
    return null;
  }

  const palette = items.map((item, index) => COLORS[index % COLORS.length]);
  const anchors = scene.anchors;
  const points = items.map((item, index) => ({
    item,
    color: palette[index],
    base: {
      x: anchors[index % anchors.length][0],
      y: anchors[index % anchors.length][1],
      z: anchors[index % anchors.length][2],
    },
    screen: { x: 0, y: 0, scale: 1 },
  }));

  let rotationY = 0.32;
  let rotationX = -0.08;
  let paused = prefersReducedMotion();
  let dragging = false;
  let dragged = false;
  let pointerStart = { x: 0, y: 0 };
  let previousPointer = { x: 0, y: 0 };
  let selected = -1;
  let frame = 0;
  let lastTime = 0;
  let elapsed = 0;
  let width = 900;
  let height = 460;
  let dpr = 1;
  let cleanup = null;
  let labelBoxes = [];

  const detailText = {
    emptyTitle: isPt ? scene.title.pt : scene.title.en,
    emptyBody: isPt ? scene.body.pt : scene.body.en,
    application: isPt ? 'Aplicação real' : 'Real-world application',
    fromText: isPt ? 'Do teu texto' : 'From your text',
    scene: isPt ? 'Cenário prático' : 'Practical scene',
  };

  function renderDetail(index) {
    detail.replaceChildren();
    if (index < 0 || !points[index]) {
      detail.append(
        make('span', 'summary-lab-detail-label', detailText.scene),
        make('strong', 'summary-lab-detail-title', detailText.emptyTitle),
        make('p', 'summary-lab-detail-body', detailText.emptyBody),
        make('p', 'summary-lab-detail-scene-app', isPt ? `Onde aparece: ${scene.application.pt}` : `Where it appears: ${scene.application.en}`),
      );
      return;
    }
    const node = points[index].item;
    const head = make('div', 'summary-lab-detail-head');
    const dot = make('span', 'summary-lab-detail-dot');
    dot.style.background = points[index].color;
    head.append(dot, make('strong', 'summary-lab-detail-title', node.term));
    const body = make('p', 'summary-lab-detail-body', node.detail || '');
    const app = make('div', 'summary-lab-detail-app');
    app.append(
      make('span', 'summary-lab-detail-label', detailText.application),
      make('strong', '', node.application || ''),
      make('p', '', node.applicationText || ''),
    );
    detail.append(head);
    if (node.detail) {
      detail.append(make('span', 'summary-lab-detail-label', detailText.fromText), body);
    }
    if (node.application) detail.append(app);
  }

  chips.replaceChildren();
  const chipButtons = items.map((item, index) => {
    const button = make('button', 'summary-lab-chip', shorten(item.term, 30));
    button.type = 'button';
    button.dataset.labIndex = String(index);
    button.setAttribute('aria-pressed', 'false');
    button.addEventListener('click', () => select(index));
    chips.append(button);
    return button;
  });

  function select(index, { focus = false } = {}) {
    selected = index;
    chipButtons.forEach((button, buttonIndex) => button.setAttribute('aria-pressed', String(buttonIndex === selected)));
    if (focus) chipButtons[selected]?.focus({ preventScroll: true });
    renderDetail(selected);
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = Math.max(280, rect.width || stage.clientWidth || 900);
    height = Math.max(260, rect.height || 460);
    dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    hint.textContent = width < 520
      ? (isPt ? 'Toca num ponto · arrasta para rodar' : 'Tap a point · drag to rotate')
      : (isPt ? 'Arrasta para rodar · toca num ponto para ver a aplicação prática' : 'Drag to rotate · tap a point to see the practical application');
  }

  const resizeObserver = typeof ResizeObserver === 'function' ? new ResizeObserver(resize) : null;
  if (resizeObserver) resizeObserver.observe(stage);
  resize();

  function rotatePoint(point) {
    const cosY = Math.cos(rotationY);
    const sinY = Math.sin(rotationY);
    const cosX = Math.cos(rotationX);
    const sinX = Math.sin(rotationX);
    const x1 = point.x * cosY - point.z * sinY;
    const z1 = point.x * sinY + point.z * cosY;
    const y1 = point.y * cosX - z1 * sinX;
    const z2 = point.y * sinX + z1 * cosX;
    return { x: x1, y: y1, z: z2 };
  }

  function project(point) {
    const camera = 5.1;
    const focal = 3.7;
    const depth = Math.max(0.8, camera - point.z);
    const perspective = focal / depth;
    const base = Math.min(width, height) * 0.285;
    return {
      x: width / 2 + point.x * base * perspective,
      y: height / 2 - point.y * base * perspective,
      scale: perspective,
      z: point.z,
    };
  }

  function world(point) {
    return project(rotatePoint(point));
  }

  function screenLine(from, to, { color = 'rgba(207,172,255,.2)', width: lineWidth = 1, alpha = 1, dash = null } = {}) {
    const a = world(from);
    const b = world(to);
    context.save();
    context.globalAlpha = alpha;
    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    if (dash) context.setLineDash(dash);
    context.beginPath();
    context.moveTo(a.x, a.y);
    context.lineTo(b.x, b.y);
    context.stroke();
    context.restore();
    return { a, b };
  }

  function screenArrow(from, to, { color = '#a7efd8', width: lineWidth = 2, label = '', alpha = 1 } = {}) {
    const { a, b } = screenLine(from, to, { color, width: lineWidth, alpha });
    const angle = Math.atan2(b.y - a.y, b.x - a.x);
    const head = Math.max(7, lineWidth * 3.2);
    context.save();
    context.globalAlpha = alpha;
    context.fillStyle = color;
    context.beginPath();
    context.moveTo(b.x, b.y);
    context.lineTo(b.x - Math.cos(angle - 0.42) * head, b.y - Math.sin(angle - 0.42) * head);
    context.lineTo(b.x - Math.cos(angle + 0.42) * head, b.y - Math.sin(angle + 0.42) * head);
    context.closePath();
    context.fill();
    if (label) {
      context.font = '700 9px "Plus Jakarta Sans", system-ui, sans-serif';
      context.fillStyle = color;
      context.textAlign = 'left';
      context.textBaseline = 'middle';
      context.fillText(label, b.x + 8, b.y - 8);
    }
    context.restore();
  }

  function screenCircle(point, radius, { color = '#fff', alpha = 1, fill = false, width: lineWidth = 1.4 } = {}) {
    const screen = world(point);
    const r = Math.max(2, radius * Math.min(width, height) * 0.285 * screen.scale);
    context.save();
    context.globalAlpha = alpha;
    context.beginPath();
    context.arc(screen.x, screen.y, r, 0, TAU);
    if (fill) {
      context.fillStyle = color;
      context.fill();
    } else {
      context.strokeStyle = color;
      context.lineWidth = lineWidth;
      context.stroke();
    }
    context.restore();
    return screen;
  }

  function drawSphere(point, radius, color, { glow = true } = {}) {
    const screen = world(point);
    const r = Math.max(4, radius * Math.min(width, height) * 0.285 * screen.scale);
    if (glow) {
      const halo = context.createRadialGradient(screen.x, screen.y, r * 0.2, screen.x, screen.y, r * 2.4);
      halo.addColorStop(0, `${color}66`);
      halo.addColorStop(1, `${color}00`);
      context.fillStyle = halo;
      context.beginPath();
      context.arc(screen.x, screen.y, r * 2.4, 0, TAU);
      context.fill();
    }
    const gradient = context.createRadialGradient(screen.x - r * 0.35, screen.y - r * 0.4, r * 0.1, screen.x, screen.y, r);
    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(0.26, color);
    gradient.addColorStop(1, '#2b1740');
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(screen.x, screen.y, r, 0, TAU);
    context.fill();
    context.strokeStyle = 'rgba(255,255,255,.35)';
    context.lineWidth = 1;
    context.stroke();
    return screen;
  }

  function drawBox(center, size, color, { alpha = 1, wire = false } = {}) {
    const hx = size.x / 2;
    const hy = size.y / 2;
    const hz = size.z / 2;
    const corners = [
      { x: center.x - hx, y: center.y - hy, z: center.z - hz },
      { x: center.x + hx, y: center.y - hy, z: center.z - hz },
      { x: center.x + hx, y: center.y - hy, z: center.z + hz },
      { x: center.x - hx, y: center.y - hy, z: center.z + hz },
      { x: center.x - hx, y: center.y + hy, z: center.z - hz },
      { x: center.x + hx, y: center.y + hy, z: center.z - hz },
      { x: center.x + hx, y: center.y + hy, z: center.z + hz },
      { x: center.x - hx, y: center.y + hy, z: center.z + hz },
    ].map(world);
    const faces = [
      { indices: [4, 5, 6, 7], shade: 1 },
      { indices: [0, 1, 5, 4], shade: 0.76 },
      { indices: [1, 2, 6, 5], shade: 0.62 },
      { indices: [2, 3, 7, 6], shade: 0.52 },
      { indices: [3, 0, 4, 7], shade: 0.7 },
      { indices: [0, 3, 2, 1], shade: 0.4 },
    ].map((face) => ({ ...face, depth: face.indices.reduce((sum, index) => sum + corners[index].z, 0) / 4 }));
    faces.sort((a, b) => a.depth - b.depth);
    context.save();
    context.globalAlpha = alpha;
    faces.forEach((face) => {
      if (wire) {
        context.strokeStyle = color;
        context.lineWidth = 1.1;
        context.beginPath();
        face.indices.forEach((index, pointIndex) => {
          const point = corners[index];
          if (pointIndex === 0) context.moveTo(point.x, point.y);
          else context.lineTo(point.x, point.y);
        });
        context.closePath();
        context.stroke();
      } else {
        context.fillStyle = color;
        context.globalAlpha = alpha * face.shade;
        context.beginPath();
        face.indices.forEach((index, pointIndex) => {
          const point = corners[index];
          if (pointIndex === 0) context.moveTo(point.x, point.y);
          else context.lineTo(point.x, point.y);
        });
        context.closePath();
        context.fill();
        context.globalAlpha = alpha;
        context.strokeStyle = 'rgba(255,255,255,.16)';
        context.lineWidth = 0.8;
        context.stroke();
      }
    });
    context.restore();
  }

  function drawGrid() {
    const floor = -0.92;
    context.save();
    for (let index = -3; index <= 3; index += 1) {
      const offset = index * 0.7;
      screenLine({ x: -2.1, y: floor, z: offset }, { x: 2.1, y: floor, z: offset }, { color: 'rgba(201,163,255,.12)', width: 1 });
      screenLine({ x: offset, y: floor, z: -2.1 }, { x: offset, y: floor, z: 2.1 }, { color: 'rgba(160,189,255,.09)', width: 1 });
    }
    screenCircle({ x: 0, y: floor, z: 0 }, 1.6, { color: 'rgba(201,163,255,.12)', alpha: 0.8, width: 1.1 });
    screenCircle({ x: 0, y: floor, z: 0 }, 0.72, { color: 'rgba(167,239,216,.16)', alpha: 0.9, width: 1.1 });
    context.restore();
  }

  function drawBackground() {
    const gradient = context.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#150d22');
    gradient.addColorStop(0.55, '#20122f');
    gradient.addColorStop(1, '#2b173d');
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);

    const glow = context.createRadialGradient(width * 0.58, height * 0.4, 10, width * 0.58, height * 0.4, width * 0.62);
    glow.addColorStop(0, 'rgba(167,120,240,.16)');
    glow.addColorStop(0.6, 'rgba(167,120,240,.045)');
    glow.addColorStop(1, 'rgba(167,120,240,0)');
    context.fillStyle = glow;
    context.fillRect(0, 0, width, height);

    for (let index = 0; index < 32; index += 1) {
      const x = ((index * 137.5) % 100) / 100 * width;
      const y = ((index * 73.3) % 100) / 100 * height * 0.62;
      const size = index % 7 === 0 ? 1.6 : 0.9;
      context.fillStyle = `rgba(235,221,255,${0.08 + (index % 4) * 0.04})`;
      context.beginPath();
      context.arc(x, y, size, 0, TAU);
      context.fill();
    }
  }

  function drawAxes() {
    const origin = { x: -1.95, y: -0.9, z: 1.35 };
    screenArrow(origin, { x: origin.x + 1.2, y: origin.y, z: origin.z }, { color: 'rgba(255,146,128,.85)', width: 1.8, label: 'x' });
    screenArrow(origin, { x: origin.x, y: origin.y + 1.15, z: origin.z }, { color: 'rgba(167,239,216,.85)', width: 1.8, label: 'y' });
    screenArrow(origin, { x: origin.x, y: origin.y, z: origin.z - 1.2 }, { color: 'rgba(142,196,255,.85)', width: 1.8, label: 'z' });
  }

  function objectLabel(text, point, { color = 'rgba(214,190,246,.78)', align = 'left' } = {}) {
    if (width < 560) return;
    const screen = world(point);
    context.save();
    context.font = '600 8px "DM Mono", monospace';
    context.fillStyle = color;
    context.textAlign = align;
    context.textBaseline = 'middle';
    context.fillText(text, screen.x, screen.y);
    const metrics = context.measureText(text);
    const boxWidth = metrics.width;
    const boxX = align === 'center' ? screen.x - boxWidth / 2 : align === 'right' ? screen.x - boxWidth : screen.x;
    labelBoxes.push({ x: boxX - 3, y: screen.y - 6, w: boxWidth + 6, h: 12 });
    context.restore();
  }

  function labelOverlaps(box) {
    return labelBoxes.some((other) => box.x < other.x + other.w && box.x + box.w > other.x && box.y < other.y + other.h && box.y + box.h > other.y);
  }

  function placeLabel(x, y, radius, boxWidth, boxHeight) {
    const margin = 7;
    const gap = 7;
    const clampX = (value) => Math.max(margin, Math.min(width - boxWidth - margin, value));
    const attempts = [
      { x: clampX(x - boxWidth / 2), y: y + radius + gap },
      { x: clampX(x - boxWidth / 2), y: y - radius - gap - boxHeight },
      { x: clampX(x + radius + gap), y: y - boxHeight / 2 },
      { x: clampX(x - radius - gap - boxWidth), y: y - boxHeight / 2 },
    ];
    for (const attempt of attempts) {
      const top = Math.max(margin, Math.min(height - boxHeight - margin, attempt.y));
      const box = { x: Math.round(attempt.x), y: Math.round(top), w: boxWidth, h: boxHeight };
      if (!labelOverlaps(box)) {
        labelBoxes.push(box);
        return box;
      }
    }
    for (let offset = boxHeight + 4; offset < height; offset += boxHeight + 4) {
      for (const direction of [1, -1]) {
        const top = Math.max(margin, Math.min(height - boxHeight - margin, y + radius + gap + direction * offset));
        const box = { x: Math.round(clampX(x - boxWidth / 2)), y: Math.round(top), w: boxWidth, h: boxHeight };
        if (!labelOverlaps(box)) {
          labelBoxes.push(box);
          return box;
        }
      }
    }
    return null;
  }

  function drawRobotScene() {
    drawAxes();
    const base = { x: 0, y: -0.9, z: 0 };
    const shoulder = { x: 0, y: 0.0, z: 0 };
    const elbow = { x: 0.78, y: 0.7, z: 0.12 };
    const wrist = { x: 1.35, y: 0.45, z: 0.22 };
    const tip = { x: 1.55, y: 0.18, z: 0.32 };
    screenCircle({ x: 0, y: -0.9, z: 0 }, 0.62, { color: 'rgba(201,163,255,.22)', fill: true });
    drawBox({ x: 0, y: -0.77, z: 0 }, { x: 0.38, y: 0.24, z: 0.38 }, '#5b3a82', { alpha: 0.98 });
    screenLine(base, shoulder, { color: 'rgba(225,203,255,.55)', width: 13 });
    screenLine(shoulder, elbow, { color: 'rgba(216,190,252,.7)', width: 10 });
    screenLine(elbow, wrist, { color: 'rgba(201,163,255,.85)', width: 8 });
    drawSphere(shoulder, 0.12, '#cdb2ff', { glow: false });
    drawSphere(elbow, 0.1, '#b18beb', { glow: false });
    drawSphere(wrist, 0.085, '#9ed9ff', { glow: false });
    drawBox(tip, { x: 0.22, y: 0.22, z: 0.22 }, '#a7efd8', { alpha: 0.9 });
    screenArrow(base, wrist, { color: '#a7efd8', width: 2.2, label: 'v' });
    const matrixSelected = normalise(points[selected]?.item.term).match(/matriz|matrix|determinante|sistema|plano/);
    if (matrixSelected) {
      screenCircle({ x: 0, y: 0.05, z: 0 }, 0.62, { color: 'rgba(255,180,200,.7)', width: 1.4 });
      screenCircle({ x: 0, y: 0.05, z: 0 }, 0.48, { color: 'rgba(255,180,200,.35)', width: 1.1 });
      objectLabel(isPt ? 'M · v = nova posição' : 'M · v = new position', { x: 0.1, y: 0.95, z: 0.55 }, { color: 'rgba(255,180,200,.8)' });
    }
    objectLabel(isPt ? 'BRAÇO ROBÓTICO' : 'ROBOT ARM', { x: -0.9, y: 1.05, z: 0 }, { color: 'rgba(230,214,250,.82)' });
    objectLabel(isPt ? 'PEÇA' : 'PART', tip, { color: 'rgba(167,239,216,.9)' });
  }

  function drawDrone(x, y, z, phase) {
    const screen = world({ x, y, z });
    const unit = Math.max(0.9, Math.min(1.35, width / 620));
    const body = 13 * unit;
    const arm = 26 * unit;
    context.save();
    context.strokeStyle = 'rgba(226,213,250,.9)';
    context.lineWidth = Math.max(1.8, 2 * unit);
    [-1, 1].forEach((direction) => {
      context.beginPath();
      context.moveTo(screen.x - arm * 0.7, screen.y);
      context.lineTo(screen.x + arm * 0.7, screen.y);
      context.stroke();
      context.beginPath();
      context.moveTo(screen.x, screen.y - arm * 0.45);
      context.lineTo(screen.x, screen.y + arm * 0.45);
      context.stroke();
      context.beginPath();
      context.ellipse(screen.x + direction * arm * 0.7, screen.y, arm * 0.34, arm * 0.1, phase, 0, TAU);
      context.strokeStyle = 'rgba(201,163,255,.6)';
      context.stroke();
    });
    const bodyGradient = context.createRadialGradient(screen.x - body * 0.3, screen.y - body * 0.3, 1, screen.x, screen.y, body);
    bodyGradient.addColorStop(0, '#f4eaff');
    bodyGradient.addColorStop(1, '#8354bd');
    context.fillStyle = bodyGradient;
    context.beginPath();
    context.arc(screen.x, screen.y, body, 0, TAU);
    context.fill();
    context.fillStyle = '#a7efd8';
    context.beginPath();
    context.arc(screen.x + body * 0.3, screen.y - body * 0.15, body * 0.24, 0, TAU);
    context.fill();
    context.restore();
  }

  function drawDroneScene() {
    drawAxes();
    const start = { x: -1.65, y: -0.35, z: 0.2 };
    const end = { x: 1.7, y: -0.9, z: -0.15 };
    const apex = 1.95;
    const at = (t) => ({
      x: start.x + (end.x - start.x) * t,
      y: start.y + (end.y - start.y) * t + apex * 4 * t * (1 - t) * 0.5,
      z: start.z + (end.z - start.z) * t,
    });
    const steps = 48;
    for (let index = 0; index < steps; index += 1) {
      const t0 = index / steps;
      const t1 = (index + 1) / steps;
      screenLine(at(t0), at(t1), { color: 'rgba(201,163,255,.34)', width: 1.4, dash: [3, 4] });
    }
    const progress = paused ? 0.42 : 0.2 + 0.62 * ((Math.sin(elapsed * 0.55 - Math.PI / 2) + 1) / 2);
    for (let index = 0; index < Math.floor(progress * steps); index += 1) {
      screenLine(at(index / steps), at((index + 1) / steps), { color: 'rgba(167,239,216,.9)', width: 2.2 });
    }
    const current = at(progress);
    const next = at(Math.min(1, progress + 0.015));
    const previous = at(Math.max(0, progress - 0.015));
    const velocity = { x: (next.x - previous.x) * 2.4, y: (next.y - previous.y) * 2.4, z: 0 };
    screenArrow(current, { x: current.x + velocity.x, y: current.y + velocity.y, z: current.z }, { color: '#a7efd8', width: 2, label: 'v' });
    screenArrow(current, { x: current.x + 0.16, y: current.y - 0.65, z: current.z }, { color: '#ff9d8d', width: 2, label: 'a' });
    drawDrone(current.x, current.y, current.z, elapsed * 12);
    screenCircle({ x: end.x, y: -0.9, z: end.z }, 0.38, { color: 'rgba(167,239,216,.65)', width: 1.4 });
    screenCircle({ x: end.x, y: -0.9, z: end.z }, 0.24, { color: 'rgba(167,239,216,.32)', width: 1.1 });
    objectLabel(isPt ? 'ZONA DE ENTREGA' : 'DELIVERY ZONE', { x: end.x, y: -0.62, z: end.z }, { color: 'rgba(167,239,216,.9)', align: 'center' });
    objectLabel(isPt ? 'LANÇAMENTO' : 'LAUNCH', start, { color: 'rgba(230,214,250,.8)' });
    objectLabel(isPt ? 'TRAJETÓRIA' : 'TRAJECTORY', at(0.58), { color: 'rgba(230,214,250,.65)', align: 'center' });
  }

  function drawMoleculeScene() {
    const oxygen = { x: 0, y: 0.28, z: 0 };
    const hydrogenA = { x: -0.66, y: 0.72, z: 0.15 };
    const hydrogenB = { x: 0.66, y: 0.72, z: 0.15 };
    screenCircle({ x: 0, y: -0.9, z: 0 }, 0.9, { color: 'rgba(201,163,255,.14)', width: 1.1 });
    screenLine(oxygen, hydrogenA, { color: 'rgba(225,213,246,.7)', width: 7 });
    screenLine(oxygen, hydrogenB, { color: 'rgba(225,213,246,.7)', width: 7 });
    drawSphere(hydrogenA, 0.23, '#8fc9ff');
    drawSphere(hydrogenB, 0.23, '#8fc9ff');
    drawSphere(oxygen, 0.36, '#ff9d8d');
    screenCircle(oxygen, 0.9, { color: 'rgba(201,163,255,.18)', width: 1.1 });
    objectLabel('O', oxygen, { color: 'rgba(255,240,237,.9)', align: 'center' });
    objectLabel('H', hydrogenA, { color: 'rgba(235,246,255,.9)', align: 'center' });
    objectLabel('H', hydrogenB, { color: 'rgba(235,246,255,.9)', align: 'center' });
    objectLabel(isPt ? 'H₂O · LIGAÇÕES' : 'H₂O · BONDS', { x: 0, y: 1.45, z: 0 }, { color: 'rgba(230,214,250,.78)', align: 'center' });
    objectLabel(isPt ? 'TRATAMENTO DE ÁGUA' : 'WATER TREATMENT', { x: -1.65, y: 0.35, z: 0.8 }, { color: 'rgba(167,239,216,.75)' });
  }

  function drawMathScene() {
    drawAxes();
    const heights = [0.25, 0.42, 0.52, 0.74, 0.92, 1.2, 1.52];
    const bars = heights.map((barHeight, index) => ({ x: -1.5 + index * 0.48, z: 0, height: barHeight }));
    bars.forEach((bar, index) => {
      const color = index === bars.length - 1 ? '#a7efd8' : `hsl(${268 - index * 8} 62% ${62 - index * 2}%)`;
      drawBox({ x: bar.x, y: -0.9 + bar.height / 2, z: bar.z }, { x: 0.26, y: bar.height, z: 0.32 }, color, { alpha: 0.9 });
      const top = { x: bar.x, y: -0.9 + bar.height, z: bar.z };
      drawSphere(top, 0.07, color, { glow: false });
      if (index < bars.length - 1) {
        screenLine(top, { x: bars[index + 1].x, y: -0.9 + bars[index + 1].height, z: bars[index + 1].z }, { color: 'rgba(201,163,255,.4)', width: 1.2, dash: [3, 3] });
      }
    });
    objectLabel(isPt ? 'CRESCIMENTO' : 'GROWTH', { x: 0.55, y: 1.48, z: 0 }, { color: 'rgba(167,239,216,.85)' });
    objectLabel('n', { x: 1.75, y: -0.9, z: 0 }, { color: 'rgba(201,163,255,.7)' });
  }

  function drawGeneralScene() {
    const center = { x: 0, y: 0.2, z: 0 };
    screenCircle({ x: 0, y: -0.9, z: 0 }, 1.1, { color: 'rgba(201,163,255,.16)', width: 1.1 });
    for (let ring = 0; ring < 2; ring += 1) {
      context.beginPath();
      for (let step = 0; step <= 72; step += 1) {
        const angle = (step / 72) * TAU;
        const point = world({ x: Math.cos(angle) * (1.05 + ring * 0.35), y: 0.2 + Math.sin(angle) * 0.18, z: Math.sin(angle) * (1.05 + ring * 0.35) });
        if (step === 0) context.moveTo(point.x, point.y);
        else context.lineTo(point.x, point.y);
      }
      context.strokeStyle = ring ? 'rgba(167,239,216,.16)' : 'rgba(201,163,255,.2)';
      context.lineWidth = 1;
      context.stroke();
    }
    drawBox(center, { x: 0.52, y: 0.52, z: 0.52 }, '#9b6be0', { alpha: 0.92 });
    objectLabel(rootLabel || (isPt ? 'RESUMO' : 'SUMMARY'), { x: 0, y: 0.85, z: 0 }, { color: 'rgba(230,214,250,.8)', align: 'center' });
  }

  const sceneRenderers = {
    algebra: drawRobotScene,
    physics: drawDroneScene,
    chemistry: drawMoleculeScene,
    math: drawMathScene,
    general: drawGeneralScene,
  };

  function drawNode(point, index) {
    const { x, y, scale } = point.screen;
    const isSelected = index === selected;
    const radius = (isSelected ? 8 : 5.8) * Math.min(1.35, scale);
    if (isSelected) {
      context.beginPath();
      context.arc(x, y, radius + 10, 0, TAU);
      context.fillStyle = `${point.color}22`;
      context.fill();
      context.beginPath();
      context.arc(x, y, radius + 5, 0, TAU);
      context.strokeStyle = point.color;
      context.lineWidth = 1.2;
      context.setLineDash([3, 3]);
      context.stroke();
      context.setLineDash([]);
    }
    const glow = context.createRadialGradient(x, y, 0, x, y, radius * 3.4);
    glow.addColorStop(0, `${point.color}bb`);
    glow.addColorStop(1, `${point.color}00`);
    context.fillStyle = glow;
    context.beginPath();
    context.arc(x, y, radius * 3.4, 0, TAU);
    context.fill();
    context.beginPath();
    context.arc(x, y, radius, 0, TAU);
    context.fillStyle = point.color;
    context.fill();
    context.strokeStyle = 'rgba(255,255,255,.85)';
    context.lineWidth = 1.2;
    context.stroke();

    const label = shorten(point.item.term, isSelected ? 28 : 20);
    if (width < 520 && !isSelected) return;
    context.font = '600 10.5px "Plus Jakarta Sans", system-ui, sans-serif';
    const textWidth = context.measureText(label).width;
    const paddingX = 7;
    const boxWidth = textWidth + paddingX * 2;
    const boxHeight = 21;
    const position = placeLabel(x, y, radius, boxWidth, boxHeight);
    if (!position) return;
    const boxX = position.x;
    const boxY = position.y;
    if (isSelected && (boxY > y + radius + boxHeight || boxY < y - radius - boxHeight)) {
      context.beginPath();
      context.moveTo(x, y);
      context.lineTo(boxX + boxWidth / 2, boxY + (boxY > y ? 0 : boxHeight));
      context.strokeStyle = 'rgba(255,255,255,.36)';
      context.lineWidth = 1;
      context.stroke();
    }
    context.fillStyle = isSelected ? 'rgba(255,255,255,.97)' : 'rgba(20,10,34,.82)';
    roundedRect(boxX, boxY, boxWidth, boxHeight, 7);
    context.fill();
    context.strokeStyle = isSelected ? point.color : 'rgba(255,255,255,.18)';
    context.lineWidth = 1;
    context.stroke();
    context.fillStyle = isSelected ? '#2a1b3d' : '#f4ecff';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(label, boxX + boxWidth / 2, boxY + boxHeight / 2 + 0.5);
    context.textAlign = 'left';
    context.textBaseline = 'alphabetic';
  }

  function roundedRect(x, y, w, h, radius) {
    const r = Math.min(radius, h / 2, w / 2);
    context.beginPath();
    context.moveTo(x + r, y);
    context.arcTo(x + w, y, x + w, y + h, r);
    context.arcTo(x + w, y + h, x, y + h, r);
    context.arcTo(x, y + h, x, y, r);
    context.arcTo(x, y, x + w, y, r);
    context.closePath();
  }

  function draw(timestamp) {
    if (!canvas.isConnected) {
      cleanup?.();
      return;
    }
    if (!lastTime) lastTime = timestamp;
    const delta = Math.min(0.05, (timestamp - lastTime) / 1000);
    lastTime = timestamp;
    if (!paused) {
      elapsed += delta;
      if (!dragging) rotationY += delta * 0.06;
    }

    drawBackground();
    drawGrid();
    labelBoxes = [];
    const renderer = sceneRenderers[sceneKey] || drawGeneralScene;
    renderer();

    for (const point of points) {
      point.screen = world(point.base);
    }
    const ordered = [...points].sort((a, b) => a.screen.z - b.screen.z);
    const selectedPoint = selected >= 0 ? points[selected] : null;
    if (selectedPoint) drawNode(selectedPoint, selected);
    ordered.forEach((point) => {
      if (point !== selectedPoint) drawNode(point, points.indexOf(point));
    });

    if (!paused) frame = requestAnimationFrame(draw);
    else frame = 0;
  }

  function schedule() {
    if (!frame) {
      lastTime = 0;
      frame = requestAnimationFrame(draw);
    }
  }

  toggle.addEventListener('click', () => {
    paused = !paused;
    toggle.setAttribute('aria-pressed', String(paused));
    toggle.textContent = paused ? (isPt ? 'Retomar cena' : 'Resume scene') : (isPt ? 'Pausar cena' : 'Pause scene');
    if (paused) {
      cancelAnimationFrame(frame);
      frame = 0;
      draw(performance.now());
    } else {
      schedule();
    }
  });
  reset.addEventListener('click', () => {
    rotationY = 0.32;
    rotationX = -0.08;
    elapsed = 0;
    select(-1);
    renderDetail(-1);
    if (paused) draw(performance.now());
  });

  const controller = typeof AbortController === 'function' ? new AbortController() : null;
  const listenerOptions = controller ? { signal: controller.signal } : undefined;

  canvas.addEventListener('pointerdown', (event) => {
    dragging = true;
    dragged = false;
    pointerStart = { x: event.clientX, y: event.clientY };
    previousPointer = { x: event.clientX, y: event.clientY };
    canvas.setPointerCapture?.(event.pointerId);
    canvas.classList.add('is-dragging');
    schedule();
  }, listenerOptions);
  canvas.addEventListener('pointermove', (event) => {
    if (!dragging) return;
    const dx = event.clientX - previousPointer.x;
    const dy = event.clientY - previousPointer.y;
    if (Math.abs(event.clientX - pointerStart.x) + Math.abs(event.clientY - pointerStart.y) > 5) dragged = true;
    rotationY += dx * 0.008;
    rotationX = Math.max(-1.02, Math.min(1.02, rotationX + dy * 0.006));
    previousPointer = { x: event.clientX, y: event.clientY };
    if (paused) draw(performance.now());
  }, listenerOptions);
  const endDrag = (event) => {
    if (!dragging) return;
    dragging = false;
    canvas.classList.remove('is-dragging');
    if (!dragged) {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      let nearest = -1;
      let distance = 32;
      points.forEach((point, index) => {
        const candidate = Math.hypot(point.screen.x - x, point.screen.y - y);
        if (candidate < distance) {
          distance = candidate;
          nearest = index;
        }
      });
      if (nearest >= 0) select(nearest);
    }
    if (paused) draw(performance.now());
  };
  canvas.addEventListener('pointerup', endDrag, listenerOptions);
  canvas.addEventListener('pointercancel', endDrag, listenerOptions);
  canvas.addEventListener('keydown', (event) => {
    const step = 0.12;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight' || event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();
      if (event.key === 'ArrowLeft') rotationY -= step;
      if (event.key === 'ArrowRight') rotationY += step;
      if (event.key === 'ArrowUp') rotationX = Math.max(-1.02, rotationX - step);
      if (event.key === 'ArrowDown') rotationX = Math.min(1.02, rotationX + step);
      if (paused) draw(performance.now());
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      select((selected + 1) % points.length);
      if (paused) draw(performance.now());
    }
  }, listenerOptions);

  renderDetail(-1);
  if (paused) draw(performance.now());
  else schedule();

  cleanup = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    resizeObserver?.disconnect();
    controller?.abort();
  };
  root.__labCleanup = cleanup;
  return { select, destroy: cleanup, scene: sceneKey };
}
