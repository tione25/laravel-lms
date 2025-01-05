import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Listen on all network interfaces
    port: 5173,      // Make sure it's the correct port
    watch: {
      usePolling: true,  // Necessary for Docker to handle file changes
    },
  },
})
