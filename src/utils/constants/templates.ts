import type { HolidayTemplate } from '@/types/template';

export const HOLIDAY_TEMPLATES: HolidayTemplate[] = [
  {
    id: 'christmas',
    name: 'Christmas',
    background: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=1200&h=1600&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=300&h=400&fit=crop',
    defaultGreeting: 'Merry Christmas and Happy New Year!',
    colors: { primary: '#c41e3a', secondary: '#2e8b57', text: '#ffffff' }
  },
  {
    id: 'newyear',
    name: 'New Year',
    background: 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=1200&h=1600&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=300&h=400&fit=crop',
    defaultGreeting: 'Happy New Year! Wishing you joy and prosperity!',
    colors: { primary: '#ffd700', secondary: '#4169e1', text: '#ffffff' }
  },
  {
    id: 'valentine',
    name: 'Valentine',
    background: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=1200&h=1600&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=300&h=400&fit=crop',
    defaultGreeting: 'Happy Valentine\'s Day! You are loved!',
    colors: { primary: '#ff1493', secondary: '#ff69b4', text: '#ffffff' }
  },
  {
    id: 'birthday',
    name: 'Birthday',
    background: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1200&h=1600&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=300&h=400&fit=crop',
    defaultGreeting: 'Happy Birthday! Wishing you a wonderful day!',
    colors: { primary: '#ff6347', secondary: '#ffa500', text: '#ffffff' }
  }
];
