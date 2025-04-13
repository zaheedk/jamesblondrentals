
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import type { IncomingMessage, ServerResponse } from 'http';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      // Proxy API requests to RCM API with improved configuration
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
            console.log('Proxy error:', err);
          });
          
          proxy.on('proxyReq', (proxyReq, req: IncomingMessage & { body?: any }, _res) => {
            // Add debugging information
            console.log(`Proxying request to: ${req.method} ${proxyReq.path}`);
            
            // Fix for POST requests - ensure body is properly forwarded
            if (req.body) {
              const bodyData = JSON.stringify(req.body);
              // Update header to match content length
              proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
              // Write body to request
              proxyReq.write(bodyData);
            }
          });
          
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            const status = proxyRes.statusCode;
            console.log(`Received response: ${status ?? 'unknown'} for ${req.url}`);
            
            // Enhanced logging for non-200 responses
            if (status && status >= 400) {
              console.error(`Error response from API: ${status} for ${req.url}`);
              let responseBody = '';
              
              proxyRes.on('data', (chunk) => {
                responseBody += chunk;
              });
              
              proxyRes.on('end', () => {
                try {
                  const parsedBody = JSON.parse(responseBody);
                  console.error('Error response body:', parsedBody);
                } catch (e) {
                  console.error('Error response (non-JSON):', responseBody);
                }
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
