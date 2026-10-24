const PT_STOPWORDS = new Set(`
a à às ao aos aquela aquelas aquele aqueles aquilo as até com como da das de dela delas dele deles depois do dos e é ela elas ele eles em entre era eram essa essas esse esses esta estas este estes eu foi for foram há isso isto já lhe lhes mais mas me mesmo meu meus minha minhas muito na nas não nem no nos nós o os ou para pela pelas pelo pelos por qual quando que quem se sem ser seu seus sua suas são também te tem têm tenho ter teu teus tua tuas um uma umas uns você vocês
acerca agora ainda além apenas assim cada coisa como comu? dado deve devem dizer então exemplo forma grande horas igual logo maior maneira menor mesmo muito muitos nada nem nenhum nenhuma novo outra outras outro outros parte pela pode podem pois porque primeiro qual qualquer quando quanto segundo sempre sobre todo todos toda todas tudo último última unidade unidades valor valores
`.trim().split(/\s+/).filter((word) => word && !word.includes("?")));

const EN_STOPWORDS = new Set(`
a about above after again against all also am an and any are aren't as at be because been before being below between both but by can cannot could couldn't did didn't do does doesn't doing don't down during each example few for form from further had hadn't has hasn't have haven't having he her here hers herself him himself his how i if in into is isn't it its itself just large less like long made make many may me more most much must my myself no nor not now number of off on once one only or other others our ours ourselves out over own part per same she should shouldn't so some such than that the their theirs them themselves then there these they this those through to too under until up very was wasn't we were weren't what when where which while who whom why will with won't would wouldn't you your yours yourself yourselves value values unit units hour hours
`.trim().split(/\s+/).filter(Boolean));

const CAUSAL_WORDS = /\b(porque|pois|logo|portanto|assim|consequ[eê]ncia|resulta|implica|because|therefore|thus|so that|as a result|hence)\b/i;
const EXAMPLE_WORDS = /\b(exemplo|por exemplo|e\.g\.|for example|for instance|ilustra)\b/i;
const NUMBER_UNIT = /(?:\d+(?:[.,]\d+)?\s*(?:%|°|m\/s|km\/h|m\/s²|m|cm|mm|km|s|min|h|kg|g|mg|mol|n|j|w|v|a|pa|l|ml|g\/mol|m²|cm²|m³|cm³|km²|hz|ω|°c|k)\b)|\b\d+(?:[.,]\d+)?\b/i;
const CONCLUSION_WORDS = /\b(em resumo|concluindo|conclus[aã]o|portanto|assim|in summary|to sum up|in conclusion|overall)\b/i;

