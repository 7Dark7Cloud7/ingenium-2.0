import { buildWikipediaSearchUrl } from './concept-lens.js';

export class WikiLookupError extends Error {
  constructor(code) {
    super(code);
    this.name = 'WikiLookupError';
    this.code = code;
  }
}

export function buildWikipediaSummaryUrl(title, lang = 'pt') {
  const host = lang === 'en' ? 'en.wikipedia.org' : 'pt.wikipedia.org';
  return `https://${host}/api/rest_v1/page/summary/${encodeURIComponent(String(title || '').replace(/ /g, '_'))}?redirect=true`;
}

export function wikiLookupErrorMessage(code, lang = 'pt') {
  const isPt = lang !== 'en';
  const messages = {
    invalid: isPt ? 'Este resumo ainda não tem um conceito claro para procurar.' : 'This summary does not have a clear concept to look up yet.',
    offline: isPt ? 'Estás sem ligação. O resto do resumo continua a funcionar neste dispositivo.' : 'You are offline. The rest of the summary still works on this device.',
    notfound: isPt ? 'Não encontrei um artigo com esse nome. Tenta uma palavra-chave mais geral.' : 'I could not find an article with that name. Try a broader keyword.',
    empty: isPt ? 'O artigo encontrado não tem um resumo em texto.' : 'The article found has no text summary.',
    network: isPt ? 'A Wikipédia não respondeu. Tenta outra vez dentro de momentos.' : 'Wikipedia did not respond. Try again in a moment.',
  };
  return messages[code] || messages.network;
}

async function readJson(response) {
  if (!response.ok) throw new WikiLookupError(response.status === 404 ? 'notfound' : 'network');
  try {
    return await response.json();
  } catch {
    throw new WikiLookupError('network');
  }
}

export async function fetchWikipediaConcept(term, { lang = 'pt', timeoutMs = 12000 } = {}) {
  const query = String(term || '').replace(/\s+/g, ' ').trim();
  if (query.length < 2) throw new WikiLookupError('invalid');
  if (typeof fetch !== 'function') throw new WikiLookupError('offline');
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), Math.max(2000, timeoutMs));
  try {
    const searchResponse = await fetch(buildWikipediaSearchUrl(query, lang), {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    const search = await readJson(searchResponse);
    const title = search?.query?.search?.[0]?.title;
    if (!title) throw new WikiLookupError('notfound');
    const summaryResponse = await fetch(buildWikipediaSummaryUrl(title, lang), {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    const summary = await readJson(summaryResponse);
    const extract = String(summary?.extract || '').replace(/\s+/g, ' ').trim();
    if (!extract) throw new WikiLookupError('empty');
    const pageUrl = summary?.content_urls?.desktop?.page
      || `https://${lang === 'en' ? 'en' : 'pt'}.wikipedia.org/wiki/${encodeURIComponent(String(summary?.title || title).replace(/ /g, '_'))}`;
    return {
      term: query,
      title: String(summary?.title || title),
      description: String(summary?.description || ''),
      extract,
      url: pageUrl,
      lang: lang === 'en' ? 'en' : 'pt',
      source: 'Wikipédia',
      license: 'CC BY-SA',
      fetchedAt: new Date().toISOString(),
    };
  } catch (error) {
    if (error instanceof WikiLookupError) throw error;
    if (error?.name === 'AbortError') throw new WikiLookupError('network');
    throw new WikiLookupError('network');
  } finally {
    clearTimeout(timer);
  }
}
