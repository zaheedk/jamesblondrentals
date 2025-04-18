
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import type { IncomingMessage, ServerResponse } from 'http';
// Fix the import for Server by using import type and using a namespace import
import type * as httpProxy from 'http-proxy';

// Common proxy configuration for development and production preview
const createRcmProxy = () => ({
  target: 'https://apis.rentalcarmanager.com',
  changeOrigin: true,
  secure: true, 
  rewrite: (path: string) => path.replace(/^\/api\/rcm/, ''),
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  configure: (proxy: httpProxy.Server, _options: object) => {
    proxy.on('error', (err: Error, _req: IncomingMessage, _res: ServerResponse) => {
      console.error('Proxy error:', err);
    });
    
    proxy.on('proxyReq', (proxyReq: any, req: IncomingMessage & { body?: any }, _res: ServerResponse) => {
      console.log(`Proxying request to RCM API: ${req.method} ${proxyReq.path}`);
      
      // Enhanced logging for request
      console.log('Request headers:', JSON.stringify(proxyReq.getHeaders()));
      
      // Ensure body is properly handled for POST requests
      if (req.body) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
    });
    
    proxy.on('proxyRes', (proxyRes: IncomingMessage, req: IncomingMessage, _res: ServerResponse) => {
      console.log(`Response from RCM API: ${proxyRes.statusCode} for ${req.url}`);
      
      // Check if response is HTML instead of JSON
      const contentType = proxyRes.headers['content-type'] || '';
      if (contentType.includes('text/html')) {
        console.error('WARNING: Received HTML instead of JSON response from API. This indicates a proxy misconfiguration or API endpoint issue.');
      }
    });
  }
});

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      '/api/rcm': createRcmProxy()
    }
  },
  preview: {
    // Configure the production preview server to handle API proxy as well
    proxy: {
      '/api/rcm': createRcmProxy()
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
  build: {
    sourcemap: true,
    rollupOptions: {
      // Ensure consistent output for deployments
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@/components/ui'],
        }
      }
    }
  }
}));
