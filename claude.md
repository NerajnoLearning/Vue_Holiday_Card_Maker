# Holiday Greeting Card Maker - AI Assistant Guide

> **Purpose**: This document helps AI coding assistants (Claude, etc.) understand the project architecture, make consistent code changes, and follow established patterns.

---

## ⚠️ CRITICAL: This is a Vue 3 Project

**DO NOT use React patterns, JSX, or React hooks.** This project uses:
- ✅ Vue 3 with Composition API (`<script setup>`)
- ✅ Single-File Components (`.vue` files with `<template>` sections)
- ✅ Vue composables (NOT React hooks)
- ✅ Tailwind CSS (utility classes, no CSS-in-JS)
- ✅ TypeScript with strict mode

See the **[Vue 3 vs React section](#vue-3-vs-react---critical-differences)** for detailed pattern comparisons.

---

## Quick Context

**What**: Vue 3 + TypeScript web app for creating personalized holiday greeting cards
**Goal**: Enable users to create, customize, and export greeting cards with photos in under 2 minutes
**Stage**: MVP (4-6 week timeline, ~80 files)

## Tech Stack & Key Dependencies

```json
{
  "framework": "Vue 3.4+ (Composition API with <script setup>)",
  "language": "TypeScript 5+ (strict mode)",
  "build": "Vite 5+",
  "styling": "Tailwind CSS 3+",
  "testing": "Vitest (unit) + Cypress (e2e)",
  "export": "jsPDF (PDF) + Canvas API (JPG)",
  "state": "Vue Composition API (no Pinia/Vuex needed for MVP)"
}
```

## Critical Rules for AI Assistants

### ✅ DO:
1. **Always use Composition API** with `<script setup lang="ts">`
2. **Use existing composables** before creating new ones
3. **Follow TypeScript strictly** - no `any`, explicit return types
4. **Keep components under 300 lines** - split if larger
5. **Use Tailwind classes** - avoid custom CSS unless necessary
6. **Write tests** for new composables and utilities
7. **Check `/src/types/` first** before defining new types
8. **Use semantic commit messages** (feat:, fix:, refactor:, etc.)
9. **Use Vue 3 terminology** - composables (not hooks), SFC (not JSX), defineProps/defineEmits (not props destructuring)

### ❌ DON'T:
1. **Never use Options API** - only Composition API with `<script setup>`
2. **Don't add new dependencies** without discussing (MVP scope)
3. **Don't create inline styles** - use Tailwind utilities
4. **Don't skip TypeScript types** - always define interfaces
5. **Don't create duplicate utilities** - check `/src/utils/` first
6. **Don't bypass validation** - use existing validators
7. **Don't ignore mobile responsive** - mobile-first approach
8. **Never use React patterns** - no JSX, no React hooks (useState, useEffect, etc.)
9. **Don't destructure props directly** - always access via `props.propName`

### Vue 3 Specific Guidelines:
- **Composables** - Functions starting with `use` that encapsulate reactive logic (not "React hooks")
- **SFC** - Single-File Components with `.vue` extension (not JSX/TSX)
- **Template refs** - For DOM access, use `ref()` with `ref` attribute in template
- **Compiler macros** - Use `defineProps()`, `defineEmits()`, `defineExpose()` (no runtime imports needed)
- **Reactive primitives** - `ref()`, `reactive()`, `computed()`, `watch()`, `watchEffect()`
- **Props access** - Never destructure props, always use `props.propName` to maintain reactivity

---

## Architecture Overview

### Complete Project Structure
```
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

### Directory Purpose Guide

| Directory | Purpose | File Count | Notes |
|-----------|---------|------------|-------|
| `/public/assets/` | Static assets (templates, icons) | 15 | Served as-is, no processing |
| `/src/components/` | Vue UI components | 14 | Domain-organized, reusable |
| `/src/composables/` | Reactive state logic | 5 | One per major feature |
| `/src/types/` | TypeScript definitions | 4 | Central type system |
| `/src/utils/` | Pure utility functions | 8 | No Vue dependencies |
| `/src/assets/` | Build-processed assets | 5 | Imported in components |
| `/tests/` | Test suite | 15 | Unit + E2E coverage |
| `/config/` | Build configurations | 5 | Tool setup files |
| `/docs/` | Documentation | 3 | User & dev docs |

### State Management Philosophy
- **No Vuex/Pinia** - MVP uses composables only
- **Composables = Single Responsibility** - Each composable manages one domain
- **Local state preferred** - Use props/emits for parent-child communication
- **Reactive refs for simple state** - Avoid complex reactive objects

### Component Architecture Pattern
```vue
<script setup lang="ts">
// 1. Imports (Vue primitives, types, composables, components)
import { ref, computed, onMounted } from 'vue'
import type { GreetingCard } from '@/types'
import { useGreetingCard } from '@/composables/useGreetingCard'

// 2. Props & Emits (with TypeScript) - Use compiler macros, no imports needed
interface Props {
  initialData?: GreetingCard
}
const props = defineProps<Props>()
const emit = defineEmits<{
  save: [card: GreetingCard]
  cancel: []
}>()

// 3. Composables (external state/logic)
const { card, updateGreeting, isValid } = useGreetingCard(props.initialData)

// 4. Local reactive state - Use ref() for primitives, reactive() for objects
const isEditing = ref(false)
const isSubmitting = ref(false)

// 5. Computed properties - Always use computed() for derived state
const canSubmit = computed(() => isValid.value && !isSubmitting.value)

// 6. Methods - Regular functions, can be async
const handleSubmit = async () => {
  if (!canSubmit.value) return
  isSubmitting.value = true
  try {
    emit('save', card.value)
  } finally {
    isSubmitting.value = false
  }
}

// 7. Lifecycle hooks (if needed) - Use onMounted, onUnmounted, etc.
onMounted(() => {
  // Initialize component
})
</script>

<template>
  <!-- Vue template syntax, not JSX -->
  <!-- Mobile-first Tailwind classes -->
  <div class="container mx-auto p-4">
    <!-- Access props directly without destructuring -->
    <p v-if="props.initialData">{{ props.initialData.greeting }}</p>
    
    <!-- Access ref values with .value in script, without .value in template -->
    <button 
      @click="handleSubmit"
      :disabled="!canSubmit"
      class="btn"
    >
      Submit
    </button>
  </div>
</template>
```

**Key Vue 3 Patterns**:
- Import reactive primitives: `ref`, `reactive`, `computed`, `watch`, `watchEffect`
- Compiler macros (`defineProps`, `defineEmits`) don't need imports
- Access ref `.value` in `<script>`, but NOT in `<template>`
- Never destructure props - always use `props.propName`
- Use `@click` for events (not `onClick`), `:disabled` for bindings (not `disabled={}`)


---

## Key Composables Reference

### `useGreetingCard(initialCard?: GreetingCard)`
**Purpose**: Manages card state and validation
```typescript
const {
  card,              // Ref<GreetingCard> - Current card data
  updateGreeting,    // (text: string) => void
  selectTemplate,    // (template: Template) => void
  setPhoto,          // (photo: Photo | null) => void
  isValid,           // ComputedRef<boolean> - Auto-validates
  reset              // () => void - Reset to initial state
} = useGreetingCard()
```
**When to use**: Any component that needs card data/operations

### `usePhotoUpload(options?: UploadOptions)`
**Purpose**: Handles image upload, validation, and preview
```typescript
const {
  photo,             // Ref<Photo | null>
  isUploading,       // Ref<boolean>
  error,             // Ref<string | null>
  uploadPhoto,       // (file: File) => Promise<void>
  removePhoto,       // () => void
  validatePhoto      // (file: File) => { valid: boolean; error?: string }
} = usePhotoUpload({ maxSize: 5242880, allowedTypes: ['jpg', 'png'] })
```
**When to use**: PhotoUpload component and anywhere file upload is needed

### `useTemplates()`
**Purpose**: Manages template data and selection
```typescript
const {
  templates,         // ComputedRef<Template[]> - All available templates
  selectedTemplate,  // Ref<Template | null>
  selectTemplate,    // (templateId: string) => void
  getTemplateById    // (id: string) => Template | undefined
} = useTemplates()
```
**When to use**: Template selection, card preview components

### `useExport()`
**Purpose**: Generates and downloads PDF/JPG exports
```typescript
const {
  isExporting,       // Ref<boolean>
  error,             // Ref<string | null>
  exportPDF,         // (element: HTMLElement, filename?: string) => Promise<void>
  exportJPG          // (element: HTMLElement, filename?: string, quality?: number) => Promise<void>
} = useExport()
```
**When to use**: Export modal, download buttons

### `useModal()`
**Purpose**: Manages modal visibility state
```typescript
const {
  isOpen,            // Ref<boolean>
  open,              // () => void
  close,             // () => void
  toggle             // () => void
} = useModal(initialState?: boolean)
```
**When to use**: Any component with modal/dialog functionality

---

## TypeScript Type System

### Core Types Location
**Always import from**: `@/types` (never define types inline for shared data)

```typescript
// @/types/greeting-card.ts
export interface GreetingCard {
  id: string
  template: Template
  greeting: string          // Max 500 chars
  photo?: Photo            // Optional
  createdAt: Date
}

export interface Photo {
  url: string
  file: File
  dimensions: { width: number; height: number }
}

// @/types/template.ts
export type Holiday = 'christmas' | 'newyear' | 'valentine' | 'birthday'

export interface Template {
  id: string
  name: string
  holiday: Holiday
  backgroundUrl: string    // Path to full-size image
  thumbnailUrl: string     // Path to thumbnail
}

// @/types/export.ts
export type ExportFormat = 'pdf' | 'jpg'

export interface ExportOptions {
  format: ExportFormat
  quality?: number         // 0-1 for JPG
  dimensions?: { width: number; height: number }
}
```

### Type Usage Rules
1. **Import types with `type` keyword**: `import type { GreetingCard } from '@/types'`
2. **Use interfaces for objects**: Objects = `interface`, primitives = `type`
3. **No implicit any**: Always define parameter and return types
4. **Optional props**: Use `?` syntax, not `| undefined`

---

## File Organization Patterns

### When to Create New Files

**Create NEW component when**:
- Logic exceeds 300 lines
- Component is reused 2+ times
- Clear single responsibility

**Create NEW composable when**:
- Logic is reused across 2+ components
- Managing a distinct piece of state
- Complex business logic needs isolation

**Create NEW utility when**:
- Pure function with no Vue dependencies
- Reusable helper logic
- Can be unit tested independently

### Naming Conventions
```
Components:   PascalCase.vue       (e.g., GreetingCard.vue)
Composables:  use*.ts              (e.g., useGreetingCard.ts)
Types:        kebab-case.ts        (e.g., greeting-card.ts)
Utils:        kebab-case.ts        (e.g., pdf-generator.ts)
Constants:    SCREAMING_SNAKE      (e.g., MAX_FILE_SIZE)
```

---

## Common Development Tasks

### Adding a New Feature
1. **Check requirements** - Is it in MVP scope?
2. **Define types** - Add to `/src/types/` if shared
3. **Create composable** (if stateful) or utility (if pure)
4. **Build component** - Use existing base components
5. **Write tests** - Unit test composables/utils
6. **Update this doc** - Add new patterns/decisions

### Modifying Existing Component
1. **Read component file** - Understand current structure
2. **Check composable** - Is logic there or in component?
3. **Update types** - Modify interfaces if data shape changes
4. **Test changes** - Run unit/e2e tests
5. **Verify mobile** - Check responsive behavior

### Adding New Template
1. Add images to `/public/assets/templates/backgrounds/`
   - Full size: 1200x1600px JPG
   - Thumbnail: 300x400px JPG
2. Update `src/utils/constants/templates.ts`:
```typescript
export const TEMPLATES: Template[] = [
  // ... existing
  {
    id: 'new-template-id',
    name: 'New Template Name',
    holiday: 'birthday', // or other Holiday type
    backgroundUrl: '/assets/templates/backgrounds/new-bg.jpg',
    thumbnailUrl: '/assets/templates/thumbnails/new-thumb.jpg'
  }
]
```
3. No component changes needed (dynamic rendering)

### Debugging Common Issues

**Problem**: TypeScript errors about missing types
- **Solution**: Check `/src/types/` for existing definitions
- Import with `import type { ... } from '@/types'`

**Problem**: Composable state not updating
- **Solution**: Ensure you're using `.value` with refs
- Check if computed properties need to be ref-wrapped

**Problem**: Tailwind classes not applying
- **Solution**: Verify class names (no typos)
- Check if using JIT mode (all classes work)
- Avoid dynamic class strings - use full class names

**Problem**: Export functionality fails
- **Solution**: Verify DOM element is rendered before export
- Check browser console for Canvas/jsPDF errors
- Ensure images loaded (use `onload` events)

---

## Testing Guidelines

### What to Test
✅ **Always test**:
- All composables (business logic)
- Utility functions (pure functions)
- Complex component methods
- User interactions (e2e)

❌ **Don't test**:
- Simple props/template rendering
- External library behavior
- Trivial getters/setters

### Test Structure Pattern
```typescript
// useGreetingCard.spec.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { useGreetingCard } from '@/composables/useGreetingCard'

describe('useGreetingCard', () => {
  it('should initialize with empty card', () => {
    const { card } = useGreetingCard()
    expect(card.value.greeting).toBe('')
  })
  
  it('should validate card with required fields', () => {
    const { card, isValid, updateGreeting, selectTemplate } = useGreetingCard()
    
    expect(isValid.value).toBe(false)
    
    updateGreeting('Happy Holidays!')
    selectTemplate(mockTemplate)
    
    expect(isValid.value).toBe(true)
  })
})
```

### Running Tests
```bash
npm run test:unit              # Run all unit tests
npm run test:unit -- --watch   # Watch mode
npm run test:e2e               # Run e2e tests
npm run test:coverage          # Generate coverage report
```

---

## Code Style & Patterns

### Import Order
```typescript
// 1. Vue imports
import { ref, computed, onMounted } from 'vue'

// 2. Type imports
import type { GreetingCard, Template } from '@/types'

// 3. Composables
import { useGreetingCard } from '@/composables/useGreetingCard'

// 4. Components
import BaseButton from '@/components/common/BaseButton.vue'

// 5. Utils/Constants
import { MAX_FILE_SIZE } from '@/utils/constants/file-types'
```

### Error Handling Pattern
```typescript
// In composables
const error = ref<string | null>(null)

const doSomething = async () => {
  error.value = null
  try {
    // operation
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Unknown error'
    console.error('doSomething failed:', e)
  }
}

return { error, doSomething }
```

### Validation Pattern
```typescript
// In utils/validation/
export const validateGreeting = (text: string): { valid: boolean; error?: string } => {
  if (!text.trim()) {
    return { valid: false, error: 'Greeting is required' }
  }
  if (text.length > 500) {
    return { valid: false, error: 'Greeting must be 500 characters or less' }
  }
  return { valid: true }
}
```

### Async/Await Pattern
```typescript
// Always use async/await, not promises
const handleUpload = async (file: File) => {
  isLoading.value = true
  try {
    const result = await uploadPhoto(file)
    // handle success
  } catch (e) {
    // handle error
  } finally {
    isLoading.value = false
  }
}
```

---

## Tailwind CSS Guidelines

### Responsive Design Pattern
```vue
<template>
  <!-- Mobile-first approach -->
  <div class="
    flex flex-col          <!-- Mobile: vertical stack -->
    md:flex-row            <!-- Tablet+: horizontal -->
    gap-4                  <!-- Consistent spacing -->
    p-4 md:p-6 lg:p-8      <!-- Responsive padding -->
  ">
    <div class="w-full md:w-1/2">
      <!-- Content -->
    </div>
  </div>
</template>
```

### Component Styling Pattern
```vue
<template>
  <!-- Use Tailwind utilities, not custom classes -->
  <button class="
    px-4 py-2 rounded-lg
    bg-blue-600 hover:bg-blue-700
    text-white font-medium
    transition-colors duration-200
    disabled:opacity-50 disabled:cursor-not-allowed
  ">
    Click Me
  </button>
</template>
```

### Common Utility Classes Used
```css
/* Layout */
flex, grid, container

/* Spacing */
p-4, m-4, gap-4, space-x-4

/* Typography */
text-sm, text-base, text-lg, font-medium, font-bold

/* Colors */
bg-blue-600, text-gray-800, border-gray-300

/* Effects */
shadow-lg, rounded-lg, transition-colors

/* Interactive */
hover:bg-blue-700, focus:ring-2, active:scale-95
```

---

## Performance Considerations

### Image Optimization
```typescript
// Always resize images before upload (in usePhotoUpload)
const resizeImage = async (file: File): Promise<File> => {
  const MAX_WIDTH = 1200
  const MAX_HEIGHT = 1600
  
  // Canvas-based resizing logic
  // Return optimized file
}
```

### Lazy Loading
```vue
<!-- Use v-lazy for template images -->
<img 
  :src="template.thumbnailUrl" 
  loading="lazy"
  alt="Template preview"
>
```

### Code Splitting
```typescript
// Use dynamic imports for modals (they're not needed immediately)
const PreviewModal = defineAsyncComponent(() => 
  import('@/components/modal/PreviewModal.vue')
)
```

---

## Vue 3 vs React - Critical Differences

**This is a Vue 3 project. Never use React patterns.** Here are the key differences:

### Terminology & Concepts

| React Term | Vue 3 Equivalent | Notes |
|------------|------------------|-------|
| Hook (useState, useEffect) | Composable (useGreetingCard) | Vue composables use `use` prefix but are NOT React hooks |
| JSX/TSX | SFC Template | Use `.vue` files with `<template>` section, not JSX |
| Props destructuring | Props object | Never destructure: use `props.name` not `const { name } = props` |
| State (useState) | ref() or reactive() | `const count = ref(0)` not `const [count, setCount] = useState(0)` |
| Effect (useEffect) | watch() or watchEffect() | Different API, different patterns |
| Component | Component | Same concept, different implementation |
| Fragment | Fragment or Multi-root | Vue supports multi-root components natively |

### Syntax Differences

```vue
<!-- ❌ WRONG (React/JSX pattern) -->
<script setup lang="tsx">
const [count, setCount] = useState(0)
const handleClick = () => setCount(count + 1)

return (
  <button onClick={handleClick} className="btn">
    Count: {count}
  </button>
)
</script>

<!-- ✅ CORRECT (Vue 3 pattern) -->
<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)
const handleClick = () => count.value++
</script>

