import { defineConfig } from 'vite'

export default defineConfig({
  css: {
    postcss: './config/postcss.config.js'
  },
  server: {
    port: 5173,
    open: true
  }
})
