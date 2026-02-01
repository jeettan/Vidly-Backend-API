const mongoose = require('mongoose')

const CustomerSchema = new mongoose.Schema({
    name: {
        type: String,
        requird: true,
        minlength: 3,
        maxlength: 50
    },
    phone: {
        type: Number,
        required: true
    },
    isGold: {
        type: Boolean,
        default: false
    }
});

const Customer = mongoose.model('Customers', CustomerSchema);

module.exports = Customer