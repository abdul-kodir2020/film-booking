import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'


// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
     base: env.VITE_API_BASE || '',
     plugins: [react(), tailwindcss()],
     resolve: {
       alias: {
         "@": path.resolve(__dirname, "./src"),
       },
     },
  }
})
