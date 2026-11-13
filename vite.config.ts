import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/aliamir/' : '/',
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: true,
  },
  build: {
    sourcemap: false,
    target: 'es2020',
  },
}))
