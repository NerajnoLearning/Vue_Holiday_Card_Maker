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
  {
    id: 'newyear',
    name: 'New Year',
    background: '/assets/templates/backgrounds/newyear-bg.jpg',
    thumbnail: '/assets/templates/thumbnails/newyear-thumb.jpg',
    defaultMessage: 'Happy New Year! Wishing you joy and prosperity!',
    colors: { primary: '#ffd700', secondary: '#4169e1', text: '#ffffff' }
  },
  {
    id: 'valentine',
    name: 'Valentine',
    background: '/assets/templates/backgrounds/valentine-bg.jpg',
    thumbnail: '/assets/templates/thumbnails/valentine-thumb.jpg',
    defaultMessage: 'Happy Valentine\'s Day! You are loved!',
    colors: { primary: '#ff1493', secondary: '#ff69b4', text: '#ffffff' }
  },
  {
    id: 'birthday',
    name: 'Birthday',
    background: '/assets/templates/backgrounds/birthday-bg.jpg',
    thumbnail: '/assets/templates/thumbnails/birthday-thumb.jpg',
    defaultMessage: 'Happy Birthday! Wishing you a wonderful day!',
    colors: { primary: '#ff6347', secondary: '#ffa500', text: '#ffffff' }
  }
];
