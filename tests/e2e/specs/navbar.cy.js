Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
});



describe('navbar', () => {
    beforeEach(()=>{
        cy.visit('http://localhost:5000/login')
        cy.get('[data-cy=input-email]').type('test@test.com')
        cy.get('[data-cy=input-password]').type('123456789')
        cy.get('[data-cy=button-login]').click()
        cy.wait(500);
    })

    it('Should navigate to recipe when clicking recipes', () => {
        cy.get('[data-cy=recipes]').click()
        cy.url().should('include', '/recipes')
    })

    it('Should navigate to week meny when clicking week menu', () => {
        cy.get('[data-cy=weekMenu]').click()
        cy.url().should('include', '/weekMenu')
    })

    it('Should navigate to shopping cart when clicking shopping cart', () => {
        cy.get('[data-cy=shoppingCart]').click()
        cy.url().should('include', '/shoppinglist')
    })

    it('Should navigate to fridge when clicking fridge', () => {
        cy.get('[data-cy=inventory]').click()
        cy.url().should('include', '/fridge')
    })

    it('Should navigate to edit profile when clicking profile', () => {
        cy.get('[data-cy=profile]').click()
        cy.url().should('include', '/profile')
    })
})