import { shortenText } from '../study/learning-methods.js';

const PALETTE = {
  teal: { ink: '#4b2a7b', soft: '#efe5fb', line: '#b79ae0' },
  rust: { ink: '#7b2f63', soft: '#f7e7f2', line: '#d5a0c4' },
  blue: { ink: '#3a3a8f', soft: '#e8e6f9', line: '#a3a0dd' },
  purple: { ink: '#653d94', soft: '#f0e7fa', line: '#c1a5df' },
  ochre: { ink: '#8a4f9e', soft: '#f6e9fa', line: '#d5aadf' },
};

const escapeXml = (value = '') => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[char]));

function wrap(value, maxChars, maxLines) {
  const original = String(value ?? '').replace(/\s+/g, ' ').trim();
  if (!original) return [''];
  const clipped = shortenText(original, maxChars * maxLines);
  const words = clipped.split(' ');
  const lines = [];
  let line = '';
  for (const word of words) {
    if (!line) {
      line = word;
      continue;
    }
    if ((line.length + 1 + word.length) <= maxChars) {
      line += ` ${word}`;
      continue;
    }
    lines.push(line);
    line = word;
    if (lines.length === maxLines - 1) break;
  }
  if (line && lines.length < maxLines) lines.push(line);
  return lines.slice(0, maxLines);
}

function childLines(label, detail) {
  const lines = wrap(label, 24, detail ? 2 : 3);
  const detailLine = detail ? wrap(detail, 30, 1)[0] : '';
  return { lines, detailLine };
}

function childBox(label, detail) {
  const { lines, detailLine } = childLines(label, detail);
  const width = 188;
  const height = 16 + lines.length * 13 + (detailLine ? 13 : 0) + 9;
  return { width, height, lines, detailLine };
}

function childText(box, color, e) {
  const total = box.lines.length * 13 + (box.detailLine ? 13 : 0);
  const top = -total / 2 + 10;
  const spans = box.lines.map((line, index) => `<tspan x="0" dy="${index === 0 ? 0 : 13}">${e(line)}</tspan>`).join('');
  const detail = box.detailLine
    ? `<tspan x="0" dy="13" fill="#6b5b7d" font-size="9.5" font-weight="500">${e(box.detailLine)}</tspan>`
    : '';
  return `<text y="${top}" text-anchor="middle" fill="${color.ink}" font-size="11.5" font-weight="600">${spans}${detail}</text>`;
}

function pointAt(cx, cy, radius, angle) {
  return { x: cx + Math.cos(angle) * radius, y: cy + Math.sin(angle) * radius };
}

function childOffsets(count) {
  if (count <= 0) return [];
  if (count === 1) return [0.26];
  if (count === 2) return [-0.23, 0.23];
  return [-0.35, 0, 0.35];
}

