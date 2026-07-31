describe('Invalid registeration', () => {
  it('rejects invalid registeration', () => {
    cy.intercept(
      "POST",
      "/api/user/register"
    ).as("register");

    cy.visit("/register")

    cy.visit("/register")

    cy.get('[data-cy="register-email"]').find("input").type(`invalid-email`);
    cy.get('[data-cy="register-username"]').find("input").type(`Tester`);
    cy.get('[data-cy="register-password"]').find("input").type(`weakpassword`);
    cy.get('[data-cy="register-submit"]').click();

    cy.wait("@register").its("response.statusCode").should("eq", 400);

    cy.location("pathname").should("eq", "/register");

  })
})