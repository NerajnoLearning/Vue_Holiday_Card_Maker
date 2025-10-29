import { ref, onMounted, onUnmounted, readonly } from 'vue'

export const useOnline = () => {
  const isOnline = ref(navigator.onLine)
  const wasOffline = ref(false)

  const handleOnline = () => {
    if (!isOnline.value) {
      wasOffline.value = true
    }
    isOnline.value = true
  }

  const handleOffline = () => {
    isOnline.value = false
  }

  const resetOfflineFlag = () => {
    wasOffline.value = false
  }

  onMounted(() => {
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
  })

  onUnmounted(() => {
    window.removeEventListener('online', handleOnline)
    window.removeEventListener('offline', handleOffline)
  })

  return {
    isOnline: readonly(isOnline),
    wasOffline: readonly(wasOffline),
    resetOfflineFlag
  }
}
