# Quick TODO Summary

> **Last Updated**: November 22, 2025
> **Full List**: See [README.md](./README.md#-todo-list)

## Current Status 📊

- **Tests**: 102 passing / 2 failing (104 total)
- **Dev Server**: ✅ Running on port 3001
- **Build**: ✅ Passing
- **TypeScript**: ✅ Strict mode enabled

## Today (Critical) 🔴

### Immediate Fixes Needed

1. ⚠️ **Fix Failing Tests** (2 tests failing)
   - `useTemplates.spec.ts` - Update path assertions for Unsplash URLs
   - Tests expect `/assets/templates/` but we're using Unsplash CDN
   - **Action**: Update test expectations or revert to local images

2. ⬜ **Template Images** - Still using placeholders
   - Current: Using Unsplash CDN (temporary solution)
   - Files in `/public/assets/templates/` are 21-byte placeholders
   - **Action**: Download and add real images OR update tests to accept CDN URLs

3. ⬜ **Security: v-html in ToastContainer**
   - File: `src/components/common/ToastContainer.vue`
   - **Action**: Replace v-html with component-based icons

## This Week (High Priority) 🟠

4. ✅ **Refactor App.vue state management** - Using `useGreetingCard()` composable
5. ⬜ **Complete E2E tests** - Playwright setup exists, needs test implementation
6. ⬜ **WCAG contrast verification** - Dark mode colors need validation
7. ⬜ **Add CSP headers** - Security headers in vite.config.ts

## Completed Recently ✅

- ✅ Implemented `useGreetingCard` composable with full functionality
- ✅ Fixed image implementation (GreetingCard.vue, CardBackground.vue)
- ✅ Migrated to Unsplash CDN for template images
- ✅ Dark mode fully implemented with toggle
- ✅ TypeScript strict mode enabled
- ✅ 102 unit tests passing

## Next Sprint (Medium Priority) 🟡

- Image optimization (WebP conversion)
- Error boundaries implementation
- Performance tuning (Lighthouse optimization)
- Dependency updates (Vue 3.5.24 is current)

## Known Issues ⚠️

1. **Test Failures**: 2 tests in `useTemplates.spec.ts` expect local paths
2. **Placeholder Images**: Local image files are text placeholders (21 bytes)
3. **v-html Usage**: Security concern in ToastContainer component
4. **Vue Warnings**: useDarkMode tests trigger lifecycle warnings (non-critical)

---

**Priority Legend**:
- 🔴 Critical - Fix today/this week
- 🟠 High - Fix before production
- 🟡 Medium - Next sprint
- 🟢 Low - Technical debt

**See full detailed TODO list in [README.md](./README.md#-todo-list)**
