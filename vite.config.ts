import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['logo.png', 'apple-touch-icon.png', 'images/logo.png', 'images/i1.jpg', 'images/i2.jpg'],
      manifest: {
        id: 'the-act-of-prayers-app',
        name: 'The Act of Prayers & Deliverance Ministries',
        short_name: 'ActOfPrayers',
        description: 'A community where faith grows, lives change, and people discover their purpose in Christ.',
        theme_color: '#0C0C0D',
        background_color: '#0C0C0D',
        display: 'standalone',
        orientation: 'portrait',
        start_url: './index.html',
        scope: './',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'pwa-maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      devOptions: {
        enabled: true,
        type: 'module'
      }
    })
  ],
  base: './',
  server: {
    host: '0.0.0.0',
    port: 3000
  }
});
