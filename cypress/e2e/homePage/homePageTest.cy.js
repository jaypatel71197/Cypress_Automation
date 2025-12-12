import { endPoints } from '../../constants/endPoints';
import { testText } from '../../constants/testText';
import UserLoginPage from '../../pages/auth/userLoginPage';
import HomePage from '../../pages/homePage';
import { log } from '../../support/logger';
import SearchPage from '../../pages/searchPage';
import AddToCartPage from '../../pages/topHeaders/addTocartPage';
import ProductDetailsPage from '../../pages/productDetailsPage';
import WishlistPage from '../../pages/topHeaders/wishListPage';

describe('Home Page Validations', () => {

  it('Verify search functionality with multiple scenarios', () => {
    cy.fixture('loginUser').then((user) => {
      cy.fixture('searchScenarios').then((scenarios) => {
    
        const loginPage = new UserLoginPage();
        const homePage = new HomePage();

        loginPage.navigate(endPoints.login);
        loginPage.login(user.email, user.password);
        cy.url().should('include', testText.urls.accountDashboard);

        scenarios.forEach(({ searchTerm, expected }) => {
          homePage.enterSearchText(searchTerm);
          homePage.clickOnSearchButton();
          cy.contains(`Search - ${searchTerm}`).should('be.visible');

          homePage.getProductsTitles().each(($el) => {
            const text = $el.text().toLowerCase();
            expect(expected.some(keyword => text.includes(keyword))).to.be.true;
          });

        });
      });
    });
  });

it('Verify add to cart from search results and price assertion', () => {
    const homePage = new HomePage();
    const searchPage = new SearchPage();
    const addToCartPage = new AddToCartPage();
    const loginPage = new UserLoginPage();

    log.info('Navigate to home page');
    loginPage.navigate(endPoints.home);

    log.info('Search item and click on add to cart');
    homePage.enterSearchText('samsung');
    homePage.clickOnSearchButton();

    log.info('Get product details and add to cart');
    searchPage.hoverAndClickOnAddToCartButton().then(searchProduct => {
      homePage.clickOnCartIcon();
      log.info('Validate product title and price in cart');
      addToCartPage.getCartProductData().then(cartData => {
        const searchTitle = searchProduct.title;
        const cartTitle = cartData.title;
        const searchPrice = searchProduct.price;
        const cartPrice = cartData.price;
        const totalPrice = cartData.total;
        expect(searchTitle).to.equal(cartTitle);
        expect(searchPrice).to.equal(cartPrice);
        expect(searchPrice).to.equal(totalPrice);
      });
    });
  });

it('Verify product details page title and price match search result', () => {
    const homePage = new HomePage();
    const searchPage = new SearchPage();
    const productDetailsPage = new ProductDetailsPage();
    const loginPage = new UserLoginPage();

    log.info('Navigate to home page');
    loginPage.navigate(endPoints.home);

    log.info('Search item');
    homePage.enterSearchText('samsung');
    homePage.clickOnSearchButton();

    log.info('Select a random product from search results and validate details page');
    searchPage.clickOnProduct().then(product => {
      productDetailsPage.getProductTitle().then(detailsTitle => {
        productDetailsPage.getProductPrice().then(detailsPrice => {
          expect(product.title).to.equal(detailsTitle.trim());
          expect(product.price).to.equal(detailsPrice.trim());
        });
      });
    });
  });

it('Verify selected product appears in the wishlist after adding from product details page', () => {
  cy.fixture('loginUser').then(user => {
    const loginPage = new UserLoginPage();
    const homePage = new HomePage();
    const searchPage = new SearchPage();
    const productDetailsPage = new ProductDetailsPage();
    const wishlistPage = new WishlistPage();

    cy.visit(endPoints.login);
    loginPage.login(user.email, user.password);

    homePage.enterSearchText('samsung');
    homePage.clickOnSearchButton();

    searchPage.clickOnProduct().then(searchProduct => {
      productDetailsPage.getProductDetails().then(details => {
        expect(details.title).to.equal(searchProduct.title);
        expect(details.price).to.equal(searchProduct.price);

        productDetailsPage.addToWishList();
        homePage.clickOnWishlistIcon();

        wishlistPage.getWishlistItems().then(items => {
          const matchedItem = items.find(item =>
            item.productName.includes(details.title) &&
            item.unitPrice.includes(details.price) &&
            item.model.includes(details.model) &&
            item.stock.includes(details.stock)
          );

          expect(matchedItem, 'wishlist entry for selected product with all details').to.not.be.undefined;
          expect(matchedItem.productName).to.include(details.title);
          expect(matchedItem.unitPrice).to.include(details.price);
          expect(matchedItem.model).to.include(details.model);
          expect(matchedItem.stock).to.include(details.stock);

          wishlistPage.removeItemByProductName(details.title, { unitPrice: details.price }).then(() => {
            wishlistPage.getWishlistItems().then(updatedItems => {
              const stillPresent = updatedItems.some(item =>
                item.productName.includes(details.title)
              );
              expect(stillPresent, 'product should be removed from wishlist').to.be.false;
              if (!updatedItems.length) {
                cy.get(wishlistPage.wishlistTable).should('not.exist');
              }
            });
          });
        });
      });
    });
  });
});


it('Verify quick view from search results', () => {
    const homePage = new HomePage();
    const searchPage = new SearchPage();
    const productDetailsPage = new ProductDetailsPage();
    const loginPage = new UserLoginPage();

    log.info('Navigate to home page');
    loginPage.navigate(endPoints.home);

    log.info('Search item and click on quick view');
    homePage.enterSearchText('samsung');
    homePage.clickOnSearchButton();

    log.info('Get product details and open quick view');
    searchPage.clickOnQuickView().then(searchProduct => {

      productDetailsPage.getViewProductTitle().then(viewTitle => {
        productDetailsPage.getViewProductPrice().then(viewPrice => {
          expect(searchProduct.title).to.equal(viewTitle.trim());
          expect(searchProduct.price).to.equal(viewPrice.trim());
        });
      });
    });
});

});
