import { ref, computed } from 'vue';
import type { HolidayTemplate } from '@/types/template';
import { HOLIDAY_TEMPLATES } from '@/utils/constants/templates';

export const useGreetingCard = () => {
  // Card state - templateId is the string ID, template is the full object
  const templateId = ref<string>('christmas');
  const name = ref<string>('');
  const greeting = ref<string>('');
  const photo = ref<File | null>(null);

  // Computed template object from ID
  const template = computed<HolidayTemplate | undefined>(() => {
    return HOLIDAY_TEMPLATES.find(t => t.id === templateId.value);
  });

  // Validation
  const isValid = computed(() => {
    return template.value && greeting.value.trim().length > 0;
  });

  // Actions
  const setTemplate = (id: string) => {
    templateId.value = id;
  };

  const setName = (value: string) => {
    name.value = value;
  };

  const setGreeting = (value: string) => {
    greeting.value = value;
  };

  const setPhoto = (file: File | null) => {
    photo.value = file;
  };

  const reset = () => {
    templateId.value = 'christmas';
    name.value = '';
    greeting.value = '';
    photo.value = null;
  };

  return {
    // State
    templateId,
    template,
    name,
    greeting,
    photo,

    // Computed
    isValid,

    // Actions
    setTemplate,
    setName,
    setGreeting,
    setPhoto,
    reset
  };
};
