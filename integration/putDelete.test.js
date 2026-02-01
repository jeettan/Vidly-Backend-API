const request = require('supertest')
const User = require('../models/user')
const mongoose = require('mongoose')
const { Genre } = require('../models/genre')

let server

describe('PUT and DELETE function tests', () => {

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

    beforeEach(() => {

        let newUser = new User()
        newUser.isAdmin = true
        token = newUser.generateAuthToken()
    })

    describe('PUT tests', () => {

        it('should update the genre if input is valid', async () => {

            let k = await Genre.collection.insertOne({ name: 'testgenre' })

            const id = k.insertedId.toHexString()

            const res = await request(server).put(`/api/genres/${id}`).send({ name: 'updateGenre' }).set('x-auth-token', token)

            expect(res.status).toBe(200);
            expect(res.body.name).toBe('updateGenre')

        })

        it('should return 400 because genre id is invalid', async () => {

            let k = await Genre.collection.insertOne({ name: 'testgenre' })

            const id = 3

            const res = await request(server).put(`/api/genres/${id}`).send({ name: 'updateGenre' }).set('x-auth-token', token)

            expect(res.status).toBe(400);

        })

        it('should return 404 because not found correct field to update', async () => {

            let k = await Genre.collection.insertOne({ name: 'testgenre' })

            const id = '507f1f77bcf86cd799439011'

            const res = await request(server).put(`/api/genres/${id}`).send({ name: 'updateGenre' }).set('x-auth-token', token)

            expect(res.status).toBe(404);

        })


    })

    describe('DELETE tests', () => {

        it('Successfully deleted field', async () => {

            let k = await Genre.collection.insertOne({ name: 'testgenre' })

            const id = k.insertedId.toHexString()

            const res = await request(server).delete(`/api/genres/${id}`).set('x-auth-token', token)

            expect(res.status).toBe(200);

        })

        it('Send without admin permissions in auth token', async () => {

            let k = await Genre.collection.insertOne({ name: 'testgenre' })

            const id = k.insertedId.toHexString()

            let fakeToken = new User().generateAuthToken()

            const res = await request(server).delete(`/api/genres/${id}`).set('x-auth-token', fakeToken)

            expect(res.status).toBe(403);

        })

        it('Delete non-existent field', async () => {

            const id = '507f1f77bcf86cd799439011'

            const res = await request(server).delete(`/api/genres/${id}`).set('x-auth-token', token)

            expect(res.status).toBe(404);

        })

    })

})