<script setup lang="ts">
import { computed } from 'vue'

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

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const handleBlur = () => {
  emit('blur')
}

const inputClasses = computed(() => {
  return [
    'w-full px-4 py-2 border rounded-lg shadow-sm transition-all duration-200',
    'focus:outline-none focus:ring-2',
    props.error
      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
    props.disabled
      ? 'bg-gray-100 cursor-not-allowed opacity-50'
      : 'bg-white'
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
