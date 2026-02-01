const express = require("express")
const router = express.Router()
const mongoose = require("mongoose");
const { Genre } = require("../models/genre")
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const validateObjectId = require('../middleware/validateObjectIds')
const Joi = require('joi')


router.get('/', async (req, res) => {

    const genres = await Genre.find({}).select({ _id: 1, name: 1 })
    return res.send(genres)

})

router.get('/:id', validateObjectId, async (req, res) => {

    const genre = await Genre.findById(req.params.id)

    if (!genre) res.status(404).send("Course with given id is not found")

    res.send(genre)
})

router.post('/creategenre', auth, async (req, res) => {

    const { error } = validateSchema(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const genre = new Genre({
        name: req.body.name
    });

    try {
        const result = await genre.save();
        return res.send(genre)

    } catch (err) {
        console.log(err)
        return res.status(500).send("Internal Server Error")
    }

})

router.put('/:id', auth, async (req, res) => {

    try {

        const id = req.params.id

        if (!mongoose.Types.ObjectId.isValid(req.params.id))
            return res.status(400).send('Invalid ID.')

        const result = await Genre.findByIdAndUpdate({ _id: id }, {

            $set: {
                name: req.body.name
            }
        }, { new: true })

        if (!result) return res.status(404).send('The genre with the given ID was not found')

        res.send(result)

    } catch (err) {

        console.log(err)
    }

})

router.delete('/:id', [auth, admin], async (req, res) => {

    const { id } = req.params

    const result = await Genre.deleteMany({ _id: id })

    if (result.deletedCount === 0) return res.status(404).send('The course with the given ID was not found')

    res.send(result).status(200)
})

function validateSchema(it) {

    const schema = Joi.object({

        name: Joi.string().min(5).max(50).required(),
    })

    return schema.validate(it)

}


module.exports = router