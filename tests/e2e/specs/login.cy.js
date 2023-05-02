describe('login', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5000/login')
  })

  it('Should switch between login and sign up forms', () => {
    cy.get('[data-cy=signup-form-comp]').should('not.be.visible')
    cy.get('[data-cy=switch-to-signup]').click()

    cy.get('[data-cy=login-form-comp]').should('not.be.visible')
    cy.get('[data-cy=signup-form-comp]').should('be.visible')

    cy.get('[data-cy=switch-to-login]').click()
    cy.get('[data-cy=login-form-comp]').should('be.visible')
  })

  it('Should be able to login with created user', () => {
    cy.get('[data-cy=input-email]').type('test@test.com')
    cy.get('[data-cy=input-password]').type('123456789')
    cy.get('[data-cy=button-login]').click()
    cy.url().should('include', '/fridge')
  })
})
