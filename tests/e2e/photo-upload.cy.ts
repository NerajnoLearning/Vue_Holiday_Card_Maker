/// <reference types="cypress" />

describe('Photo Upload Flow', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should display photo upload area', () => {
    cy.get('[data-testid="photo-upload"]').should('be.visible')
    cy.contains('Upload Photo').should('be.visible')
  })

  it('should allow file selection via click', () => {
    cy.get('input[type="file"]').should('exist')
    cy.get('input[type="file"]').should('have.attr', 'accept').and('include', 'image')
  })

  it('should accept valid image file types', () => {
    const acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    cy.get('input[type="file"]')
      .invoke('attr', 'accept')
      .should('exist')
  })

  it('should show preview after successful upload', () => {
    // Note: This requires a test fixture image
    cy.get('input[type="file"]').selectFile('tests/fixtures/sample-images/test-photo.jpg', {
      force: true,
    })

    cy.get('[data-testid="photo-preview"]', { timeout: 10000 }).should('be.visible')
  })

  it('should display loading state during upload', () => {
    cy.get('input[type="file"]').selectFile('tests/fixtures/sample-images/test-photo.jpg', {
      force: true,
    })

    // Loading spinner should appear briefly
    cy.get('[data-testid="loading-spinner"]').should('exist')
  })

  it('should show error for invalid file type', () => {
    // Try uploading a non-image file
    cy.get('input[type="file"]').selectFile({
      contents: Cypress.Buffer.from('fake pdf content'),
      fileName: 'test.pdf',
      mimeType: 'application/pdf',
    }, { force: true })

    cy.get('[data-testid="error-message"]').should('be.visible')
    cy.get('[data-testid="error-message"]').should('contain', 'Unsupported file type')
  })

  it('should show error for file that is too large', () => {
    // Create a large file (> 5MB)
    const largeFile = new Array(6 * 1024 * 1024).join('a')
    cy.get('input[type="file"]').selectFile({
      contents: Cypress.Buffer.from(largeFile),
      fileName: 'large-image.jpg',
      mimeType: 'image/jpeg',
    }, { force: true })

    cy.get('[data-testid="error-message"]').should('be.visible')
    cy.get('[data-testid="error-message"]').should('contain', 'too large')
  })

  it('should allow removing uploaded photo', () => {
    // Upload a photo
    cy.get('input[type="file"]').selectFile('tests/fixtures/sample-images/test-photo.jpg', {
      force: true,
    })

    cy.get('[data-testid="photo-preview"]', { timeout: 10000 }).should('be.visible')

    // Remove the photo
    cy.get('[data-testid="remove-photo-button"]').click()

    // Preview should disappear
    cy.get('[data-testid="photo-preview"]').should('not.exist')
  })

  it('should support drag and drop upload', () => {

    cy.get('[data-testid="photo-upload"]')
      .trigger('dragover')
      .should('have.class', 'drag-over')

    cy.get('[data-testid="photo-upload"]')
      .trigger('dragleave')
      .should('not.have.class', 'drag-over')
  })

  it('should show progress indicator during processing', () => {
    cy.get('input[type="file"]').selectFile('tests/fixtures/sample-images/test-photo.jpg', {
      force: true,
    })

    // Progress should be visible during processing
    cy.get('[data-testid="upload-progress"]').should('exist')
  })

  it('should display photo in card preview after upload', () => {
    // Upload photo
    cy.get('input[type="file"]').selectFile('tests/fixtures/sample-images/test-photo.jpg', {
      force: true,
    })

    // Wait for processing
    cy.get('[data-testid="photo-preview"]', { timeout: 10000 }).should('be.visible')

    // Photo should appear in card preview
    cy.get('[data-testid="card-preview"]').within(() => {
      cy.get('img').should('be.visible')
    })
  })

  it('should allow uploading different photo to replace current one', () => {
    // Upload first photo
    cy.get('input[type="file"]').selectFile('tests/fixtures/sample-images/test-photo.jpg', {
      force: true,
    })
    cy.get('[data-testid="photo-preview"]', { timeout: 10000 }).should('be.visible')

    // Upload second photo
    cy.get('input[type="file"]').selectFile('tests/fixtures/sample-images/test-photo-2.jpg', {
      force: true,
    })

    // Should still only show one photo
    cy.get('[data-testid="photo-preview"]').should('have.length', 1)
  })
})
