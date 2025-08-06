export interface HolidayTemplate {
  id: string;
  name: string;
  background: string;
  thumbnail: string;
  defaultMessage: string;
  colors: {
    primary: string;
    secondary: string;
    text: string;
  };
}
