// Write your tests here
const server = require('./server')
const request = require('supertest')
const db = require('../data/dbConfig')

// test('sanity', () => {
//   expect(true).toBe(true)
// })
beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})
beforeEach(async () => {
  await db('users').truncate()
  await db.seed.run()
})
afterAll(async () => {
  await db.destroy()
})


describe('users endpoints', () => {
  describe('[Register] endpoint', () => {
    it('returns the new user', async () => {
      const res = await request(server)
      .post('/register')
      .send({username: 'joey'})
      expect(res.body).toMatchObject({id: 8, username: 'joey'})
    })
  })
})

