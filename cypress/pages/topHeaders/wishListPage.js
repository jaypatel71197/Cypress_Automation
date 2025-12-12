export default class WishlistPage {
	wishlistTable = 'table.table-hover.border';
	tableHeaderCells = `${this.wishlistTable} thead th`;
	tableBodyRows = `${this.wishlistTable} tbody tr`;
	tableCells = 'td';
	actionButtons = 'button[data-original-title], button[title]';
	removeButton = '//a[contains(@href, "remove")]';
	addToCartIcon = 'button[data-original-title="Add to Cart"]';

	getWishlistHeaders() {
		return cy.get(this.tableHeaderCells).then($headers =>
			Cypress.$.makeArray($headers).map(header => Cypress.$(header).text().trim())
		);
	}

getWishlistItems() {
    return cy.get('body').then($body => {
        const hasTable = $body.find(this.wishlistTable).length > 0;
        const hasRows = $body.find(this.tableBodyRows).length > 0;

        if (!hasTable || !hasRows) {
            return cy.wrap([]);
        }

        return cy.get(this.tableBodyRows).then($rows => {
            const items = [];

            Cypress.$($rows).each((_, row) => {
                const $row = Cypress.$(row);
                const $cells = $row.find(this.tableCells);
                const productName = $cells.eq(1).text().replace(/\s+/g, ' ').trim();
                const model = $cells.eq(2).text().replace(/\s+/g, ' ').trim();
                const stock = $cells.eq(3).text().replace(/\s+/g, ' ').trim();
                const unitPrice = $cells.eq(4).text().replace(/\s+/g, ' ').trim();
                const actions = $cells.eq(5)
                    .find(this.actionButtons)
                    .map((_, button) => {
                        const $button = Cypress.$(button);
                        return $button.attr('data-original-title') || $button.attr('title') || $button.text().trim();
                    })
                    .get()
                    .filter(Boolean);

                items.push({
                    productName,
                    model,
                    stock,
                    unitPrice,
                    actions
                });
            });

            return cy.wrap(items);
        });
    });
}

	removeItemByProductName(productName, options = {}) {
		const normalizedName = productName.replace(/\s+/g, ' ').trim();
		const normalizedPrice = options.unitPrice ? options.unitPrice.replace(/\s+/g, ' ').trim() : undefined;

		return cy.get(this.tableBodyRows).then($rows => {
			const row = Cypress.$($rows)
				.filter((_, el) => {
					const $row = Cypress.$(el);
					const nameText = $row.find(this.tableCells).eq(1).text().replace(/\s+/g, ' ').trim();
					const priceText = $row.find(this.tableCells).eq(4).text().replace(/\s+/g, ' ').trim();
					const matchesName = nameText.includes(normalizedName);
					const matchesPrice = normalizedPrice ? priceText.includes(normalizedPrice) : true;
					return matchesName && matchesPrice;
				}) 
				;

			expect(row.length, `wishlist row for ${productName}`).to.be.greaterThan(0);

			return cy.wrap(row).xpath(this.removeButton).click({ force: true });
		});
	}

	addItemToCartByProductName(productName) {
		cy.get(this.tableBodyRows).each($row => {
			const $cells = $row.find(this.tableCells);
			const name = $cells.eq(1).text().replace(/\s+/g, ' ').trim();
			if (name === productName) {
				cy.wrap($row).find(this.addToCartIcon).click({ force: true });
			}
		});

	}
}