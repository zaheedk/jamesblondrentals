
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      // Proxy API requests to RCM API with improved logging and error handling
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
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Proxy request:', req.method, req.url);
            
            // Log request body for debugging, only if available
            // Using 'as any' to bypass TypeScript error since body is added by middleware
            const reqWithBody = req as any;
            if (reqWithBody.body) {
              console.log('Request body:', reqWithBody.body);
            }
            
            // Log request headers for debugging
            console.log('Request headers:', req.headers);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Proxy response:', proxyRes.statusCode, req.url);
            
            // Log response headers for debugging
            console.log('Response headers:', proxyRes.headers);
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