<template>
  <button @click="handleClick" class="btn">
    Count: {{ count }}
  </button>
</template>
```

### Reactive State

```typescript
// ❌ WRONG (React pattern)
const [user, setUser] = useState({ name: 'John', age: 30 })
setUser({ ...user, age: 31 })

// ✅ CORRECT (Vue 3 pattern)
import { ref, reactive } from 'vue'

// Option 1: ref for primitives or entire objects
const user = ref({ name: 'John', age: 30 })
user.value = { ...user.value, age: 31 }

// Option 2: reactive for objects (no .value needed)
const user = reactive({ name: 'John', age: 30 })
user.age = 31
```

### Event Handling

```vue
<!-- ❌ WRONG (React pattern) -->
<button onClick={handleClick}>Click</button>
<input onChange={handleChange} value={text} />

<!-- ✅ CORRECT (Vue 3 pattern) -->
<button @click="handleClick">Click</button>
<input @input="handleChange" :value="text" />
<!-- Or use v-model for two-way binding -->
<input v-model="text" />
```

### Conditional Rendering

```vue
<!-- ❌ WRONG (React/JSX pattern) -->
<template>
  {isVisible && <div>Content</div>}
  {isLoading ? <Spinner /> : <Content />}
</template>

<!-- ✅ CORRECT (Vue 3 pattern) -->
<template>
  <div v-if="isVisible">Content</div>
  <Spinner v-if="isLoading" />
  <Content v-else />
