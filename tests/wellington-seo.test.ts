import { expect, test } from 'bun:test';
import { wellingtonAliases, isWellingtonVanArticle, wellingtonCarSEO, wellingtonVanSEO } from '../src/seo/wellington';
import { sitemapRoutes } from '../src/sitemap-routes';
import { staticPageMetadata } from '../src/seo/static-page-metadata';
import vercel from '../vercel.json';

test('short Wellington car URLs retain the established car page rather than duplicate it', () => {
  expect(wellingtonAliases['/car-hire-wellington']).toBe('/car-rental-wellington-new-zealand');
  expect(wellingtonAliases['/car-rental-wellington']).toBe('/car-rental-wellington-new-zealand');
  expect(wellingtonAliases['/wellington-car-rental']).toBe('/car-rental-wellington-new-zealand');
});

test('Wellington aliases have matching permanent production redirects', () => {
  for (const [source, destination] of Object.entries(wellingtonAliases)) {
    expect(vercel.redirects.find(rule => rule.source === source)).toMatchObject({ destination, statusCode: 301 });
    expect(sitemapRoutes.some(route => route.path === source)).toBe(false);
  }
});

test('car and van canonical pages remain discoverable with matching static metadata', () => {
  for (const page of [wellingtonCarSEO, wellingtonVanSEO]) {
    expect(sitemapRoutes.some(route => route.path === page.path)).toBe(true);
    expect(staticPageMetadata.find(route => route.path === page.path)).toMatchObject(page);
  }
});

test('Wellington van articles receive the local booking destination, not Auckland or unrelated articles', () => {
  expect(isWellingtonVanArticle('How much does van hire cost in Wellington?')).toBe(true);
  expect(isWellingtonVanArticle('Moving guide', 'van-hire-wellington-cost')).toBe(true);
  expect(isWellingtonVanArticle('Van hire prices in Auckland')).toBe(false);
  expect(isWellingtonVanArticle('Wellington car rental')).toBe(false);
});