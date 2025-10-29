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
    <!-- Background with transition -->
    <Transition name="card-fade" mode="out-in">
      <div
        :key="template"
        class="absolute inset-0 bg-cover bg-center transition-all duration-500"
        :style="{ backgroundImage: `url(/templates/${template}/background.jpg)` }"
      />
    </Transition>

    <!-- Card content -->
    <div class="card-content relative z-10 flex flex-col items-center justify-center h-full p-8 text-center">
      <Transition name="photo-fade" mode="out-in">
        <img
          v-if="photo"
          :key="photoUrl"
          :src="photoUrl"
          :alt="photoAlt"
          class="card-photo w-48 h-48 object-cover rounded-full border-4 border-white shadow-lg mb-6 transition-transform duration-300 hover:scale-105"
        />
      </Transition>

      <Transition name="text-fade" mode="out-in">
        <h1 :key="greeting" class="card-greeting text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-lg">
          {{ greeting }}
        </h1>
      </Transition>

      <Transition name="text-fade" mode="out-in">
        <p :key="name" class="card-name text-xl md:text-2xl text-white drop-shadow-md">
          {{ name }}
        </p>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.greeting-card {
  aspect-ratio: 3 / 4;
  max-width: 600px;
  margin: 0 auto;
}

/* Card fade transition */
.card-fade-enter-active,
.card-fade-leave-active {
  transition: opacity 0.5s ease;
}

.card-fade-enter-from {
  opacity: 0;
}

.card-fade-leave-to {
  opacity: 0;
}

/* Photo fade transition */
.photo-fade-enter-active,
.photo-fade-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.photo-fade-enter-from {
  opacity: 0;
  transform: scale(0.8);
}

.photo-fade-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

/* Text fade transition */
.text-fade-enter-active,
.text-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.text-fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.text-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>

