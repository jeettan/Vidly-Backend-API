const _ = require("lodash")
const express = require("express")
const router = express.Router()
const mongoose = require("mongoose");
const Joi = require("joi")
const User = require("../models/user")
const bcrypt = require("bcrypt")
const config = require('config')
const jwt = require('jsonwebtoken')
const auth = require('../middleware/auth')

router.get('/', async (req, res) => {

    const users = await User.find()
    return res.send(_.pick(users, ['_id', 'name', 'email']))

})

router.get('/me', auth, async (req, res) => {

    const user = await User.findById(req.user._id).select('-password')
    res.send(user)

})

router.post('/', async (req, res) => {

    const { error } = validateSchema(req.body)

    if (error) return res.status(400).send(error.details[0].message)

    try {

        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        })

        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(user.password, salt);

        const result = await user.save();
        const token = user.generateAuthToken();
        res.header('x-auth-token', token).send(_.pick(result, ['_id', 'name', 'email']))

    } catch (err) {
        console.log(err)
        return res.status(500).send("Internal Server Error")
    }

})

function validateSchema(user) {

    const schema = Joi.object({

        name: Joi.string().min(3).max(50).required(),
        email: Joi.string().required().email(),
        password: Joi.string().min(5).max(50).required()

    })

    return schema.validate(user)

}

module.exports = router