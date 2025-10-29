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
    <TransitionGroup
      name="template-fade"
      tag="div"
      class="contents"
    >
      <TemplateCard
        v-for="template in templates"
        :key="template.id"
        :template="template"
        :selected="selectedTemplate === template.id"
        @click="handleSelect(template.id)"
      />
    </TransitionGroup>
  </div>
</template>

<style scoped>
.template-fade-enter-active,
.template-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.template-fade-enter-from {
  opacity: 0;
  transform: scale(0.9);
}

.template-fade-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
