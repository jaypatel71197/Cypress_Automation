const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://ecommerce-playground.lambdatest.io/index.php?route=account',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
