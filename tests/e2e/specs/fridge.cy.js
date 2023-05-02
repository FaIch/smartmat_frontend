describe('Fridge', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5000/login')
    cy.get('[data-cy=input-email]').type('test@test.com')
    cy.get('[data-cy=input-password]').type('123456789')
    cy.get('[data-cy=button-login]').click()
    cy.wait(500)
  })

  it('Should be able to add an item and find it', () => {
    cy.get('[data-cy=allFridge]').click()
    cy.wait(500)
    cy.get('.grid-item').first().click()
    cy.get('[data-cy=addFridge]').click()
    cy.wait(1000)
    cy.get('.item-cards').first().click()
  })

  it('Should be able to edit the item', () => {
    cy.get('#edit-button').click()
    cy.get('#quantity').clear().type(1000)
    cy.get('#save-button').click()
  })

  it('Should find an expired item', () => {
    cy.get('#edit-button').click().wait(500)
    cy.get('#expiration-date').type('2023-05-01')
    cy.get('#save-button').click()
    cy.get('[data-cy=expired]').click()
    cy.wait(500)
    cy.get('.item-cards').first().click()
  })

  it('Should be able to remove expired item', () => {
    cy.get('[data-cy=expired]').click()
    cy.wait(500)
    cy.get('.item-cards').first().click()
    cy.get('.add-button').click()
  })
})
