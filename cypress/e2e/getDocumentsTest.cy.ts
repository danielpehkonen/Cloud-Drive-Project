describe("Document list", () => {
    it("loads user's documents", () => {
        cy.intercept(
            "GET",
            "/api/document/get"
        ).as("getDocuments");

        cy.login();
        cy.wait("@getDocuments").its("response.statusCode").should("eq", 200);
        cy.get('[role="grid"').should("be.visible");
    });
});