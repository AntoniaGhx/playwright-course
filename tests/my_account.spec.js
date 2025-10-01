import * as dotenv from "dotenv"
dotenv.config()
import { test } from "@playwright/test"
import { MyAccountPage } from "../page-objects/MyAccountPage.js"
import { getLoginToken } from "../api-calls/getLoginToken.js"
import { adminDetails } from "../data/userDetails.js"

//CI(Continous integration) - jenkins, CircleCI, github actions, Travis CI

test("Myaccount using cookie injection and mocking network request", async ({ page }) => {
    //Make a request to the login token 
    const loginToken = await getLoginToken(adminDetails.username, adminDetails.password) 
    //console.warn({loginToken})

    page.route("**/api/user**", async (route, request) => {
        await route.fulfill({
            status: 500,
            contentType: "application/json",
            body: JSON.stringify({message: "PLAWRIGHT ERROR FROM MOCKING"})
        })
    })

    //Inject the login token into the browser
    const myAccount = new MyAccountPage(page)
    await myAccount.visit()
    //await page.pause()
    await page.evaluate(([loginTokenInsideBrowserCode]) => {
        document.cookie = "token=" + loginTokenInsideBrowserCode

    }, [loginToken])
    await myAccount.visit()
    await myAccount.waitForPageHeading()
    await myAccount.waitForErrorMessage()
})