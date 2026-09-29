const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('sekret', 10)
  await new User({ username: 'root', passwordHash }).save()
})

describe('creation of a user', () => {
  test('succeeds with a fresh username', async () => {
    const newUser = { username: 'rex', name: 'Rex Rowan', password: 'salainen' }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    expect(response.body.passwordHash).toBeUndefined()

    const usersAtEnd = await User.find({})
    expect(usersAtEnd).toHaveLength(2)
    expect(usersAtEnd.map(u => u.username)).toContain('rex')
  })

  test('fails with 400 if username is already taken', async () => {
    const response = await api
      .post('/api/users')
      .send({ username: 'root', name: 'Dup', password: 'salainen' })
      .expect(400)

    expect(response.body.error).toContain('unique')
    expect(await User.find({})).toHaveLength(1)
  })

  test('fails with 400 if username is missing', async () => {
    const response = await api
      .post('/api/users')
      .send({ name: 'No Username', password: 'salainen' })
      .expect(400)

    expect(response.body.error).toContain('required')
    expect(await User.find({})).toHaveLength(1)
  })

  test('fails with 400 if password is missing', async () => {
    const response = await api
      .post('/api/users')
      .send({ username: 'nopass', name: 'No Password' })
      .expect(400)

    expect(response.body.error).toContain('required')
    expect(await User.find({})).toHaveLength(1)
  })

  test('fails with 400 if username is shorter than 3 characters', async () => {
    const response = await api
      .post('/api/users')
      .send({ username: 'ab', name: 'Short', password: 'salainen' })
      .expect(400)

    expect(response.body.error).toContain('at least 3')
    expect(await User.find({})).toHaveLength(1)
  })

  test('fails with 400 if password is shorter than 3 characters', async () => {
    const response = await api
      .post('/api/users')
      .send({ username: 'shortpw', name: 'Short', password: 'pw' })
      .expect(400)

    expect(response.body.error).toContain('at least 3')
    expect(await User.find({})).toHaveLength(1)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})