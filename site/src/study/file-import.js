const PDFJS_URL = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.min.mjs';
const PDFJS_WORKER_URL = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.worker.min.mjs';
const TESSERACT_URL = 'https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.esm.min.js';

export const IMPORT_LIMITS = {
  maxBytes: 20 * 1024 * 1024,
  maxPages: 30,
  maxOcrPages: 10,
  maxChars: 20000,
  ocrLanguages: 'por+eng',
  textPageThreshold: 40,
};

const PDF_TYPES = new Set(['application/pdf']);
const IMAGE_TYPES = new Set(['image/png', 'image/jpeg', 'image/jpg', 'image/webp']);

const LIST_START = /^(?:[-•*–—·▪]|\(?\d{1,2}[.)]|[a-hA-H][.)])\s+/;
const PAGE_NUMBER_LINE = /^(?:(?:p(?:á|a)g(?:ina)?\.?\s*)?\d{1,4}(?:\s*(?:de|\/|of)\s*\d{1,4})?|page\s+\d{1,4}(?:\s+of\s+\d{1,4})?)$/i;
const SENTENCE_END = /[.!?…:;»”"’')]$/;
const HEADINGISH = /^[\p{Lu}\d][\p{Lu}\d\s.,:;()'’\-–—/&%°]+$/u;

export class ImportError extends Error {
  constructor(code, cause) {
    super(code);
    this.name = 'ImportError';
    this.code = code;
    this.cause = cause;
  }
}

export function importErrorMessage(code, lang = 'pt', detail = '') {
  const isPt = lang !== 'en';
  const messages = {
    type: isPt
      ? 'Formato não suportado. Usa PDF, PNG, JPEG ou WebP. No iPhone, converte HEIC para JPEG antes de importar.'
      : 'Unsupported format. Use PDF, PNG, JPEG or WebP. On iPhone, convert HEIC to JPEG before importing.',
    size: isPt
      ? `O ficheiro tem ${detail || 'demasiado'} MB. O máximo é 20 MB por ficheiro.`
      : `The file is ${detail || 'too'} MB. The limit is 20 MB per file.`,
    empty: isPt ? 'O ficheiro está vazio.' : 'The file is empty.',
    crypto: isPt ? 'Este navegador não conseguiu verificar o ficheiro.' : 'This browser could not verify the file.',
    library: isPt
      ? 'Não consegui carregar o leitor de PDF/OCR. Verifica a ligação à internet e tenta outra vez. As bibliotecas vêm de uma CDN; o teu ficheiro não é enviado.'
      : 'Could not load the PDF/OCR reader. Check your internet connection and try again. The libraries come from a CDN; your file is not uploaded.',
    pdf: isPt ? 'Não foi possível abrir este PDF. Pode estar danificado.' : 'Could not open this PDF. It may be damaged.',
    password: isPt ? 'Este PDF está protegido por palavra-passe. Exporta uma cópia sem proteção.' : 'This PDF is password-protected. Export an unprotected copy.',
    image: isPt ? 'Não foi possível abrir esta imagem. Tenta JPEG ou PNG.' : 'Could not open this image. Try JPEG or PNG.',
    'no-text': isPt
      ? 'Não encontrei texto legível. Tenta uma foto mais nítida, com boa luz e o papel direito.'
      : 'No readable text found. Try a sharper photo with good light and the page straight.',
    ocr: isPt
      ? 'O reconhecimento de texto falhou nesta imagem. Tenta outra foto com melhor luz e menos sombras.'
      : 'Text recognition failed on this image. Try another photo with better light and fewer shadows.',
    limit: isPt ? 'Já atingiste o limite de 20 000 caracteres neste resumo.' : 'You reached the 20,000-character limit in this summary.',
    unknown: isPt ? 'Não consegui ler este ficheiro. Tenta outro formato.' : 'Could not read this file. Try another format.',
  };
  return messages[code] || messages.unknown;
}

export function formatFileSize(bytes) {
  const value = Number(bytes);
  if (!Number.isFinite(value) || value < 0) return '';
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${Math.round(value / 1024)} KB`;
  return `${(value / (1024 * 1024)).toFixed(value >= 10 * 1024 * 1024 ? 0 : 1)} MB`;
}

export function fileKind(file) {
  const type = String(file?.type || '').toLowerCase().split(';')[0].trim();
  const name = String(file?.name || '').toLowerCase();
  if (PDF_TYPES.has(type) || /\.pdf$/.test(name)) return 'pdf';
  if (IMAGE_TYPES.has(type) || /\.(png|jpe?g|webp)$/.test(name)) return 'image';
  return null;
}

export function validateImportFile(file) {
  if (!file || typeof file.size !== 'number' || typeof file.name !== 'string') {
    return { ok: false, code: 'unknown' };
  }
  const kind = fileKind(file);
  if (!kind) return { ok: false, code: 'type' };
  if (file.size === 0) return { ok: false, code: 'empty' };
  if (file.size > IMPORT_LIMITS.maxBytes) {
    return { ok: false, code: 'size', detail: (file.size / (1024 * 1024)).toFixed(1) };
  }
  return { ok: true, kind };
}

export function filenameToTitle(name) {
  const raw = String(name || '')
    .replace(/^.*[\\/]/, '')
    .replace(/\.[a-z0-9]{1,8}$/i, '')
    .replace(/[_+]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!raw) return '';
  const cleaned = raw.replace(/^[\d\s.\-–—]+(?=\p{L})/u, '').trim() || raw;
  const title = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  return title.slice(0, 90).trim();
}

export function inferImportTitle({ filename = '', metaTitle = '', text = '', lang = 'pt' } = {}) {
  const isPt = lang !== 'en';
  const meta = String(metaTitle || '').replace(/\s+/g, ' ').trim();
  if (meta.length >= 3 && meta.length <= 90 && !/^(untitled|document|documento|sem título|sem titulo|microsoft word|powerpoint|pdf|scan(?:ned)?(?: document)?)$/i.test(meta)) {
    return meta;
  }
  const fromName = filenameToTitle(filename);
  if (fromName && fromName.length >= 3 && !/^(img|image|imagem|scan|digitaliza(?:ção|cao)|document|documento|file|ficheiro|photo|foto|whatsapp)(?:[\s_-]*\d+)?$/i.test(fromName)) {
    return fromName;
  }
  const firstLine = String(text || '')
    .split('\n')
    .map((line) => line.replace(/\s+/g, ' ').trim())
    .find((line) => line.length >= 8 && line.length <= 90 && /[\p{L}]{3}/u.test(line));
  if (firstLine) return firstLine.replace(/[.:;,\s]+$/, '').slice(0, 90);
  return isPt ? 'Documento importado' : 'Imported document';
}

const PRONOUN_TAIL = /^(?:se|me|te|nos|vos|lhe|lhes|o|a|os|as|lo|la|los|las|de|da|do|das|em|e)$/i;

export function cleanExtractedText(value) {
  let text = String(value ?? '')
    .replace(/\r\n?/g, '\n')
    .replace(/\u00a0/g, ' ')
    .replace(/\u00ad/g, '')
    .replace(/[\u200b-\u200d\ufeff]/g, '');

  // PDF and OCR often split a word at the end of a line: "acelera-\nção".
  // Portuguese also breaks on a real hyphen ("expressa-\nse"), where joining
  // two lowercase halves would destroy the word.
  text = text.replace(/(\p{Ll})[-\u2010\u2011]\n[ \t]*(\p{Ll}+)(?=[^\p{L}]|$)/gu, (whole, head, tail) =>
    (PRONOUN_TAIL.test(tail) || tail.length <= 2 ? `${head}-${tail}` : `${head}${tail}`));

  const rawLines = text.split('\n');
  const kept = [];
  for (const rawLine of rawLines) {
    const line = rawLine.replace(/[ \t]+/g, ' ').trim();
    if (!line) {
      if (kept.length && kept[kept.length - 1] !== '') kept.push('');
      continue;
    }
    const compact = line.replace(/\s+/g, ' ');
    if (PAGE_NUMBER_LINE.test(compact)) continue;
    if (/^[-–—_·. ]{3,}$/.test(compact)) continue;
    kept.push(line);
  }

  const merged = [];
  let paragraph = [];
  const flush = () => {
    if (!paragraph.length) return;
    merged.push(paragraph.join(' ').replace(/\s+/g, ' ').trim());
    paragraph = [];
  };

  for (const line of kept) {
    if (!line) {
      flush();
      if (merged.length && merged[merged.length - 1] !== '') merged.push('');
      continue;
    }
    const isList = LIST_START.test(line);
    const isHeading = line.length <= 70 && HEADINGISH.test(line) && /[\p{L}]{2}/u.test(line);
    if (isList || isHeading) {
      flush();
      merged.push(line.replace(/\s+/g, ' ').trim());
      continue;
    }
    if (paragraph.length) {
      const previous = paragraph[paragraph.length - 1];
      if (SENTENCE_END.test(previous) && line.length <= 70 && /^\p{Lu}/u.test(line)) {
        flush();
      }
    }
    paragraph.push(line);
  }
  flush();

  return merged
    .join('\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function pdfItemsToText(items = []) {
  let text = '';
  for (const item of items) {
    const chunk = typeof item?.str === 'string' ? item.str : '';
    if (chunk) {
      text += chunk;
      if (!item.hasEOL && !/\s$/.test(chunk)) text += ' ';
    }
    if (item?.hasEOL) text += '\n';
  }
  return text.replace(/[ \t]+\n/g, '\n').replace(/[ \t]+$/, '');
}

export function suggestSubject(text) {
  const haystack = String(text || '').toLowerCase();
  const hasTerm = (word) => {
    if (word.includes(' ')) return haystack.includes(word);
    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const ending = word.length >= 5 ? '\\p{L}*' : '';
    return new RegExp(`(^|[^\\p{L}])${escaped}${ending}(?=[^\\p{L}]|$)`, 'u').test(haystack);
  };
  const groups = [
    { subject: 'chemistry', words: ['química', 'chemistry', 'mol', 'átomo', 'atomo', 'reação', 'reacao', 'ligação química', 'ph', 'ácido', 'acido', 'base', 'oxid'] },
    { subject: 'algebra', words: ['álgebra', 'algebra', 'matriz', 'matrizes', 'determinante', 'vetor', 'vector', 'espaço vetorial', 'transformação linear', 'autovalor'] },
    { subject: 'physics', words: ['física', 'physics', 'velocidade', 'velocity', 'aceleração', 'acceleration', 'força', 'forca', 'energia', 'energy', 'cinemática', 'cinematica', 'newton', 'atrito', 'friction', 'projétil', 'projectile', 'momento', 'torque'] },
    { subject: 'math', words: ['matemática', 'mathematics', 'função', 'funcao', 'derivada', 'integral', 'limite', 'equação', 'equacao', 'trigonometria', 'sucessão', 'sucessao', 'sequência', 'sequencia', 'logaritmo'] },
  ];
  let best = { subject: 'general', score: 0 };
  for (const group of groups) {
    let score = 0;
    for (const word of group.words) {
      if (!hasTerm(word)) continue;
      score += word.includes(' ') ? 3 : 2;
    }
    if (score > best.score) best = { subject: group.subject, score };
  }
  return best.score >= 4 ? best.subject : 'general';
}

export async function sha256Hex(input) {
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) throw new ImportError('crypto');
  let bytes;
  if (input instanceof ArrayBuffer) bytes = input;
  else if (ArrayBuffer.isView(input)) bytes = input.buffer.slice(input.byteOffset, input.byteOffset + input.byteLength);
  else bytes = new TextEncoder().encode(String(input ?? ''));
  const digest = await subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

function throwImport(code, cause) {
  throw new ImportError(code, cause);
}

let pdfjsPromise = null;
function loadPdfJs() {
  if (!pdfjsPromise) {
    pdfjsPromise = import(PDFJS_URL)
      .then((module) => {
        module.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_URL;
        return module;
      })
      .catch((error) => {
        pdfjsPromise = null;
        throwImport('library', error);
      });
  }
  return pdfjsPromise;
}

let tesseractPromise = null;
function loadTesseract() {
  if (!tesseractPromise) {
    tesseractPromise = import(TESSERACT_URL)
      .then((module) => {
        const api = typeof module.createWorker === 'function' ? module : module.default;
        if (typeof api?.createWorker !== 'function') throwImport('library');
        return api;
      })
      .catch((error) => {
        tesseractPromise = null;
        throwImport('library', error);
      });
  }
  return tesseractPromise;
}

let ocrWorkerPromise = null;
let ocrProgressHandler = null;
function ocrWorker() {
  if (!ocrWorkerPromise) {
    ocrWorkerPromise = (async () => {
      const { createWorker } = await loadTesseract();
      try {
        return await createWorker(IMPORT_LIMITS.ocrLanguages.split('+'), 1, {
          logger: (message) => {
            if (message?.status === 'recognizing text' && ocrProgressHandler) {
              ocrProgressHandler(Math.max(0, Math.min(1, Number(message.progress) || 0)));
            }
          },
        });
      } catch (error) {
        ocrWorkerPromise = null;
        throwImport('library', error);
      }
    })();
  }
  return ocrWorkerPromise;
}

async function disposeOcrWorker() {
  if (!ocrWorkerPromise) return;
  const current = ocrWorkerPromise;
  ocrWorkerPromise = null;
  ocrProgressHandler = null;
  try {
    const worker = await current;
    await worker.terminate();
  } catch {
    // The worker may have failed before it existed; nothing to release.
  }
}

async function recognizeCanvas(canvas, onProgress) {
  const worker = await ocrWorker();
  ocrProgressHandler = onProgress;
  try {
    const result = await worker.recognize(canvas);
    return { text: String(result?.data?.text || ''), confidence: Number(result?.data?.confidence) || 0 };
  } finally {
    ocrProgressHandler = null;
  }
}

function canvasFromImage(source, width, height) {
  const maxDimension = 2200;
  const longest = Math.max(width, height);
  const scale = longest > maxDimension ? maxDimension / longest : Math.min(2.5, Math.max(1, 1400 / Math.max(1, longest)));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(width * scale));
  canvas.height = Math.max(1, Math.round(height * scale));
  const context = canvas.getContext('2d', { alpha: false });
  if (!context) throwImport('image');
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'high';
  context.drawImage(source, 0, 0, canvas.width, canvas.height);
  return canvas;
}

async function renderPdfPage(page) {
  const base = page.getViewport({ scale: 1 });
  const maxDimension = 2200;
  const scale = Math.min(2.2, maxDimension / Math.max(1, base.width, base.height));
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement('canvas');
  canvas.width = Math.ceil(viewport.width);
  canvas.height = Math.ceil(viewport.height);
  const context = canvas.getContext('2d', { alpha: false });
  if (!context) throwImport('pdf');
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, canvas.width, canvas.height);
  await page.render({ canvasContext: context, viewport }).promise;
  return canvas;
}

async function decodeImage(file) {
  if (typeof createImageBitmap === 'function') {
    try {
      return await createImageBitmap(file);
    } catch {
      // Fall through to an <img> element for browsers with partial codec support.
    }
  }
  const url = URL.createObjectURL(file);
  try {
    return await new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = url;
    });
  } finally {
    setTimeout(() => URL.revokeObjectURL(url), 3000);
  }
}

function resultMethod({ kind, textPages = 0, ocrPages = 0 }) {
  if (kind === 'image') return 'image-ocr';
  if (textPages && ocrPages) return 'mixed';
  if (ocrPages) return 'pdf-ocr';
  return 'pdf-text';
}

async function extractPdf(file, { buffer, hash, onProgress }) {
  const pdfjs = await loadPdfJs();
  onProgress({ phase: 'text', progress: 0.08, page: 0 });
  let pdf;
  try {
    pdf = await pdfjs.getDocument({ data: new Uint8Array(buffer), isEvalSupported: false }).promise;
  } catch (error) {
    const name = String(error?.name || '');
    if (/Password/i.test(name)) throwImport('password', error);
    throwImport('pdf', error);
  }

  const totalPages = pdf.numPages;
  let metaTitle = '';
  try {
    const metadata = await pdf.metadata;
    metaTitle = String(metadata?.info?.Title || '');
  } catch {
    metaTitle = '';
  }
  const pageCount = Math.min(totalPages, IMPORT_LIMITS.maxPages);
  const chunks = [];
  let chars = 0;
  let textPages = 0;
  let ocrPages = 0;
  let skippedPages = 0;
  let ocrFailures = 0;
  let truncated = false;
  let usedPages = 0;

  try {
    for (let pageNumber = 1; pageNumber <= pageCount; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      let pageText = '';
      try {
        const content = await page.getTextContent();
        pageText = cleanExtractedText(pdfItemsToText(content.items));
      } catch {
        pageText = '';
      }
      const usableLength = pageText.replace(/\s+/g, '').length;
      if (usableLength >= IMPORT_LIMITS.textPageThreshold) {
        textPages += 1;
        chunks.push(pageText);
        chars += pageText.length;
      } else if (ocrPages < IMPORT_LIMITS.maxOcrPages) {
        onProgress({ phase: 'ocr-init', progress: 0.1 + (pageNumber / Math.max(1, pageCount)) * 0.06, page: pageNumber });
        try {
          const canvas = await renderPdfPage(page);
          const pageSpan = 0.74 / Math.max(1, pageCount);
          const base = 0.14 + ((pageNumber - 1) / Math.max(1, pageCount)) * 0.74;
          const recognised = await recognizeCanvas(canvas, (progress) => {
            onProgress({ phase: 'ocr', progress: Math.min(0.96, base + progress * pageSpan), page: pageNumber });
          });
          const clean = cleanExtractedText(recognised.text);
          if (clean.replace(/\s+/g, '').length >= 12) {
            ocrPages += 1;
            chunks.push(clean);
            chars += clean.length;
          } else {
            ocrFailures += 1;
          }
          canvas.width = 0;
          canvas.height = 0;
        } catch (error) {
          if (error instanceof ImportError && error.code === 'library') throw error;
          ocrFailures += 1;
        }
      } else {
        skippedPages += 1;
      }
      usedPages = pageNumber;
      onProgress({ phase: 'text', progress: 0.1 + (pageNumber / Math.max(1, pageCount)) * 0.82, page: pageNumber });
      if (chars >= IMPORT_LIMITS.maxChars) {
        truncated = true;
        skippedPages += Math.max(0, pageCount - pageNumber);
        break;
      }
    }
  } finally {
    await disposeOcrWorker();
    try {
      await pdf.destroy();
    } catch {
      // Closing a partially read document can fail; the text is already captured.
    }
  }

  const text = cleanExtractedText(chunks.join('\n\n')).slice(0, IMPORT_LIMITS.maxChars);
  if (!text || text.replace(/\s+/g, '').length < 12) {
    throwImport(ocrFailures ? 'ocr' : 'no-text');
  }

  return {
    ok: true,
    text,
    hash,
    kind: 'pdf',
    method: resultMethod({ kind: 'pdf', textPages, ocrPages }),
    fileName: file.name,
    fileSize: file.size,
    title: inferImportTitle({ filename: file.name, metaTitle, text }),
    pages: usedPages,
    totalPages,
    textPages,
    ocrPages,
    skippedPages,
    ocrFailures,
    truncated,
  };
}

async function extractImage(file, { hash, onProgress }) {
  onProgress({ phase: 'reading', progress: 0.05 });
  let source;
  try {
    source = await decodeImage(file);
  } catch (error) {
    throwImport('image', error);
  }
  const width = source.width || source.naturalWidth || 0;
  const height = source.height || source.naturalHeight || 0;
  if (!width || !height) throwImport('image');
  const canvas = canvasFromImage(source, width, height);
  if (typeof source.close === 'function') source.close();
  onProgress({ phase: 'ocr-init', progress: 0.08 });
  try {
    const recognised = await recognizeCanvas(canvas, (progress) => {
      onProgress({ phase: 'ocr', progress: 0.12 + progress * 0.86 });
    });
    const text = cleanExtractedText(recognised.text).slice(0, IMPORT_LIMITS.maxChars);
    if (!text || text.replace(/\s+/g, '').length < 12) throwImport('no-text');
    return {
      ok: true,
      text,
      hash,
      kind: 'image',
      method: 'image-ocr',
      fileName: file.name,
      fileSize: file.size,
      title: inferImportTitle({ filename: file.name, text }),
      pages: 1,
      totalPages: 1,
      textPages: 0,
      ocrPages: 1,
      skippedPages: 0,
      ocrFailures: 0,
      truncated: false,
      confidence: recognised.confidence,
    };
  } catch (error) {
    if (error instanceof ImportError) throw error;
    throwImport('ocr', error);
  } finally {
    canvas.width = 0;
    canvas.height = 0;
    await disposeOcrWorker();
  }
}

export async function extractFileText(file, { hash = '', buffer: providedBuffer = null, onProgress = () => {} } = {}) {
  const check = validateImportFile(file);
  if (!check.ok) throw new ImportError(check.code);
  const notify = typeof onProgress === 'function' ? onProgress : () => {};
  notify({ phase: 'reading', progress: 0.01 });
  let buffer = providedBuffer;
  if (!buffer) {
    try {
      buffer = await file.arrayBuffer();
    } catch (error) {
      throwImport('unknown', error);
    }
  }
  const digest = hash || await sha256Hex(buffer);
  let result;
  if (check.kind === 'pdf') {
    result = await extractPdf(file, { buffer, hash: digest, onProgress: notify });
  } else {
    result = await extractImage(file, { hash: digest, onProgress: notify });
  }
  notify({ phase: 'done', progress: 1 });
  return result;
}

export function sourceLabel(method, lang = 'pt') {
  const isPt = lang !== 'en';
  const labels = {
    'pdf-text': isPt ? 'PDF com texto' : 'Text PDF',
    'pdf-ocr': isPt ? 'PDF digitalizado · OCR' : 'Scanned PDF · OCR',
    mixed: isPt ? 'PDF · texto + OCR' : 'PDF · text + OCR',
    'image-ocr': isPt ? 'Imagem · OCR' : 'Image · OCR',
  };
  return labels[method] || (isPt ? 'Ficheiro importado' : 'Imported file');
}
