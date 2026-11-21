import { expect, test } from 'bun:test';
import { searchLocationDefault } from '../src/lib/search-location-default';
import { wellingtonCarSearchDefaults, wellingtonVanSearchDefaults, wellingtonAirportSearchDefaults } from '../src/seo/wellington';

test('Wellington CBD car searches use branch 11 and car category 1 despite saved Auckland preferences', () => {
  expect(searchLocationDefault('1', wellingtonCarSearchDefaults.defaultPickupLocation, wellingtonCarSearchDefaults.preferDefaultLocation)).toBe('11');
  expect(searchLocationDefault('7', wellingtonCarSearchDefaults.defaultDropoffLocation, wellingtonCarSearchDefaults.preferDefaultLocation)).toBe('11');
  expect(wellingtonCarSearchDefaults.defaultCarCategory).toBe('1');
});

test('Wellington Airport car searches use airport branch 13 and car category 1', () => {
  expect(searchLocationDefault('1', wellingtonAirportSearchDefaults.defaultPickupLocation, wellingtonAirportSearchDefaults.preferDefaultLocation)).toBe('13');
  expect(searchLocationDefault('11', wellingtonAirportSearchDefaults.defaultDropoffLocation, wellingtonAirportSearchDefaults.preferDefaultLocation)).toBe('13');
  expect(wellingtonAirportSearchDefaults.defaultCarCategory).toBe('1');
});

test('Wellington cargo van searches use city branch 11 and standard van category 11', () => {
  expect(searchLocationDefault('1', wellingtonVanSearchDefaults.defaultPickupLocation, wellingtonVanSearchDefaults.preferDefaultLocation)).toBe('11');
  expect(wellingtonVanSearchDefaults.defaultDropoffLocation).toBe('11');
  expect(wellingtonVanSearchDefaults.defaultCarCategory).toBe('11');
});

test('ordinary search pages keep saved Auckland preferences', () => {
  expect(searchLocationDefault('1', '11', false)).toBe('1');
  expect(searchLocationDefault('7', '13', false)).toBe('7');
});