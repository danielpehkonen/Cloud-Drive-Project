describe("Delete document", () => {
    it("deletes a document", () => {
        cy.login();
        cy.get('[data-cy="create-document"]').click();
        cy.visit("/");

        cy.intercept(
            "DELETE",
            "/api/document/*"
        ).as("deleteDocument")

        cy.get('[data-cy="delete-document"]').first().click();
        
        cy.wait("@deleteDocument").its("response.statusCode").should("eq", 200)
    })
})