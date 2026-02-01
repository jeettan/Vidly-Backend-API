const User = require('../models/user')
const jwt = require('jsonwebtoken')
const config = require('config')


describe('User Model', () => {

    it('should generate a valid auth token', () => {

        const user = new User()

        user._id = '64a1f2b5c2e4f2a1b2c3d4e5'
        user.isAdmin = true

        let token = user.generateAuthToken()

        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));

        expect(decoded).toMatchObject({
            _id: user._id.toString(),
            isAdmin: true
        })

    })

})