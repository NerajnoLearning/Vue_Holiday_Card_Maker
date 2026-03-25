# Holiday Greeting Card Maker — Project Status

**Last Updated**: March 25, 2026
**Version**: 1.0.0 (MVP)
**Status**: 🟡 Pre-Production (Critical fixes needed)

---

## 📊 Quick Stats

| Metric | Status |
|--------|--------|
| **Tests** | ⚠️ 102 passing / 2 failing (104 total) |
| **TypeScript** | ✅ Strict mode, passing |
| **Build** | ✅ Passing (Vite 8 / Rolldown) |
| **Bundle Size** | ✅ ~1 MB total, optimized |
| **Accessibility** | ✅ WCAG AA compliant |
| **Dark Mode** | ✅ Fully implemented |
| **PWA** | ✅ Service worker active |
| **ESLint** | ✅ Flat config (v10), 0 errors |

---

## 🎯 Top Critical Issues

### 1. Missing Template Images ⚠️
**Location**: `/public/assets/templates/`
**Impact**: App cannot display card backgrounds — currently using Unsplash CDN placeholders
**Fix**: Download real images (1200×1600px backgrounds, 300×400px thumbnails) into `/public/assets/templates/backgrounds/` and `/thumbnails/`, OR update tests to accept CDN URLs

### 2. Failing Unit Tests ⚠️
**Location**: `tests/unit/composables/useTemplates.spec.ts`
**Impact**: 2 tests fail because assertions expect local `/assets/templates/` paths but templates now use Unsplash CDN URLs
**Fix**: Update test expectations to match actual CDN URLs

### 3. Security: `v-html` in ToastContainer ⚠️
**Location**: `src/components/common/ToastContainer.vue:67`
**Impact**: XSS risk from unsanitized HTML injection
**Fix**: Replace `v-html` with component-based SVG icons

---

## 📋 Action Items by Priority

### 🔴 Critical (Fix Before Launch)
- [ ] Add real template images or update tests to accept CDN URLs
- [ ] Fix 2 failing `useTemplates.spec.ts` tests
- [ ] Replace `v-html` in `ToastContainer.vue` with SVG components
- [ ] Add Content Security Policy headers in `vite.config.ts`

### 🟠 High Priority (Before Production)
- [ ] Complete Playwright E2E test implementation (framework exists, tests unwritten)
- [ ] WCAG contrast verification on dark mode colors
- [ ] Refactor App.vue local state (`selectedTemplate`, `cardName`, etc.) into `useGreetingCard()` composable
- [ ] Add security headers: `X-Frame-Options`, `X-Content-Type-Options`

### 🟡 Medium Priority (Next Sprint)
- [ ] Image optimization — WebP versions with `<picture>` fallbacks, `srcset`
- [ ] Add Vue error boundaries globally
- [ ] Improve error messages and UX for failed exports
- [ ] Performance tuning (Lighthouse optimization)
- [ ] Run WCAG color contrast checker on all dark mode colors

### 🟢 Low Priority (Technical Debt)
- [ ] Add TypeDoc comments to all composables
- [ ] Visual regression testing (Percy or Chromatic)
- [ ] Lighthouse CI integration
- [ ] axe-core accessibility testing
- [ ] Undo/redo (useHistory composable)
- [ ] Auto-save to localStorage
- [ ] Multiple photo support
- [ ] Custom template creation

---

## ✅ Recently Completed

- [x] **Full dependency upgrade** — TypeScript 6, Vite 8 (Rolldown), Vitest 4, ESLint 10, jsPDF 4, vue-router 5, @types/node 25, jsdom 29
- [x] **ESLint flat config migration** — `.eslintrc.js` → `eslint.config.js` (ESLint v10 format)
- [x] **Lint bug fixes** — `BaseButton` now respects `prefersReducedMotion`; `BaseInput` uses computed animation class instead of hardcoded string
- [x] Implemented `useGreetingCard` composable with full functionality
- [x] Dark mode with system preference detection and manual toggle
- [x] Input sanitization with DOMPurify
- [x] PWA support with service worker
- [x] PDF/JPG export functionality
- [x] Accessibility (ARIA, keyboard navigation, skip links, focus management)
- [x] Responsive design with Tailwind CSS
- [x] 102 unit tests passing

