<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  templateId?: string
  backgroundUrl?: string
}

const props = withDefaults(defineProps<Props>(), {
  templateId: 'christmas',
  backgroundUrl: ''
})

const bgImage = computed(() => {
  if (props.backgroundUrl) return props.backgroundUrl
  return `/assets/templates/backgrounds/${props.templateId}-bg.jpg`
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
