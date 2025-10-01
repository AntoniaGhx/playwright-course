import { expect } from "@playwright/test"

export class DeliveryDetails {
    constructor(page) {
        this.page = page  
        
        this.firstNameInput = page.locator('[data-qa="delivery-first-name"]')
        this.lastNameInput = page.locator('[data-qa="delivery-last-name"]')
        this.addressInput = page.locator('[data-qa="delivery-address-street"]')
        this.postcodeInput = page.locator('[data-qa="delivery-postcode"]')
        this.cityInput = page.locator('[data-qa="delivery-city"]')
        this.countryDropdown = page.locator('[data-qa="country-dropdown"]')
        this.saveAddressButton = page.locator('[data-qa="save-address-button"]')
        this.savedAddressContainer = page.locator('[data-qa="saved-address-container"]')
        this.savedAddressFirstName = page.locator('[data-qa="saved-address-firstName"]')
        this.savedAddressLastName = page.locator('[data-qa="saved-address-lastName"]')
        this.savedAddressStreet = page.locator('[data-qa="saved-address-street"]')
        this.savedAddressPostcode = page.locator('[data-qa="saved-address-postcode"]')
        this.savedAddressCity = page.locator('[data-qa="saved-address-city"]')
        this.savedAddressCountry = page.locator('[data-qa="saved-address-country"]')
        // this.editAddressButton = page.locator('[data-qa="edit-address-button"]')
        // this.deleteAddressButton = page.locator('[data-qa="delete-address-button"]')
        // this.confirmDeleteAddressButton = page.locator('[data-qa="confirm-delete-address-button"]')
        // this.cancelDeleteAddressButton = page.locator('[data-qa="cancel-delete-address-button"]')
        // this.addressErrorMessage = page.locator('[data-qa="address-error-message"]')





        this.continueToPaymentButton = page.locator('[data-qa="continue-to-payment-button"]')
    }

    fillDetails = async (userAddress) => {
        // Wait for the first name input to be visible and enabled before filling
        await this.firstNameInput.waitFor({ state: 'visible' })
        await this.firstNameInput.waitFor({ state: 'attached' })
        await this.firstNameInput.fill(userAddress.firstName)
        
        await this.lastNameInput.waitFor({ state: 'visible' })
        await this.lastNameInput.fill(userAddress.lastName)
        
        await this.addressInput.waitFor({ state: 'visible' })
        await this.addressInput.fill(userAddress.address)
        
        await this.postcodeInput.waitFor({ state: 'visible' })
        await this.postcodeInput.fill(userAddress.postcode)
        
        await this.cityInput.waitFor({ state: 'visible' })
        await this.cityInput.fill(userAddress.city)
        
        await this.countryDropdown.waitFor({ state: 'visible' })
        await this.countryDropdown.selectOption({ label: userAddress.country })
        
    }

    saveDetails = async () => {
        const addressCountBeforeSaving = await this.savedAddressContainer.count()
        await this.saveAddressButton.waitFor()
        await this.saveAddressButton.click()
        await expect(this.savedAddressContainer).toHaveCount(addressCountBeforeSaving + 1)

        await this.savedAddressFirstName.first().waitFor()
        expect(await this.savedAddressFirstName.first().innerText()).toBe(await this.firstNameInput.inputValue())

        await this.savedAddressLastName.first().waitFor()
        expect(await this.savedAddressLastName.first().innerText()).toBe(await this.lastNameInput.inputValue())

        await this.savedAddressStreet.first().waitFor()
        expect(await this.savedAddressStreet.first().innerText()).toBe(await this.addressInput.inputValue())    

        await this.savedAddressPostcode.first().waitFor()
        expect(await this.savedAddressPostcode.first().innerText()).toBe(await this.postcodeInput.inputValue())

        await this.savedAddressCity.first().waitFor()
        expect(await this.savedAddressCity.first().innerText()).toBe(await this.cityInput.inputValue())

        await this.savedAddressCountry.first().waitFor()
        expect(await this.savedAddressCountry.first().innerText()).toBe(await this.countryDropdown.inputValue())

    }

    continueToPayment = async () => {
        await this.continueToPaymentButton.waitFor()
        await this.continueToPaymentButton.click()
        await this.page.waitForURL(/\/payment/, { timeout: 3000 } )
        //await this.page.pause()
    }
}