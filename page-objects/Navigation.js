import { isDesktopViewPort } from "../utils/isDesktopViewport.js"

export class Navigation {
    constructor(page) {
        this.page = page

        this.basketCounter = page.locator('[data-qa="header-basket-count"]')
        this.checkoutLink = page.getByRole('link', { name: 'Checkout' })
        this.mobileBurgerButton = page.locator('[data-qa="burger-button"]')
    }
    getBasketCount = async () => {
        await this.basketCounter.waitFor({ timeout: 20000 })
        const text = await this.basketCounter.innerText()
        return parseInt(text, 10)
    }

        //true if desktop
        //false if mobile -> reverse false -> !false === false
    goToCheckout = async () => {
        //if mobile viewport, first open the burger menu
        if (!isDesktopViewPort(this.page)) {
            await this.mobileBurgerButton.waitFor()
            await this.mobileBurgerButton.click()
        }
        await this.checkoutLink.waitFor()
        await this.checkoutLink.click()
        await this.page.waitForURL("/basket")
    }
}