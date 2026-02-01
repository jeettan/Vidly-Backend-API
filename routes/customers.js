const express = require("express")
const router = express.Router()
const mongoose = require("mongoose");
const Customer = require("../models/customer")

router.get('/', async (req, res) => {

    const customers = await Customer.find().sort('name')
    console.log(customers)
    return res.send(customers)
})

router.get('/:id', async (req, res) => {

    const customer = await Customer.findById(req.params.id)

    if (!customer) res.status(404).send("Course with given id is not found")

    res.send(customer)
})

router.post('/createcustomer', async (req, res) => {

    const customer = new Customer({
        name: req.body.name,
        phone: parseInt(req.body.phone),
        isGold: req.body.isGold
    });

    try {
        const result = await customer.save();
        console.log(result);

    } catch (err) {
        console.log(err)

    }

    return res.send(customer)
})

router.put('/:id', async (req, res) => {

    try {

        const updates = {};

        const id = req.params.id

        if ("name" in req.body) {
            updates.name = req.body.name;
        }

        if ("phone" in req.body) {
            updates.phone = req.body.phone;
        }

        if ("isgold" in req.body) {
            updates.isGold = req.body.isGold;
        }

        console.log(updates)

        const result = await Customer.findByIdAndUpdate({ _id: id }, {

            $set: updates
        }, { new: true })
        console.log(result)
        res.send(result)

    } catch (err) {

        console.log(err)
    }
})

router.delete('/:id', async (req, res) => {

    const { id } = req.params

    const result = await Customer.deleteMany({ _id: id })

    console.log(result)

    if (!result) return res.status(404).send('The course with the given ID was not found')

    res.send(result)
})

module.exports = router