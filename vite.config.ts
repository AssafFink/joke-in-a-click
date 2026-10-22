import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // New versions take over in the background without reloading an open page (ADR-7).
      registerType: 'autoUpdate',
      injectRegister: 'script',
      manifest: {
        name: 'בדיחה בלחיצה',
        short_name: 'בדיחה בלחיצה',
        lang: 'he',
        dir: 'rtl',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        theme_color: '#F7AEB8',
        background_color: '#FFF4ED',
        icons: [
          { src: 'pwa-64x64.png', sizes: '64x64', type: 'image/png' },
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // App shell only: woff2 fonts (Chrome never needs the woff fallbacks), no runtime caching.
        globPatterns: ['**/*.{html,js,css,svg,png,ico,woff2}'],
        globIgnores: ['app-icon-placeholder.svg'],
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api\//],
        cleanupOutdatedCaches: true,
      },
    }),
  ],
});