export function mindMapSvg(map, { e = escapeXml, lang = 'pt' } = {}) {
  const isPt = lang !== 'en';
  const branches = Array.isArray(map?.branches) ? map.branches : [];
  const width = 1100;
  const height = 1000;
  const cx = width / 2;
  const cy = 490;
  const branchRadius = 240;
  const childRadius = 390;
  const rootWidth = 264;
  const rootHeight = 132;
  const step = (Math.PI * 2) / Math.max(1, branches.length);
  const start = -Math.PI / 2;
  const esc = typeof e === 'function' ? e : escapeXml;

  const edges = [];
  const nodes = [];
  const described = [String(map?.root?.label || '')];

  branches.forEach((branch, branchIndex) => {
    const palette = PALETTE[branch.color] || PALETTE.teal;
    const angle = start + step * branchIndex;
    const branchPoint = pointAt(cx, cy, branchRadius, angle);
    const control = pointAt(cx, cy, branchRadius * 0.58, angle);
    edges.push(`<path d="M ${cx} ${cy} Q ${control.x.toFixed(1)} ${control.y.toFixed(1)} ${branchPoint.x.toFixed(1)} ${branchPoint.y.toFixed(1)}" fill="none" stroke="${palette.line}" stroke-width="2.4" stroke-linecap="round"/>`);

    const children = branch.children || [];
    const offsets = childOffsets(children.length);
    described.push(`${branch.label}: ${children.map((child) => child.label).join('; ')}`);

    children.forEach((child, childIndex) => {
      const radius = childRadius + (childIndex % 2 === 1 ? 46 : 0);
      const childAngle = angle + (offsets[childIndex] || 0);
      const childPoint = pointAt(cx, cy, radius, childAngle);
      const box = childBox(child.label, child.detail);
      edges.push(`<path d="M ${branchPoint.x.toFixed(1)} ${branchPoint.y.toFixed(1)} Q ${((branchPoint.x + childPoint.x) / 2).toFixed(1)} ${((branchPoint.y + childPoint.y) / 2 - 12).toFixed(1)} ${childPoint.x.toFixed(1)} ${childPoint.y.toFixed(1)}" fill="none" stroke="${palette.line}" stroke-width="1.5" stroke-linecap="round" opacity="0.9"/>`);
      const title = `${child.label}${child.detail ? ` — ${child.detail}` : ''}`;
      nodes.push(`<g class="mm-child" transform="translate(${childPoint.x.toFixed(1)} ${childPoint.y.toFixed(1)})"><title>${esc(title)}</title><rect x="${-box.width / 2}" y="${-box.height / 2}" width="${box.width}" height="${box.height}" rx="12" fill="#fffafe" stroke="${palette.line}" stroke-width="1.4"/>${childText(box, palette, esc)}</g>`);
    });

    nodes.push(`<g class="mm-branch" transform="translate(${branchPoint.x.toFixed(1)} ${branchPoint.y.toFixed(1)})"><title>${esc(branch.label)}</title><rect x="-96" y="-25" width="192" height="50" rx="15" fill="${palette.ink}"/><circle cx="-72" cy="0" r="5" fill="#ffffff" opacity="0.55"/><text x="4" y="4.5" text-anchor="middle" fill="#ffffff" font-size="13" font-weight="700" letter-spacing="0.2">${esc(branch.label)}</text></g>`);
  });

  const rootLines = wrap(map?.root?.label || (isPt ? 'Resumo' : 'Summary'), 22, 3);
  const rootSpans = rootLines.map((line, index) => `<tspan x="0" dy="${index === 0 ? 0 : 21}">${esc(line)}</tspan>`).join('');
  const rootTop = -((rootLines.length - 1) * 21) / 2 - 8;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-labelledby="mm-title mm-desc" class="mindmap-svg" font-family="'Plus Jakarta Sans','Segoe UI',sans-serif">
  <title id="mm-title">${esc(isPt ? 'Mapa mental do resumo' : 'Summary mind map')} · ${esc(map?.root?.label || '')}</title>
  <desc id="mm-desc">${esc(described.join('. '))}</desc>
  <defs>
    <pattern id="mm-dots" width="26" height="26" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.1" fill="#ded2ed"/></pattern>
  </defs>
  <rect width="${width}" height="${height}" fill="#f7f1fc"/>
  <rect width="${width}" height="${height}" fill="url(#mm-dots)" opacity="0.65"/>
  <g stroke-linejoin="round">${edges.join('')}</g>
  <g>${nodes.join('')}</g>
  <g class="mm-root" transform="translate(${cx} ${cy})">
    <rect x="${-rootWidth / 2}" y="${-rootHeight / 2}" width="${rootWidth}" height="${rootHeight}" rx="24" fill="#2a1242"/>
    <rect x="${-rootWidth / 2 + 10}" y="${-rootHeight / 2 + 10}" width="${rootWidth - 20}" height="${rootHeight - 20}" rx="17" fill="none" stroke="#f3ebff" stroke-width="1" opacity="0.18"/>
    <text y="${rootTop}" text-anchor="middle" fill="#f7f1fc" font-size="17" font-weight="700">${rootSpans}</text>
    <text y="${rootHeight / 2 - 17}" text-anchor="middle" fill="#c9a3ff" font-size="9.5" font-weight="600" letter-spacing="1.6">${esc(isPt ? `${branches.length} RAMOS · INGENIUM` : `${branches.length} BRANCHES · INGENIUM`)}</text>
  </g>
</svg>`;
  return svg;
}
