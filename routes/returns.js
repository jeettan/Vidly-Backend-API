const express = require("express")
const router = express.Router()
const auth = require('../middleware/auth')
const Customer = require('../models/customer')
const Movie = require('../models/movie')
const { Rental } = require('../models/rental')
const mongoose = require('mongoose')
const Joi = require('joi')
const validate = require('../middleware/validate')
const daysBetween = require('../functions/daysBetween')

router.post('/', [auth, validate(validateReturn)], async (req, res) => {

    const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

    if ((!mongoose.Types.ObjectId.isValid(req.body.customerId)) || (!mongoose.Types.ObjectId.isValid(req.body.movieId))) {
        return res.status(400).send("Invalid mongDB objectId")
    }
    if (!rental) return res.status(404).send("Can't find movie or customer")

    if (rental.dateReturned) return res.status(400).send("ERROR. Rental already been processed")

    rental.return()

    await rental.save()

    let movieres = await Movie.findById(req.body.movieId)

    if (!movieres) {

        const movie = new Movie({
            _id: req.body.movieId,
            title: rental.movie.title,
            dailyRentalRate: rental.movie.dailyRentalRate,
            numberInStock: 1

        })

        await movie.save()
    } else {

        movieres.numberInStock += 1
        await movieres.save()
    }

    return res.status(200).send(rental)

})

function validateReturn(req) {

    const schema = Joi.object({
        customerId: Joi.string().hex().length(24).required(),
        movieId: Joi.string().hex().length(24).required(),
    });

    return schema.validate(req);
}
module.exports = router