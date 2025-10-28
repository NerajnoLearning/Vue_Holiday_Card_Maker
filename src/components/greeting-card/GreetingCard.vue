<template>
  <div 
    class="relative w-full max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl"
    :style="{ backgroundImage: `url(${backgroundImage})` }"
    :class="{ 'p-6': !backgroundImage }"
  >
    <!-- Background overlay if image is present -->
    <div 
      v-if="backgroundImage"
      class="absolute inset-0 bg-black/30 backdrop-blur-sm"
    ></div>
    
    <!-- Card content -->
    <div class="relative z-10 p-6 text-center">
      <h2 class="text-2xl font-bold mb-2" :class="titleClass">{{ title }}</h2>
      <p class="mb-4" :class="messageClass">{{ message }}</p>
      <slot></slot>
    </div>
    
    <!-- Footer with signature -->
    <div v-if="signature" class="relative z-10 px-6 pb-4 text-right">
      <p class="text-sm italic" :class="signatureClass">{{ signature }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface GreetingCardProps {
  /**
   * The title of the greeting card
   */
  title: string;
  
  /**
   * The main message content
   */
  message: string;
  
  /**
   * Optional signature at the bottom of the card
   */
  signature?: string;
  
  /**
   * Optional background image URL
   */
  backgroundImage?: string;
  
  /**
   * Custom CSS class for the title
   */
  titleClass?: string;
  
  /**
   * Custom CSS class for the message
   */
  messageClass?: string;
  
  /**
   * Custom CSS class for the signature
   */
  signatureClass?: string;
}

const props = withDefaults(defineProps<GreetingCardProps>(), {
  title: 'Greetings!',
  message: 'Wishing you a wonderful day!',
  signature: '',
  backgroundImage: '',
  titleClass: 'text-gray-800',
  messageClass: 'text-gray-600',
  signatureClass: 'text-gray-500'
});
</script>
