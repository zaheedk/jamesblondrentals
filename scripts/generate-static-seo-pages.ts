import fs from 'fs';
import path from 'path';
import { staticPageMetadata } from '../src/seo/static-page-metadata';

const SITE_URL = 'https://jamesblond.co.nz';
const distDir = path.resolve(process.cwd(), 'dist');
const appHtmlPath = path.join(distDir, 'index.html');

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const upsertHeadTag = (html: string, selector: RegExp, replacement: string) =>
  selector.test(html) ? html.replace(selector, replacement) : html.replace('</head>', `    ${replacement}\n  </head>`);

const injectSeo = (html: string, metadata: typeof staticPageMetadata[number]) => {
  const title = escapeHtml(metadata.title);
  const description = escapeHtml(metadata.description);
  const canonical = `${SITE_URL}${metadata.path}`;
  const heading = escapeHtml(metadata.heading);
  const body = escapeHtml(metadata.body);
  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: metadata.title,
    description: metadata.description,
    url: canonical,
    isPartOf: {
      '@type': 'WebSite',
      name: 'James Blond Rentals',
      url: SITE_URL,
    },
  });

  let output = html;
  output = upsertHeadTag(output, /<title>.*?<\/title>/s, `<title>${title}</title>`);
  output = upsertHeadTag(output, /<meta name="description" content=".*?"\s*\/>/s, `<meta name="description" content="${description}" />`);
  output = upsertHeadTag(output, /<link rel="canonical" href=".*?"\s*\/>/s, `<link rel="canonical" href="${canonical}" />`);
  output = upsertHeadTag(output, /<meta property="og:title" content=".*?"\s*\/>/s, `<meta property="og:title" content="${title}" />`);
  output = upsertHeadTag(output, /<meta property="og:description" content=".*?"\s*\/>/s, `<meta property="og:description" content="${description}" />`);
  output = upsertHeadTag(output, /<meta property="og:url" content=".*?"\s*\/>/s, `<meta property="og:url" content="${canonical}" />`);
  output = upsertHeadTag(output, /<meta name="twitter:title" content=".*?"\s*\/>/s, `<meta name="twitter:title" content="${title}" />`);
  output = upsertHeadTag(output, /<meta name="twitter:description" content=".*?"\s*\/>/s, `<meta name="twitter:description" content="${description}" />`);
  output = output.replace('</head>', `    <script type="application/ld+json">${jsonLd.replace(/</g, '\\u003c')}</script>\n  </head>`);
  output = output.replace('<div id="root"></div>', `<div id="root"><main class="seo-prerender" aria-label="${heading}"><h1>${heading}</h1><p>${body}</p><p><a href="${canonical}">View ${heading} at James Blond Rentals</a></p></main></div>`);
  return output;
};

if (!fs.existsSync(appHtmlPath)) {
  throw new Error('dist/index.html not found. Run this script after vite build.');
}

const appHtml = fs.readFileSync(appHtmlPath, 'utf-8');

for (const metadata of staticPageMetadata) {
  const routeDir = metadata.path === '/' ? distDir : path.join(distDir, metadata.path.replace(/^\//, ''));
  fs.mkdirSync(routeDir, { recursive: true });
  fs.writeFileSync(path.join(routeDir, 'index.html'), injectSeo(appHtml, metadata), 'utf-8');
}

console.log(`✅ Static SEO HTML generated for ${staticPageMetadata.length} public routes`);
