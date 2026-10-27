import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    modules: {
      // CSS Modules 类名：component__local-hash，便于调试
      generateScopedName: '[name]__[local]__[hash:base64:5]',
    },
  },
})
