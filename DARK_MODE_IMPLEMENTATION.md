# Dark Mode Implementation

## Overview

A complete dark mode feature has been implemented for the Greeting Card Maker application with a toggle switch in the top right corner of the header.

## ✅ Features Implemented

### 1. Dark Mode Composable (`useDarkMode.ts`)
**Location**: `src/composables/useDarkMode.ts`

**Features**:
- ✅ Theme persistence in `localStorage`
- ✅ System preference detection
- ✅ Three theme modes: `light`, `dark`, `system`
- ✅ Reactive theme switching
- ✅ Automatic `dark` class application to `<html>`
- ✅ Media query listener for system preference changes

**API**:
```typescript
const {
  isDark,              // Ref<boolean> - Current dark mode state
  theme,               // Ref<Theme> - 'light' | 'dark' | 'system'
  setTheme,            // (theme: Theme) => void
  toggleDarkMode,      // () => void - Toggle between light/dark
  initializeDarkMode   // () => void - Initialize from saved preference
} = useDarkMode()
```

### 2. Dark Mode Toggle Component
**Location**: `src/components/common/DarkModeToggle.vue`

**Features**:
- ✅ Sun/Moon icon animation
- ✅ Smooth transitions
- ✅ Hover and focus states
- ✅ Full accessibility (ARIA labels)
- ✅ Reduced motion support
- ✅ Positioned in top right corner

**Usage**:
```vue
<DarkModeToggle />
```

### 3. Tailwind Configuration
**Location**: `tailwind.config.js`