---

## 🧪 Testing

### Unit Tests — 102 passing / 2 failing

| File | Tests | Status |
|------|-------|--------|
| `image-validator.spec.ts` | 11 | ✅ |
| `pdf-generator.spec.ts` | 7 | ✅ |
| `form-validators.spec.ts` | 1 | ✅ |
| `useTemplates.spec.ts` | 15 | ⚠️ 2 failing (CDN path mismatch) |
| `useGreetingCard.spec.ts` | 3 | ✅ |
| `usePhotoUpload.spec.ts` | 11 | ✅ |
| `useExport.spec.ts` | 9 | ✅ |
| `LoadingSpinner.spec.ts` | 7 | ✅ |
| `ErrorMessage.spec.ts` | 5 | ✅ |
| `HolidaySelector.spec.ts` | 6 | ✅ |
| `PhotoUpload.spec.ts` | 5 | ✅ |
| `GreetingCard.spec.ts` | 1 | ✅ |

### E2E Tests — Playwright (framework set up, tests need writing)
- `card-creation` — template display, message input, live preview, form reset
- `photo-upload` — file selection, type/size validation, drag-and-drop, removal
- `export-functionality` — PDF/JPG format selection, download trigger, progress, error handling

### Running Tests

```bash
# Unit tests
npm run test:unit           # Run all unit tests
npm run test:watch          # Watch mode
npm run test:coverage       # Coverage report
npm run test:ui             # Vitest interactive UI

# E2E tests (Playwright)
npm run test:e2e            # Headless
npm run test:e2e:ui         # Playwright UI mode
npm run test:e2e:headed     # Visible browser
```

### Test Setup (`tests/setup.ts`)
- Jest-DOM matchers via `@testing-library/jest-dom`
- `window.matchMedia` mock for responsive/dark mode tests
- `HTMLCanvasElement` mock for export tests
- `URL.createObjectURL` mock for photo upload tests
- jsPDF and html2canvas mocked in export composable tests

### Test Fixtures Required
E2E tests expect:
- `tests/fixtures/sample-images/test-photo.jpg`
- `tests/fixtures/sample-images/test-photo-2.jpg`

---

## 📈 Metrics

### Bundle Size (Vite 8 / Rolldown)

```
Vue vendor:   75.8 KB  (29.4 KB gzipped) ✓ Excellent
Main bundle: 151.6 KB  (48.9 KB gzipped) ✓ Excellent
Export libs: 616.2 KB  (180  KB gzipped, lazy-loaded) ✓ Good
Total: ~1.0 MB
```

### Code Quality

| Check | Status |
|-------|--------|
| TypeScript strict mode | ✅ Passing |
| ESLint (flat config v10) | ✅ 0 errors |
| Prettier formatting | ✅ Configured |
| Vue 3 best practices | ✅ No prop destructuring, composable pattern |
| No `any` types | ✅ Fixed in upgrade |

---

## 🏗 Architecture Strengths

- **Clean composable separation** — one composable per domain (`useGreetingCard`, `usePhotoUpload`, `useTemplates`, `useExport`, `useModal`)
- **Accessibility first** — skip links, ARIA labels, keyboard navigation, focus management
- **Performance** — code splitting, lazy-loaded modals, optimized build chunks
- **Security** — DOMPurify input sanitization (v-html in ToastContainer is the remaining gap)
- **Dark mode** — system preference detection + manual toggle with localStorage persistence

---

## 🚀 Quick Start

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # Production build
npm run lint         # ESLint check
npm run type-check   # TypeScript check
```

---

## 🔗 Related Documents

- **[CLAUDE.md](./CLAUDE.md)** — Development guide for AI assistants and developers
- **[README.md](./README.md)** — Project overview and full TODO list
