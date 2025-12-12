import { endPoints } from '../../constants/endPoints';
import { testText } from '../../constants/testText';
import UserLoginPage from '../../pages/auth/userLoginPage';
import HomePage from '../../pages/homePage';
import { log } from '../../support/logger';
import SearchPage from '../../pages/searchPage';
import AddToCartPage from '../../pages/topHeaders/addTocartPage';
import ProductDetailsPage from '../../pages/productDetailsPage';
import CheckoutPage from '../../pages/checkOutPage';
import AddressDataFactory from '../../factories/addressData';
import ConfirmOrderPage from '../../pages/confirmOrderPage';


describe('Purchase Products Test Suite', () => {
it('Verify product name and price in checkout page', () => {
    cy.fixture('loginUser').then((user) => {
        const loginPage = new UserLoginPage();
        const homePage = new HomePage();
        const searchPage = new SearchPage();
        const productDetailsPage = new ProductDetailsPage();
        const addToCartPage = new AddToCartPage();
        const checkoutPage = new CheckoutPage();
        const addressData = AddressDataFactory.getData();
        const confirmOrderPage = new ConfirmOrderPage();

        log.info('Navigate to login page');
        loginPage.navigate(endPoints.login);
        log.info('Perform login');
        loginPage.login(user.email, user.password);

        log.info('Search item');
        homePage.enterSearchText('samsung');
        homePage.clickOnSearchButton();
        cy.wait(1000);
        searchPage.clickOnInStockLabel();
        cy.wait(3000);

        log.info('Select a random product from search results');
        searchPage.clickOnProduct().then(() => {
            log.info('Get product details');
            productDetailsPage.getProductDetails().then(details => {
                const normalizedTitle = details.title.replace(/\s+/g, ' ').trim().toLowerCase();

                log.info('Add product to cart');
                productDetailsPage.clickOnAddToCart();

                log.info('Click on cart icon from header');
                homePage.clickOnCartIcon();

                log.info('Click on checkout button');
                cy.wait(10000);
                addToCartPage.clickOnCheckoutButton();
                cy.wait(1000);

                log.info('Get product details from checkout page');
                checkoutPage.getCheckoutProducts().then(items => {
                    const checkoutProduct = items.find(item => {
                        if (!item.productName) {
                            return false;
                        }
                        const itemTitle = item.productName.replace(/\s+/g, ' ').trim().toLowerCase();
                        return itemTitle.includes(normalizedTitle);
                    });

                    expect(checkoutProduct, 'Product should exist in checkout').to.not.be.undefined;
                    expect(checkoutProduct.productName).to.include(details.title);
                    expect(checkoutProduct.unitPrice).to.include(details.price);

                    checkoutPage.clickOnAddNewAddress();

                    checkoutPage.fillAddressForm(addressData);

                    checkoutPage.agreeToTerms();

                    checkoutPage.clickOnContinueButton();

                    confirmOrderPage.getConfirmOrderSummary().then(({ products, summary }) => {
                        const confirmProduct = products.find(item => {
                            if (!item.productName) {
                                return false;
                            }
                            const itemTitle = item.productName.replace(/\s+/g, ' ').trim().toLowerCase();
                            return itemTitle.includes(normalizedTitle);
                        });

                        expect(confirmProduct, 'Product should exist in confirm order').to.not.be.undefined;
                        expect(confirmProduct.productName).to.include(details.title);
                        expect(confirmProduct.unitPrice).to.include(details.price);

                        const totalRows = summary.filter(row => row.label.toLowerCase().includes('total'));
                        expect(totalRows.length, 'Should have at least one total row').to.be.greaterThan(0);
                        const totalRow = totalRows[totalRows.length - 1];

                        const expectedTotal = products.reduce((sum, item) => sum + item.totalPriceValue, 0);

                        const shippingRow = summary.find(row => row.label.toLowerCase().includes('shipping'));
                        const shippingFee = shippingRow ? shippingRow.valueNumber : 0;
                        const expectedGrandTotal = expectedTotal + shippingFee;

                        expect(Number(totalRow.value.replace(/[^0-9.-]/g, '')), 'Total price should match expected').to.equal(expectedGrandTotal);
                    });
                });
            });
        });
    });
    });
});