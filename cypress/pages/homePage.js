export default class HomePage {

    searchBox = 'input[data-autocomplete_route]';
    searchButton = 'div.search-button > button.type-text';
    categoryDropDown = 'div.dropdown.search-category.show > button.btn.dropdown-toggle';
    categoryDropDownOptions = '.dropdown-menu.dropdown-menu-left.show > a';
    wishlistIcon = 'a[aria-label="Wishlist"]';
    cartIcon = '(//div[contains(@class,"cart-icon")])[1]';
    specialsLink = '//span[contains(text()," Special")])[2]';
    blogLink = '(//span[contains(text(),"Blog")])[2]';
    productsTitles = 'h4.title> a';

    

    enterSearchText(text) {
        cy.get(this.searchBox).clear().type(text);
    }

    clickOnSearchButton() {
        cy.get(this.searchButton).click();
    }
    selectCategory(category) {
        cy.get(this.categoryDropDown).click();
        cy.get(this.categoryDropDownOptions).contains(category).click();
    }
    clickOnWishlistIcon() {
        cy.get(this.wishlistIcon).click();
    }
    clickOnCartIcon() {
        cy.xpath(this.cartIcon).click();
    }
    clickOnSpecialsLink() {
        cy.xpath(this.specialsLink).click();
    }
    clickOnBlogLink() {
        cy.xpath(this.blogLink).click();
    }
    getProductsTitles() {
        return cy.get(this.productsTitles);
    }

}