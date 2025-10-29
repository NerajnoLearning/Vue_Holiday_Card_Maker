<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import BaseInput from '@/components/common/BaseInput.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'

interface Props {
  name?: string
  greeting?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  name: '',
  greeting: '',
  disabled: false
})

const emit = defineEmits<{
  'update:name': [value: string]
  'update:greeting': [value: string]
  reset: []
}>()

// Local state
const localName = ref(props.name)
const localGreeting = ref(props.greeting)

// Input sanitization
const sanitizeInput = (value: string): string => {
  // Remove leading/trailing whitespace
  let sanitized = value.trim()

  // Remove excessive whitespace (multiple spaces to single space)
  sanitized = sanitized.replace(/\s+/g, ' ')

  // Remove potentially dangerous characters (basic XSS prevention)
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
  sanitized = sanitized.replace(/<[^>]*>/g, '')

  return sanitized
}

// Validation rules
const MAX_NAME_LENGTH = 50
const MAX_GREETING_LENGTH = 500
const MIN_NAME_LENGTH = 2
const MIN_GREETING_LENGTH = 10

// Character counts
const nameCharsRemaining = computed(() => MAX_NAME_LENGTH - localName.value.length)
const greetingCharsRemaining = computed(() => MAX_GREETING_LENGTH - localGreeting.value.length)

// Validation states
const nameError = computed(() => {
  if (!localName.value.trim()) {
    return 'Name is required'
  }
  if (localName.value.trim().length < MIN_NAME_LENGTH) {
    return `Name must be at least ${MIN_NAME_LENGTH} characters`
  }
  if (localName.value.length > MAX_NAME_LENGTH) {
    return `Name must be ${MAX_NAME_LENGTH} characters or less`
  }
  return null
})

const greetingError = computed(() => {
  if (!localGreeting.value.trim()) {
    return 'Greeting message is required'
  }
  if (localGreeting.value.trim().length < MIN_GREETING_LENGTH) {
    return `Greeting must be at least ${MIN_GREETING_LENGTH} characters`
  }
  if (localGreeting.value.length > MAX_GREETING_LENGTH) {
    return `Greeting must be ${MAX_GREETING_LENGTH} characters or less`
  }
  return null
})

const isNameValid = computed(() => nameError.value === null)
const isGreetingValid = computed(() => greetingError.value === null)
const isFormValid = computed(() => isNameValid.value && isGreetingValid.value)

// Watch for prop changes
watch(() => props.name, (newValue) => {
  localName.value = newValue
})

watch(() => props.greeting, (newValue) => {
  localGreeting.value = newValue
})

// Emit updates with sanitization on blur
const handleNameInput = (value: string) => {
  localName.value = value
  emit('update:name', value)
}

const handleGreetingInput = (value: string) => {
  localGreeting.value = value
  emit('update:greeting', value)
}

// Sanitize inputs on blur
const handleNameBlur = () => {
  const sanitized = sanitizeInput(localName.value)
  if (sanitized !== localName.value) {
    localName.value = sanitized
    emit('update:name', sanitized)
  }
}

const handleGreetingBlur = () => {
  const sanitized = sanitizeInput(localGreeting.value)
  if (sanitized !== localGreeting.value) {
    localGreeting.value = sanitized
    emit('update:greeting', sanitized)
  }
}

// Clear form
const clearForm = () => {
  localName.value = ''
  localGreeting.value = ''
  emit('update:name', '')
  emit('update:greeting', '')
}

// Reset to initial values
const resetForm = () => {
  localName.value = props.name
  localGreeting.value = props.greeting
  emit('update:name', props.name)
  emit('update:greeting', props.greeting)
  emit('reset')
}

// Check if form is dirty (has changes)
const isDirty = computed(() => {
  return localName.value !== props.name || localGreeting.value !== props.greeting
})

// Expose validation state and methods for parent components
defineExpose({
  isValid: isFormValid,
  isNameValid,
  isGreetingValid,
  nameError,
  greetingError,
  clearForm,
  resetForm,
  isDirty
})
</script>

