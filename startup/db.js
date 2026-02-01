const mongoose = require("mongoose");
const config = require('config')

module.exports = function () {

    mongoose
        .connect(`${config.get('db')}`)
        .then(() => {
            console.log(mongoose.connection.name)
            console.log(`Successfully connected to ${config.get('db')}`);
        })
        .catch((err) => console.error(err));

}