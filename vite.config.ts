
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import type { IncomingMessage } from 'http';
import { ServerResponse } from 'http';

// Define production and development API URLs
const RCM_API_URL = {
  development: 'https://apis.rentalcarmanager.com',
  production: 'https://api.rentalcarmanager.com' // Production API endpoint
};

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      '/api/rcm': {
        target: mode === 'production' ? RCM_API_URL.production : RCM_API_URL.development,
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
            
            const errorDetails = {
              status: 'error',
              message: `Proxy Error: ${err.message}`,
              errorCode: (err as NodeJS.ErrnoException).code,
              target: mode === 'production' ? RCM_API_URL.production : RCM_API_URL.development,
              environment: mode
            };
            
            if (res && !res.writableEnded) {
              res.writeHead(502, {
                'Content-Type': 'application/json'
              });
              res.end(JSON.stringify(errorDetails));
            }
          });
          
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            const apiUrl = mode === 'production' ? RCM_API_URL.production : RCM_API_URL.development;
            const url = new URL(proxyReq.path, apiUrl);
            console.log(`[${mode.toUpperCase()}] Proxying ${req.method} request to: ${url.toString()}`);
            
            console.log('Request headers:', proxyReq.getHeaders());
            
            if ('body' in req && req.body) {
              const bodyData = JSON.stringify(req.body);
              proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
              proxyReq.write(bodyData);
              console.log('Request body:', bodyData.substring(0, 200) + (bodyData.length > 200 ? '...' : ''));
            }
          });
          
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            const statusCode = proxyRes.statusCode || 0;
            const statusText = proxyRes.statusMessage || '';
            const contentType = proxyRes.headers['content-type'] || '';
            
            console.log(`[${mode.toUpperCase()}] Response from RCM API: ${statusCode} ${statusText} for ${req.url}`);
            console.log(`Response headers: ${JSON.stringify(proxyRes.headers)}`);
            
            if (statusCode >= 400) {
              console.error(`API Error: ${statusCode} ${statusText} for ${req.url}`);
            }
            
            if (contentType.includes('text/html')) {
              console.error(`[${mode.toUpperCase()}] WARNING: Received HTML instead of JSON response from API`);
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
    }
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
