import { test, expect } from 'bun:test';
import { hasActualBooking, accountWasActivated, findAccountByEmail } from '../supabase/functions/_shared/activation-eligibility';

test('quote-only customers must not receive activation emails', () => {
  expect(hasActualBooking([{ customer_email: 'customer@example.com', booking_status: 'pending' }], 'customer@example.com')).toBe(false);
  expect(hasActualBooking([{ customer_email: 'customer@example.com', booking_status: 'Quotation' }], 'customer@example.com')).toBe(false);
});
test('a confirmed booking under the associated email qualifies even if they also have a quote', () => {
  expect(hasActualBooking([{ customer_email: 'Customer@Example.com', booking_status: 'confirmed' }, { customer_email: 'customer@example.com', booking_status: 'pending' }], ' customer@example.com ')).toBe(true);
  expect(hasActualBooking([{ customer_email: 'other@example.com', booking_status: 'confirmed' }], 'customer@example.com')).toBe(false);
  expect(hasActualBooking([{ customer_email: 'customer@example.com', booking_status: 'cancelled' }], 'customer@example.com')).toBe(false);
});
test('activation emails exclude already activated accounts matched case-insensitively', () => {
  expect(accountWasActivated({ email: 'Customer@Example.com', last_sign_in_at: '2026-10-27T00:00:00Z' }, 'customer@example.com')).toBe(true);
  expect(accountWasActivated({ email: 'customer@example.com', last_sign_in_at: null }, 'customer@example.com')).toBe(false);
});
test('account matching checks beyond the first thousand accounts', async () => {
  const target = { email: 'Customer@Example.com', last_sign_in_at: '2026-10-27T00:00:00Z' };
  const found = await findAccountByEmail('customer@example.com', async page => page === 1 ? Array.from({ length: 1000 }, (_, i) => ({ email: `other${i}@example.com` })) : [target]);
  expect(found).toEqual(target);
  expect(accountWasActivated(found ?? {}, 'customer@example.com')).toBe(true);
});