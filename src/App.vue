<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import { useGreetingCard } from '@/composables/useGreetingCard'
import { useModal } from '@/composables/useModal'
import { useDarkMode } from '@/composables/useDarkMode'

// Eagerly loaded components (above the fold)
import HolidaySelector from '@/components/templates/HolidaySelector.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import DarkModeToggle from '@/components/common/DarkModeToggle.vue'

// Initialize dark mode (called for side effect only)
useDarkMode()

// Lazy loaded components (below the fold or conditional)
const GreetingCard = defineAsyncComponent(() => import('@/components/card/GreetingCard.vue'))
const PhotoUpload = defineAsyncComponent(() => import('@/components/photo/PhotoUpload.vue'))
const CardForm = defineAsyncComponent(() => import('@/components/greeting-card/CardForm.vue'))
const ExportModal = defineAsyncComponent(() => import('@/components/modal/ExportModal.vue'))
const PreviewModal = defineAsyncComponent(() => import('@/components/modal/PreviewModal.vue'))

// Card state management from composable
const {
  templateId,
  name,
  greeting,
  photo,
  isValid,
  setTemplate,
  setName,
  setGreeting,
  setPhoto
} = useGreetingCard()

// Modals
const { isOpen: isPreviewOpen, open: openPreview, close: closePreview } = useModal()
const { isOpen: isExportOpen, open: openExport, close: closeExport } = useModal()
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-dark-bg dark:to-slate-900 transition-colors duration-300">
    <!-- Skip to main content link -->
    <a href="#main-content" class="skip-link">
      Skip to main content
    </a>

    <!-- Header -->
    <header class="bg-white dark:bg-dark-surface shadow-sm transition-colors duration-300" role="banner">
      <div class="container mx-auto px-4 py-6 relative">
        <!-- Dark Mode Toggle - Top Right -->
        <div class="absolute top-4 right-4">
          <DarkModeToggle />
        </div>

        <h1 class="text-3xl md:text-4xl font-bold text-center text-gray-800 dark:text-dark-text-primary transition-colors duration-300">
          Holiday Greeting Card Maker
        </h1>
        <p class="text-center text-gray-600 dark:text-dark-text-secondary mt-2 transition-colors duration-300">
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
          <section class="bg-white dark:bg-dark-surface rounded-lg shadow-md p-6 transition-colors duration-300" aria-labelledby="template-heading">
            <h2 id="template-heading" class="text-xl font-semibold text-gray-800 dark:text-dark-text-primary mb-4 transition-colors duration-300">
              Step 1: Choose Template
            </h2>
            <HolidaySelector
              :selected-template="templateId"
              @select="setTemplate"
            />
          </section>

          <!-- Photo Upload -->
          <section class="bg-white dark:bg-dark-surface rounded-lg shadow-md p-6 transition-colors duration-300" aria-labelledby="photo-heading">
            <h2 id="photo-heading" class="text-xl font-semibold text-gray-800 dark:text-dark-text-primary mb-4 transition-colors duration-300">
              Step 2: Upload Photo <span class="text-sm font-normal text-gray-500 dark:text-dark-text-muted">(Optional)</span>
            </h2>
            <PhotoUpload
              @upload="setPhoto"
            />
          </section>

          <!-- Card Form -->
          <section class="bg-white dark:bg-dark-surface rounded-lg shadow-md p-6 transition-colors duration-300" aria-labelledby="message-heading">
            <h2 id="message-heading" class="text-xl font-semibold text-gray-800 dark:text-dark-text-primary mb-4 transition-colors duration-300">
              Step 3: Add Your Message
            </h2>
            <CardForm
              :name="name"
              :greeting="greeting"
              @update:name="setName"
              @update:greeting="setGreeting"
            />
          </section>

          <!-- Action Buttons -->
          <div class="flex gap-4" role="group" aria-label="Card actions">
            <BaseButton
              :disabled="!isValid"
              @click="openPreview"
              class="flex-1"
              aria-label="Preview your greeting card"
            >
              Preview Card
            </BaseButton>
            <BaseButton
              :disabled="!isValid"
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
        <div class="bg-white dark:bg-dark-surface rounded-lg shadow-md p-6 transition-colors duration-300" aria-labelledby="preview-heading" role="region">
          <h2 id="preview-heading" class="text-xl font-semibold text-gray-800 dark:text-dark-text-primary mb-4 transition-colors duration-300">
            Live Preview
          </h2>
          <div class="flex items-center justify-center min-h-[500px]" aria-live="polite" aria-atomic="true">
            <GreetingCard
              :template="templateId"
              :name="name"
              :greeting="greeting"
              :photo="photo"
            />
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-white dark:bg-dark-surface mt-12 border-t border-gray-200 dark:border-dark-border transition-colors duration-300" role="contentinfo">
      <div class="container mx-auto px-4 py-6 text-center text-gray-600 dark:text-dark-text-secondary transition-colors duration-300">
        <p>&copy; 2025 Holiday Greeting Card Maker. Built with Vue 3 + TypeScript.</p>
      </div>
    </footer>

    <!-- Modals -->
    <PreviewModal
      v-if="isPreviewOpen"
      title="Card Preview"
      description="Full-size preview of your greeting card"
      :template="templateId"
      :name="name"
      :greeting="greeting"
      :photo="photo"
      @close="closePreview"
    />

    <ExportModal
      v-if="isExportOpen"
      title="Export Card"
      description="Download your greeting card as PDF or JPG"
      :template="templateId"
      :name="name"
      :greeting="greeting"
      :photo="photo"
      @close="closeExport"
    />
  </div>
</template>

<style scoped>
/* Additional custom styles if needed */
</style>
