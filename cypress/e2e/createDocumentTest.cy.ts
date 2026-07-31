describe("Create document", () => {
    it("creates a document", () => {
        cy.login();
        cy.get('[data-cy="create-document"]').click();
        cy.location("pathname").should("match", /^\/document\/.+/);
    })
})