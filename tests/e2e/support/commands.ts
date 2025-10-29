/// <reference types="cypress" />

// ***********************************************
// Custom commands for Cypress E2E tests
// ***********************************************

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Select a holiday template by ID
       * @example cy.selectTemplate('christmas')
       */
      selectTemplate(templateId: string): Chainable<void>

      /**
       * Upload a photo file
       * @example cy.uploadPhoto('sample-image.jpg')
       */
      uploadPhoto(fileName: string): Chainable<void>

      /**
       * Fill in the greeting card form
       * @example cy.fillGreetingForm({ recipientName: 'John', message: 'Happy Birthday!' })
       */
      fillGreetingForm(data: { recipientName?: string; message?: string }): Chainable<void>
    }
  }
}

Cypress.Commands.add('selectTemplate', (templateId: string) => {
  cy.get(`[data-template-id="${templateId}"]`).click()
})

Cypress.Commands.add('uploadPhoto', (fileName: string) => {
  cy.get('input[type="file"]').selectFile(`tests/fixtures/sample-images/${fileName}`, {
    force: true,
  })
})

Cypress.Commands.add('fillGreetingForm', (data: { recipientName?: string; message?: string }) => {
  if (data.recipientName) {
    cy.get('[data-testid="recipient-name-input"]').clear().type(data.recipientName)
  }
  if (data.message) {
    cy.get('[data-testid="message-input"]').clear().type(data.message)
  }
})

export {}
