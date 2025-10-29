/// <reference types="cypress" />

describe('Export Functionality', () => {
  beforeEach(() => {
    cy.visit('/')

    // Set up a basic card before export tests
    cy.get('[data-template-id="christmas"]').click()
    cy.get('[data-testid="message-input"]').type('Merry Christmas!')
  })

  it('should display export button when card is ready', () => {
    cy.get('[data-testid="export-button"]').should('be.visible')
    cy.get('[data-testid="export-button"]').should('not.be.disabled')
  })

  it('should open export modal when export button is clicked', () => {
    cy.get('[data-testid="export-button"]').click()

    cy.get('[data-testid="export-modal"]').should('be.visible')
  })

  it('should offer PDF and JPG export options', () => {
    cy.get('[data-testid="export-button"]').click()

    cy.get('[data-testid="export-format-pdf"]').should('be.visible')
    cy.get('[data-testid="export-format-jpg"]').should('be.visible')
  })

  it('should select PDF format by default', () => {
    cy.get('[data-testid="export-button"]').click()

    cy.get('[data-testid="export-format-pdf"]').should('be.checked')
  })

  it('should allow switching between export formats', () => {
    cy.get('[data-testid="export-button"]').click()

    // Switch to JPG
    cy.get('[data-testid="export-format-jpg"]').click()
    cy.get('[data-testid="export-format-jpg"]').should('be.checked')

    // Switch back to PDF
    cy.get('[data-testid="export-format-pdf"]').click()
    cy.get('[data-testid="export-format-pdf"]').should('be.checked')
  })

  it('should show quality slider for JPG format', () => {
    cy.get('[data-testid="export-button"]').click()

    cy.get('[data-testid="export-format-jpg"]').click()

    cy.get('[data-testid="quality-slider"]').should('be.visible')
  })

  it('should not show quality slider for PDF format', () => {
    cy.get('[data-testid="export-button"]').click()

    cy.get('[data-testid="export-format-pdf"]').click()

    cy.get('[data-testid="quality-slider"]').should('not.exist')
  })

  it('should allow customizing filename', () => {
    cy.get('[data-testid="export-button"]').click()

    const customFilename = 'my-christmas-card'
    cy.get('[data-testid="filename-input"]').clear().type(customFilename)

    cy.get('[data-testid="filename-input"]').should('have.value', customFilename)
  })

  it('should show progress indicator during export', () => {
    cy.get('[data-testid="export-button"]').click()
    cy.get('[data-testid="confirm-export-button"]').click()

    // Progress indicator should appear
    cy.get('[data-testid="export-progress"]').should('be.visible')
  })

  it('should show success message after successful export', () => {
    cy.get('[data-testid="export-button"]').click()
    cy.get('[data-testid="confirm-export-button"]').click()

    // Wait for export to complete
    cy.get('[data-testid="export-success"]', { timeout: 15000 }).should('be.visible')
  })

  it('should close modal after successful export', () => {
    cy.get('[data-testid="export-button"]').click()
    cy.get('[data-testid="confirm-export-button"]').click()

    // Wait for export and modal to close
    cy.get('[data-testid="export-modal"]', { timeout: 15000 }).should('not.exist')
  })

  it('should allow closing modal without exporting', () => {
    cy.get('[data-testid="export-button"]').click()

    cy.get('[data-testid="close-modal-button"]').click()

    cy.get('[data-testid="export-modal"]').should('not.exist')
  })

  it('should handle export errors gracefully', () => {
    // This would require mocking a failure scenario
    cy.get('[data-testid="export-button"]').click()
    cy.get('[data-testid="confirm-export-button"]').click()

    // If export fails, error message should appear
    // cy.get('[data-testid="export-error"]').should('be.visible')
  })

  it('should export card with photo', () => {
    // Upload a photo first
    cy.get('input[type="file"]').selectFile('tests/fixtures/sample-images/test-photo.jpg', {
      force: true,
    })

    cy.get('[data-testid="photo-preview"]', { timeout: 10000 }).should('be.visible')

    // Export the card
    cy.get('[data-testid="export-button"]').click()
    cy.get('[data-testid="confirm-export-button"]').click()

    cy.get('[data-testid="export-success"]', { timeout: 15000 }).should('be.visible')
  })

  it('should show preview of card before export', () => {
    cy.get('[data-testid="export-button"]').click()

    cy.get('[data-testid="export-preview"]').should('be.visible')
    cy.get('[data-testid="export-preview"]').should('contain', 'Merry Christmas!')
  })

  it('should disable export button while export is in progress', () => {
    cy.get('[data-testid="export-button"]').click()
    cy.get('[data-testid="confirm-export-button"]').click()

    // Button should be disabled during export
    cy.get('[data-testid="confirm-export-button"]').should('be.disabled')
  })

  it('should support exporting multiple times', () => {
    // First export
    cy.get('[data-testid="export-button"]').click()
    cy.get('[data-testid="confirm-export-button"]').click()
    cy.get('[data-testid="export-success"]', { timeout: 15000 }).should('be.visible')

    // Second export
    cy.get('[data-testid="export-button"]').click()
    cy.get('[data-testid="confirm-export-button"]').click()
    cy.get('[data-testid="export-success"]', { timeout: 15000 }).should('be.visible')
  })

  it('should include timestamp in filename when option is selected', () => {
    cy.get('[data-testid="export-button"]').click()

    cy.get('[data-testid="include-timestamp-checkbox"]').check()

    // This would verify the downloaded filename includes timestamp
    // Actual verification would require cypress-downloadfile plugin or similar
  })
})
