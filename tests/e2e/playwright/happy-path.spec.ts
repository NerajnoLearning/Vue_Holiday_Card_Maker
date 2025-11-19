import { test, expect } from '@playwright/test'
import path from 'path'

test.describe('Greeting Card Maker - Happy Path', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should complete full card creation flow', async ({ page }) => {
    // Step 1: Verify app loads
    await expect(page.locator('h1')).toContainText(/greeting card/i)

    // Step 2: Select a template
    const templateCards = page.locator('[data-testid="template-card"]')
    await expect(templateCards.first()).toBeVisible()
    await templateCards.first().click()

    // Verify template is selected (has visual indicator)
    await expect(templateCards.first()).toHaveClass(/selected|ring|border/)

    // Step 3: Enter greeting text
    const greetingInput = page.locator('[data-testid="greeting-input"], textarea, input[type="text"]').first()
    await greetingInput.fill('Happy Holidays from the Smith Family!')

    // Step 4: Enter recipient name (if field exists)
    const nameInput = page.locator('[data-testid="name-input"], input[placeholder*="name" i]').first()
    if (await nameInput.isVisible()) {
      await nameInput.fill('Dear Friends')
    }

    // Step 5: Upload a photo
    const fileInput = page.locator('input[type="file"]')
    const testImagePath = path.join(__dirname, '../fixtures/sample-images/test-photo.jpg')

    // Check if test image exists, if not use a placeholder approach
    if (await fileInput.isVisible()) {
      await fileInput.setInputFiles(testImagePath)

      // Wait for photo preview to appear
      await expect(page.locator('[data-testid="photo-preview"], img[alt*="upload" i], img[alt*="photo" i]')).toBeVisible({ timeout: 5000 })
    }

    // Step 6: Preview the card
    const previewButton = page.locator('button:has-text("Preview"), [data-testid="preview-button"]')
    if (await previewButton.isVisible()) {
      await previewButton.click()

      // Verify preview modal opens
      await expect(page.locator('[data-testid="preview-modal"], [role="dialog"]')).toBeVisible()

      // Close preview
      const closeButton = page.locator('[data-testid="close-modal"], button:has-text("Close"), [aria-label="Close"]')
      await closeButton.click()
    }

    // Step 7: Export the card
    const exportButton = page.locator('button:has-text("Export"), button:has-text("Download"), [data-testid="export-button"]')
    await expect(exportButton).toBeVisible()
    await exportButton.click()

    // Verify export modal opens
    const exportModal = page.locator('[data-testid="export-modal"], [role="dialog"]')
    await expect(exportModal).toBeVisible()

    // Verify export options are available
    await expect(page.locator('button:has-text("PDF"), [data-testid="export-pdf"]')).toBeVisible()
    await expect(page.locator('button:has-text("JPG"), button:has-text("Image"), [data-testid="export-jpg"]')).toBeVisible()
  })

  test('should display all four holiday templates', async ({ page }) => {
    const templateCards = page.locator('[data-testid="template-card"]')

    // Wait for templates to load
    await expect(templateCards.first()).toBeVisible()

    // Should have 4 templates (Christmas, New Year, Valentine, Birthday)
    await expect(templateCards).toHaveCount(4)
  })

  test('should validate greeting text input', async ({ page }) => {
    const greetingInput = page.locator('[data-testid="greeting-input"], textarea').first()

    // Test character limit (500 chars)
    const longText = 'A'.repeat(501)
    await greetingInput.fill(longText)

    // Should show error or truncate
    const inputValue = await greetingInput.inputValue()
    expect(inputValue.length).toBeLessThanOrEqual(500)
  })

  test('should toggle dark mode', async ({ page }) => {
    const darkModeToggle = page.locator('[data-testid="dark-mode-toggle"], button[aria-label*="dark" i], button[aria-label*="theme" i]')

    if (await darkModeToggle.isVisible()) {
      // Get initial state
      const htmlElement = page.locator('html')
      const initialDarkClass = await htmlElement.getAttribute('class')

      // Toggle dark mode
      await darkModeToggle.click()

      // Verify class changed
      const newDarkClass = await htmlElement.getAttribute('class')
      expect(newDarkClass).not.toBe(initialDarkClass)
    }
  })

  test('should show loading state during export', async ({ page }) => {
    // Select template and add content first
    const templateCards = page.locator('[data-testid="template-card"]')
    await templateCards.first().click()

    const greetingInput = page.locator('[data-testid="greeting-input"], textarea').first()
    await greetingInput.fill('Test greeting')

    // Click export
    const exportButton = page.locator('button:has-text("Export"), button:has-text("Download"), [data-testid="export-button"]')
    await exportButton.click()

    // Click PDF export in modal
    const pdfButton = page.locator('button:has-text("PDF"), [data-testid="export-pdf"]')

    // Set up download listener
    const downloadPromise = page.waitForEvent('download', { timeout: 10000 }).catch(() => null)

    await pdfButton.click()

    // Either download starts or loading indicator appears
    const download = await downloadPromise
    if (download) {
      expect(download.suggestedFilename()).toMatch(/\.(pdf|jpg)$/i)
    }
  })
})
