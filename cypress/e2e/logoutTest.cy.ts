describe("Logout", () => {
    it("logs the user out", () => {
        cy.login();

        cy.get('[data-cy="logout"').click();

        cy.window().then((window) => {
            expect(window.localStorage.getItem("token")).to.be.null;
        })

        cy.contains("LOGIN").should("be.visible");
    })
})