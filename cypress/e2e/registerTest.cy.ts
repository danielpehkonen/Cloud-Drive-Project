describe('Registeration', () => {
  it('registers a new user', () => {
    const unique = Date.now();

    cy.visit("/register")

    cy.get('[data-cy="register-email"]').find("input").type(`tester-${unique}@example.com`);
    cy.get('[data-cy="register-username"]').find("input").type(`Tester#${unique}`);
    cy.get('[data-cy="register-password"]').find("input").type(`TesterPassword123!`);
    cy.get('[data-cy="register-submit"]').click();

    cy.location("pathname").should("eq", "/login");


  });
})