describe('Week Menu', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5000/login')
    cy.get('[data-cy=input-email]').type('test@test.com')
    cy.get('[data-cy=input-password]').type('123456789')
    cy.get('[data-cy=button-login]').click()
    cy.wait(1000)
    cy.get('[data-cy=shoppingCart]').click()
    cy.wait(500)
  })

  it('Should be able to add an item to shopping list', () => {
    cy.get('[data-cy=allProducts]').click()
    cy.wait(500)
    cy.get('.grid-item').first().click()
    cy.get('[data-cy=addShopping]').click()
    cy.wait(500)
    cy.get('.item-cards').first().click()
  })

  it('Should be able to send shopping list item to fridge', () => {
    cy.get('.item-cards').first().click()
    cy.get('.add-button').click()
    cy.wait(500)
    cy.get('[data-cy=inventory]').click()
    cy.wait(1000)
    cy.get('.item-cards').first().click()
  })
})
