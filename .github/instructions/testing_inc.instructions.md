---
applyTo: '**'
---
# Holiday Greeting Card Maker - Agent Build Instructions

## Project Overview
Build a **Holiday Greeting Card Maker** MVP - a Vue 3 + TypeScript + Tailwind CSS web application that allows users to create personalized greeting cards with photo upload, holiday templates, and PDF/JPG export functionality.

## Core Requirements

### **Essential Features to Implement:**
1. ✅ Custom greeting card creation (name, message, photo)
2. ✅ Photo upload with drag & drop functionality  
3. ✅ 4 holiday templates (Christmas, New Year, Valentine, Birthday)
4. ✅ Live preview modal
5. ✅ PDF and JPG export/download
6. ✅ Form validation and error handling
7. ✅ Responsive design for mobile/desktop

### **Technology Stack:**
- **Frontend**: Vue 3 with Composition API
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Testing**: Vitest + Cypress
- **Export Libraries**: jsPDF + html2canvas

---

## Folder Structure to Create

```
greeting-card-maker/
├── public/
│   ├── favicon.ico
│   ├── index.html
│   └── assets/
│       ├── templates/
│       │   ├── backgrounds/
│       │   │   ├── christmas-bg.jpg
│       │   │   ├── newyear-bg.jpg
│       │   │   ├── valentine-bg.jpg
│       │   │   └── birthday-bg.jpg
│       │   └── thumbnails/
│       │       ├── christmas-thumb.jpg
│       │       ├── newyear-thumb.jpg
│       │       ├── valentine-thumb.jpg
│       │       └── birthday-thumb.jpg
│       └── icons/
│           ├── download.svg
│           ├── upload.svg
│           ├── close.svg
│           ├── edit.svg
│           └── reset.svg
│
├── src/
│   ├── main.ts
│   ├── App.vue
│   ├── style.css
│   ├── components/
│   │   ├── common/
│   │   │   ├── BaseButton.vue
│   │   │   ├── BaseInput.vue
│   │   │   ├── BaseModal.vue
│   │   │   ├── LoadingSpinner.vue
│   │   │   └── ErrorMessage.vue
│   │   ├── greeting-card/
│   │   │   ├── GreetingCard.vue
│   │   │   ├── CardPreview.vue
│   │   │   └── CardForm.vue
│   │   ├── photo/
│   │   │   ├── PhotoUpload.vue
│   │   │   └── PhotoPreview.vue
│   │   ├── templates/
│   │   │   ├── HolidaySelector.vue
│   │   │   └── TemplateCard.vue
│   │   └── modal/
│   │       ├── PreviewModal.vue
│   │       └── ExportModal.vue
│   ├── composables/
│   │   ├── useGreetingCard.ts
│   │   ├── usePhotoUpload.ts
│   │   ├── useTemplates.ts
│   │   ├── useExport.ts
│   │   └── useModal.ts
│   ├── types/
│   │   ├── index.ts
│   │   ├── greeting-card.ts
│   │   ├── template.ts
│   │   └── export.ts
│   ├── utils/
│   │   ├── export/
│   │   │   ├── pdf-generator.ts
│   │   │   ├── jpg-generator.ts
│   │   │   └── canvas-utils.ts
│   │   ├── image/
│   │   │   ├── image-validator.ts
│   │   │   └── image-resizer.ts
│   │   ├── validation/
│   │   │   └── form-validators.ts
│   │   └── constants/
│   │       ├── templates.ts
│   │       └── file-types.ts
│   └── assets/
│       ├── styles/
│       │   ├── main.css
│       │   └── components.css
│       └── images/
│           ├── logo.svg
│           └── photo-placeholder.png
│
├── tests/ (create basic test files)
├── docs/ (create README.md, SETUP.md, USER_GUIDE.md)
├── config/ (vite.config.ts, tailwind.config.js, tsconfig.json)
├── package.json
└── other config files
```

---

## Step-by-Step Build Instructions

### **Phase 1: Project Setup (Week 1)**

#### Step 1: Initialize Project

# Install additional dependencies
npm install -D tailwindcss postcss autoprefixer
npm install jspdf html2canvas
npm install @types/jspdf

