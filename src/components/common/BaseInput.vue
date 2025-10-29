<script setup lang="ts">
import { computed } from 'vue'
import { useReducedMotion } from '@/composables/useReducedMotion'

interface Props {
  modelValue?: string | number
  type?: string
  placeholder?: string
  disabled?: boolean
  error?: boolean
  maxlength?: number
  id?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  type: 'text',
  placeholder: '',
  disabled: false,
  error: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  blur: []
}>()

const { prefersReducedMotion } = useReducedMotion()

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const handleBlur = () => {
  emit('blur')
}

const inputClasses = computed(() => {
  const animations = prefersReducedMotion.value
    ? 'transition-none'
    : 'transition-all duration-200 ease-in-out hover:border-gray-400'

  return [
    'w-full px-3 py-2 sm:px-4 sm:py-2.5 border rounded-lg shadow-sm',
    'text-sm sm:text-base',
    'focus:outline-none focus:ring-2 focus:shadow-md',
    'touch-manipulation',
    'transition-all duration-200 ease-in-out hover:border-gray-400',
    'dark:text-dark-text-primary dark:placeholder-dark-text-muted',
    props.error
      ? 'border-red-300 focus:border-red-500 focus:ring-red-500 hover:border-red-400 dark:border-red-400 dark:focus:border-red-400 dark:focus:ring-red-400'
      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-dark-border dark:focus:border-blue-400 dark:focus:ring-blue-400',
    props.disabled
      ? 'bg-gray-100 cursor-not-allowed opacity-50 dark:bg-gray-800'
      : 'bg-white dark:bg-dark-surface'
  ].join(' ')
})
</script>

<template>
  <input
    :id="props.id"
    :type="props.type"
    :value="props.modelValue"
    :placeholder="props.placeholder"
    :disabled="props.disabled"
    :maxlength="props.maxlength"
    :class="inputClasses"
    @input="handleInput"
    @blur="handleBlur"
  />
</template>
