Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
});



describe('Week Menu', () => {
    beforeEach(()=>{
        cy.visit('http://localhost:5000/login')
        cy.get('[data-cy=input-email]').type('test@test.com')
        cy.get('[data-cy=input-password]').type('123456789')
        cy.get('[data-cy=button-login]').click()
        cy.wait(500);
    })

    it('Should route to specific week menu', () => {
        cy.get('[data-cy=weekMenu]').click()
        cy.wait(500);
        cy.get('[data-cy=randomMenu]').click()
        cy.wait(500);
        cy.url().should('include', '/specificMenu')
    })
})