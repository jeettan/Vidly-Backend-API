const mongoose = require('mongoose')

const RentalSchema = new mongoose.Schema({
    movieName: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 50
    },
    rentalDate: {
        type: Date,
        required: true
    },
    returnDate: {
        type: Date,
        required: true
    },
    customerName: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    price: {

        type: Number,
        required: true,
        min: 0,
        max: 10000
    }
});

const Rental = mongoose.model('Rental', RentalSchema);

module.exports = Rental