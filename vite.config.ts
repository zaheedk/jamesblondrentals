
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import type { IncomingMessage } from 'http';
import { ServerResponse } from 'http';
import type { ConfigEnv, UserConfig, ProxyOptions } from 'vite';

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
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