</template>
```

### List Rendering

```vue
<!-- ❌ WRONG (React pattern) -->
<template>
  {items.map(item => (
    <div key={item.id}>{item.name}</div>
  ))}
</template>

<!-- ✅ CORRECT (Vue 3 pattern) -->
<template>
  <div v-for="item in items" :key="item.id">
    {{ item.name }}
  </div>
</template>
```

### Props & Emits

```typescript
// ❌ WRONG (React pattern)
interface Props {
  title: string
  onSave: (data: string) => void
}
const { title, onSave } = props // Never destructure!
onSave('data') // Calling a function prop

// ✅ CORRECT (Vue 3 pattern)
interface Props {
  title: string
}
const props = defineProps<Props>()
const emit = defineEmits<{
  save: [data: string]
}>()

// Access: props.title (not destructured)
// Emit: emit('save', 'data')
```

### Lifecycle

```typescript
// ❌ WRONG (React pattern)
useEffect(() => {
  // componentDidMount + componentDidUpdate
  return () => {
    // componentWillUnmount
  }
}, [dependency])

// ✅ CORRECT (Vue 3 pattern)
import { onMounted, onUnmounted, watch } from 'vue'

onMounted(() => {
  // Component mounted
})

onUnmounted(() => {
  // Component unmounted
})

