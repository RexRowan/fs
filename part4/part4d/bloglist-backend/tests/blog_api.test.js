const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 5,
  },
]

let token

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)
  const rootUser = await new User({ username: 'root', passwordHash }).save()

  const blogs = await Blog.insertMany(
    initialBlogs.map(blog => ({ ...blog, user: rootUser._id }))
  )
  rootUser.blogs = blogs.map(blog => blog._id)
  await rootUser.save()

  const login = await api
    .post('/api/login')
    .send({ username: 'root', password: 'sekret' })
  token = login.body.token
})

describe('when there is initially some blogs saved', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(initialBlogs.length)
  })

  test('unique identifier property is named id', async () => {
    const response = await api.get('/api/blogs')
    response.body.forEach(blog => {
      expect(blog.id).toBeDefined()
      expect(blog._id).toBeUndefined()
    })
  })
})

describe('addition of a new blog', () => {
  const newBlog = {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'https://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
  }

  test('succeeds with valid data and a valid token', async () => {
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const titles = response.body.map(b => b.title)

    expect(response.body).toHaveLength(initialBlogs.length + 1)
    expect(titles).toContain('Canonical string reduction')
  })

  test('fails with 401 if the token is not provided', async () => {
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)

    const blogsAtEnd = await Blog.find({})
    expect(blogsAtEnd).toHaveLength(initialBlogs.length)
  })

  test('fails with 401 if the token is invalid', async () => {
    await api
      .post('/api/blogs')
      .set('Authorization', 'Bearer notarealtoken')
      .send(newBlog)
      .expect(401)

    const blogsAtEnd = await Blog.find({})
    expect(blogsAtEnd).toHaveLength(initialBlogs.length)
  })

  test('if likes property is missing, it defaults to 0', async () => {
    const { likes, ...blogWithoutLikes } = newBlog

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(blogWithoutLikes)
      .expect(201)

    expect(response.body.likes).toBe(0)
  })

  test('if title is missing, responds with 400', async () => {
    const { title, ...blogWithoutTitle } = newBlog

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(blogWithoutTitle)
      .expect(400)
  })

  test('if url is missing, responds with 400', async () => {
    const { url, ...blogWithoutUrl } = newBlog

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(blogWithoutUrl)
      .expect(400)
  })

  test('new blog is linked to the token user in both listings', async () => {
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)

    const blogsResponse = await api.get('/api/blogs')
    const created = blogsResponse.body.find(b => b.title === newBlog.title)
    expect(created.user.username).toBe('root')

    const usersResponse = await api.get('/api/users')
    expect(usersResponse.body[0].blogs.map(b => b.title)).toContain(newBlog.title)
  })
})

describe('deletion of a blog', () => {
  test('succeeds with 204 when done by the creator', async () => {
    const blogsAtStart = await Blog.find({})
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await Blog.find({})
    expect(blogsAtEnd).toHaveLength(initialBlogs.length - 1)
    expect(blogsAtEnd.map(b => b.title)).not.toContain(blogToDelete.title)
  })

  test('fails with 401 if the token is not provided', async () => {
    const blogsAtStart = await Blog.find({})

    await api
      .delete(`/api/blogs/${blogsAtStart[0].id}`)
      .expect(401)

    const blogsAtEnd = await Blog.find({})
    expect(blogsAtEnd).toHaveLength(initialBlogs.length)
  })

  test('fails with 403 when attempted by a different user', async () => {
    const passwordHash = await bcrypt.hash('other', 10)
    await new User({ username: 'other', passwordHash }).save()

    const login = await api
      .post('/api/login')
      .send({ username: 'other', password: 'other' })

    const blogsAtStart = await Blog.find({})

    await api
      .delete(`/api/blogs/${blogsAtStart[0].id}`)
      .set('Authorization', `Bearer ${login.body.token}`)
      .expect(403)

    const blogsAtEnd = await Blog.find({})
    expect(blogsAtEnd).toHaveLength(initialBlogs.length)
  })
})

describe('updating a blog', () => {
  test('succeeds in updating the number of likes', async () => {
    const blogsAtStart = await Blog.find({})
    const blogToUpdate = blogsAtStart[0]

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send({ ...blogToUpdate.toJSON(), likes: blogToUpdate.likes + 1 })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body.likes).toBe(blogToUpdate.likes + 1)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})