# Initialize Tailwind
npx tailwindcss init -p
```

#### Step 2: Configure Tailwind CSS
Update `tailwind.config.js`:
```js
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts}"],
  theme: { extend: {} },
  plugins: [],
}
```

#### Step 3: Create Folder Structure
Create all folders and placeholder files as shown in the structure above.

### **Phase 2: Core Components (Week 2)**

#### Step 4: Define TypeScript Interfaces
Create in `/src/types/`:

**greeting-card.ts:**
```typescript
export interface GreetingCardData {
  name: string;
  message: string;
  photo?: string | File;
  template: HolidayTemplate;
}
```

**template.ts:**
```typescript
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
```

#### Step 5: Build Core Components

**GreetingCard.vue** - Main card display component
- Accept props: name, message, photo, template
- Render card with background image
- Display user text and photo
- Responsive design with Tailwind

**CardForm.vue** - Input form component
- Name and message input fields
- Form validation
- Real-time preview updates

**PhotoUpload.vue** - File upload component
- Drag & drop functionality
- File validation (JPG, PNG, max 5MB)
- Preview uploaded image

**HolidaySelector.vue** - Template dropdown
- Display template thumbnails
- Switch between templates
- Update card preview

#### Step 6: Create Composables

**useGreetingCard.ts** - Card state management
```typescript
export const useGreetingCard = () => {
  const cardData = ref<GreetingCardData>({...});
  const updateCard = (data: Partial<GreetingCardData>) => {...};
  return { cardData, updateCard };
}
```

**usePhotoUpload.ts** - Photo handling logic
**useTemplates.ts** - Template management
**useExport.ts** - PDF/JPG export logic

### **Phase 3: Export Functionality (Week 3)**

#### Step 7: Implement Export Utils

**pdf-generator.ts:**
```typescript
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generatePDF = async (element: HTMLElement) => {
  const canvas = await html2canvas(element);
  const pdf = new jsPDF();
  // Implementation details...
}
```

**jpg-generator.ts:**
```typescript
export const generateJPG = async (element: HTMLElement) => {
  const canvas = await html2canvas(element);
  return canvas.toDataURL('image/jpeg', 0.9);
}
```

#### Step 8: Create Modal Components

**PreviewModal.vue** - Full-size card preview
**ExportModal.vue** - Download options (PDF/JPG)

### **Phase 4: Templates & Assets (Week 4)**

#### Step 9: Create Template Data
In `/src/utils/constants/templates.ts`:
```typescript
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
```

#### Step 10: Add Template Assets
- Create 4 holiday background images (1200x800px)
- Create corresponding thumbnail images (300x200px)
- Add essential SVG icons

### **Phase 5: Testing & Polish (Week 5-6)**

#### Step 11: Write Tests
Create basic tests for:
- Component rendering
- Photo upload functionality
- Export generation
- Form validation

#### Step 12: Add Error Handling
- File upload errors
- Export failures
- Form validation messages
- Loading states

#### Step 13: Responsive Design
- Mobile-first approach
- Touch-friendly interfaces
- Modal behavior on small screens

---

## Key Implementation Guidelines

### **Vue 3 Best Practices:**
- Use Composition API for all components
- Implement proper TypeScript interfaces
- Use `<script setup>` syntax
- Reactive refs for state management

### **Component Architecture:**
- Keep components small and focused
- Use props for data passing
- Emit events for parent communication
- Implement proper prop validation

### **Styling Guidelines:**
- Use Tailwind utility classes
- Mobile-first responsive design
- Consistent color scheme
- Accessible contrast ratios

### **File Upload Requirements:**
- Accept JPG, PNG, WebP formats
- Maximum file size: 5MB
- Client-side image validation
- Drag & drop functionality

### **Export Requirements:**
- High-quality PDF output (300 DPI)
- JPG export with 90% quality
- Proper filename with timestamp
- Loading indicators during export

---

## Validation Checklist

Before considering the MVP complete, verify:

### **Core Functionality:**
- [ ] User can input name and message
- [ ] Photo upload works with validation
- [ ] Template switching updates preview
- [ ] PDF export generates correctly
- [ ] JPG export works properly
- [ ] Preview modal displays correctly

### **User Experience:**
- [ ] Form validation provides clear feedback
- [ ] Loading states during export
- [ ] Error messages for failed operations
- [ ] Responsive on mobile and desktop
- [ ] Intuitive user interface

### **Code Quality:**
- [ ] TypeScript strict mode enabled
- [ ] No console errors in browser
- [ ] ESLint and Prettier configured
- [ ] Basic test coverage
- [ ] Clean, documented code

### **Performance:**
- [ ] Fast initial page load
- [ ] Smooth template switching
- [ ] Efficient image handling
- [ ] Quick export generation

---

## Deployment Instructions

### **Build for Production:**
```bash
npm run build
npm run preview  # Test production build locally
```

### **Environment Variables:**
Create `.env.example`:
```
VITE_APP_TITLE="Holiday Greeting Card Maker"
VITE_MAX_FILE_SIZE="5242880"
VITE_SUPPORTED_FORMATS="image/jpeg,image/png,image/webp"
```

### **Basic Deployment:**
- Build artifacts are in `dist/` folder
- Can be deployed to any static hosting (Netlify, Vercel, GitHub Pages)
- No server-side requirements

---

## Success Criteria

The MVP is complete when:
1. ✅ Users can create a greeting card with their name, message, and photo
2. ✅ Users can select from 4 holiday templates  
3. ✅ Users can preview their card in a modal
4. ✅ Users can download their card as PDF or JPG
5. ✅ Application works on mobile and desktop
6. ✅ Code is clean, typed, and well-structured
7. ✅ Basic error handling is implemented

**Estimated Timeline: 4-6 weeks**
**Target File Count: ~80 files**
**Core Features: 7 essential features only**

This MVP provides immediate value while maintaining a professional codebase that can scale for future enhancements.