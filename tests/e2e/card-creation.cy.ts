describe('Card Creation Flow', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should load the application successfully', () => {
    cy.get('body').should('be.visible')
    cy.contains('Greeting Card Maker').should('be.visible')
  })

  it('should display all holiday templates', () => {
    cy.get('[data-template-id]').should('have.length.at.least', 4)
    cy.contains('Christmas').should('be.visible')
    cy.contains('New Year').should('be.visible')
    cy.contains('Valentine').should('be.visible')
    cy.contains('Birthday').should('be.visible')
  })

  it('should select a template', () => {
    cy.get('[data-template-id="valentine"]').click()
    cy.get('[data-template-id="valentine"]').should('have.class', 'selected')
  })

  it('should allow entering a greeting message', () => {
    const message = 'Happy Valentine\'s Day! Love you!'
    cy.get('[data-testid="message-input"]').type(message)
    cy.get('[data-testid="message-input"]').should('have.value', message)
  })

  it('should display live preview of the card', () => {
    // Select template
    cy.get('[data-template-id="christmas"]').click()

    // Enter message
    const message = 'Merry Christmas!'
    cy.get('[data-testid="message-input"]').type(message)

    // Check preview contains the message
    cy.get('[data-testid="card-preview"]').should('contain', message)
  })

  it('should complete full card creation flow', () => {
    // Step 1: Select template
    cy.get('[data-template-id="birthday"]').click()

    // Step 2: Enter recipient name
    cy.get('[data-testid="recipient-name-input"]').type('Sarah')

    // Step 3: Enter message
    cy.get('[data-testid="message-input"]').type('Happy Birthday! Have a wonderful year ahead!')

    // Step 4: Verify preview
    cy.get('[data-testid="card-preview"]').should('contain', 'Sarah')
    cy.get('[data-testid="card-preview"]').should('contain', 'Happy Birthday')

    // Step 5: Verify export button is enabled
    cy.get('[data-testid="export-button"]').should('not.be.disabled')
  })

  it('should validate required fields', () => {
    // Try to export without message
    cy.get('[data-testid="export-button"]').should('be.disabled')

    // Add message
    cy.get('[data-testid="message-input"]').type('Test message')

    // Export button should now be enabled
    cy.get('[data-testid="export-button"]').should('not.be.disabled')
  })

  it('should show character count for message', () => {
    const message = 'Test message'
    cy.get('[data-testid="message-input"]').type(message)
    cy.get('[data-testid="character-count"]').should('contain', message.length.toString())
  })

  it('should respect maximum character limit', () => {
    const longMessage = 'a'.repeat(600) // Exceeds typical 500 char limit
    cy.get('[data-testid="message-input"]').type(longMessage)
    cy.get('[data-testid="error-message"]').should('be.visible')
    cy.get('[data-testid="error-message"]').should('contain', 'too long')
  })

  it('should switch between templates without losing message', () => {
    const message = 'My special message'

    // Enter message with Christmas template
    cy.get('[data-template-id="christmas"]').click()
    cy.get('[data-testid="message-input"]').type(message)

    // Switch to Valentine template
    cy.get('[data-template-id="valentine"]').click()

    // Message should still be there
    cy.get('[data-testid="message-input"]').should('have.value', message)
  })

  it('should reset form when reset button is clicked', () => {
    // Fill in the form
    cy.get('[data-template-id="birthday"]').click()
    cy.get('[data-testid="recipient-name-input"]').type('John')
    cy.get('[data-testid="message-input"]').type('Happy Birthday!')

    // Click reset
    cy.get('[data-testid="reset-button"]').click()

    // Form should be cleared
    cy.get('[data-testid="recipient-name-input"]').should('have.value', '')
    cy.get('[data-testid="message-input"]').should('have.value', '')
  })
})
