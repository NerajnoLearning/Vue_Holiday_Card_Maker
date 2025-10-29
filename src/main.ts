import './style.css'

import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)
app.mount('#app')

// Register service worker for caching
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then(registration => {
        // Use console.info to ensure this message is not stripped in production by Terser
        console.info('SW registered:', registration.scope)
      })
      .catch(error => {
        console.error('SW registration failed:', error)
      })
  })
}
