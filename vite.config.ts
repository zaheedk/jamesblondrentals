
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
          proxy.on('error', (err: Error, req: IncomingMessage & { body?: any }, res: ServerResponse) => {
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
          
          proxy.on('proxyReq', (proxyReq, req: IncomingMessage & { body?: any }, _res) => {
            const url = new URL(proxyReq.path || '/', 'https://apis.rentalcarmanager.com');
            console.log(`Proxying ${req.method} request to: ${url.toString()}`);
            
            // Ensure Content-Type and Accept headers are properly set
            proxyReq.setHeader('Content-Type', 'application/json');
            proxyReq.setHeader('Accept', 'application/json');
            
            // Fix for body handling in proxied POST requests
            if (req.method === 'POST' && req.body) {
              try {
                const bodyData = JSON.stringify(req.body);
                proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
                proxyReq.write(bodyData);
              } catch (error) {
                console.error('Error handling request body:', error);
              }
            }
          });
        }
      }
    } : undefined
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
