// Decides which reminder (if any) a quote gets today.
// - First reminder once per quote, while pickup is more than 3 days away.
// - Final reminder once per quote, when pickup is 0–3 days away. If the first
//   reminder was never sent by then, the final template is used instead.
export const FINAL_WINDOW_DAYS = 3

export type ReminderKind = 'first' | 'final'

export function daysBetween(fromIso: string, toIso: string): number {
  const a = Date.UTC(+fromIso.slice(0, 4), +fromIso.slice(5, 7) - 1, +fromIso.slice(8, 10))
  const b = Date.UTC(+toIso.slice(0, 4), +toIso.slice(5, 7) - 1, +toIso.slice(8, 10))
  return Math.round((b - a) / 86400000)
}

export function reminderDue(todayIso: string, pickupIso: string, sent: Set<ReminderKind>): ReminderKind | null {
  const days = daysBetween(todayIso, pickupIso)
  if (days < 0) return null
  if (days <= FINAL_WINDOW_DAYS) return sent.has('final') ? null : 'final'
  return sent.has('first') ? null : 'first'
}

export function nzToday(now = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Pacific/Auckland' }).format(now)
}
