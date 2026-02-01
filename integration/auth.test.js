const request = require('supertest')
const User = require('../models/user')
const mongoose = require('mongoose')
const { Genre } = require('../models/genre')

let server

describe('auth middleware', () => {

    beforeEach(() => {
        server = require('../index')
    })

    afterEach(async () => {
        await Genre.deleteMany({})
        await server.close()

    })

    afterAll(async () => {

        await mongoose.connection.close()

    })

    let token;

    const exec = async () => {

        return await request(server).post('/api/genres/creategenre').send({ name: 'genre1' }).set('x-auth-token', token)
    }

    beforeEach(() => {
        token = new User().generateAuthToken();
    })

    it('should return 401 if no token is provided', async () => {

        token = ''

        const res = await exec()

        expect(res.status).toBe(401)

    })

    it('should return 400 if no token is provided', async () => {

        token = 'a'

        const res = await exec()

        expect(res.status).toBe(400)

    })


    it('should return 200 if token is valid', async () => {

        const res = await exec()

        expect(res.status).toBe(200)

    })

})