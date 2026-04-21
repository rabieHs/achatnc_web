/// Lowercases + strips French/common diacritics so "Néoprène" and
/// "neoprene" match. Keep in sync with `Formatters.normalizeForSearch`
/// in the Flutter app.

const REPLACEMENTS: Record<string, string> = {
  à: 'a', â: 'a', ä: 'a', ã: 'a', á: 'a', å: 'a',
  ç: 'c',
  è: 'e', é: 'e', ê: 'e', ë: 'e',
  ì: 'i', í: 'i', î: 'i', ï: 'i',
  ñ: 'n',
  ò: 'o', ó: 'o', ô: 'o', ö: 'o', õ: 'o',
  ù: 'u', ú: 'u', û: 'u', ü: 'u',
  ý: 'y', ÿ: 'y',
  œ: 'oe', æ: 'ae',
};

export function normalizeForSearch(input: string): string {
  let s = input.toLowerCase();
  for (const [from, to] of Object.entries(REPLACEMENTS)) {
    s = s.split(from).join(to);
  }
  return s;
}

export function generateSearchKeywords(title: string): string[] {
  return Array.from(
    new Set(
      normalizeForSearch(title)
        .split(/\s+/)
        .filter((w) => w.length > 1),
    ),
  );
}
