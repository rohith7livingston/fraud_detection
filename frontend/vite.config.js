import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Add this proxy to avoid CORS issues during development
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Your Node.js server
        changeOrigin: true,
      },
    },
  },
})