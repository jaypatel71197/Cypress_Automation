export default class UserLoginPage {

  emailInput = '#input-email';
  passwordInput = '#input-password';
  loginButton = 'input[type="submit"]'; 
  alertMessage = '.alert.alert-danger.alert-dismissible';

  enterEmail(email) {
    cy.get(this.emailInput).type(email);
  }
  enterPassword(password) {
    cy.get(this.passwordInput).type(password);
  }
  submitForm() {
    cy.get(this.loginButton).click();       
  }

  login(email, password) {
    this.enterEmail(email);
    this.enterPassword(password);
    this.submitForm();
  }

  navigate(url) {
  cy.visit(url);
}

  getAlertMessage() {
    return cy.get(this.alertMessage);
  }

}