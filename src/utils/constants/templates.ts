import type { HolidayTemplate } from '@/types/template';

export const HOLIDAY_TEMPLATES: HolidayTemplate[] = [
  {
    id: 'christmas',
    name: 'Christmas',
    background: '/assets/templates/backgrounds/christmas-bg.jpg',
    thumbnail: '/assets/templates/thumbnails/christmas-thumb.jpg',
    defaultMessage: 'Merry Christmas and Happy New Year!',
    colors: { primary: '#c41e3a', secondary: '#2e8b57', text: '#ffffff' }
  },
  // Add New Year, Valentine, Birthday templates
];
