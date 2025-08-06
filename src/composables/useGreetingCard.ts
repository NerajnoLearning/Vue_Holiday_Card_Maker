import { ref } from 'vue';
import type { GreetingCardData } from '@/types/greeting-card';

export const useGreetingCard = () => {
  const cardData = ref<GreetingCardData | null>(null);
  const updateCard = (data: Partial<GreetingCardData>) => {
    // update logic
  };
  return { cardData, updateCard };
};
