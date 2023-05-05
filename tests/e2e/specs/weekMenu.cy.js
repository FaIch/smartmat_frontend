describe('Week Menu', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5000/login')
    cy.get('[data-cy=input-email]').type('test@test.com')
    cy.get('[data-cy=input-password]').type('123456789')
    cy.get('[data-cy=button-login]').click()
    cy.wait(500)
  })

  it('Should route to week menu', () => {
    cy.get('[data-cy=weekMenu]').click()
    cy.wait(500)
    cy.url().should('include', '/weekMenu')
  })
})
