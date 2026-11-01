import { expect, test } from 'bun:test';
import { aucklandArticleHirePath, aucklandHirePaths, aucklandCarSEO, aucklandVanSEO } from '../src/seo/auckland';
import { staticPageMetadata } from '../src/seo/static-page-metadata';
import { sitemapRoutes } from '../src/sitemap-routes';

test('Auckland hire destinations reuse the established public pages', () => {
  expect(aucklandHirePaths.vans).toBe('/van-hire-auckland');
  expect(aucklandHirePaths.cars).toBe('/car-hire-auckland');
  expect(aucklandHirePaths.trucks).toBe('/auckland-truck-rentals-hire');
  expect(aucklandHirePaths.westTrucks).toBe('/west-auckland-truck-rentals-hire');
  for (const path of Object.values(aucklandHirePaths)) {
    expect(sitemapRoutes.some(route => route.path === path)).toBe(true);
  }
});

test('Auckland car and van pages share their crawler metadata', () => {
  for (const page of [aucklandCarSEO, aucklandVanSEO]) {
    expect(staticPageMetadata.find(route => route.path === page.path)).toMatchObject(page);
  }
});

test('Auckland cargo van articles link to the van booking hub', () => {
  expect(aucklandArticleHirePath('Van hire prices in Auckland')).toBe('/van-hire-auckland');
  expect(aucklandArticleHirePath('Moving guide', 'cargo-van-hire-auckland')).toBe('/van-hire-auckland');
});

test('Auckland truck and car articles retain their matching hire intent', () => {
  expect(aucklandArticleHirePath('Moving truck hire Auckland')).toBe('/auckland-truck-rentals-hire');
  expect(aucklandArticleHirePath('Car rental in Auckland')).toBe('/car-hire-auckland');
});

test('other cities and passenger articles are not redirected to Auckland cargo hire', () => {
  expect(aucklandArticleHirePath('Van hire Wellington')).toBeUndefined();
  expect(aucklandArticleHirePath('Auckland to Wellington one-way van hire')).toBeUndefined();
  expect(aucklandArticleHirePath('12 seater van hire Auckland')).toBeUndefined();
  expect(aucklandArticleHirePath('Auckland sightseeing guide')).toBeUndefined();
});