<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

interface Props {
  modelValue?: boolean
  maxWidth?: string
  closeOnEscape?: boolean
  closeOnClickOutside?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: true,
  maxWidth: '2xl',
  closeOnEscape: true,
  closeOnClickOutside: true
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
}>()

const modalContent = ref<HTMLElement | null>(null)

// Close modal
const close = () => {
  emit('update:modelValue', false)
  emit('close')
}

// Handle escape key
const handleEscape = (e: KeyboardEvent) => {
  if (props.closeOnEscape && e.key === 'Escape') {
    close()
  }
}

// Handle click outside
const handleClickOutside = (e: MouseEvent) => {
  if (props.closeOnClickOutside && modalContent.value && !modalContent.value.contains(e.target as Node)) {
    close()
  }
}

// Focus management
const previouslyFocusedElement = ref<HTMLElement | null>(null)

const trapFocus = (e: KeyboardEvent) => {
  if (!modalContent.value || e.key !== 'Tab') return

  const focusableElements = modalContent.value.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )
  const firstElement = focusableElements[0] as HTMLElement
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

  if (e.shiftKey && document.activeElement === firstElement) {
    e.preventDefault()
    lastElement?.focus()
  } else if (!e.shiftKey && document.activeElement === lastElement) {
    e.preventDefault()
    firstElement?.focus()
  }
}

// Lifecycle
onMounted(() => {
  // Store previously focused element
  previouslyFocusedElement.value = document.activeElement as HTMLElement

  // Add event listeners
  document.addEventListener('keydown', handleEscape)
  document.addEventListener('keydown', trapFocus)

  // Prevent body scroll
  document.body.style.overflow = 'hidden'

  // Focus first focusable element in modal
  setTimeout(() => {
    const firstFocusable = modalContent.value?.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as HTMLElement
    firstFocusable?.focus()
  }, 100)
})

onUnmounted(() => {
  // Remove event listeners
  document.removeEventListener('keydown', handleEscape)
  document.removeEventListener('keydown', trapFocus)

  // Restore body scroll
  document.body.style.overflow = ''

  // Restore focus to previously focused element
  previouslyFocusedElement.value?.focus()
})

// Max width classes
const maxWidthClass = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
  full: 'max-w-full'
}[props.maxWidth]
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="props.modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
        @click="handleClickOutside"
      >
        <!-- Overlay -->
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />

        <!-- Modal Content -->
        <div
          ref="modalContent"
          :class="[
            'relative bg-white rounded-lg shadow-2xl w-full transform transition-all',
            maxWidthClass
          ]"
          role="dialog"
          aria-modal="true"
          @click.stop
        >
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Modal fade animation */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-active .relative,
.modal-fade-leave-active .relative {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-from .relative {
  transform: scale(0.95) translateY(-20px);
  opacity: 0;
}

.modal-fade-leave-to .relative {
  transform: scale(0.95) translateY(20px);
  opacity: 0;
}
</style>
