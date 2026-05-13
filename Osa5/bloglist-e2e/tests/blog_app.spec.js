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

    describe('When logged in', () => {
        beforeEach(async ({ page }) => {
            await page.getByLabel('username').fill('Testi')
            await page.getByLabel('password').fill('salasana')
            await page.getByRole('button', { name: 'login' }).click()
        })

        test('a new blog can be created', async ({ page }) => {
            await page.getByRole('button', { name: 'new blog' }).click()
            await page.getByLabel('title').fill('Playwright blog')
            await page.getByLabel('author').fill('Teppo Testaaja')
            await page.getByLabel('url').fill('www.testi.fi')
            await page.getByRole('button', { name: 'create' }).click()

            const blogElement = page.getByText('Playwright blog Teppo Testaaja')

            await expect(blogElement.first()).toBeVisible()
        })
    })
})