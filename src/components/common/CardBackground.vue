<script setup lang="ts">
import { computed } from 'vue'
import { HOLIDAY_TEMPLATES } from '@/utils/constants/templates'

interface Props {
  templateId?: string
  backgroundUrl?: string
}

const props = withDefaults(defineProps<Props>(), {
  templateId: 'christmas',
  backgroundUrl: ''
})

const bgImage = computed(() => {
  // If explicit background URL is provided, use it
  if (props.backgroundUrl) return props.backgroundUrl

  // Otherwise, look up the template background from HOLIDAY_TEMPLATES
  const template = HOLIDAY_TEMPLATES.find(t => t.id === props.templateId)
  return template?.background || HOLIDAY_TEMPLATES[0].background
})
</script>

<template>
  <div
    class="absolute inset-0 bg-cover bg-center bg-no-repeat"
    :style="{ backgroundImage: `url(${bgImage})` }"
  />
</template>

<style scoped>
/* Additional styling if needed */
</style>
