import { expect } from "@playwright/test";

export class PaymentPage {
  constructor(page) {
    this.page = page;

    this.discountCode = page
      .frameLocator('[data-qa="active-discount-container"]')
      .locator('[data-qa="discount-code"]');
    this.discountInput = page.getByPlaceholder("Discount code");
    this.activateDiscountButton = page.locator(
      '[data-qa="submit-discount-button"]'
    );
    this.totalValue = page.locator('[data-qa="total-value"]');
    this.discountedValue = page.locator(
      '[data-qa="total-with-discount-value"]'
    );
    this.discountActiveMessage = page.getByText("Discount activated!");
    this.creditCardOwnerInput = page.locator(
      '[data-qa="credit-card-owner"]')
      this.creditCardNumberInput = page.locator(
        '[data-qa="credit-card-number"]')
    this.validUntilInput = page.locator(
        '[data-qa="valid-until"]')
    this.creditCardCVCInput = page.locator(
        '[data-qa="credit-card-cvc"]')
    this.payNowButton = page.locator(
        '[data-qa="pay-button"]')
  }

  activateDiscount = async () => {
    await this.discountCode.waitFor();
    const code = await this.discountCode.innerText();
    await this.discountInput.waitFor();

    console.log("The code is: " + code);
    console.log("discountcode: " + this.discountCode);
    console.log("input: " + this.discountInput);
    //OPTION 1 for laggy inputs: using .fill() with await expect()
    //TO DO: need to fill out the discount input
    //await this.discountInput.fill(code);
    //TO DO: wait to see that the input contains the value which was entered
    //await expect(this.discountInput).toHaveValue(code);

    //OPTION 2 for laggy inputs: slow typing
    await this.discountInput.focus()
    await this.page.keyboard.type(code, {delay:1000})
    expect(await this.discountInput.inputValue()).toBe(code)

    expect(await this.discountedValue.isVisible()).toBe(false);
    expect(await this.discountActiveMessage.isVisible()).toBe(false);

    await this.activateDiscountButton.waitFor();
    await this.activateDiscountButton.click();
    //check that it displays "Discount activated"
    await this.discountActiveMessage.waitFor({ state: "visible" });
    await expect(this.discountActiveMessage).toBeVisible();
    //check thath there is now a discounted price total showing
    await expect(this.discountedValue).toBeVisible();
    const discountValueText = await this.discountedValue.innerText(); //"344$"
    const discountValueOnlyStringNumber = discountValueText.replace("$", "");
    const discountValueNumber = parseInt(discountValueOnlyStringNumber, 10);

    await this.totalValue.waitFor();
    const totalValueText = await this.totalValue.innerText(); //"400$"
    const totalValueOnlyStringNumber = totalValueText.replace("$", "");
    const totalValueNumber = parseInt(totalValueOnlyStringNumber, 10);
    //check that the discounted price total is smaller than the regular one
    expect(discountValueNumber).toBeLessThan(totalValueNumber);
  }
    fillPaymentDetails = async (paymentDetails) => {    
    await this.creditCardOwnerInput.fill(paymentDetails.creditCardOwner)
    await this.creditCardNumberInput.fill(paymentDetails.creditCardNumber)
    await this.validUntilInput.fill(paymentDetails.validUntil)
    await this.creditCardCVCInput.fill(paymentDetails.creditCardCVC)        
    expect(await this.creditCardOwnerInput.inputValue()).toBe(paymentDetails.creditCardOwner)
    expect(await this.creditCardNumberInput.inputValue()).toBe(paymentDetails.creditCardNumber)
    expect(await this.validUntilInput.inputValue()).toBe(paymentDetails.validUntil)
    expect(await this.creditCardCVCInput.inputValue()).toBe(paymentDetails.creditCardCVC)   
    }
    completePayment = async () => {
        await this.payNowButton.waitFor()
        await this.payNowButton.click()
        await this.page.waitForURL(/\/thank-you/, { timeout: 3000 } )
        //await this.page.pause()
    }
}
