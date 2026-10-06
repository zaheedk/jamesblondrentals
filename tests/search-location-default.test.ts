import { expect, test } from 'bun:test';
import { searchLocationDefault } from '../src/lib/search-location-default';

test('Hamilton hub starts at Hamilton (17) even with a saved Auckland location (1)', () => {
  expect(searchLocationDefault('1', '17', true)).toBe('17');
});

test('other search forms retain saved customer locations', () => {
  expect(searchLocationDefault('1', '17', false)).toBe('1');
});