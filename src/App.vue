<script setup lang="ts">
import { ref, computed } from 'vue'
import GreetingCard from '@/components/card/GreetingCard.vue'
import HolidaySelector from '@/components/templates/HolidaySelector.vue'
import PhotoUpload from '@/components/photo/PhotoUpload.vue'
import CardForm from '@/components/greeting-card/CardForm.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import ExportModal from '@/components/modal/ExportModal.vue'
import PreviewModal from '@/components/modal/PreviewModal.vue'
import { useGreetingCard } from '@/composables/useGreetingCard'
import { useModal } from '@/composables/useModal'
import type { HolidayTemplate } from '@/types/template'

// State management
const selectedTemplate = ref<string>('christmas')
const cardName = ref<string>('')
const cardGreeting = ref<string>('')
const uploadedPhoto = ref<File | null>(null)

// Modals
const { isOpen: isPreviewOpen, open: openPreview, close: closePreview } = useModal()
const { isOpen: isExportOpen, open: openExport, close: closeExport } = useModal()

// Handlers
const handleTemplateSelect = (templateId: string) => {
  selectedTemplate.value = templateId
}

const handlePhotoUpload = (photo: File | null) => {
  uploadedPhoto.value = photo
}

const handleNameChange = (name: string) => {
  cardName.value = name
}

const handleGreetingChange = (greeting: string) => {
  cardGreeting.value = greeting
}

const canPreview = computed(() => {
  return selectedTemplate.value && cardGreeting.value.trim().length > 0
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
    <!-- Skip to main content link -->
    <a href="#main-content" class="skip-link">
      Skip to main content
    </a>

    <!-- Header -->
    <header class="bg-white shadow-sm" role="banner">
      <div class="container mx-auto px-4 py-6">
        <h1 class="text-3xl md:text-4xl font-bold text-center text-gray-800">
          Holiday Greeting Card Maker
        </h1>
        <p class="text-center text-gray-600 mt-2">
          Create beautiful personalized greeting cards in minutes
        </p>
      </div>
    </header>

    <!-- Main Content -->
    <main id="main-content" class="container mx-auto px-4 py-8" role="main" aria-label="Greeting card creation interface">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Left Panel: Card Configuration -->
        <div class="space-y-6">
          <!-- Template Selection -->
          <section class="bg-white rounded-lg shadow-md p-6" aria-labelledby="template-heading">
            <h2 id="template-heading" class="text-xl font-semibold text-gray-800 mb-4">
              Step 1: Choose Template
            </h2>
            <HolidaySelector
              :selected-template="selectedTemplate"
              @select="handleTemplateSelect"
            />
          </section>

          <!-- Photo Upload -->
          <section class="bg-white rounded-lg shadow-md p-6" aria-labelledby="photo-heading">
            <h2 id="photo-heading" class="text-xl font-semibold text-gray-800 mb-4">
              Step 2: Upload Photo <span class="text-sm font-normal text-gray-500">(Optional)</span>
            </h2>
            <PhotoUpload
              @upload="handlePhotoUpload"
            />
          </section>

          <!-- Card Form -->
          <section class="bg-white rounded-lg shadow-md p-6" aria-labelledby="message-heading">
            <h2 id="message-heading" class="text-xl font-semibold text-gray-800 mb-4">
              Step 3: Add Your Message
            </h2>
            <CardForm
              :name="cardName"
              :greeting="cardGreeting"
              @update:name="handleNameChange"
              @update:greeting="handleGreetingChange"
            />
          </section>

          <!-- Action Buttons -->
          <div class="flex gap-4" role="group" aria-label="Card actions">
            <BaseButton
              :disabled="!canPreview"
              @click="openPreview"
              class="flex-1"
              aria-label="Preview your greeting card"
            >
              Preview Card
            </BaseButton>
            <BaseButton
              :disabled="!canPreview"
              @click="openExport"
              variant="secondary"
              class="flex-1"
              aria-label="Export greeting card as PDF or JPG"
            >
              Export Card
            </BaseButton>
          </div>
        </div>

        <!-- Right Panel: Live Preview -->
        <div class="bg-white rounded-lg shadow-md p-6" aria-labelledby="preview-heading" role="region">
          <h2 id="preview-heading" class="text-xl font-semibold text-gray-800 mb-4">
            Live Preview
          </h2>
          <div class="flex items-center justify-center min-h-[500px]" aria-live="polite" aria-atomic="true">
            <GreetingCard
              :template="selectedTemplate"
              :name="cardName"
              :greeting="cardGreeting"
              :photo="uploadedPhoto"
            />
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-white mt-12 border-t" role="contentinfo">
      <div class="container mx-auto px-4 py-6 text-center text-gray-600">
        <p>&copy; 2024 Holiday Greeting Card Maker. Built with Vue 3 + TypeScript.</p>
      </div>
    </footer>

    <!-- Modals -->
    <PreviewModal
      v-if="isPreviewOpen"
      title="Card Preview"
      description="Full-size preview of your greeting card"
      :template="selectedTemplate"
      :name="cardName"
      :greeting="cardGreeting"
      :photo="uploadedPhoto"
      @close="closePreview"
    />

    <ExportModal
      v-if="isExportOpen"
      title="Export Card"
      description="Download your greeting card as PDF or JPG"
      :template="selectedTemplate"
      :name="cardName"
      :greeting="cardGreeting"
      :photo="uploadedPhoto"
      @close="closeExport"
    />
  </div>
</template>

<style scoped>
/* Additional custom styles if needed */
</style>
