<script setup lang="ts">
import { computed } from 'vue'
import GreetingCard from '@/components/card/GreetingCard.vue'
import type { HolidayTemplate } from '@/types/template'

interface Props {
  template: HolidayTemplate
  name: string
  greeting: string
  photo?: File | null
  showControls?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showControls: true,
  photo: null
})

const emit = defineEmits<{
  preview: []
  export: []
}>()

// Generate photo URL from File if provided
const photoUrl = computed(() => {
  if (props.photo instanceof File) {
    return URL.createObjectURL(props.photo)
  }
  return props.photo || null
})

// Check if card has enough content to preview
const hasContent = computed(() => {
  return props.name.trim().length > 0 || props.greeting.trim().length > 0
})

const handlePreview = () => {
  emit('preview')
}

const handleExport = () => {
  emit('export')
}
</script>

<template>
  <div class="space-y-4">
    <!-- Preview Header -->
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-lg font-semibold text-gray-900">Card Preview</h3>
        <p class="text-sm text-gray-500">See how your card looks in real-time</p>
      </div>
      <div v-if="props.showControls && hasContent" class="flex gap-2">
        <button
          type="button"
          @click="handlePreview"
          class="px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <svg class="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Full Preview
        </button>
        <button
          type="button"
          @click="handleExport"
          class="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <svg class="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export
        </button>
      </div>
    </div>

    <!-- Card Preview Container -->
    <div class="relative">
      <!-- Preview Card -->
      <div class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 sm:p-8 shadow-inner">
        <div class="max-w-md mx-auto">
          <div class="bg-white rounded-lg shadow-2xl overflow-hidden transform transition-transform hover:scale-[1.02]">
            <GreetingCard
              :template="props.template.id"
              :name="props.name"
              :greeting="props.greeting"
              :photo="photoUrl"
            />
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-if="!hasContent"
        class="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-xl"
      >
        <div class="text-center px-4">
          <svg class="w-16 h-16 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
          <h4 class="text-lg font-medium text-gray-900 mb-1">Start Creating Your Card</h4>
          <p class="text-sm text-gray-500">
            Fill in the name and greeting to see your card preview
          </p>
        </div>
      </div>
    </div>

    <!-- Preview Info -->
    <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
        <div>
          <span class="text-gray-500 block">Template</span>
          <span class="font-medium text-gray-900">{{ props.template.name }}</span>
        </div>
        <div>
          <span class="text-gray-500 block">Recipient</span>
          <span class="font-medium text-gray-900">
            {{ props.name || 'Not set' }}
          </span>
        </div>
        <div>
          <span class="text-gray-500 block">Message</span>
          <span class="font-medium text-gray-900">
            {{ props.greeting ? `${props.greeting.length} chars` : 'Not set' }}
          </span>
        </div>
        <div>
          <span class="text-gray-500 block">Photo</span>
          <span class="font-medium text-gray-900">
            {{ props.photo ? 'Added' : 'Optional' }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
