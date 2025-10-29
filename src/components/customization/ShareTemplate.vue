<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCustomization } from '@/composables/useCustomization'
import { useToast } from '@/composables/useToast'
import type { SavedTemplate } from '@/types/customization'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseModal from '@/components/common/BaseModal.vue'

interface Props {
  template: SavedTemplate
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()

const {
  updateCustomization,
  exportCustomization,
  importCustomization,
  getCustomizationByShareCode
} = useCustomization()

const { success: showSuccess, error: showError, warning: showWarning } = useToast()

const showImportModal = ref(false)
const importCode = ref('')
const importJson = ref('')
const isImporting = ref(false)

const shareUrl = computed(() => {
  if (!props.template.shareCode) return ''
  const baseUrl = window.location.origin
  return `${baseUrl}/?shareCode=${props.template.shareCode}`
})

const copyShareCode = async () => {
  if (!props.template.shareCode) return

  try {
    await navigator.clipboard.writeText(props.template.shareCode)
    showSuccess('Share code copied to clipboard!')
  } catch (err) {
    showError('Failed to copy share code')
  }
}

const copyShareUrl = async () => {
  if (!shareUrl.value) return

  try {
    await navigator.clipboard.writeText(shareUrl.value)
    showSuccess('Share URL copied to clipboard!')
  } catch (err) {
    showError('Failed to copy share URL')
  }
}

const downloadJson = () => {
  const json = exportCustomization(props.template.id)
  if (!json) {
    showError('Failed to export template')
    return
  }

  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${props.template.name.replace(/\s+/g, '-').toLowerCase()}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)

  showSuccess('Template exported successfully!')
}

const togglePublic = async () => {
  const success = await updateCustomization(props.template.id, {
    isPublic: !props.template.isPublic
  })

  if (success) {
    showSuccess(
      props.template.isPublic ? 'Template is now private' : 'Template is now public'
    )
  } else {
    showError('Failed to update template visibility')
  }
}

const openImportModal = () => {
  showImportModal.value = true
  importCode.value = ''
  importJson.value = ''
}

const handleImportByCode = async () => {
  if (!importCode.value.trim()) {
    showWarning('Please enter a share code')
    return
  }

  isImporting.value = true

  try {
    const template = getCustomizationByShareCode(importCode.value.trim())
    if (!template) {
      showError('Template not found with this share code')
      return
    }

    // Export and re-import to create a copy
    const json = exportCustomization(template.id)
    if (!json) {
      showError('Failed to load template')
      return
    }

    const imported = await importCustomization(json)
    if (imported) {
      showSuccess('Template imported successfully!')
      showImportModal.value = false
    } else {
      showError('Failed to import template')
    }
  } finally {
    isImporting.value = false
  }
}

const handleImportByJson = async () => {
  if (!importJson.value.trim()) {
    showWarning('Please paste template JSON')
    return
  }

  isImporting.value = true

  try {
    const imported = await importCustomization(importJson.value.trim())
    if (imported) {
      showSuccess('Template imported successfully!')
      showImportModal.value = false
    } else {
      showError('Failed to import template')
    }
  } finally {
    isImporting.value = false
  }
}

