import { endPoints } from '../../constants/endPoints';
import { testText } from '../../constants/testText';
import RegisterData from '../../factories/registerData';
import UserRegisterPage from '../../pages/auth/userRegisetrPage';
import UserLoginPage from '../../pages/auth/userLoginPage';
import { log } from '../../support/logger';

describe('User Authentication', () => {
  const registerPage = new UserRegisterPage();
  const loginPage = new UserLoginPage();
  const userData = RegisterData.getData();

  const assertDashboardSections = () => {
    cy.contains(testText.dashboard.myAccount).should('be.visible');
    cy.contains(testText.dashboard.myOrders).should('be.visible');
    cy.contains(testText.dashboard.myAffiliateAccount).should('be.visible');
  };

  it('registers a new user successfully', () => {

    log.info('Navigate to register page');
    loginPage.navigate(endPoints.register);

    log.info('Filling registration form with user data');
    registerPage.enterFirstName(userData.firstName);
    registerPage.enterLastName(userData.lastName);
    registerPage.enterEmail(userData.email);
    registerPage.enterPhone(userData.phone);
    registerPage.enterPassword(userData.password);
    registerPage.enterConfirmPassword(userData.confirmPassword);
    registerPage.clickOnAgreeCheckbox();
    registerPage.submitForm();

    cy.contains(testText.registration.successHeading).should('be.visible');

    registerPage.clickOnContinueButton();

    cy.url().should('include', testText.urls.accountDashboard);
    cy.url().should('not.include', endPoints.register);
    assertDashboardSections();
  });

    it('Verify alert message shown when user try to register without checking terms', () => {

    log.info('Navigate to register page');
    loginPage.navigate(endPoints.register);

    log.info('Filling registration form with user data');
    registerPage.enterFirstName(userData.firstName);
    registerPage.enterLastName(userData.lastName);
    registerPage.enterEmail(userData.email);
    registerPage.enterPhone(userData.phone);
    registerPage.enterPassword(userData.password);
    registerPage.enterConfirmPassword(userData.confirmPassword);
    registerPage.submitForm();

    loginPage.getAlertMessage().should('be.visible').and('contain', 'Warning');
    cy.url().should('include', endPoints.register);
  });

    it('Verify alert message shown when user try to register existing email', () => {
       cy.fixture('loginUser').then((user) => {
      const existingEmail = user.email;
      userData.email = existingEmail;
    });
    log.info('Navigate to register page');
    loginPage.navigate(endPoints.register);

    log.info('Filling registration form with user data');
    registerPage.enterFirstName(userData.firstName);
    registerPage.enterLastName(userData.lastName);
    registerPage.enterEmail(userData.email);
    registerPage.enterPhone(userData.phone);
    registerPage.enterPassword(userData.password);
    registerPage.enterConfirmPassword(userData.confirmPassword);
    registerPage.clickOnAgreeCheckbox();
    registerPage.submitForm();

    loginPage.getAlertMessage().should('be.visible').and('contain', 'Warning');
    cy.url().should('include', endPoints.register);
  });

     it('Verify alert message shown when user try to register without mandatory field', () => {
       cy.fixture('loginUser').then((user) => {
      const existingEmail = user.email;
      userData.email = existingEmail;
    });
    log.info('Navigate to register page');
    loginPage.navigate(endPoints.register);

    log.info('Filling registration form with user data');
    registerPage.enterFirstName(userData.firstName);
    registerPage.enterLastName(userData.lastName);
    registerPage.enterPhone(userData.phone);
    registerPage.enterPassword(userData.password);
    registerPage.enterConfirmPassword(userData.confirmPassword);
    registerPage.clickOnAgreeCheckbox();
    registerPage.submitForm();

   registerPage.getInvalidEmailAlert()
  .should('be.visible')
  .and('contain', 'E-Mail Address does not appear to be valid!');
    cy.url().should('include', endPoints.register);
  });
  

  it('logs in successfully with valid credentials', () => {
    cy.fixture('loginUser').then((user) => {

      loginPage.navigate(endPoints.login);

      loginPage.enterEmail(user.email);
      loginPage.enterPassword(user.password);
      loginPage.submitForm();

      cy.url().should('include', testText.urls.accountDashboard);
      assertDashboardSections();
    });
  });

  it('shows error for invalid email with valid password', () => {
  cy.fixture('loginUser').then((user) => {
    log.info('Navigate to login page');
    loginPage.navigate(endPoints.login);

    log.info('Attempt login with invalid email and valid password');
    loginPage.enterEmail(user.invalidEmail);
    loginPage.enterPassword(user.password);
    loginPage.submitForm();

    loginPage.getAlertMessage().should('be.visible').and('contain', 'Warning');
    cy.url().should('include', endPoints.login);
  });
});

it('shows error for valid email with invalid password', () => {
  cy.fixture('loginUser').then((user) => {
    log.info('Navigate to login page');
    loginPage.navigate(endPoints.login);

    log.info('Attempt login with valid email and invalid password');
    loginPage.enterEmail(user.email);
    loginPage.enterPassword(user.invalidPassword);
    loginPage.submitForm();

    loginPage.getAlertMessage().should('be.visible').and('contain', 'Warning');
    cy.url().should('include', endPoints.login);
  });
});

  it('shows error for empty email and password', () => {
    log.info('Navigate to login page');
    loginPage.navigate(endPoints.login);

    log.info('Attempt login with empty email and password');
    loginPage.submitForm();

    loginPage.getAlertMessage().should('be.visible').and('contain', 'Warning');
    cy.url().should('include', endPoints.login);
  });

});
