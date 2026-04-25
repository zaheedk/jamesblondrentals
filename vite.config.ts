
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import { componentTagger } from "lovable-tagger";
import type { IncomingMessage } from 'http';
import { ServerResponse } from 'http';
import type { ConfigEnv, UserConfig, ProxyOptions } from 'vite';
import { sitemapRoutes } from './src/sitemap-routes';
import { staticPageMetadata } from './src/seo/static-page-metadata';

const SITE_URL = 'https://jamesblond.co.nz';

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const upsertHeadTag = (html: string, selector: RegExp, replacement: string) =>
  selector.test(html) ? html.replace(selector, replacement) : html.replace('</head>', `    ${replacement}\n  </head>`);

const injectStaticSeo = (html: string, pathname: string) => {
  const metadata = staticPageMetadata.find(route => route.path === pathname);
  if (!metadata) return html;

  const title = escapeHtml(metadata.title);
  const description = escapeHtml(metadata.description);
  const canonical = `${SITE_URL}${metadata.path}`;
  const heading = escapeHtml(metadata.heading);
  const body = escapeHtml(metadata.body);

  let output = html;
  output = upsertHeadTag(output, /<title>.*?<\/title>/s, `<title>${title}</title>`);
  output = upsertHeadTag(output, /<meta name="description" content=".*?"\s*\/>/s, `<meta name="description" content="${description}" />`);
  output = upsertHeadTag(output, /<link rel="canonical" href=".*?"\s*\/>/s, `<link rel="canonical" href="${canonical}" />`);
  output = output.replace('<div id="root"></div>', `<div id="root"><main class="seo-prerender" aria-label="${heading}"><h1>${heading}</h1><p>${body}</p></main></div>`);
  return output;
};

function sitemapPlugin() {
  return {
    name: 'generate-sitemap',
    buildStart() {
      const today = new Date().toISOString().split('T')[0];
      const urls = sitemapRoutes.map(route => `  <url>
    <loc>${SITE_URL}${route.path}</loc>
    <lastmod>${today}</lastmod>
    <priority>${route.priority.toFixed(1)}</priority>
    <changefreq>${route.changefreq}</changefreq>
  </url>`).join('\n');
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>\n`;
      fs.writeFileSync(path.resolve(__dirname, 'public/sitemap.xml'), sitemap, 'utf-8');
      console.log(`✅ Sitemap generated with ${sitemapRoutes.length} URLs`);
    }
  };
}

function devStaticSeoPlugin() {
  return {
    name: 'dev-static-seo-html',
    transformIndexHtml: {
      order: 'pre' as const,
      handler(html: string, ctx: { path?: string }) {
        return injectStaticSeo(html, ctx.path || '/');
      },
    },
  };
}

export default defineConfig(({ mode }: ConfigEnv): UserConfig => ({
  server: {
    host: "::",
    port: 8080,
    proxy: mode === 'development' ? {
      '/api/rcm': {
        target: 'https://apis.rentalcarmanager.com',
        changeOrigin: true,
        secure: true, 
        rewrite: (path) => path.replace(/^\/api\/rcm/, ''),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        configure: (proxy, _options) => {
          proxy.on('error', (err: Error, req, res: ServerResponse) => {
            console.error('Proxy error:', err);
            
            // Send a more informative error response instead of default error page
            if (res && !res.writableEnded) {
              const errorDetails = {
                status: 'error',
                message: `Proxy Error: ${err.message}`,
                errorCode: (err as NodeJS.ErrnoException).code,
                target: 'https://apis.rentalcarmanager.com'
              };
              
              res.writeHead(502, {
                'Content-Type': 'application/json'
              });
              res.end(JSON.stringify(errorDetails));
            }
          });
          
          proxy.on('proxyReq', (proxyReq, req: IncomingMessage, _res) => {
            const url = new URL(proxyReq.path || '/', 'https://apis.rentalcarmanager.com');
            console.log(`Proxying ${req.method} request to: ${url.toString()}`);
            
            console.log('Request headers:', proxyReq.getHeaders());
            
            // Ensure Content-Type and Accept headers are properly set
            proxyReq.setHeader('Content-Type', 'application/json');
            proxyReq.setHeader('Accept', 'application/json');
            
            // Fix for body handling in proxied POST requests
            if (req.method === 'POST' && 'body' in req && (req as any).body) {
              try {
                const bodyData = JSON.stringify((req as any).body);
                // Set content length header
                proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
                // Write the body to the request
                proxyReq.write(bodyData);
                console.log('Request body:', bodyData.substring(0, 200) + (bodyData.length > 200 ? '...' : ''));
              } catch (error) {
                console.error('Error handling request body:', error);
              }
            }
          });
          
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            const statusCode = proxyRes.statusCode || 0;
            const statusText = proxyRes.statusMessage || '';
            const contentType = proxyRes.headers['content-type'] || '';
            
            console.log(`Response from RCM API: ${statusCode} ${statusText} for ${req.url}`);
            console.log(`Response headers: ${JSON.stringify(proxyRes.headers)}`);
            
            if (statusCode >= 400) {
              console.error(`API Error: ${statusCode} ${statusText} for ${req.url}`);
            }
            
            if (contentType.includes('text/html')) {
              console.error('WARNING: Received HTML instead of JSON response from API. This indicates a proxy misconfiguration or API endpoint issue.');
              console.error('Content-Type:', contentType);
              
              let responseBody = '';
              proxyRes.on('data', (chunk) => {
                responseBody += chunk;
              });
              
              proxyRes.on('end', () => {
                console.error('HTML response preview:', responseBody.substring(0, 500));
              });
            }
          });
        }
      }
    } : undefined
  },
  plugins: [
    react(),
    sitemapPlugin(),
    devStaticSeoPlugin(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom"],
  },
}));
