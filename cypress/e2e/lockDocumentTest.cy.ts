describe("Document lock", () => {
    it("locks the document", () => {
        cy.intercept(
            "PATCH",
            "/api/document/*/lock"
        ).as("lockDocument");

        cy.login();
        cy.get('[data-cy="create-document"]').click();
        cy.wait("@lockDocument").its("response.statusCode").should("eq", 200);
    })
})