const PT_MONTHS = new Set(["janeiro", "fevereiro", "março", "marco", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"]);
const EN_MONTHS = new Set(["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"]);

const ABBREVIATIONS = new Set(["ex", "etc", "fig", "pág", "pag", "dr", "dra", "prof", "profa", "eng", "nº", "no", "al", "cap", "art", "vs", "cf", "mr", "mrs", "ms", "st", "approx", "aprox"]);

const BAD_TERM_STARTS = new Set([
  "quando", "se", "como", "onde", "que", "isto", "isso", "este", "esta", "estes", "estas",
  "ele", "ela", "eles", "elas", "there", "this", "that", "these", "those", "when", "where",
  "which", "if", "it", "they", "we", "you", "i", "um", "uma", "uns", "umas", "a", "o", "as", "os",
  "the", "an",
]);

const PT_ARTICLES = new Set(["a", "o", "as", "os", "um", "uma", "uns", "umas"]);
const EN_ARTICLES = new Set(["the", "a", "an"]);

const WORDS = /[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu;

export function normalizeText(value) {
  return String(value ?? "")
    .replace(/\r\n?/g, "\n")
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function stripDiacritics(value) {
  return String(value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function wordsOf(value) {
  return normalizeText(value).match(WORDS) ?? [];
}

export function splitSentences(value) {
  const text = normalizeText(value).replace(/\n+/g, " ");
  const sentences = [];
  let current = "";
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    current += char;
    if (!/[.!?…]/.test(char)) continue;
    const next = text[index + 1] ?? "";
    if (next && !/\s/.test(next)) continue;
    if (char === ".") {
      const previous = current.match(/([A-Za-zÀ-ÖØ-öø-ÿ]+)\.$/u)?.[1]?.toLowerCase();
      if (previous && ABBREVIATIONS.has(previous)) continue;
      const rest = text.slice(index + 1).trimStart();
      if (/^\d/.test(rest)) continue;
    }
    const sentence = current.trim();
    if (sentence) sentences.push(sentence);
    current = "";
    while (index + 1 < text.length && /\s/.test(text[index + 1])) index += 1;
  }
  if (current.trim()) sentences.push(current.trim());
  return sentences.filter((sentence) => /[\p{L}\p{N}]/u.test(sentence));
}

export function detectLanguage(value) {
  const tokens = wordsOf(value).map((word) => word.toLowerCase());
  let pt = 0;
  let en = 0;
  for (const token of tokens) {
    if (PT_STOPWORDS.has(token)) pt += 1;
    if (EN_STOPWORDS.has(token)) en += 1;
  }
  if (pt === 0 && en === 0) {
    if (/\b(ção|ções|não|é|são|uma|para|com)\b/i.test(value)) return "pt";
    return "pt";
  }
  return en > pt ? "en" : "pt";
}

function cleanTerm(value) {
  let term = String(value ?? "").trim().replace(/^[\-–—*•\d.)\s]+/, "").replace(/\s+/g, " ");
  term = term.replace(/^["'“”«»]+|["'“”«»]+$/g, "").trim();
  const first = term.split(/\s+/)[0]?.toLowerCase() ?? "";
  if (PT_ARTICLES.has(first) || EN_ARTICLES.has(first)) {
    const stripped = term.split(/\s+/).slice(1).join(" ");
    if (stripped) term = stripped;
  }
  return term.replace(/[:;,]+$/g, "").trim();
}

function validTerm(term) {
  if (!term || term.length < 2 || term.length > 64) return false;
  if (!/[\p{L}]/u.test(term)) return false;
  if (/[.;!?]/.test(term)) return false;
  const words = term.split(/\s+/).filter(Boolean);
  if (words.length < 1 || words.length > 6) return false;
  const first = stripDiacritics(words[0].toLowerCase());
  if (BAD_TERM_STARTS.has(first)) return false;
  if (words.every((word) => PT_STOPWORDS.has(word.toLowerCase()) || EN_STOPWORDS.has(word.toLowerCase()))) return false;
  return true;
}

function truncateAtWord(value, max) {
  const text = String(value ?? "").trim();
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const boundary = cut.lastIndexOf(" ");
  return `${(boundary > max * 0.55 ? cut.slice(0, boundary) : cut).trim()}…`;
}

function plainSentence(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function suggestionTitle(text) {
  const lines = normalizeText(text).split("\n").map((line) => line.trim()).filter(Boolean);
  const heading = lines.find((line) => /^#{1,6}\s+/.test(line));
  if (heading) return truncateAtWord(heading.replace(/^#+\s*/, "").replace(/:$/, ""), 64);
  const firstLine = lines[0] ?? "";
  if (firstLine.length <= 70 && !/[.!?…]$/.test(firstLine)) return truncateAtWord(firstLine.replace(/:$/, ""), 64);
  const sentence = splitSentences(text)[0] ?? "";
  return truncateAtWord(sentence.replace(/[.!?…]+$/, ""), 64) || "Resumo sem título";
}

function sentenceWords(sentence) {
  return wordsOf(sentence).length;
}

function keywordTable(sentences, detectedTitle = "") {
  const counts = new Map();
  const firstSeen = new Map();
  sentences.forEach((sentence, sentenceIndex) => {
    for (const raw of wordsOf(sentence)) {
      const word = raw.toLowerCase();
      if (word.length < 4) continue;
      if (/mente$/.test(word)) continue;
      if (PT_STOPWORDS.has(word) || EN_STOPWORDS.has(word)) continue;
      if (/^\d+$/.test(word)) continue;
      if (!counts.has(word)) {
        counts.set(word, { label: raw, count: 0, first: sentenceIndex });
        firstSeen.set(word, raw);
      }
      counts.get(word).count += 1;
    }
  });
  const titleTokens = new Set(wordsOf(detectedTitle).map((word) => word.toLowerCase()));
  return [...counts.entries()]
    .map(([word, data]) => ({
      term: data.label,
      normalized: word,
      count: data.count,
      score: data.count * 2 + (titleTokens.has(word) ? 3 : 0) + Math.min(data.label.length, 12) / 20,
      first: data.first,
    }))
    .sort((a, b) => b.score - a.score || a.first - b.first)
    .slice(0, 14);
}

function extractDefinitions(sentences) {
  const definitions = [];
  const seen = new Set();
  const patterns = [
    /^(.{2,70}?)\s+(é|são)\s+(.{4,320})$/iu,
    /^(.{2,70}?)\s+(significa|significam|consiste em|consistem em|refere-se a|referem-se a|corresponde a|correspondem a|define-se como|designa|designam)\s*(.{4,320})$/iu,
    /^(.{2,70}?)\s+(is|are)\s+(.{4,320})$/iu,
    /^(.{2,70}?)\s+(means|refers to|is defined as)\s+(.{4,320})$/iu,
  ];
  for (const sentence of sentences) {
    const clean = plainSentence(sentence);
    for (const pattern of patterns) {
      const match = clean.match(pattern);
      if (!match) continue;
      const term = cleanTerm(match[1]);
      if (!validTerm(term)) continue;
      const normalized = stripDiacritics(term.toLowerCase());
      if (seen.has(normalized)) break;
      seen.add(normalized);
      definitions.push({ term, predicate: match[3].trim().replace(/[.!?…]+$/, ""), sentence: clean });
      break;
    }
  }
  return definitions.slice(0, 8);
}

function extractLineDefinitions(text) {
  const definitions = [];
  const seen = new Set();
  for (const line of normalizeText(text).split("\n")) {
    const trimmed = line.trim().replace(/^[-*•–]\s*/, "");
    if (!trimmed || /^\d{1,2}:\d{2}/.test(trimmed)) continue;
    const match = trimmed.match(/^([^:]{3,70}):\s*(.{4,320})$/u);
    if (!match) continue;
    const term = cleanTerm(match[1]);
    if (!validTerm(term)) continue;
    const normalized = stripDiacritics(term.toLowerCase());
    if (seen.has(normalized)) continue;
    seen.add(normalized);
    definitions.push({ term, predicate: match[2].trim().replace(/[.!?…]+$/, ""), sentence: trimmed });
  }
  return definitions;
}

function mergeDefinitions(sentences, text) {
  const merged = new Map();
  for (const item of [...extractDefinitions(sentences), ...extractLineDefinitions(text)]) {
    const key = stripDiacritics(item.term.toLowerCase());
    if (!merged.has(key)) merged.set(key, item);
  }
  return [...merged.values()].slice(0, 8);
}

function isHeadingLine(line) {
  const trimmed = line.trim();
  if (!trimmed) return false;
  if (/^#{1,6}\s+\S/.test(trimmed)) return true;
  if (/^[-*•–]\s+/.test(trimmed)) return false;
  const stripped = trimmed.replace(/^\d+[.)]\s+/, "");
  if (stripped.length > 72) return false;
  const words = stripped.split(/\s+/).filter(Boolean);
  if (words.length > 10) return false;
  if (/:$/.test(stripped)) return true;
  if (/[.!?…]$/.test(stripped)) return false;
  if (/[,;]/.test(stripped)) return false;
  return words.length <= 7;
}

function buildOutline(text) {
  const blocks = [];
  let current = null;
  const flush = () => {
    if (!current) return;
    if (current.heading || current.points.length) blocks.push(current);
    current = null;
  };
  for (const line of normalizeText(text).split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) {
      flush();
      continue;
    }
    if (isHeadingLine(trimmed)) {
      flush();
      current = {
        heading: trimmed.replace(/^#{1,6}\s+/, "").replace(/^\d+[.)]\s+/, "").replace(/:$/, "").trim(),
        points: [],
      };
      continue;
    }
    if (!current) current = { heading: "", points: [] };
    const bullet = trimmed.match(/^[-*•–]\s+(.+)$/u) || trimmed.match(/^\d+[.)]\s+(.+)$/u);
    if (bullet) {
      current.points.push(truncateAtWord(plainSentence(bullet[1]), 220));
    } else {
      for (const sentence of splitSentences(trimmed)) {
        current.points.push(truncateAtWord(plainSentence(sentence), 220));
      }
    }
  }
  flush();
  return blocks
    .filter((block) => block.heading || block.points.length)
    .slice(0, 8)
    .map((block) => ({
      heading: block.heading || null,
      points: block.points.slice(0, 4),
    }));
}

function scoreSentences(sentences, keywords, title) {
  const counts = new Map(keywords.map((keyword) => [keyword.normalized, keyword.count]));
  const titleTokens = new Set(wordsOf(title).map((word) => word.toLowerCase()));
  const total = Math.max(1, sentences.length);
  return sentences
    .map((sentence, index) => {
      const tokens = wordsOf(sentence).map((word) => word.toLowerCase());
      if (!tokens.length) return null;
      const length = tokens.length;
      if (length < 5 || length > 55) return null;
      let score = 0;
      for (const token of new Set(tokens)) {
        if (counts.has(token)) score += 1 + Math.min(counts.get(token), 4) * 0.35;
        if (titleTokens.has(token)) score += 0.35;
      }
      if (index < total * 0.2) score += 1.1;
      if (index > total * 0.8) score += 0.35;
      if (CAUSAL_WORDS.test(sentence)) score += 0.9;
      if (/\b(é|são|significa|consiste|is|are|means)\b/i.test(sentence)) score += 0.8;
      if (NUMBER_UNIT.test(sentence)) score += 0.4;
      if (length > 38) score -= 0.6;
      if (/[?]$/.test(sentence.trim())) score -= 0.8;
      return { sentence: plainSentence(sentence), index, score };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, 4);
}

function coverageOf(sentences, definitions, text) {
  const joined = sentences.join(" ");
  const last = sentences.slice(Math.max(0, sentences.length - 3)).join(" ");
  return [
    {
      id: "definitions",
      ok: definitions.length >= 2,
      hint: definitions.length >= 2
        ? "Tem conceitos definidos."
        : "Falta definir os conceitos principais. Acrescenta uma frase «X é …» para cada termo.",
    },
    {
      id: "example",
      ok: EXAMPLE_WORDS.test(text),
      hint: EXAMPLE_WORDS.test(text)
        ? "Inclui um exemplo concreto."
        : "Não encontrámos um exemplo. Um exemplo ajuda a testar se compreendeste.",
    },
    {
      id: "quantities",
      ok: NUMBER_UNIT.test(joined),
      hint: NUMBER_UNIT.test(joined)
        ? "Inclui valores ou unidades."
        : "Não encontrámos valores nem unidades. Em Física e Química, isso costuma faltar.",
    },
    {
      id: "connections",
      ok: CAUSAL_WORDS.test(joined),
      hint: CAUSAL_WORDS.test(joined)
        ? "Liga causas e consequências."
        : "Não encontrámos ligações do tipo «porque», «logo» ou «portanto».",
    },
    {
      id: "conclusion",
      ok: CONCLUSION_WORDS.test(last),
      hint: CONCLUSION_WORDS.test(last)
        ? "Tem uma ideia de fecho."
        : "O fecho não resume a ideia principal. Termina com «Em resumo, …».",
    },
  ];
}

function makeCards(sentences, definitions, keywords, language) {
  const isPt = language !== "en";
  const cards = [];
  const usedSentences = new Set();
  for (const definition of definitions) {
    cards.push({
      kind: "definition",
      front: isPt ? `O que é «${definition.term}»?` : `What is “${definition.term}”?`,
      back: definition.sentence,
      answer: definition.term,
      sentence: definition.sentence,
    });
    usedSentences.add(definition.sentence);
    if (cards.length >= 6) break;
  }
  if (cards.length < 8) {
    for (const sentence of sentences) {
      if (cards.length >= 8) break;
      if (usedSentences.has(sentence)) continue;
      const length = sentenceWords(sentence);
      if (length < 7 || length > 38) continue;
      const match = findCloze(sentence, keywords);
      if (!match) continue;
      usedSentences.add(sentence);
      cards.push({
        kind: "cloze",
        front: match.blanked,
        back: match.answer,
        answer: match.answer,
        sentence,
      });
    }
  }
  return cards;
}

function findCloze(sentence, keywords) {
  const ordered = keywords
    .filter((keyword) => keyword.count >= 1)
    .map((keyword) => keyword.term)
    .filter((term) => term.length >= 4)
    .sort((a, b) => b.length - a.length);
  for (const term of ordered) {
    const pattern = new RegExp(`(^|[^\\p{L}\\p{N}])(${escapeRegExp(term)})(?=$|[^\\p{L}\\p{N}])`, "iu");
    const match = sentence.match(pattern);
    if (!match) continue;
    const start = match.index + match[1].length;
    const end = start + match[2].length;
    const blanked = `${sentence.slice(0, start)}_____${sentence.slice(end)}`;
    return { answer: match[2], blanked: plainSentence(blanked) };
  }
  return null;
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function hashString(value) {
  let hash = 2166136261;
  const text = String(value);
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function seededShuffle(items, seedValue) {
  const result = [...items];
  let state = seedValue >>> 0;
  for (let index = result.length - 1; index > 0; index -= 1) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const swap = state % (index + 1);
    [result[index], result[swap]] = [result[swap], result[index]];
  }
  return result;
}

function makeQuiz(sentences, keywords) {
  if (keywords.length < 3) return [];
  const questions = [];
  const usedSentences = new Set();
  for (const sentence of sentences) {
    if (questions.length >= 4) break;
    if (usedSentences.has(sentence)) continue;
    const length = sentenceWords(sentence);
    if (length < 7 || length > 38) continue;
    const match = findCloze(sentence, keywords);
    if (!match) continue;
    const sentenceKey = stripDiacritics(sentence.toLowerCase());
    const distractorPool = keywords
      .filter((keyword) => stripDiacritics(keyword.term.toLowerCase()) !== stripDiacritics(match.answer.toLowerCase()))
      .filter((keyword) => !stripDiacritics(sentenceKey).includes(stripDiacritics(keyword.term.toLowerCase())))
      .map((keyword) => keyword.term);
    const fallbackPool = keywords
      .filter((keyword) => stripDiacritics(keyword.term.toLowerCase()) !== stripDiacritics(match.answer.toLowerCase()))
      .map((keyword) => keyword.term);
    const pool = (distractorPool.length >= 2 ? distractorPool : fallbackPool)
      .filter((term, index, list) => list.findIndex((other) => stripDiacritics(other.toLowerCase()) === stripDiacritics(term.toLowerCase())) === index);
    if (pool.length < 2) continue;
    const distractors = seededShuffle(pool, hashString(match.blanked)).slice(0, 2);
    const options = seededShuffle([match.answer, ...distractors], hashString(`${match.blanked}:options`));
    usedSentences.add(sentence);
    questions.push({
      id: `q${questions.length + 1}`,
      prompt: match.blanked,
      options,
      correct: options.findIndex((option) => option === match.answer),
      answer: match.answer,
      explanation: sentence,
    });
  }
  return questions;
}

function makeGuidingQuestions(definitions, language) {
  const isPt = language !== "en";
  const questions = [];
  if (definitions.length >= 2) {
    questions.push(isPt
      ? `Consegues explicar a diferença entre «${definitions[0].term}» e «${definitions[1].term}» sem olhar ao texto?`
      : `Can you explain the difference between “${definitions[0].term}” and “${definitions[1].term}” without looking at the text?`);
  } else if (definitions.length === 1) {
    questions.push(isPt
      ? `Consegues explicar «${definitions[0].term}» por palavras tuas?`
      : `Can you explain “${definitions[0].term}” in your own words?`);
  }
  if (definitions.length) {
    questions.push(isPt
      ? `Dá um exemplo de «${definitions[0].term}» aplicado a um exercício.`
      : `Give an example of “${definitions[0].term}” applied to an exercise.`);
  }
  questions.push(isPt
    ? "Que parte deste resumo ainda não consegues repetir sem consultar?"
    : "Which part of this summary can you not yet repeat without checking?");
  return questions.slice(0, 4);
}

function scoreRelatedLessons(keywords, lessons) {
  if (!Array.isArray(lessons) || !lessons.length) return [];
  const keywordSet = keywords.slice(0, 12).map((keyword) => keyword.normalized);
  return lessons
    .map((lesson) => {
      const haystack = stripDiacritics(String(lesson.searchText ?? "").toLowerCase());
      let score = 0;
      for (const keyword of keywordSet) {
        const count = haystack.split(keyword).length - 1;
        if (count) score += Math.min(count, 3);
      }
      return { lessonId: lesson.id, score };
    })
    .filter((item) => item.score >= 3)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

export function analyzeSummary({ text, title = "", subject = "general", lessons = [] } = {}) {
  const clean = normalizeText(text);
  const sentences = splitSentences(clean);
  const paragraphs = clean.split(/\n{2,}/).map((part) => part.trim()).filter(Boolean);
  const wordCount = wordsOf(clean).length;
  const stats = {
    characters: clean.length,
    words: wordCount,
    sentences: sentences.length,
    paragraphs: paragraphs.length,
    readingMinutes: Math.max(1, Math.ceil(wordCount / 180)),
  };
  const insufficient = clean.length < 120 || sentences.length < 2;
  if (insufficient) {
    return {
      insufficient: true,
      reason: clean.length < 120 ? "too_short" : "few_sentences",
      stats,
      language: detectLanguage(clean),
      title: title.trim() || suggestionTitle(clean),
      subject,
      text: clean,
    };
  }

  const language = detectLanguage(clean);
  const suggestedTitle = suggestionTitle(clean);
  const keywords = keywordTable(sentences, title || suggestedTitle);
  const definitions = mergeDefinitions(sentences, clean);
  const keySentences = scoreSentences(sentences, keywords, title || suggestedTitle);
  const keyIdeas = keySentences.map((item) => item.sentence);
  const centralIdea = keyIdeas[0] || plainSentence(sentences[0]);
  const outline = buildOutline(clean);
  const cards = makeCards(sentences, definitions, keywords, language);
  const quiz = makeQuiz(sentences, keywords);

  return {
    insufficient: false,
    version: 1,
    stats,
    language,
    detectedSubjects: [],
    title: title.trim() || suggestedTitle,
    suggestedTitle,
    subject,
    text: clean,
    centralIdea,
    keyIdeas,
    outline,
    definitions,
    keywords: keywords.map(({ term, count }) => ({ term, count })).slice(0, 10),
    guidingQuestions: makeGuidingQuestions(definitions, language),
    coverage: coverageOf(sentences, definitions, clean),
    cards,
    quiz,
    related: scoreRelatedLessons(keywords, lessons),
    createdAt: new Date().toISOString(),
  };
}
