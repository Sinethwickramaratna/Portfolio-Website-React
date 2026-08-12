import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      output: {
        // Split the 3D stack out of the app chunk. It is large, it
        // changes far less often than the site content, and it is
        // loaded on demand — so it deserves its own long-lived cache
        // entry rather than being invalidated by every copy edit.
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          if (/[\\/]node_modules[\\/]three[\\/]/.test(id)) return 'three'
          if (/@react-three|[\\/]node_modules[\\/](its-fine|zustand|suspend-react|maath|meshline)[\\/]/.test(id)) {
            return 'r3f'
          }
          if (/[\\/]node_modules[\\/](react|react-dom|scheduler|react-router)/.test(id)) {
            return 'react'
          }
          return undefined
        },
      },
    },
    chunkSizeWarningLimit: 900,
  },
})
