import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'

export default defineConfig({
  plugins: [vue(), vuetify({ autoImport: true })],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: { host: true, port: 8080 },
  preview: { host: true, port: 8080 },
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.js'],
    server: { deps: { inline: ['vuetify'] } },
  },
})
