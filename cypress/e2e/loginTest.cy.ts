describe('login', () => {
    it('logs in', () => {
        cy.login();

        cy.get('[data-cy="logout"]').should("be.visible")
    });
})