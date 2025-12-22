import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    proxy: {
      // Proxy API requests to Catalyst during local development
      // This bypasses CORS issues when running on localhost
      '/api/Bridgex': {
        target: 'https://websitewireframeproject-895469053.development.catalystserverless.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/Bridgex/, '/server/Bridgex'),
        secure: true
      }
    }
  },
  build: {
    chunkSizeWarningLimit: 1000, // Increased from 500kb
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          charts: ['recharts'],
          utils: ['html5-qrcode']
        }
      }
    }
  }
})
