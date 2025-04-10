
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
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Proxy request:', req.method, req.url);
            console.log('Request headers:', proxyReq.getHeaders());
            
            // Log request body for debugging if available
            if (req.body) {
              console.log('Request body:', typeof req.body === 'object' ? JSON.stringify(req.body) : req.body);
            }
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Proxy response:', proxyRes.statusCode, req.url);
            console.log('Response headers:', proxyRes.headers);
            
            // Log content-type to help debug response format issues
            console.log('Response content-type:', proxyRes.headers['content-type']);
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
