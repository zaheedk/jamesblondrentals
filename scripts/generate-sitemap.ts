/**
 * Sitemap generator script.
 * Run at build time via Vite plugin to auto-generate public/sitemap.xml
 * from the central route config in src/sitemap-routes.ts.
 */

import fs from 'fs';
import path from 'path';
import { sitemapRoutes } from '../src/sitemap-routes';

const SITE_URL = 'https://jamesblond.co.nz';

function generateSitemap(): string {
  const today = new Date().toISOString().split('T')[0];

  const urls = sitemapRoutes.map(route => `  <url>
    <loc>${SITE_URL}${route.path}</loc>
    <lastmod>${today}</lastmod>
    <priority>${route.priority.toFixed(1)}</priority>
    <changefreq>${route.changefreq}</changefreq>
  </url>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

const sitemap = generateSitemap();
const outPath = path.resolve(__dirname, '../public/sitemap.xml');
fs.writeFileSync(outPath, sitemap, 'utf-8');
console.log(`✅ Sitemap generated with ${sitemapRoutes.length} URLs → public/sitemap.xml`);
