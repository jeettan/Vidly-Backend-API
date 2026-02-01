const express = require('express')
const error = require('../middleware/error')
const genresRoute = require("../routes/genres.js")
const customersRoute = require("../routes/customers.js")
const moviesRoute = require("../routes/movies.js")
const rentalsRoute = require("../routes/rentals.js")
const usersRoute = require("../routes/users.js")
const auth = require("../routes/auth.js")
const returns = require("../routes/returns")

module.exports = function (app) {

    app.use(express.json())
    app.use("/api/genres", genresRoute)
    app.use("/api/customers", customersRoute)
    app.use("/api/movies", moviesRoute)
    app.use("/api/rentals", rentalsRoute)
    app.use("/api/users", usersRoute)
    app.use("/api/auth", auth)
    app.use(error)
    app.use("/api/auth", auth)
    app.use("/api/returns", returns)

}