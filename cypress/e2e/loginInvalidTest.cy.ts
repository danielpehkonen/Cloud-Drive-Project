describe('Invalid login', () => {
    it('rejects invalid password ', () => {
        cy.intercept(
            "POST",
            "/api/user/login"
        ).as("login");

        cy.visit("/login");

        cy.get('[data-cy="login-email"]').find("input").type("tester@example.com");
        cy.get('[data-cy="login-password"]').find("input").type("WrongPassword123!");
        cy.get('[data-cy="login-submit"]').click();

        cy.wait("@login").its("response.statusCode").should("eq", 401);

        cy.location("pathname").should("eq", "/login");

    });
})