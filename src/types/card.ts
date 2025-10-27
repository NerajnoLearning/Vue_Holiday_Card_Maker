export interface GreetingCardProps {
  name?: string
  greeting?: string
  photo?: string | File | null
  template?: HolidayTemplate
}

export interface CardExportOptions {
  format: 'pdf' | 'jpg'
  quality: number
  filename?: string
}

export interface CardState {
  name: string
  greeting: string
  photo: File | null
  selectedTemplate: HolidayTemplate | null
  isPreviewOpen: boolean
  isExporting: boolean
}

export type HolidayTemplate = 'christmas' | 'birthday' | 'thankyou' | 'newyear' | 'easter'