watch(() => dependency.value, (newVal, oldVal) => {
  // When dependency changes
})
```

### Async Components

```typescript
// ❌ WRONG (React pattern)
const LazyComponent = React.lazy(() => import('./Component'))

// ✅ CORRECT (Vue 3 pattern)
import { defineAsyncComponent } from 'vue'
const LazyComponent = defineAsyncComponent(() => 
  import('./Component.vue')
)
```

### Template Refs (DOM Access)

```vue
<!-- ❌ WRONG (React pattern) -->
<script setup lang="ts">
const inputRef = useRef<HTMLInputElement>(null)
useEffect(() => {
  inputRef.current?.focus()
}, [])
</script>
<template>
  <input ref={inputRef} />
</template>

<!-- ✅ CORRECT (Vue 3 pattern) -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'

const inputRef = ref<HTMLInputElement | null>(null)

onMounted(() => {
  inputRef.value?.focus()
})
</script>

<template>
  <input ref="inputRef" />
</template>
```

### Key Reminders
- **No JSX** - Use Vue templates with `<template>` tags
- **No React hooks** - Use Vue composables (different API)
- **No destructuring props** - Access via `props.propertyName`
- **Use .value** - Access ref values with `.value` in `<script>`, not in `<template>`
- **Vue directives** - Use `v-if`, `v-for`, `v-model`, `@click`, `:class`, etc.
- **Compiler macros** - `defineProps`, `defineEmits` don't need imports

---

## MVP Scope Boundaries

### ✅ In Scope (Implement These)
- 4 holiday templates (Christmas, New Year, Valentine, Birthday)
- Single photo upload with validation
- Text input (max 500 chars)
- PDF and JPG export
- Basic responsive design
- Form validation
- Error messaging

### ❌ Out of Scope (Don't Implement)
- Multiple photos per card
- Photo editing/filters
- User authentication/accounts
- Saving cards to backend
- Social sharing
- Print ordering
- Custom template creation
- Animation effects
- Internationalization (i18n)
- Dark mode
- Advanced accessibility beyond basics

**If asked to implement out-of-scope features**: Acknowledge request, explain MVP constraint, suggest post-MVP phase.

---

## Quick Command Reference

```bash
# Development
npm install           # Install dependencies
npm run dev          # Start dev server (http://localhost:5173)
npm run build        # Production build
npm run preview      # Preview production build

