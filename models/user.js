const mongoose = require('mongoose')
const config = require('config')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1050
    },
    isAdmin: Boolean
});

UserSchema.methods.generateAuthToken = function () {

    const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'))
    return token
}

const User = mongoose.model('Users', UserSchema);

module.exports = User