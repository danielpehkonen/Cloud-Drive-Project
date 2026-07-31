const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: 'kimvo8',
  allowCypressEnv: false,

  e2e: {
    baseUrl: "http://localhost:3000/"
  },
});
