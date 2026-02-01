const mongoose = require('mongoose')

const GenreSchema = new mongoose.Schema({
    name: {
        type: String,
        requird: true,
        minlength: 5,
        maxlength: 50
    }
});

const Genre = mongoose.model('Genre', GenreSchema);

module.exports = {
    Genre,
    GenreSchema
}