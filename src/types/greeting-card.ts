import type { HolidayTemplate } from './template';

export interface GreetingCardData {
  name: string;
  message: string;
  photo?: string | File;
  template: HolidayTemplate;
}
