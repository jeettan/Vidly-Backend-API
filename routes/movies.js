const express = require("express")
const router = express.Router()
const mongoose = require("mongoose");
const Movie = require("../models/movie")
const { Genre } = require("../models/genre")
const auth = require('../middleware/auth')

router.get('/', async (req, res) => {
    const movies = await Movie.find()
    console.log(movies)
    return res.send(movies)
})

router.post('/', async (req, res) => {

    const movie = new Movie({
        title: req.body.title,
        genre: {
            name: req.body.genre
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    })

    try {
        const result = await movie.save();
        console.log(result);

    } catch (err) {
        console.log(err)
    }

    return res.send(movie)
})

async function addGenres(movieId, genre) {

    const movie = await Movie.findById(movieId)
    movie.genre.push(genre)
    movie.save()
}

router.post('/addgenrebyid/:id', auth, async (req, res) => {

    const genre = addGenres(req.params.id, new Genre({ name: req.body.genre }))
    res.send(genre)

})

router.put('/updategenrebyid/:id', auth, async (req, res) => {
    const { genreName, newGenre } = req.body;

    const movie = await Movie.findOneAndUpdate(
        {
            _id: req.params.id,
            "genre.name": genreName
        },
        {
            $set: {
                "genre.$.name": newGenre
            }
        },
        { new: true }
    );

    if (!movie)
        return res.status(404).send("Movie or genre not found");

    res.send(movie);
});

router.delete('/deletegenrebyid/:id', auth, async (req, res) => {

    const { genreName } = req.body;

    const movie = await Movie.findOneAndUpdate(
        { _id: req.params.id },
        {
            $pull: {
                genre: { name: genreName }
            }
        },
        { new: true }
    );

    if (!movie)
        return res.status(404).send("Movie not found");

    res.send(movie);
});

router.put('/:id', auth, async (req, res) => {

    try {

        const updates = {};

        const id = req.params.id

        if ("title" in req.body) {
            updates.title = req.body.title;
        }

        if ("numberInStock" in req.body) {
            updates.numberInStock = req.body.numberInStock;
        }

        if ("dailyRentalRate" in req.body) {
            updates.dailyRentalRate = req.body.dailyRentalRate;
        }

        console.log(updates)

        const result = await Movie.findByIdAndUpdate({ _id: id }, {

            $set: updates
        }, { new: true })
        console.log(result)
        res.send(result)

    } catch (err) {

        console.log(err)
    }
})

router.delete('/:id', auth, async (req, res) => {

    const { id } = req.params

    const result = await Movie.deleteMany({ _id: id })

    console.log(result)

    if (!result) return res.status(404).send('The course with the given ID was not found')

    res.send(result)
})

module.exports = router

// We need the following endpoints: addGenreById x, updateGenreById x, deleteGenreById