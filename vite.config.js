import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { VitePWA } from 'vite-plugin-pwa' 

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    VitePWA({ // <-- Добавьте вызов плагина
      registerType: 'autoUpdate', // Автоматическое обновление service worker
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'], // Статические ассеты для кэширования
      manifest: {
        name: 'Metrium',
        short_name: 'MetriumBot',
        description: 'MetriumBot PWA Application',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
   
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },

  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/assets/styles/variables.scss";`
      }
    }
  }

})
