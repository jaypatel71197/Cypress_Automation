export default class AddToCartPage {
    productTitle = 'td> a[title]';
    productPrice = '//table[@class="table"]//td[@class="text-center"]/following-sibling::td';
    subTotalPrice = '//td[text()=\'Sub-Total:\']//following-sibling::td/strong';
    ecoTexPrice = '//td[contains(text(),"Eco Tax")]//following-sibling::td/strong';
    vatTextPrice = '//td[contains(text(),"VAT")]//following-sibling::td/strong';
    totalPrice = '//td[text()=\'Total:\']//following-sibling::td/strong';
    checkoutButton = '//a[contains(@href, "checkout/checkout")]';
    editCartButton = '//a[contains(@href, "checkout/cart")]';

    getProductTitle(attributeName = 'data-original-title') {
        return cy.get(this.productTitle).invoke('attr', attributeName);
    }

    getProductPrice() {
        return cy.xpath(this.productPrice).invoke('text');            
    }

    getTotalPrice() {
        return cy.xpath(this.totalPrice).invoke('text');
    }

    getSubTotalPrice() {
        return cy.xpath(this.subTotalPrice).invoke('text');
    }

    getEcoTexPrice() {
        return cy.xpath(this.ecoTexPrice).invoke('text');
    }
    getVatTextPrice() {
        return cy.xpath(this.vatTextPrice).invoke('text');
    }
    clickOnCheckoutButton() {
        cy.xpath(this.checkoutButton).click();
    }

    clickOnEditCartButton() {
        cy.xpath(this.editCartButton).click();
    }

    getCartProductData() {
        return cy.get(this.productTitle, { timeout: 10000 })
            .should('exist')
            .then($titleEl => {
                const attrTitle = $titleEl.attr('data-original-title') || $titleEl.attr('title');
                const titleText = attrTitle && attrTitle.trim().length ? attrTitle : $titleEl.text();
                const title = titleText.trim();

                return cy.xpath(this.productPrice).invoke('text').then(price =>
                    cy.xpath(this.totalPrice).invoke('text').then(total =>
                        ({
                            title,
                            price,
                            total
                        })
                    )
                );
            });
    }
}
