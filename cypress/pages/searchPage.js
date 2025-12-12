

export default class SearchPage {

    addToCartIcon = 'div > button> i.fas.fa-shopping-cart';
    quickViewIcon = "button[title='Quick view']";
    productTitle = 'h4>a';
    productPrice = 'div[class="caption"] > div > span';
    productList = 'div.carousel-item.active';
    inStockLabel = '(//label[text()="In stock"])[2]';



clickOnInStockLabel() {
    cy.xpath(this.inStockLabel).click({ force: true });
}
hoverAndClickOnAddToCartButton() {
  return cy.get(this.productList).then($products => {
    const count = $products.length;
    const randomIndex = Math.floor(Math.random() * count);
    const randomProduct = $products.eq(randomIndex);

    cy.wrap(randomProduct).realHover();

    return cy.get(this.productTitle).eq(randomIndex).invoke('text').then(title => {
      return cy.get(this.productPrice).eq(randomIndex).invoke('text').then(price => {
        cy.get(this.addToCartIcon).eq(randomIndex).click({ force: true });

        return cy.wrap({
          title: title.trim(),
          price: price.trim()
        });
      });
    });
  });
}

clickOnQuickView() {
  return cy.get(this.productList).then($products => {
    const count = $products.length;
    const randomIndex = Math.floor(Math.random() * count);
    const randomProduct = $products.eq(randomIndex);

    cy.wrap(randomProduct).realHover();

    return cy.get(this.productTitle).eq(randomIndex).invoke('text').then(title => {
      return cy.get(this.productPrice).eq(randomIndex).invoke('text').then(price => {
        cy.get(this.quickViewIcon).eq(randomIndex).click({ force: true });

        return cy.wrap({
          title: title.trim(),
          price: price.trim()
        });
      });
    });
  });
}

clickOnProduct() {
  return cy.get(this.productList).then($products => {
    const count = $products.length;

    if (!count) {
      throw new Error('No products found in the search results');
    }

    const randomIndex = Math.floor(Math.random() * count);

    return cy.get(this.productTitle).eq(randomIndex).invoke('text').then(title => {
      return cy.get(this.productPrice).eq(randomIndex).invoke('text').then(price => {
        cy.get(this.productTitle).eq(randomIndex).click();

        return cy.wrap({
          title: title.trim(),
          price: price.trim()
        });
      });
    });
  });
}

}