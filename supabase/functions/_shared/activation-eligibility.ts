export function normalizeAccountEmail(email: string): string {
  return email.trim().toLowerCase();
}

export const ACTIVATION_BOOKING_STATUSES = ['confirmed', 'reservation', 'Reservation', 'completed', 'hired', 'Hired', 'returned', 'Returned'];

export function hasActualBooking(rows: Array<{ customer_email?: string | null; booking_status?: string | null }>, email: string): boolean {
  const target = normalizeAccountEmail(email);
  return rows.some(row => normalizeAccountEmail(row.customer_email ?? '') === target &&
    ACTIVATION_BOOKING_STATUSES.some(status => status.toLowerCase() === row.booking_status?.trim().toLowerCase()));
}

export function accountWasActivated(user: { email?: string | null; last_sign_in_at?: string | null }, email: string): boolean {
  return normalizeAccountEmail(user.email ?? '') === normalizeAccountEmail(email) && Boolean(user.last_sign_in_at);
}

// Paginate: the matching activated customer may be beyond the first auth page.
export async function findAccountByEmail<T extends { email?: string | null }>(
  email: string,
  loadPage: (page: number) => Promise<T[]>,
): Promise<T | undefined> {
  for (let page = 1; ; page++) {
    const users = await loadPage(page);
    const found = users.find(user => normalizeAccountEmail(user.email ?? '') === normalizeAccountEmail(email));
    if (found) return found;
    if (users.length < 1000) return undefined;
  }
}