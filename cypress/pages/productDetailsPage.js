export default class ProductDetailsPage {

    productTitle = 'h1.h3';
    productPrice = 'h3[data-update="price"]';
    wishListIcon = '(//i[@class="far fa-heart"])[1]';
    modelinfo = '//li/span[text()="Product Code:"]//following-sibling::span';
    stockAvailability = '//li/span[text()="Availability:"]//following-sibling::span';
    viewProductTitle = '(//h1[@class="h4"])[2]';
    viewProductPrice = '//div[@class="price"]/h3';
    addToCartButton = '(//button[@title="Add to Cart"])[2]';
    buyNowButton = 'button.btn-buynow.button-buynow';

    getProductTitle() {
        return cy.get(this.productTitle).invoke('text');
    }

    getProductPrice() {
        return cy.get(this.productPrice).invoke('text');
    }
    addToWishList() {
        cy.xpath(this.wishListIcon).click();
    }
    getModelInfo() {
        return cy.xpath(this.modelinfo).invoke('text');
    }
    getStockAvailability() {
        return cy.xpath(this.stockAvailability).invoke('text');
    }
    getViewProductTitle() {
        return cy.xpath(this.viewProductTitle).invoke('text');
    }
    getViewProductPrice() {
        return cy.xpath(this.viewProductPrice).invoke('text');
    }
    clickOnAddToCart() {
        cy.xpath(this.addToCartButton).click({force: true});
    }  
    clickOnBuyNow() {
        cy.xpath(this.buyNowButton).click();
    }   

    getProductDetails() {
        return cy.get(this.productTitle).invoke('text').then(title =>
        cy.get(this.productPrice).invoke('text').then(price =>
        cy.xpath(this.modelinfo).invoke('text').then(model =>
            cy.xpath(this.stockAvailability).invoke('text').then(stock => ({
            title: title.trim(),
            price: price.trim(),
            model: model.trim(),
            stock: stock.trim(),
            }))
        )
        )
    );
    }
}   