**Changes**:
- ✅ Enabled class-based dark mode: `darkMode: 'class'`
- ✅ Custom dark color palette:
  - `dark-bg`: Deep slate background (#0f172a)
  - `dark-surface`: Card/surface background (#1e293b)
  - `dark-border`: Border color (#334155)
  - `dark-text-primary`: Primary text (#f1f5f9)
  - `dark-text-secondary`: Secondary text (#cbd5e1)
  - `dark-text-muted`: Muted text (#94a3b8)

### 4. Component Updates

All major components have been updated with dark mode support:

#### App.vue
- Background gradient (light → dark transition)
- Header with dark mode toggle
- All sections with dark mode styles
- Footer with dark mode support

#### BaseButton.vue
- Primary, secondary, outline, and danger variants
- Hover, active, and focus states
- Smooth color transitions

#### BaseInput.vue
- Background, border, and text colors
- Placeholder text styling
- Error and disabled states
- Focus ring colors

#### ErrorMessage.vue
- Error text color adjustments
- Icon color transitions

#### LoadingSpinner.vue
- Already supports dark mode with color prop

## 🎨 Color Palette

### Light Mode
- Background: `from-blue-50 to-purple-50`
- Surface: `white`
- Text: `gray-800`
- Border: `gray-300`

### Dark Mode
- Background: `from-dark-bg to-slate-900`
- Surface: `dark-surface (#1e293b)`
- Text: `dark-text-primary (#f1f5f9)`
- Border: `dark-border (#334155)`

## 📱 User Experience

### Toggle Behavior
1. Click the sun/moon icon in the top right corner
2. Theme switches between light and dark
3. Preference is saved to `localStorage`
4. Page transitions smoothly (300ms duration)

### Theme Persistence
- User preference is saved as `greeting-card-maker-theme` in `localStorage`
- Theme is automatically loaded on page refresh
- Syncs across browser tabs (same origin)

### System Preference
- Detects OS-level dark mode preference
- Automatically updates when system preference changes
- Can be overridden by user selection

## 🧪 Testing

### Unit Tests (16 tests passing)

#### useDarkMode.spec.ts (10 tests)
- Default state initialization
- Theme toggling
- Theme setting (light/dark/system)
- localStorage persistence
- DOM class application
- System preference handling

#### DarkModeToggle.spec.ts (6 tests)
- Button rendering
- Icon display
- ARIA labels
- Hover and focus styles
- Transition classes

**Run tests**:
```bash
npm run test:unit -- useDarkMode
```

## 🎯 Implementation Details

### How It Works

1. **Initialization** (App.vue):
```typescript
import { useDarkMode } from '@/composables/useDarkMode'
const { isDark } = useDarkMode()
```

2. **Class-based Dark Mode**:
   - Tailwind's `dark:` variant requires `dark` class on `<html>`
   - Composable adds/removes this class automatically
   - All components use `dark:` variants for styling

3. **State Management**:
   - Shared reactive state across all composable instances
   - Single source of truth for theme state
   - No Vuex/Pinia needed

4. **Transitions**:
   - All components use `transition-colors duration-300`
   - Smooth color changes when toggling
   - Respects `prefers-reduced-motion`

### Dark Mode Classes Pattern

```vue
<template>
  <div class="
    bg-white dark:bg-dark-surface
    text-gray-800 dark:text-dark-text-primary
    border-gray-300 dark:border-dark-border
    transition-colors duration-300
  ">
    Content
  </div>
</template>
```

## 📂 File Structure

```
src/
├── composables/
│   └── useDarkMode.ts           ✅ Dark mode logic
├── components/
│   └── common/
│       ├── DarkModeToggle.vue   ✅ Toggle component
│       ├── BaseButton.vue       ✅ Updated with dark styles
│       ├── BaseInput.vue        ✅ Updated with dark styles
│       ├── ErrorMessage.vue     ✅ Updated with dark styles
│       └── LoadingSpinner.vue   ✅ Already supports dark mode
└── App.vue                      ✅ Updated with dark styles

tests/
└── unit/
    ├── composables/
    │   └── useDarkMode.spec.ts  ✅ Composable tests
    └── components/
        └── DarkModeToggle.spec.ts ✅ Component tests

tailwind.config.js               ✅ Dark mode configuration
```

## 🚀 Usage Guide

### For Users
1. Look for the sun/moon icon in the top right corner
2. Click to toggle between light and dark mode
3. Your preference is automatically saved

### For Developers

#### Adding Dark Mode to New Components

```vue
<template>
  <div class="
    bg-white dark:bg-dark-surface
    text-gray-900 dark:text-dark-text-primary
    border border-gray-200 dark:border-dark-border
    transition-colors duration-300
  ">
    <h2 class="text-gray-800 dark:text-dark-text-primary">
      Title
    </h2>
    <p class="text-gray-600 dark:text-dark-text-secondary">
      Description
    </p>
  </div>
</template>
```

#### Using Custom Colors

```vue
<!-- Custom background -->
<div class="bg-blue-50 dark:bg-slate-800">

<!-- Custom text -->
<p class="text-blue-600 dark:text-blue-400">

<!-- Custom borders -->
<div class="border-blue-200 dark:border-blue-700">
```

#### Checking Current Theme in JavaScript

```typescript
import { useDarkMode } from '@/composables/useDarkMode'

const { isDark, theme } = useDarkMode()

// Check if dark mode is active
if (isDark.value) {
  console.log('Dark mode is on')
}

// Get current theme setting
console.log(theme.value) // 'light' | 'dark' | 'system'
```

## ♿ Accessibility

### Features
- ✅ ARIA labels on toggle button
- ✅ Dynamic aria-label based on current mode
- ✅ Keyboard accessible (Tab + Enter/Space)
- ✅ Focus ring indicators
- ✅ Sufficient color contrast (WCAG AA compliant)
- ✅ Respects `prefers-reduced-motion`

### Testing
```bash
# Run accessibility checks
npm run test:unit -- DarkModeToggle
```

## 🔧 Configuration

### Customize Colors

Edit `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      dark: {
        bg: '#your-color',
        surface: '#your-color',
        // ... more colors
      }
    }
  }
}
```

### Change Storage Key

Edit `useDarkMode.ts`:

```typescript
const STORAGE_KEY = 'your-app-theme'
```

### Adjust Transition Duration

Global setting in components:

```css
.transition-colors { transition-duration: 300ms; }
```

## 🐛 Known Issues

None currently. All tests passing ✅

## 📈 Performance

- **No performance impact**: Class-based approach is instant
- **Minimal bundle size**: ~2KB for composable + component
- **Efficient re-renders**: Only affected elements repaint
- **localStorage**: Synchronous but negligible impact

## 🎓 Best Practices

1. **Always use transitions**: Add `transition-colors duration-300`
2. **Test in both modes**: Check components in light and dark
3. **Use semantic colors**: Use Tailwind's color system
4. **Maintain contrast**: Ensure text is readable in both modes
5. **Support system preference**: Don't force a theme

## 📝 Future Enhancements

Potential improvements:
- [ ] Auto-switch based on time of day
- [ ] Multiple theme options (not just dark/light)
- [ ] Custom theme builder
- [ ] Animation preferences
- [ ] Export theme settings

## 📚 Resources

- [Tailwind Dark Mode Docs](https://tailwindcss.com/docs/dark-mode)
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [WCAG Color Contrast](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [prefers-color-scheme MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)

---

**Implementation Date**: October 29, 2024
**Status**: ✅ Complete and Tested
**Tests**: 16/16 passing
**Browser Support**: All modern browsers
