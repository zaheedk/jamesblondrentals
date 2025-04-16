
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import type { IncomingMessage } from 'http';

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
            console.error('Proxy error:', err);
          });
          
          proxy.on('proxyReq', (proxyReq, req: IncomingMessage & { body?: any }, _res) => {
            console.log(`Proxying request: ${req.method} ${proxyReq.path}`);
            
            // Ensure body is properly handled for POST requests
            if (req.body) {
              const bodyData = JSON.stringify(req.body);
              proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
              proxyReq.write(bodyData);
            }
          });
          
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            const contentType = proxyRes.headers['content-type'];
            console.log(`Response Content-Type: ${contentType}`);
            
            const status = proxyRes.statusCode;
            console.log(`Response Status: ${status ?? 'unknown'} for ${req.url}`);
            
            // Log full response body for debugging
            let responseBody = '';
            proxyRes.on('data', (chunk) => {
              responseBody += chunk;
            });
            
            proxyRes.on('end', () => {
              console.log('Full Response Body:', responseBody);
            });
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
  // Add production specific settings
  build: {
    sourcemap: true, // Enable sourcemaps for debugging
    // Add public path to ensure the app works when hosted on the Lovable portal
    base: './',
  }
}));
