let server
let request = require('supertest')
const { Genre } = require('../models/genre')
const User = require('../models/user')
const mongoose = require('mongoose')

describe('/api/genres', () => {

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

    describe('GET \ ', () => {

        it('should return all genres', async () => {

            await Genre.collection.insertMany([{ name: 'genre1' }, { name: 'genre2' }])

            const res = await request(server).get('/api/genres')

            expect(res.status).toBe(200)
            expect(res.body.some(g => g.name === 'genre1')).toBeTruthy()
            expect(res.body.some(g => g.name === 'genre2')).toBeTruthy()

        })


        it('should return a genre by id', async () => {

            let gen = await Genre.collection.insertOne({ name: 'genre3' })

            const res = await request(server).get(`/api/genres/${gen.insertedId}`)

            expect(res.status).toBe(200)
            expect(res.body.name === 'genre3').toBeTruthy()


        })

        it('should generate 404', async () => {

            const res = await request(server).get(`/api/genres/13`)

            expect(res.status).toBe(404)

        })

    })



    describe('POST', () => {

        let token;
        let name;

        const exec = async () => {

            return await request(server).post('/api/genres/creategenre').send({ name: name }).set('x-auth-token', token)

        }

        beforeEach(() => {

            token = new User().generateAuthToken()
            name = 'genre1'
        })

        it('should return 404 if client is not logged in', async () => {

            token = ''

            const res = await exec()

            expect(res.status).toBe(401)

        })


        it('should return 400 if genre is less than 5 characters', async () => {

            name = '1234'

            const res = await exec()

            expect(res.status).toBe(400)

        })

        it('should return 400 if genre is more than 50 characters', async () => {

            name = new Array(52).join('a')

            const res = await exec()

            expect(res.status).toBe(400)

        })

        it('should save genre if genre it is valid', async () => {

            await exec()

            const genre = await Genre.find({ name: 'genre1' })

            expect(genre).not.toBeNull()

        })

        it('should return the genre if genre it is valid', async () => {

            const res = await exec()

            expect(res.body).toHaveProperty('_id')
            expect(res.body).toHaveProperty('name', 'genre1')

        })


    })

})