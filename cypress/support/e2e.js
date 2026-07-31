// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Register test user before running tests

const testUser = {
    email: "tester@example.com",
    username: "CypressTester",
    password: "StrongTesterPassword123!"
}

before(() => {
    cy.request({
        method: "POST",
        url: "/api/user/register",
        body: testUser,
        failOnStatusCode: false
    }).then((response) => {
        // 200 = test user created
        // 403 = test user already exists
        expect(response.status).to.be.oneOf([
            200,
            403
        ])
    })
})