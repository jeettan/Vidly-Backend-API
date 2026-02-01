const express = require("express")
const router = express.Router()
const mongoose = require("mongoose");
const Rental = require("../models/rental")

router.get('/', async (req, res) => {

    const rentals = await Rental.find()
    console.log(rentals)
    return res.send(rentals)
})

router.post('/', async (req, res) => {

    if (req.body.rentalDate > req.body.returnDate) {

        res.status(400).send("Return date must be greater than rental date")
        return false
    }

    const rental = new Rental({
        movieName: req.body.movieName,
        rentalDate: new Date(req.body.rentalDate),
        returnDate: new Date(req.body.returnDate),
        customerName: req.body.customerName,
        price: parseInt(req.body.price)
    })

    try {
        const result = await rental.save();
        console.log(result)
        return res.send(rental)

    } catch (err) {
        console.log(err)
    }

})


module.exports = router