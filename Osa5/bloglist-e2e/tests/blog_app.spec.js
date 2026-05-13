const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
    beforeEach(async ({ page, request }) => {
        await request.post('http://localhost:3003/api/testing/reset')

        await request.post('http://localhost:3003/api/users', {
        data: {
            name: 'Teppo Testaaja',
            username: 'Testi',
            password: 'salasana'
        }
        })

        await page.goto('http://localhost:5173')
    })

    test('Login form is shown', async ({ page }) => {
        await expect(
            page.getByText('Log in to application')
        ).toBeVisible()

        await expect(
            page.getByLabel('username')
        ).toBeVisible()

        await expect(
            page.getByLabel('password')
        ).toBeVisible()

        await expect(
            page.getByRole('button', { name: 'login' })
        ).toBeVisible()
    })

    describe('Login', () => {
        test('succeeds with correct credentials', async ({ page }) => {
            await page.getByLabel('username').fill('Testi')

            await page.getByLabel('password').fill('salasana')

            await page.getByRole('button', { name: 'login' }).click()

            await expect(
                page.getByText('Teppo Testaaja logged in')
            ).toBeVisible()
        })

        test('fails with wrong credentials', async ({ page }) => {
            await page.getByLabel('username').fill('wrong')

            await page.getByLabel('password').fill('wrong')

            await page.getByRole('button', { name: 'login' }).click()

            const errorDiv = page.locator('.error')

            await expect(errorDiv).toContainText(
                'wrong username/password'
            )

            await expect(
            page.getByText('Teppo Testaaja logged in')
            ).not.toBeVisible()
        })
    })
})