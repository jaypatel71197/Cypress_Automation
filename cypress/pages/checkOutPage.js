export default class CheckOutPage {
	firstNameInput = '#input-payment-firstname';
	lastNameInput = 'input[name="lastname"]';
	companyInput = 'input[name="company"]';
	address1Input = '#input-payment-address-1';
	address2Input = 'input[name="address_2"]';
	cityInput = 'input[name="city"]';
	postCodeInput = 'div>input[name="postcode"]';
	countrySelect = 'select[name="country_id"]';
	stateSelect = 'div>select[name="zone_id"]';
	checkoutCartRows = '#checkout-cart table.table tbody tr';
	checkoutCartCells = 'td';
	productLink = 'a[title]';
	productMeta = 'small';
	quantityInput = 'input';
    addNewAddressButton = 'label[for="input-payment-address-new"]';
	agreeCheckbox = 'label[for="input-agree"]';
	continueButton = 'button#button-save';

	getCheckoutProducts() {
		return cy.get(this.checkoutCartRows, { timeout: 10000 }).then($rows => {
			const items = [];

			Cypress.$($rows).each((_, row) => {
				const $row = Cypress.$(row);
				const $cells = $row.find(this.checkoutCartCells);
				const nameCell = $cells.eq(1);
				const quantityCell = $cells.eq(2);
				const unitPriceCell = $cells.eq(3);
				const totalPriceCell = $cells.eq(4);
				const linkElement = nameCell.find(this.productLink);

				if (!linkElement.length) {
					return;
				}

				const linkAttr = linkElement.attr('data-original-title') || linkElement.attr('title');
				const linkText = linkAttr && linkAttr.trim().length ? linkAttr : linkElement.text();
				const productName = this.normalizeText(linkText);

				const quantity = Number(quantityCell.find(this.quantityInput).val()) || 0;
				const unitPriceText = this.normalizeText(unitPriceCell.text());
				const totalPriceText = this.normalizeText(totalPriceCell.text());
				const unitPriceValue = this.parseCurrency(unitPriceText);
				const totalPriceValue = this.parseCurrency(totalPriceText);
				const calculatedTotal = Number((quantity * unitPriceValue).toFixed(2));

				items.push({
					productName,
					quantity,
					unitPrice: unitPriceText,
					totalPrice: totalPriceText,
					unitPriceValue,
					totalPriceValue,
					calculatedTotal
				});
			});

			return cy.wrap(items);
		});
	}

	normalizeText(value = '') {
		return value.replace(/\s+/g, ' ').trim();
	}

	parseCurrency(value = '') {
		const numeric = value.replace(/[^0-9.-]/g, '');
		return Number(numeric);
	}

    clickOnAddNewAddress() {
        cy.get(this.addNewAddressButton).click();
    }

	selectCountry(countryValue) {
		cy.get(this.countrySelect).select(countryValue);
	}

	selectState(stateValue) {
		cy.get(this.stateSelect).select(stateValue);
	}

		fillAddressForm(address) {
		cy.get(this.firstNameInput).clear().type(address.firstName);
		cy.get(this.lastNameInput).clear().type(address.lastName);
		cy.get(this.companyInput).clear().type(address.company);
		cy.get(this.address1Input).clear().type(address.address1, { force: true });
		cy.get(this.address2Input).clear().type(address.address2, { force: true });
		cy.get(this.cityInput).clear().type(address.city, { force: true });
		cy.get(this.postCodeInput).clear().type(address.postCode, { force: true });
		this.selectCountry(address.country);
		this.selectState(address.state);
	}
	agreeToTerms() {
		cy.get(this.agreeCheckbox).click({ force: true });
	}
	clickOnContinueButton() {
		cy.get(this.continueButton).click({ force: true });
	}
}