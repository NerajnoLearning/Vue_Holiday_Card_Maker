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

greeting-card-maker/
├── public/
│   ├── favicon.ico
│   ├── logo.png
│   └── templates/
│       ├── christmas/
│       │   ├── bg-christmas-1.jpg
│       │   ├── bg-christmas-2.jpg
│       │   └── thumbnail.jpg
│       ├── valentine/
│       │   ├── bg-valentine-1.jpg
│       │   ├── bg-valentine-2.jpg
│       │   └── thumbnail.jpg
│       ├── newyear/
│       │   ├── bg-newyear-1.jpg
│       │   ├── bg-newyear-2.jpg
│       │   └── thumbnail.jpg
│       └── birthday/
│           ├── bg-birthday-1.jpg
│           ├── bg-birthday-2.jpg
│           └── thumbnail.jpg
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── BaseButton.vue
│   │   │   ├── BaseInput.vue
│   │   │   ├── BaseModal.vue
│   │   │   ├── BaseSpinner.vue
│   │   │   ├── BaseToast.vue
│   │   │   └── BaseDropdown.vue
│   │   ├── card/
│   │   │   ├── GreetingCard.vue
│   │   │   ├── CardPreview.vue
│   │   │   ├── CardTemplate.vue
│   │   │   └── CardBackground.vue
│   │   ├── forms/
│   │   │   ├── CardForm.vue
│   │   │   ├── PhotoUpload.vue
│   │   │   ├── HolidaySelector.vue
│   │   │   └── FormField.vue
│   │   ├── modals/
│   │   │   ├── PreviewModal.vue
│   │   │   ├── ExportModal.vue
│   │   │   └── ConfirmModal.vue
│   │   ├── layout/
│   │   │   ├── AppHeader.vue
│   │   │   ├── AppFooter.vue
│   │   │   └── MainLayout.vue
│   │   └── common/
│   │       ├── LoadingSpinner.vue
│   │       ├── ErrorBoundary.vue
│   │       └── IconComponent.vue
│   ├── composables/
│   │   ├── useFileUpload.ts
│   │   ├── useCardExport.ts
│   │   ├── useTemplates.ts
│   │   ├── useFormValidation.ts
│   │   ├── useModal.ts
│   │   ├── useToast.ts
│   │   ├── useLocalStorage.ts
│   │   └── useImageProcessing.ts
│   ├── stores/
│   │   ├── cardStore.ts
│   │   ├── templateStore.ts
│   │   └── appStore.ts
│   ├── utils/
│   │   ├── fileHelpers.ts
│   │   ├── imageHelpers.ts
│   │   ├── exportHelpers.ts
│   │   ├── validationHelpers.ts
│   │   ├── formatHelpers.ts
│   │   └── constants.ts
│   ├── types/
│   │   ├── card.ts
│   │   ├── template.ts
│   │   ├── upload.ts
│   │   └── index.ts
│   ├── assets/
│   │   ├── styles/
│   │   │   ├── main.css
│   │   │   ├── components.css
│   │   │   └── animations.css
│   │   ├── images/
│   │   │   ├── placeholder.svg
│   │   │   └── icons/
│   │   └── fonts/
│   │       └── holiday-fonts.woff2
│   ├── views/
│   │   ├── Home.vue
│   │   ├── CardMaker.vue
│   │   └── Gallery.vue
│   ├── router/
│   │   └── index.ts
│   ├── App.vue
│   └── main.ts
├── tests/
│   ├── unit/
│   │   ├── components/
│   │   │   ├── GreetingCard.test.ts
│   │   │   ├── PhotoUpload.test.ts
│   │   │   └── HolidaySelector.test.ts
│   │   ├── composables/
│   │   │   ├── useFileUpload.test.ts
│   │   │   └── useCardExport.test.ts
│   │   └── utils/
│   │       ├── fileHelpers.test.ts
│   │       └── imageHelpers.test.ts
│   ├── e2e/
│   │   ├── card-creation.cy.ts
│   │   ├── template-selection.cy.ts
│   │   └── export-functionality.cy.ts
│   └── fixtures/
│       ├── test-image.jpg
│       └── mock-templates.json
├── .env
├── .env.example
├── .gitignore
├── .eslintrc.js
├── .prettierrc
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── vitest.config.ts
├── cypress.config.ts
└── README.md