const handleFileImport = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  isImporting.value = true

  try {
    const text = await file.text()
    const imported = await importCustomization(text)
    if (imported) {
      showSuccess('Template imported from file!')
      showImportModal.value = false
    } else {
      showError('Failed to import template from file')
    }
  } catch (err) {
    showError('Invalid template file')
  } finally {
    isImporting.value = false
    input.value = ''
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Public/Private Toggle -->
    <div class="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
      <div>
        <p class="text-sm font-medium text-gray-900">Template Visibility</p>
        <p class="text-xs text-gray-500 mt-0.5">
          {{ template.isPublic ? 'Anyone with the code can import this template' : 'Only you can access this template' }}
        </p>
      </div>
      <button
        type="button"
        @click="togglePublic"
        class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
        :class="{
          'bg-blue-600': template.isPublic,
          'bg-gray-200': !template.isPublic
        }"
        role="switch"
        :aria-checked="template.isPublic"
      >
        <span
          class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
          :class="{
            'translate-x-6': template.isPublic,
            'translate-x-1': !template.isPublic
          }"
        />
      </button>
    </div>

    <!-- Share Code (only if public) -->
    <div v-if="template.isPublic && template.shareCode" class="space-y-3">
      <h4 class="text-sm font-medium text-gray-900">Share Code</h4>
      <div class="flex gap-2">
        <input
          type="text"
          :value="template.shareCode"
          readonly
          class="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
        />
        <BaseButton variant="secondary" size="sm" @click="copyShareCode">
          Copy
        </BaseButton>
      </div>
      <p class="text-xs text-gray-500">Others can use this code to import your template</p>
    </div>

    <!-- Share URL (only if public) -->
    <div v-if="template.isPublic && shareUrl" class="space-y-3">
      <h4 class="text-sm font-medium text-gray-900">Share Link</h4>
      <div class="flex gap-2">
        <input
          type="text"
          :value="shareUrl"
          readonly
          class="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm truncate"
        />
        <BaseButton variant="secondary" size="sm" @click="copyShareUrl">
          Copy
        </BaseButton>
      </div>
      <p class="text-xs text-gray-500">Share this link to let others access your template</p>
    </div>

    <!-- Export as JSON -->
    <div class="space-y-3">
      <h4 class="text-sm font-medium text-gray-900">Export Template</h4>
      <BaseButton variant="secondary" @click="downloadJson" class="w-full">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Download as JSON
      </BaseButton>
      <p class="text-xs text-gray-500">Export template configuration to a file</p>
    </div>

    <!-- Import Template -->
    <div class="space-y-3">
      <h4 class="text-sm font-medium text-gray-900">Import Template</h4>
      <BaseButton variant="secondary" @click="openImportModal" class="w-full">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        Import Template
      </BaseButton>
      <p class="text-xs text-gray-500">Import a template from code, file, or JSON</p>
    </div>

    <!-- Import Modal -->
    <BaseModal v-model="showImportModal" title="Import Template">
      <div class="space-y-6">
        <!-- Import by share code -->
        <div class="space-y-3">
          <h4 class="text-sm font-medium text-gray-900">Import by Share Code</h4>
          <BaseInput
            v-model="importCode"
            placeholder="Enter 8-character share code"
            :maxlength="8"
          />
          <BaseButton
            variant="primary"
            @click="handleImportByCode"
            :disabled="isImporting || !importCode.trim()"
            class="w-full"
          >
            Import by Code
          </BaseButton>
        </div>

        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300" />
          </div>
          <div class="relative flex justify-center text-xs">
            <span class="bg-white px-2 text-gray-500">OR</span>
          </div>
        </div>

        <!-- Import by JSON -->
        <div class="space-y-3">
          <h4 class="text-sm font-medium text-gray-900">Import by JSON</h4>
          <textarea
            v-model="importJson"
            placeholder="Paste template JSON here"
            rows="6"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs"
          />
          <BaseButton
            variant="primary"
            @click="handleImportByJson"
            :disabled="isImporting || !importJson.trim()"
            class="w-full"
          >
            Import by JSON
          </BaseButton>
        </div>

        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300" />
          </div>
          <div class="relative flex justify-center text-xs">
            <span class="bg-white px-2 text-gray-500">OR</span>
          </div>
        </div>

        <!-- Import from file -->
        <div class="space-y-3">
          <h4 class="text-sm font-medium text-gray-900">Import from File</h4>
          <label class="block">
            <input
              type="file"
              accept=".json,application/json"
              @change="handleFileImport"
              :disabled="isImporting"
              class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer disabled:opacity-50"
            />
          </label>
        </div>
      </div>
    </BaseModal>
  </div>
</template>