<template>
  <form class="space-y-6" @submit.prevent>
    <!-- Name Input Section -->
    <div class="space-y-2">
      <label for="recipient-name" class="block text-sm font-medium text-gray-700">
        Recipient Name
        <span class="text-red-500">*</span>
      </label>
      <BaseInput
        id="recipient-name"
        :model-value="localName"
        type="text"
        placeholder="Enter recipient's name"
        :disabled="props.disabled"
        :error="!isNameValid"
        :maxlength="MAX_NAME_LENGTH"
        @update:model-value="handleNameInput"
        @blur="handleNameBlur"
      />
      <div class="flex items-center justify-between text-xs">
        <ErrorMessage v-if="nameError && localName.length > 0" :message="nameError" />
        <div
          class="ml-auto"
          :class="{
            'text-gray-500': nameCharsRemaining > 10,
            'text-orange-600': nameCharsRemaining <= 10 && nameCharsRemaining > 0,
            'text-red-600': nameCharsRemaining <= 0
          }"
        >
          {{ nameCharsRemaining }} characters remaining
        </div>
      </div>
    </div>

    <!-- Greeting Message Input Section -->
    <div class="space-y-2">
      <label for="greeting-message" class="block text-sm font-medium text-gray-700">
        Greeting Message
        <span class="text-red-500">*</span>
      </label>
      <textarea
        id="greeting-message"
        v-model="localGreeting"
        :disabled="props.disabled"
        :maxlength="MAX_GREETING_LENGTH"
        rows="6"
        placeholder="Write your heartfelt greeting message here..."
        class="w-full px-4 py-3 border rounded-lg shadow-sm transition-all duration-200 resize-none focus:outline-none focus:ring-2"
        :class="{
          'border-gray-300 focus:border-blue-500 focus:ring-blue-500': !greetingError || localGreeting.length === 0,
          'border-red-300 focus:border-red-500 focus:ring-red-500': greetingError && localGreeting.length > 0,
          'opacity-50 cursor-not-allowed': props.disabled,
          'bg-white': !props.disabled,
          'bg-gray-100': props.disabled
        }"
        @input="handleGreetingInput(($event.target as HTMLTextAreaElement).value)"
        @blur="handleGreetingBlur"
      />
      <div class="flex items-start justify-between text-xs gap-2">
        <ErrorMessage v-if="greetingError && localGreeting.length > 0" :message="greetingError" />
        <div
          class="ml-auto flex-shrink-0"
          :class="{
            'text-gray-500': greetingCharsRemaining > 50,
            'text-orange-600': greetingCharsRemaining <= 50 && greetingCharsRemaining > 0,
            'text-red-600': greetingCharsRemaining <= 0
          }"
        >
          {{ greetingCharsRemaining }} / {{ MAX_GREETING_LENGTH }}
        </div>
      </div>
    </div>

    <!-- Helper Text -->
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
      <div class="flex items-start gap-2">
        <svg class="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
        </svg>
        <div>
          <p class="font-medium mb-1">Tips for a great greeting card:</p>
          <ul class="list-disc list-inside space-y-1 text-blue-700">
            <li>Keep it personal and heartfelt</li>
            <li>Include specific memories or inside jokes</li>
            <li>Express genuine emotions and well wishes</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Form Actions -->
    <div v-if="isDirty" class="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
      <button
        type="button"
        @click="resetForm"
        :disabled="props.disabled"
        class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <svg class="w-4 h-4 inline-block mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
        </svg>
        Reset
      </button>
      <button
        type="button"
        @click="clearForm"
        :disabled="props.disabled"
        class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <svg class="w-4 h-4 inline-block mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        Clear All
      </button>
    </div>

    <!-- Form Validation Status (hidden, for accessibility) -->
    <div class="sr-only" role="status" aria-live="polite">
      <span v-if="isFormValid">Form is valid and ready to submit</span>
      <span v-else>Please correct the errors in the form</span>
    </div>
  </form>
</template>
