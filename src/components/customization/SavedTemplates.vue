<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCustomization } from '@/composables/useCustomization'
import type { SavedTemplate } from '@/types/customization'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseModal from '@/components/common/BaseModal.vue'

interface Props {
  modelValue?: SavedTemplate | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: SavedTemplate | null]
  load: [template: SavedTemplate]
}>()

const {
  savedTemplates,
  publicTemplates,
  privateTemplates,
  isLoading,
  deleteCustomization
} = useCustomization()

const showDeleteConfirm = ref(false)
const templateToDelete = ref<SavedTemplate | null>(null)
const filter = ref<'all' | 'public' | 'private'>('all')

const filteredTemplates = computed(() => {
  switch (filter.value) {
    case 'public':
      return publicTemplates.value
    case 'private':
      return privateTemplates.value
    default:
      return savedTemplates.value
  }
})

const handleLoad = (template: SavedTemplate) => {
  emit('update:modelValue', template)
  emit('load', template)
}

const confirmDelete = (template: SavedTemplate) => {
  templateToDelete.value = template
  showDeleteConfirm.value = true
}

const handleDelete = async () => {
  if (!templateToDelete.value) return

  const success = await deleteCustomization(templateToDelete.value.id)
  if (success) {
    showDeleteConfirm.value = false
    templateToDelete.value = null
  }
}

const cancelDelete = () => {
  showDeleteConfirm.value = false
  templateToDelete.value = null
}

const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>

<template>
  <div class="space-y-4">
    <!-- Header with filters -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <h3 class="text-lg font-semibold text-gray-900">Saved Templates</h3>

      <div class="flex gap-2">
        <button
          type="button"
          @click="filter = 'all'"
          class="px-3 py-1.5 text-sm font-medium rounded-lg transition-colors"
          :class="{
            'bg-blue-600 text-white': filter === 'all',
            'bg-gray-100 text-gray-700 hover:bg-gray-200': filter !== 'all'
          }"
        >
          All ({{ savedTemplates.length }})
        </button>
        <button
          type="button"
          @click="filter = 'public'"
          class="px-3 py-1.5 text-sm font-medium rounded-lg transition-colors"
          :class="{
            'bg-blue-600 text-white': filter === 'public',
            'bg-gray-100 text-gray-700 hover:bg-gray-200': filter !== 'public'
          }"
        >
          Public ({{ publicTemplates.length }})
        </button>
        <button
          type="button"
          @click="filter = 'private'"
          class="px-3 py-1.5 text-sm font-medium rounded-lg transition-colors"
          :class="{
            'bg-blue-600 text-white': filter === 'private',
            'bg-gray-100 text-gray-700 hover:bg-gray-200': filter !== 'private'
          }"
        >
          Private ({{ privateTemplates.length }})
        </button>
      </div>
    </div>

    <!-- Templates list -->
    <div v-if="filteredTemplates.length > 0" class="space-y-3">
      <div
        v-for="template in filteredTemplates"
        :key="template.id"
        class="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
      >
        <!-- Preview thumbnail -->
        <div
          v-if="template.preview"
          class="flex-shrink-0 w-16 h-20 rounded border border-gray-200 overflow-hidden bg-gray-50"
        >
          <img :src="template.preview" :alt="`Preview of ${template.name}`" class="w-full h-full object-cover" />
        </div>
        <div
          v-else
          class="flex-shrink-0 w-16 h-20 rounded border border-gray-200 bg-gray-100 flex items-center justify-center"
        >
          <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>

        <!-- Template info -->
        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between gap-2">
            <div class="flex-1 min-w-0">
              <h4 class="text-sm font-medium text-gray-900 truncate">{{ template.name }}</h4>
              <p class="text-xs text-gray-500 mt-0.5">
                Updated {{ formatDate(template.updatedAt) }}
              </p>
            </div>
            <span
              v-if="template.isPublic"
              class="flex-shrink-0 px-2 py-0.5 text-xs font-medium text-blue-700 bg-blue-100 rounded"
            >
              Public
            </span>
          </div>

          <!-- Share code -->
          <p v-if="template.shareCode" class="text-xs text-gray-600 mt-2 font-mono">
            Code: {{ template.shareCode }}
          </p>

          <!-- Actions -->
          <div class="flex gap-2 mt-3">
            <BaseButton
              size="sm"
              variant="primary"
              @click="handleLoad(template)"
              :disabled="isLoading"
            >
              Load
            </BaseButton>
            <BaseButton
              size="sm"
              variant="secondary"
              @click="confirmDelete(template)"
              :disabled="isLoading"
            >
              Delete
            </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div
      v-else
      class="flex flex-col items-center justify-center py-12 text-center"
    >
      <svg class="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <p class="text-sm text-gray-600">No saved templates yet</p>
      <p class="text-xs text-gray-500 mt-1">Create and save your first custom template</p>
    </div>

    <!-- Delete confirmation modal -->
    <BaseModal v-model="showDeleteConfirm" title="Delete Template">
      <div class="space-y-4">
        <p class="text-sm text-gray-700">
          Are you sure you want to delete "{{ templateToDelete?.name }}"? This action cannot be undone.
        </p>

        <div class="flex gap-3 justify-end">
          <BaseButton variant="secondary" @click="cancelDelete" :disabled="isLoading">
            Cancel
          </BaseButton>
          <BaseButton variant="primary" @click="handleDelete" :disabled="isLoading">
            Delete
          </BaseButton>
        </div>
      </div>
    </BaseModal>
  </div>
</template>
