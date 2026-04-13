const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper.js')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)


/* const initialBlogs = [
  {
    title: 'First blog',
    author: 'Alice',
    url: 'http://example.com/1',
    likes: 5,
  },
  {
    title: 'Second blog',
    author: 'Bob',
    url: 'http://example.com/2',
    likes: 3,
  },
] */

beforeEach(async () => {
  await Blog.deleteMany({})

  /* const blogObjects = initialBlogs.map(blog => new Blog(blog)) */
  const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())

  await Promise.all(promiseArray)
})

describe('when there are blogs in db', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    /* assert.strictEqual(response.body.length, initialBlogs.length) */
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})