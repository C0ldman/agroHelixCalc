import {
  fileURLToPath,
  URL
} from 'node:url'

import {
  defineConfig
} from 'vite'
import vue
  from '@vitejs/plugin-vue'
import vueDevTools
  from 'vite-plugin-vue-devtools'
import Vuetify
  from 'vite-plugin-vuetify'
console.log('process.env.NODE_ENV: ', process.env.NODE_ENV);
console.log(process.env.NODE_ENV === "production" ? "/agroHelixCalc/" : "/");
// https://vite.dev/config/
export default defineConfig({
  plugins: [vue({publicPath: process.env.NODE_ENV === "production" ? "/agroHelixCalc/" : "/"}), vueDevTools(), Vuetify()],
  base: process.env.NODE_ENV === "production" ? "/agroHelixCalc/" : "/",
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 3000,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vuetify: ['vuetify'],
        },
      },
    },
    emptyOutDir: true,
  },
})
