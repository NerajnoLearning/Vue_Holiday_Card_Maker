<script setup lang="ts">
import { computed } from 'vue'
import BaseModal from '@/components/common/BaseModal.vue'
import GreetingCard from '@/components/card/GreetingCard.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import { useTemplates } from '@/composables/useTemplates'

interface Props {
  template: string
  name: string
  greeting: string
  photo?: File | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  download: []
}>()

const { getTemplateById } = useTemplates()

const templateData = computed(() => getTemplateById(props.template))

const handleClose = () => {
  emit('close')
}

const handleDownload = () => {
  emit('download')
  // Keep modal open so user can see the card while downloading
}
</script>

<template>
  <BaseModal :model-value="true" max-width="4xl" @close="handleClose">
    <!-- Modal Header -->
    <div class="flex items-center justify-between p-6 border-b border-gray-200">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Card Preview</h2>
        <p class="text-sm text-gray-500 mt-1">
          {{ templateData?.name }} Template
        </p>
      </div>
      <button
        type="button"
        @click="handleClose"
        class="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-2"
        aria-label="Close modal"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Modal Body -->
    <div class="p-6 bg-gray-50">
      <div class="max-w-2xl mx-auto">
        <div class="bg-white rounded-lg shadow-lg p-4">
          <GreetingCard
            :template="props.template"
            :name="props.name"
            :greeting="props.greeting"
            :photo="props.photo"
          />
        </div>

        <!-- Card Details -->
        <div class="mt-4 p-4 bg-white rounded-lg border border-gray-200">
          <h3 class="text-sm font-semibold text-gray-700 mb-2">Card Details</h3>
          <dl class="space-y-2 text-sm">
            <div class="flex justify-between">
              <dt class="text-gray-600">Template:</dt>
              <dd class="font-medium text-gray-900">{{ templateData?.name }}</dd>
            </div>
            <div v-if="props.name" class="flex justify-between">
              <dt class="text-gray-600">To:</dt>
              <dd class="font-medium text-gray-900">{{ props.name }}</dd>
            </div>
            <div v-if="props.greeting" class="flex justify-between">
              <dt class="text-gray-600">Message:</dt>
              <dd class="font-medium text-gray-900 text-right max-w-xs truncate">{{ props.greeting }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-gray-600">Photo:</dt>
              <dd class="font-medium text-gray-900">{{ props.photo ? 'Included' : 'None' }}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>

    <!-- Modal Footer -->
    <div class="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-white">
      <BaseButton
        variant="outline"
        @click="handleClose"
      >
        Close
      </BaseButton>
      <BaseButton
        variant="primary"
        @click="handleDownload"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Download Card
      </BaseButton>
    </div>
  </BaseModal>
</template>
