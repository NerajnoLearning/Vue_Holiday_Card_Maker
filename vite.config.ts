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
        manualChunks: (id) => {
          // Vue core
          if (id.includes('node_modules/vue')) {
            return 'vue-vendor';
          }
          // PDF/Image export libraries (heavy dependencies)
          if (id.includes('node_modules/jspdf') || id.includes('node_modules/html2canvas')) {
            return 'export-libs';
          }
          // DOMPurify
          if (id.includes('node_modules/dompurify')) {
            return 'sanitize';
          }
          // Components - group by feature
          if (id.includes('/src/components/common/')) {
            return 'components-common';
          }
          if (id.includes('/src/components/card/') || id.includes('/src/components/greeting-card/')) {
            return 'components-card';
          }
          if (id.includes('/src/components/modal/')) {
            return 'components-modal';
          }
          if (id.includes('/src/components/customization/')) {
            return 'components-customization';
          }
          // Default: let Vite handle other chunks
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
