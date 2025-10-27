<script setup lang="ts">
import { computed } from 'vue'
import type { GreetingCardProps } from '@/types/card'

interface Props {
  name?: string
  greeting?: string
  photo?: string | File | null
  template?: string
}

const props = withDefaults(defineProps<Props>(), {
  name: '',
  greeting: '',
  photo: null,
  template: 'christmas'
})

// Computed properties
const cardClasses = computed(() => ({
  [`template-${props.template}`]: props.template
}))

const photoUrl = computed(() => {
  if (!props.photo) return ''
  if (typeof props.photo === 'string') return props.photo
  return URL.createObjectURL(props.photo)
})

const photoAlt = computed(() => `Photo for ${props.name || 'greeting card'}`)
</script>

<template>
  <div class="greeting-card relative w-full h-full overflow-hidden rounded-lg shadow-xl" :class="cardClasses">
    <!-- Background -->
    <div
      class="absolute inset-0 bg-cover bg-center"
      :style="{ backgroundImage: `url(/templates/${template}/background.jpg)` }"
    />

    <!-- Card content -->
    <div class="card-content relative z-10 flex flex-col items-center justify-center h-full p-8 text-center">
      <img
        v-if="photo"
        :src="photoUrl"
        :alt="photoAlt"
        class="card-photo w-48 h-48 object-cover rounded-full border-4 border-white shadow-lg mb-6"
      />
      <h1 class="card-greeting text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-lg">
        {{ greeting }}
      </h1>
      <p class="card-name text-xl md:text-2xl text-white drop-shadow-md">
        {{ name }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.greeting-card {
  aspect-ratio: 3 / 4;
  max-width: 600px;
  margin: 0 auto;
}
</style>

