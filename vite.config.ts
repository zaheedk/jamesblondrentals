
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import type { IncomingMessage, ServerResponse } from 'http';

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
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
          proxy.on('error', (err, req, res) => {
            console.error('Proxy error:', err);
            
            // Send a more informative error response instead of default error page
            if (res instanceof ServerResponse && !res.writableEnded) {
              const errorDetails = {
                status: 'error',
                message: `Proxy Error: ${err.message}`,
                code: err.code,
                target: 'https://apis.rentalcarmanager.com'
              };
              
              res.writeHead(502, {
                'Content-Type': 'application/json'
              });
              res.end(JSON.stringify(errorDetails));
            }
          });
          
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            const url = new URL(proxyReq.path, 'https://apis.rentalcarmanager.com');
            console.log(`Proxying ${req.method} request to: ${url.toString()}`);
            
            // Enhanced logging for request
            console.log('Request headers:', proxyReq.getHeaders());
            
            // Ensure body is properly handled for POST requests
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
            
            console.log(`Response from RCM API: ${statusCode} ${statusText} for ${req.url}`);
            console.log(`Response headers: ${JSON.stringify(proxyRes.headers)}`);
            
            // Check for problematic responses
            if (statusCode >= 400) {
              console.error(`API Error: ${statusCode} ${statusText} for ${req.url}`);
            }
            
            // Check if response is HTML instead of JSON
            if (contentType.includes('text/html')) {
              console.error('WARNING: Received HTML instead of JSON response from API. This indicates a proxy misconfiguration or API endpoint issue.');
              console.error('Content-Type:', contentType);
              
              // Attempt to read and log HTML response for debugging
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
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
