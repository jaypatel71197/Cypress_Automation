export default class UserRegisterPage {

  firstNameInput = '#input-firstname';
  lastNameInput = '#input-lastname';
  emailInput = '#input-email';
  passwordInput = '#input-password';
  confirmPasswordInput = '#input-confirm';
  phoneInput = '#input-telephone';
  submitButton = 'input[type="submit"]';
  agreeCheckbox = '.custom-control.custom-checkbox.custom-control-inline';
  continueButton = 'div.buttons.mb-4 >a.btn.btn-primary';
  invalidEmailAlert = 'div > div.text-danger';

  enterFirstName(firstName) {
    cy.get(this.firstNameInput).type(firstName);
  }

  enterLastName(lastName) {
    cy.get(this.lastNameInput).type(lastName);
  }

  enterEmail(email) {
    cy.get(this.emailInput).type(email);
  }

  enterPassword(password) {
    cy.get(this.passwordInput).type(password);
  }

  enterConfirmPassword(confirmPassword) {
    cy.get(this.confirmPasswordInput).type(confirmPassword);
  }

  enterPhone(phone) {
    cy.get(this.phoneInput).type(phone);
  }

  submitForm() {
    cy.get(this.submitButton).click();
  }

  clickOnAgreeCheckbox() {
    cy.get(this.agreeCheckbox).click();
  }

  clickOnContinueButton() {
    cy.get(this.continueButton).click();
  }

  getInvalidEmailAlert() {
    return cy.get(this.invalidEmailAlert);
  }
}