# Testing
npm run test:unit           # Run unit tests
npm run test:unit -- -u     # Update snapshots
npm run test:e2e           # Run e2e tests
npm run test:coverage      # Generate coverage report
npm run type-check         # TypeScript type checking

# Linting
npm run lint              # Run ESLint
npm run lint:fix          # Auto-fix linting issues
npm run format            # Run Prettier
```

---

## Environment Variables

```env
# .env.local (not committed)
VITE_APP_NAME=Holiday Greeting Card Maker
VITE_MAX_FILE_SIZE=5242880        # 5MB in bytes
VITE_ALLOWED_FORMATS=jpg,jpeg,png
VITE_PDF_EXPORT_QUALITY=1.0       # 0-1
VITE_JPG_EXPORT_QUALITY=0.9       # 0-1
```

**Access in code**:
```typescript
const MAX_SIZE = Number(import.meta.env.VITE_MAX_FILE_SIZE)
```

---

## Troubleshooting for AI Assistants

### "Module not found" Error
- Check if file exists at path
- Verify `@` alias resolves to `/src` (check `vite.config.ts`)
- Ensure correct file extension (`.vue`, `.ts`, `.tsx`)

### "Type X is not assignable to type Y"
- Check `/src/types/` for correct type definitions
- Verify you're using the latest interface version
- Use `as` type assertion only as last resort

### Component Not Updating
- Ensure reactive state uses `ref()` or `reactive()`
- Check if using `.value` with refs
- Verify props are declared with `defineProps()`

### Build Fails
- Run `npm run type-check` to find TypeScript errors
- Check for unused imports (ESLint will catch)
- Verify all assets exist in `/public`

### Tests Failing
- Clear Vitest cache: `npm run test:unit -- --clearCache`
- Check for missing mock data in `/tests/fixtures`
- Verify test environment has correct imports

---

## AI Assistant Collaboration Tips

### When Making Changes
1. **Read existing code first** - Don't assume, verify patterns
2. **Use existing types** - Check `/src/types/` before creating new
3. **Follow the patterns above** - Consistency is critical
4. **Test your changes** - Run tests before declaring complete
5. **Update this doc** - Add new patterns or decisions made

### When Unsure
- **Check composables** - Logic probably exists
- **Review types** - Data structure likely defined
- **Look at similar components** - Follow established patterns
- **Ask about scope** - Confirm feature is in MVP

### Best Practices
- **Commit frequently** - Small, logical commits
- **Write clear messages** - `feat: add photo upload validation`
- **Test as you go** - Don't defer testing
- **Keep it simple** - MVP = Minimum Viable Product

---

## Project Status

**Current Phase**: MVP Development - Core Infrastructure Complete ✅
**Timeline**: Week 2 (Component implementation in progress)
**Last Updated**: October 27, 2024
**Target**: Weeks 5-6 (Deployed MVP)

### Implementation Progress

#### ✅ Completed (Infrastructure Layer)
- [x] Project scaffolding with Vue 3 + TypeScript + Vite
- [x] Tailwind CSS configuration
- [x] TypeScript strict mode setup
- [x] Type system architecture (`/src/types/`)
  - [x] `card.ts` - Card-specific types
  - [x] `greeting-card.ts` - Main card data types
  - [x] `template.ts` - Template interfaces
  - [x] `export.ts` - Export options
  - [x] `index.ts` - Central exports
- [x] Utility functions (`/src/utils/`)
  - [x] Export utilities (PDF, JPG, canvas)
  - [x] Image utilities (validator, resizer)
  - [x] Form validators
  - [x] Constants (templates, file types)
- [x] Template assets structure (`/public/assets/templates/`)
  - [x] Backgrounds directory (4 templates)
  - [x] Thumbnails directory (4 templates)
- [x] Template constants (Christmas, New Year, Valentine, Birthday)

#### ✅ Completed (Composables - 5/5)
- [x] `useModal.ts` - Modal state management (fully implemented)
- [x] `useGreetingCard.ts` - Card state (basic structure)
- [x] `usePhotoUpload.ts` - Image handling (basic structure)
- [x] `useTemplates.ts` - Template selection (basic structure)
- [x] `useExport.ts` - PDF/JPG generation (basic structure)

#### ✅ Completed (Common Components - 6/6)
- [x] `BaseButton.vue` - Button component (basic structure)
- [x] `BaseInput.vue` - Input component (basic structure)
- [x] `BaseModal.vue` - Modal component (basic structure)
- [x] `LoadingSpinner.vue` - Loading indicator (basic structure)
- [x] `ErrorMessage.vue` - Error display (basic structure)
- [x] `CardBackground.vue` - Template background renderer (fully implemented)

#### 🔄 In Progress (Feature Components - 6/8)
- [x] `card/GreetingCard.vue` - Main card display (fully implemented)
- [x] `templates/HolidaySelector.vue` - Template picker (fully implemented)
- [x] `templates/TemplateCard.vue` - Individual template (fully implemented)
- [x] `photo/PhotoUpload.vue` - Upload interface (fully implemented)
- [ ] `photo/PhotoPreview.vue` - Image preview (needs implementation)
- [ ] `greeting-card/CardForm.vue` - Text input form (needs implementation)
- [ ] `greeting-card/CardPreview.vue` - Live preview (needs implementation)
- [ ] `greeting-card/GreetingCard.vue` - Duplicate? (needs review)

#### 🔄 In Progress (Modal Components - 0/2)
- [ ] `modal/PreviewModal.vue` - Full-size preview (needs implementation)
- [ ] `modal/ExportModal.vue` - Download options (needs implementation)

#### ✅ Completed (Main App)
- [x] `App.vue` - Main application flow (fully implemented with all sections)

#### ❌ Not Started (Testing - 0/15)
- [ ] Unit tests for composables
- [ ] Unit tests for utilities
- [ ] Unit tests for components
- [ ] E2E tests for card creation flow
- [ ] E2E tests for photo upload
- [ ] E2E tests for export functionality

### Current Build Status
- ✅ TypeScript compilation: **PASSING**
- ✅ Production build: **PASSING**
- ⚠️ Some components need full implementation (stubs exist)
- ⚠️ Modal components need implementation
- ⚠️ Base components need props/emits definition

### Next Steps (Priority Order)
1. **Implement Base Components** (BaseButton, BaseInput, BaseModal)
   - Define props and emits interfaces
   - Add proper styling and variants
   - Implement accessibility features

2. **Complete CardForm Component**
   - Text input fields for name and greeting
   - Character counters and validation
   - Integration with composables

3. **Implement Modal Components**
   - PreviewModal - Full-size card preview
   - ExportModal - PDF/JPG export options

4. **Complete Remaining Feature Components**
   - PhotoPreview component
   - CardPreview component
   - Review duplicate GreetingCard components

5. **Enhance Composables**
   - Complete useGreetingCard logic
   - Complete usePhotoUpload with validation
   - Complete useTemplates with data fetching
   - Complete useExport with PDF/JPG generation

6. **Add Unit Tests**
   - Test all composables
   - Test utility functions
   - Test component logic

7. **Run Development Server & Test**
   - `npm run dev`
   - End-to-end manual testing
   - Fix any runtime issues

8. **Final Polish**
   - Responsive design verification
   - Error handling improvements
   - Performance optimization

---

## Additional Resources

### Official Vue 3 Documentation
- **Vue 3 Guide**: https://vuejs.org/guide/
- **API Reference**: https://vuejs.org/api/
- **Glossary**: https://vuejs.org/glossary/
- **Style Guide**: https://vuejs.org/style-guide/
- **Examples**: https://vuejs.org/examples/
- **Composition API FAQ**: https://vuejs.org/guide/extras/composition-api-faq

### Key Vue 3 Guides
- **Reactivity Fundamentals**: https://vuejs.org/guide/essentials/reactivity-fundamentals
- **Computed Properties**: https://vuejs.org/guide/essentials/computed
- **Template Syntax**: https://vuejs.org/guide/essentials/template-syntax
- **Event Handling**: https://vuejs.org/guide/essentials/event-handling
- **Form Input Bindings**: https://vuejs.org/guide/essentials/forms
- **Components In-Depth**: https://vuejs.org/guide/components/registration
- **Composables**: https://vuejs.org/guide/reusability/composables
- **TypeScript with Vue**: https://vuejs.org/guide/typescript/overview

### Other Tools
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Vite Guide**: https://vitejs.dev/guide/
- **Vitest**: https://vitest.dev/guide/
- **Cypress**: https://docs.cypress.io/

### Development Tools
- **Vue DevTools**: https://devtools.vuejs.org/
- **Volar (VS Code)**: https://marketplace.visualstudio.com/items?itemName=Vue.volar
- **TypeScript Vue Plugin**: https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin

---

**Document Version**: 1.0
**Last Updated**: Project Initialization
**Maintained By**: Development Team

---

## AI Assistant Onboarding Checklist

Before starting work, ensure you understand:
- [ ] **This is a Vue 3 project** - No React patterns, no JSX, no React hooks
- [ ] Tech stack (Vue 3 + TypeScript + Vite + Tailwind)
- [ ] Composition API pattern (always use `<script setup>`)
- [ ] Vue 3 terminology (composables, not hooks; SFC, not JSX)
- [ ] Composable locations and purposes
- [ ] Type system organization (`/src/types/`)
- [ ] Testing requirements (unit tests for composables)
- [ ] MVP scope boundaries (what's in/out)
- [ ] Mobile-first responsive approach with Tailwind
- [ ] Command reference for common tasks
- [ ] Never destructure props (use `props.propertyName`)
- [ ] Use `.value` for refs in `<script>`, not in `<template>`