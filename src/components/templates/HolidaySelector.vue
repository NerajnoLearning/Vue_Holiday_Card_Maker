<script setup lang="ts">
import { computed } from 'vue'
import TemplateCard from './TemplateCard.vue'
import { HOLIDAY_TEMPLATES } from '@/utils/constants/templates'

interface Props {
  selectedTemplate?: string
}

const props = withDefaults(defineProps<Props>(), {
  selectedTemplate: 'christmas'
})

const emit = defineEmits<{
  select: [templateId: string]
}>()

const templates = computed(() => HOLIDAY_TEMPLATES)

const handleSelect = (templateId: string) => {
  emit('select', templateId)
}
</script>

<template>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
    <TemplateCard
      v-for="template in templates"
      :key="template.id"
      :template="template"
      :selected="selectedTemplate === template.id"
      @click="handleSelect(template.id)"
    />
  </div>
</template>
