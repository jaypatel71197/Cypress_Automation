export const log = {
  info: (message) => {
    Cypress.log({ name: 'info', message });
  }
};