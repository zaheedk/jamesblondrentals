
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
          proxy.on('error', (err, _req, _res) => {
            console.error('Proxy error:', err);
          });
          
          proxy.on('proxyReq', (proxyReq, req: IncomingMessage & { body?: any }, _res) => {
            console.log(`Proxying request to RCM API: ${req.method} ${proxyReq.path}`);
            
            // Enhanced logging for request
            console.log('Request headers:', proxyReq.getHeaders());
            
            // Ensure body is properly handled for POST requests
            if (req.body) {
              const bodyData = JSON.stringify(req.body);
              proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
              proxyReq.write(bodyData);
            }
          });
          
          proxy.on('proxyRes', (proxyRes, req, _res: ServerResponse) => {
            console.log(`Response from RCM API: ${proxyRes.statusCode} for ${req.url}`);
            
            // Check if response is HTML instead of JSON
            const contentType = proxyRes.headers['content-type'] || '';
            if (contentType.includes('text/html')) {
              console.error('WARNING: Received HTML instead of JSON response from API. This indicates a proxy misconfiguration or API endpoint issue.');
            }
          });
        }
      }
    }
  },
  preview: {
    // Configure the production preview server to handle API proxy as well
    proxy: {
      '/api/rcm': {
        target: 'https://apis.rentalcarmanager.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/rcm/, '')
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
