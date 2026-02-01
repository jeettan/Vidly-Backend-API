const { Rental } = require('../models/rental')
const mongoose = require('mongoose')
const request = require('supertest')
const User = require('../models/user')
const Movie = require('../models/movie')

describe('/api/returns', () => {

    let server
    let customerId
    let movieId
    let rental
    let token
    let movie
    let movieTitle
    let dailyRentalRate
    let numberInStock

    beforeEach(async () => {

        server = require('../index')

        customerId = new mongoose.Types.ObjectId()
        movieId = new mongoose.Types.ObjectId()
        token = new User().generateAuthToken()

        movieTitle = 'movieTitle'
        dailyRentalRate = 2
        numberInStock = 7


        rental = new Rental({

            customer: {
                _id: customerId,
                name: '12345',
                phone: '12345'
            },
            movie: {
                _id: movieId,
                title: movieTitle,
                dailyRentalRate: dailyRentalRate
            },
            dateOut: '2025-12-05'
        })

        await rental.save()

        movie = new Movie({

            _id: movieId,
            title: movieTitle,
            dailyRentalRate: dailyRentalRate,
            numberInStock: numberInStock
        })

        await movie.save()
    })

    afterEach(async () => {

        await Rental.deleteMany({})
        await Movie.deleteMany({})
        await server.close()
    })

    afterAll(async () => {

        await mongoose.connection.close()

    })

    const exec = async () => {

        return await request(server).post('/api/returns').send({ customerId, movieId }).set('x-auth-token', token)

    }

    it('it should work', () => {

        const result = Rental.findById(rental._id)
        expect(result).not.toBeNull()
    })

    it('401 if client is not logged in', async () => {

        token = ''

        const res = await exec()

        expect(res.status).toBe(401)

    })

    it('400 if customerId not provided', async () => {

        customerId = ''

        const res = await exec()

        expect(res.status).toBe(400)

    })

    it('400 if movieId not provided', async () => {

        movieId = ''
        const res = await exec()

        expect(res.status).toBe(400)

    })

    it('404 if no rental found for this customer/movie', async () => {

        movieId = new mongoose.Types.ObjectId()
        customerId = new mongoose.Types.ObjectId()

        const res = await exec()

        expect(res.status).toBe(404)

    })

    it('400 if rental already processed', async () => {

        customerId = new mongoose.Types.ObjectId()
        movieId = new mongoose.Types.ObjectId()

        rental = new Rental({

            customer: {
                _id: customerId,
                name: '12345',
                phone: '12345'
            },
            movie: {
                _id: movieId,
                title: 'movieTitle',
                dailyRentalRate: 2
            },
            dateReturned: new Date()
        })

        await rental.save()

        const res = await exec()

        expect(res.status).toBe(400)

    })

    it('200 if valid request', async () => {

        const res = await exec()

        expect(res.status).toBe(200)

    })

    it('Set return date', async () => {

        const res = await exec()

        expect(res.body.dateReturned).toBeDefined()

    })

    it('Has a rental fee set', async () => {

        const res = await exec()

        expect(res.body.rentalFee).toBeDefined()

        const find = await Rental.findById(rental._id)

        const daysBetween = Math.floor(Math.abs(find.dateReturned - find.dateOut) / 86400000)

        const rentalFee = daysBetween * find.movie.dailyRentalRate

        expect(find.rentalFee).toBe(rentalFee)

    })


    it('Should increase in stock for the movie', async () => {

        const res = await exec()

        const find1 = await Movie.findById(movieId)

        let stock = parseInt(find1.numberInStock)

        expect(stock).toEqual(numberInStock + 1)

    })

    it('Should return rental object', async () => {

        const res = await exec()

        expect(res.body).toMatchObject({
            _id: rental._id.toString(),
            customer: {
                name: '12345',
                isGold: false,
                phone: '12345',
                _id: customerId.toString()
            },
            movie: {
                title: movieTitle,
                dailyRentalRate: dailyRentalRate,
                _id: movieId.toString()
            },
            dateOut: rental.dateOut.toISOString()
        })

    })

})