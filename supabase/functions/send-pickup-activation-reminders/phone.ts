// Normalises NZ phone numbers to E.164 (+64...). Returns null when unusable.
export function toE164NZ(raw: string | null | undefined): string | null {
  if (!raw) return null
  let d = raw.replace(/[^\d+]/g, '')
  if (d.startsWith('+')) return /^\+\d{8,15}$/.test(d) ? d : null
  if (d.startsWith('00')) d = d.slice(2)
  else if (d.startsWith('0')) d = '64' + d.slice(1)
  else if (!d.startsWith('64')) d = '64' + d
  const e = '+' + d
  // NZ mobiles start +642 and have 8–10 digits after 64
  return /^\+642\d{7,9}$/.test(e) ? e : null
}
