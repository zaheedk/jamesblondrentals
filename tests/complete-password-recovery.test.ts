import { expect, test } from 'bun:test';
import { completePasswordRecovery } from '../src/lib/complete-password-recovery';

test('saving a password keeps the verified session and opens personal details without another login', async () => {
  const destinations: string[] = [];
  let savedPassword = '';
  await completePasswordRecovery('new-password', async password => {
    savedPassword = password;
    return { error: null };
  }, async () => true, destination => destinations.push(destination));
  expect(savedPassword).toBe('new-password');
  expect(destinations).toEqual(['/member-dashboard?tab=profile']);
});

test('a failed password save never opens the account', async () => {
  const destinations: string[] = [];
  await expect(completePasswordRecovery('new-password', async () => ({ error: { message: 'Expired link' } }),
    async () => true, destination => destinations.push(destination))).rejects.toThrow('Expired link');
  expect(destinations).toEqual([]);
});

test('an unverified session never opens the account after saving', async () => {
  const destinations: string[] = [];
  await expect(completePasswordRecovery('new-password', async () => ({ error: null }),
    async () => false, destination => destinations.push(destination))).rejects.toThrow('Please sign in');
  expect(destinations).toEqual([]);
});