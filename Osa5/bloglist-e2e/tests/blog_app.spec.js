
const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

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

        await request.post('http://localhost:3003/api/users', {
            data: {
                name: 'Toinen Käyttäjä',
                username: 'toinen',
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
            await loginWith(page, 'Testi', 'salasana')

            await expect(
                page.getByText('Teppo Testaaja logged in')
            ).toBeVisible()
        })

        test('fails with wrong credentials', async ({ page }) => {
            await loginWith(page, 'wrong', 'wrong')

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
            await loginWith(page, 'Testi', 'salasana')
        })

        test('a new blog can be created', async ({ page }) => {
            await createBlog(
                page,
                'Playwright blog',
                'Teppo Testaaja',
                'www.testi.fi'
            )

            const blog = page.locator('.blog').filter({
                hasText: 'Playwright blog'
            })

            await expect(blog).toBeVisible()
        })

        test('a blog can be liked', async ({ page }) => {
            await createBlog(
                page,
                'Like test blog',
                'Teppo Testaaja',
                'www.testi.fi'
            )

            const blog = page.locator('.blog').filter({
                hasText: 'Like test blog'
            })

            await expect(blog).toBeVisible()

            await blog.getByRole('button', { name: 'view' }).click()

            const likeButton = blog.getByRole('button', { name: 'like' })

            await likeButton.click()

            await expect(
                blog.getByText('likes 1')
            ).toBeVisible()

            await likeButton.click()

            await expect(
                blog.getByText('likes 2')
            ).toBeVisible()
        })

        test('a user can delete a blog', async ({ page }) => {
            await createBlog(
                page,
                'Delete test blog',
                'Teppo Testaaja',
                'www.testi.fi'
            )

            const blog = page.locator('.blog').filter({
                hasText: 'Delete test blog'
            })

            await expect(blog).toBeVisible()

            await blog.getByRole('button', { name: 'view' }).click()

            // hyväksyy window.confirmin
            page.on('dialog', dialog => dialog.accept())

            await blog.getByRole('button', { name: 'remove' }).click()

            await expect(blog).not.toBeVisible()
        })

        test('only the user who added the blog sees the remove button', async ({ page }) => {
            // käyttäjä 1 luo blogin
            await createBlog(
                page,
                'Permission test blog',
                'Teppo Testaaja',
                'www.testi.fi'
            )

            // logout
            await page.getByRole('button', { name: 'logout' }).click()

            // käyttäjä 2 kirjautuu
            await loginWith(page, 'toinen', 'salasana')

            const blog = page.locator('.blog').filter({
                hasText: 'Permission test blog'
            })

            await blog.getByRole('button', { name: 'view' }).click()

            // remove-nappia EI saa näkyä
            await expect(
                blog.getByRole('button', { name: 'remove' })
            ).not.toBeVisible()
        })

    })
})