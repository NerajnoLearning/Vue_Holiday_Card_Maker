# Testing Documentation

This directory contains the comprehensive testing suite for the Greeting Card Maker application.

## Test Structure

```
tests/
├── unit/                      # Unit tests for components, composables, and utilities
│   ├── components/            # Component tests using Vue Test Utils
│   │   ├── ErrorMessage.spec.ts
│   │   ├── LoadingSpinner.spec.ts
│   │   ├── GreetingCard.spec.ts
│   │   ├── HolidaySelector.spec.ts
│   │   └── PhotoUpload.spec.ts
│   ├── composables/           # Composable logic tests
│   │   ├── useGreetingCard.spec.ts
│   │   ├── useTemplates.spec.ts
│   │   ├── usePhotoUpload.spec.ts
│   │   └── useExport.spec.ts
│   └── utils/                 # Utility function tests
│       ├── image-validator.spec.ts
│       ├── pdf-generator.spec.ts
│       └── form-validators.spec.ts
│
├── e2e/                       # End-to-end tests using Cypress
│   ├── card-creation.cy.ts    # Card creation flow
│   ├── photo-upload.cy.ts     # Photo upload functionality
│   ├── export-functionality.cy.ts  # PDF/JPG export
│   └── support/               # Cypress support files
│       ├── e2e.ts
│       └── commands.ts
│
├── fixtures/                  # Test data and assets
│   └── sample-images/         # Sample images for testing
│       ├── test-photo.jpg
│       └── test-photo-2.jpg
│
├── setup.ts                   # Global test setup
└── README.md                  # This file
```

## Running Tests

### Unit Tests

```bash
# Run all unit tests
npm run test:unit

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui
```

### E2E Tests

```bash
# Run E2E tests in headless mode
npm run test:e2e

# Open Cypress Test Runner
npm run test:e2e:open
```

## Test Coverage

The testing suite covers:

### Unit Tests
- ✅ Image validation (file type, size)
- ✅ PDF generation
- ✅ Greeting card state management
- ✅ Template selection
- ✅ Photo upload with progress
- ✅ Export functionality (PDF/JPG)
- ✅ Common UI components
- ✅ Feature components

### Component Tests
- ✅ ErrorMessage component
- ✅ LoadingSpinner component
- ✅ HolidaySelector component
- ✅ PhotoUpload component
- ✅ GreetingCard component

### E2E Tests
- ✅ Complete card creation flow
- ✅ Template selection
- ✅ Message input and validation
- ✅ Photo upload with drag & drop
- ✅ File validation
- ✅ Export to PDF/JPG
- ✅ Error handling

## Writing Tests

### Unit Test Example

```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MyComponent from '@/components/MyComponent.vue'

describe('MyComponent', () => {
  it('renders properly', () => {
    const wrapper = mount(MyComponent, {
      props: { message: 'Hello' }
    })
    expect(wrapper.text()).toContain('Hello')
  })
})
```

### E2E Test Example

```typescript
describe('Feature Flow', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should complete user flow', () => {
    cy.get('[data-testid="button"]').click()
    cy.get('[data-testid="result"]').should('be.visible')
  })
})
```

## Test Guidelines

### Vue 3 Testing Best Practices
1. **Use Vue Test Utils** - Official testing library for Vue 3
2. **Test behavior, not implementation** - Focus on what users see
3. **Mock external dependencies** - Keep tests isolated
4. **Use data-testid attributes** - For stable selectors
5. **Test accessibility** - Check ARIA attributes

### Cypress Best Practices
1. **Use cy.get with data-testid** - Avoid brittle selectors
2. **Avoid waiting** - Use Cypress retry-ability
3. **Keep tests independent** - Each test should be isolated
4. **Use custom commands** - For repeated actions
5. **Test real user flows** - Not just happy paths

## Mock Data

### Sample Images
Place test images in `tests/fixtures/sample-images/`:
- `test-photo.jpg` - Standard test image
- `test-photo-2.jpg` - Alternate test image
- `large-image.jpg` - For size validation tests

### Mock Services
- `validateImageFile` - Mocked in composable tests
- `generatePDF` - Mocked with success/failure scenarios
- `generateJPG` - Mocked export functionality

## Continuous Integration

Tests run automatically on:
- ✅ Pull requests
- ✅ Main branch commits
- ✅ Pre-commit hooks (optional)

## Troubleshooting

### Common Issues

**Tests failing with "Module not found"**
```bash
# Ensure aliases are configured in vitest.config.ts
npm run type-check
```

**Cypress tests timing out**
```bash
# Increase timeout in cypress.config.ts
# Or use { timeout: 10000 } in specific tests
```

**Mock not working**
```bash
# Clear mock cache
vi.clearAllMocks()
```

## Test Coverage Goals

- Unit tests: **>80%** coverage
- E2E tests: Cover all critical user flows
- Component tests: All reusable components

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Vue Test Utils](https://test-utils.vuejs.org/)
- [Cypress Documentation](https://docs.cypress.io/)
- [Testing Library](https://testing-library.com/docs/vue-testing-library/intro/)
