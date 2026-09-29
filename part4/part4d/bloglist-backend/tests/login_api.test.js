const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('sekret', 10)
  await new User({ username: 'root', name: 'Root', passwordHash }).save()
})

describe('login', () => {
  test('succeeds with correct credentials and returns a token', async () => {
    const response = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })
      .expect(200)

    expect(response.body.token).toBeDefined()
    expect(response.body.username).toBe('root')
  })

  test('fails with 401 for a wrong password', async () => {
    const response = await api
      .post('/api/login')
      .send({ username: 'root', password: 'wrong' })
      .expect(401)

    expect(response.body.token).toBeUndefined()
  })

  test('fails with 401 for an unknown username', async () => {
    await api
      .post('/api/login')
      .send({ username: 'nobody', password: 'sekret' })
      .expect(401)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})