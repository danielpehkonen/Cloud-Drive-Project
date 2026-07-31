describe("Save a document", () => {
    it("Edits and saves document content", () => {
        cy.login();
        cy.get('[data-cy="create-document"]').click();
        cy.get('[data-cy="document-content"]').find("p").type("Edited by Cypress");
        cy.get('[data-cy="file-menu"]').click();
        cy.get('[data-cy="save-document"]').click();
        cy.contains("Document saved successfully").should("be.visible");
    })
})