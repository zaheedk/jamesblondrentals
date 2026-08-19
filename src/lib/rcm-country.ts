/**
 * RCM expects `countryid` to be a numeric ID, not a country name.
 * We only know the ID for New Zealand (16) for certain, so anything we can't
 * resolve is omitted from the booking payload rather than sent as text
 * (which makes RCM reject the whole booking).
 */
const COUNTRY_IDS: Record<string, string> = {
  'new zealand': '16',
  nz: '16',
  nzl: '16',
};

export const toRcmCountryId = (value?: string | null): string | undefined => {
  if (!value) return undefined;
  const trimmed = String(value).trim();
  if (!trimmed) return undefined;
  if (/^\d+$/.test(trimmed)) return trimmed;
  return COUNTRY_IDS[trimmed.toLowerCase()];
};

/**
 * Returns a DD/MM/YYYY string only when the date is real and plausible
 * (year between 1900 and 3000 — RCM uses 3000 for "lifetime" licences).
 */
export const toRcmDate = (value?: string | null): string | undefined => {
  if (!value) return undefined;
  const raw = String(value).trim();
  if (!raw || raw === 'dd/mm/yyyy') return undefined;

  let day: number, month: number, year: number;
  if (raw.includes('/')) {
    const [d, m, y] = raw.split('/');
    day = Number(d); month = Number(m); year = Number(y);
  } else {
    const parsed = new Date(raw);
    if (Number.isNaN(parsed.getTime())) return undefined;
    day = parsed.getDate(); month = parsed.getMonth() + 1; year = parsed.getFullYear();
  }

  if (!day || !month || !year) return undefined;
  if (day < 1 || day > 31 || month < 1 || month > 12) return undefined;
  if (year < 1900 || year > 3000) return undefined;

  return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;
};
