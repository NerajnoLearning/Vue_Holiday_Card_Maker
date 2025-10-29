import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@types': resolve(__dirname, 'src/types'),
      '@assets': resolve(__dirname, 'src/assets'),
    },
  },
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    // Chunk size warnings
    chunkSizeWarningLimit: 500,
    // Optimize dependencies
    rollupOptions: {
      output: {
        // Manual chunk splitting
        manualChunks: {
          // Vue core
          'vue-vendor': ['vue'],

          // PDF/Image export libraries (heavy dependencies)
          'export-libs': ['jspdf', 'html2canvas'],

          // DOMPurify
          'sanitize': ['dompurify'],

          // Components - group by feature
          'components-common': [
            './src/components/common/BaseButton.vue',
            './src/components/common/BaseInput.vue',
            './src/components/common/BaseModal.vue',
            './src/components/common/LoadingSpinner.vue',
            './src/components/common/ErrorMessage.vue',
          ],

          'components-card': [
            './src/components/card/GreetingCard.vue',
            './src/components/greeting-card/CardForm.vue',
            './src/components/greeting-card/CardPreview.vue',
          ],

          'components-modal': [
            './src/components/modal/ExportModal.vue',
            './src/components/modal/PreviewModal.vue',
          ],

          // Customization components (loaded on demand)
          'components-customization': [
            './src/components/customization/ColorPicker.vue',
            './src/components/customization/FontSelector.vue',
            './src/components/customization/LayoutControls.vue',
            './src/components/customization/SavedTemplates.vue',
            './src/components/customization/ShareTemplate.vue',
          ],
        },

        // Asset file naming
        assetFileNames: (assetInfo) => {
          const fileName = assetInfo.names?.[0] || assetInfo.originalFileNames?.[0] || ''
          const info = fileName.split('.')
          let extType = info[info.length - 1]

          if (/\.(png|jpe?g|gif|svg|webp|avif)$/i.test(fileName)) {
            extType = 'images'
          } else if (/\.(woff2?|eot|ttf|otf)$/i.test(fileName)) {
            extType = 'fonts'
          }

          return `assets/${extType}/[name]-[hash][extname]`
        },

        // Chunk file naming
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },

    // Minification options
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
      },
    },

    // CSS code splitting
    cssCodeSplit: true,
  },

  // Optimize dependencies
  optimizeDeps: {
    include: ['vue', 'dompurify'],
    exclude: ['jspdf', 'html2canvas'], // Load on demand
  },
})
