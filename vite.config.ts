
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
        target: 'https://apis.rentalcarmanager.com/booking/v3.2',
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
            
            if (res && !res.writableEnded) {
              const errorDetails = {
                status: 'error',
                message: `Proxy Error: ${err.message}`,
                errorCode: (err as NodeJS.ErrnoException).code,
                target: 'https://apis.rentalcarmanager.com/booking/v3.2'
              };
              
              res.writeHead(502, {
                'Content-Type': 'application/json'
              });
              res.end(JSON.stringify(errorDetails));
            }
          });
          
          proxy.on('proxyReq', (proxyReq, req: IncomingMessage, _res) => {
            console.log(`Proxying request to: ${proxyReq.path}`);
            
            proxyReq.setHeader('Content-Type', 'application/json');
            proxyReq.setHeader('Accept', 'application/json');
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
