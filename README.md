# greeting-card-maker

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Complete Project Structure

g```
greeting-card-maker/
├── public/                          # Static assets served directly
│   ├── favicon.ico
│   ├── index.html
│   └── assets/
│       ├── templates/
│       │   ├── backgrounds/         # Full-size template images (1200x1600px)
│       │   │   ├── christmas-bg.jpg
│       │   │   ├── newyear-bg.jpg
│       │   │   ├── valentine-bg.jpg
│       │   │   └── birthday-bg.jpg
│       │   └── thumbnails/          # Thumbnail versions (300x400px)
│       │       ├── christmas-thumb.jpg
│       │       ├── newyear-thumb.jpg
│       │       ├── valentine-thumb.jpg
│       │       └── birthday-thumb.jpg
│       └── icons/                   # UI icons (SVG, 24x24px)
│           ├── download.svg
│           ├── upload.svg
│           ├── close.svg
│           ├── edit.svg
│           └── reset.svg
│
├── src/
│   ├── main.ts                      # Application entry point
│   ├── App.vue                      # Root component
│   ├── style.css                    # Global styles
│   │
│   ├── components/                  # Vue components (domain-organized)
│   │   ├── common/                  # Reusable UI primitives (5 files)
│   │   │   ├── BaseButton.vue
│   │   │   ├── BaseInput.vue
│   │   │   ├── BaseModal.vue
│   │   │   ├── LoadingSpinner.vue
│   │   │   └── ErrorMessage.vue
│   │   │
│   │   ├── greeting-card/           # Core card components (3 files)
│   │   │   ├── GreetingCard.vue     # Main card container
│   │   │   ├── CardPreview.vue      # Live preview display
│   │   │   └── CardForm.vue         # Text input form
│   │   │
│   │   ├── photo/                   # Image handling (2 files)
│   │   │   ├── PhotoUpload.vue      # Upload interface
│   │   │   └── PhotoPreview.vue     # Image display
│   │   │
│   │   ├── templates/               # Template selection (2 files)
│   │   │   ├── HolidaySelector.vue  # Template picker
│   │   │   └── TemplateCard.vue     # Individual template card
│   │   │
│   │   └── modal/                   # Overlay interfaces (2 files)
│   │       ├── PreviewModal.vue     # Full-size preview
│   │       └── ExportModal.vue      # Download options
│   │
│   ├── composables/                 # Reactive logic & state (5 files)
│   │   ├── useGreetingCard.ts       # Card data & configuration
│   │   ├── usePhotoUpload.ts        # Image handling & validation
│   │   ├── useTemplates.ts          # Template selection & management
│   │   ├── useExport.ts             # PDF/JPG generation
│   │   └── useModal.ts              # Modal state management
│   │
│   ├── types/                       # TypeScript definitions (4 files)
│   │   ├── index.ts                 # Central type exports
│   │   ├── greeting-card.ts         # Card & Photo interfaces
│   │   ├── template.ts              # Template & Holiday types
│   │   └── export.ts                # Export options & formats
│   │
│   ├── utils/                       # Pure functions (8 files)
│   │   ├── export/                  # Export utilities (3 files)
│   │   │   ├── pdf-generator.ts     # jsPDF wrapper
│   │   │   ├── jpg-generator.ts     # Canvas to image
│   │   │   └── canvas-utils.ts      # Shared canvas operations
│   │   ├── image/                   # Image utilities (2 files)
│   │   │   ├── image-validator.ts   # File validation
│   │   │   └── image-resizer.ts     # Image optimization
│   │   ├── validation/              # Validation utilities (1 file)
│   │   │   └── form-validators.ts   # Input validation rules
│   │   └── constants/               # App constants (2 files)
│   │       ├── templates.ts         # Template configuration
│   │       └── file-types.ts        # Supported formats
│   │
│   └── assets/                      # App-level assets (5 files)
│       ├── styles/
│       │   ├── main.css             # Tailwind imports & custom styles
│       │   └── components.css       # Component-specific styles
│       └── images/
│           ├── logo.svg
│           └── photo-placeholder.png
│
├── tests/                           # Testing suite (15 files)
│   ├── unit/                        # Unit tests
│   │   ├── components/
│   │   │   ├── GreetingCard.spec.ts
│   │   │   ├── PhotoUpload.spec.ts
│   │   │   └── HolidaySelector.spec.ts
│   │   ├── composables/
│   │   │   ├── useGreetingCard.spec.ts
│   │   │   └── useExport.spec.ts
│   │   └── utils/
│   │       ├── pdf-generator.spec.ts
│   │       └── image-validator.spec.ts
│   │
│   ├── e2e/                         # End-to-end tests
│   │   ├── card-creation.cy.ts
│   │   ├── photo-upload.cy.ts
│   │   └── export-functionality.cy.ts
│   │
│   └── fixtures/                    # Test data
│       ├── sample-images/
│       │   ├── test-photo.jpg
│       │   └── test-photo.png
│       └── mock-data/
│           └── templates.json
│
├── docs/                            # Additional documentation
│   ├── README.md                    # Project overview
│   ├── SETUP.md                     # Setup instructions
│   └── USER_GUIDE.md                # User documentation
│
├── .github/                         # GitHub configuration
│   └── workflows/
│       └── ci.yml                   # CI/CD pipeline
│
├── config/                          # Build & tool configs (5 files)
│   ├── vite.config.ts               # Vite configuration
│   ├── tailwind.config.js           # Tailwind configuration
│   ├── tsconfig.json                # TypeScript configuration
│   └── vitest.config.ts             # Vitest configuration
│
├── .env.example                     # Environment variables template
├── .gitignore                       # Git ignore rules
├── .eslintrc.js                     # ESLint configuration
├── .prettierrc                      # Prettier configuration
├── package.json                     # Dependencies & scripts
├── cypress.config.ts                # Cypress E2E configuration
└── README.md                        # Project README

**Total Files: ~80 files** (MVP scope)
```
