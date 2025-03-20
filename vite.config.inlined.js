import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from "node:url";
import { viteSingleFile } from "vite-plugin-singlefile"
import VueDevTools from "vite-plugin-vue-devtools";
import Vuetify from 'vite-plugin-vuetify'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    viteSingleFile(),
    VueDevTools(),
    Vuetify(),
  ],
  base: './',
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  build: {
    outDir: './docs',
    emptyOutDir: true,
  },
  server: {
    open: true,
  },
})
