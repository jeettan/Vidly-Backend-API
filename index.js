const express = require('express')
const Joi = require("joi");
const app = express()

require('express-async-errors')
require('./startup/routes')(app)
require('./startup/db')()
require('./startup/config')()
require('./startup/logging')()
require('./startup/prod')(app)

app.get("/", (req, res) => {
    res.send("Welcome to home")
})

const port = process.env.PORT || 3000

const server = app.listen(port, () => { console.log(`App is listening at ${port}`) })

module.exports = server