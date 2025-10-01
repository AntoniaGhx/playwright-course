import { expect } from "@playwright/test" 
import { Navigation } from "./Navigation.js"
import { isDesktopViewPort } from "../utils/isDesktopViewport.js"

export class ProductsPage {
    constructor(page) {

        this.page = page

        this.addButtons = page.locator('[data-qa="product-button"]')
        this.basketCounter = page.locator('[data-qa="header-basket-count"]')
        this.sortDropdown = page.locator('[data-qa="sort-dropdown"]')
        this.productTitle = page.locator('[data-qa="product-title"]')
    }
    visit = async () => {
        await this.page.goto("/")
    }

    addProductToBasket = async (index) => {

        const specificAddButtons = this.addButtons.nth(index)
        await specificAddButtons.waitFor()
        await expect(this.addButtons.nth(index)).toHaveText("Add to Basket")
        const navigation = new Navigation(this.page)
        //only desktop viewport
        let basketCountBeforeAdding;
        if (isDesktopViewPort(this.page)) {
            basketCountBeforeAdding = await navigation.getBasketCount();
        }
        await specificAddButtons.click();
        await expect(specificAddButtons).toHaveText("Remove from Basket");
        //only desktop viewport
        if (isDesktopViewPort(this.page)) {
            const basketCountAfterAdding = await navigation.getBasketCount();
            expect(basketCountAfterAdding).toBeGreaterThan(basketCountBeforeAdding);
        }
       
    }

    sortByCheapest = async () => {
        await this.sortDropdown.waitFor()
        await this.productTitle?.first().waitFor()
        const productTitlesBeforeSorting = await this.productTitle?.allInnerTexts()
        await this.sortDropdown.selectOption("price-asc")
        const productTitlesAfterSorting = await this.productTitle?.allInnerTexts()
        expect(productTitlesBeforeSorting).not.toEqual(productTitlesAfterSorting)
    }
        
}