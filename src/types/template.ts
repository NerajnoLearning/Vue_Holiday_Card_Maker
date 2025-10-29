export interface HolidayTemplate {
  id: string;
  name: string;
  background: string;
  thumbnail: string;
  defaultGreeting: string;
  colors: {
    primary: string;
    secondary: string;
    text: string;
  };
}
