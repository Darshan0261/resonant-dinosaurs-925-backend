
const { BlacklistModel } = require('../models/Blacklist.model')

const jwt = require('jsonwebtoken')
require('dotenv').config()

const authentication = (req, res, next) => {
    let token = req.cookies.token || req.headers.authorization;
    if (!token) {
        return res.status(401).send({ message: 'Access Denied' })
    }
    jwt.verify(token, process.env.LOGIN_TOKEN_SECRET, async function (err, decoded) {
        if (err) {
            return res.status(404).send({ message: err.message })
        }
        req.body.token = decoded;
        if (decoded.role == 'admin') {
            try {
                const Blacklist = await BlacklistModel.findOne({ admin_id: decoded.id })
                const tokens = Blacklist.tokens;
                if (tokens.some(index => index == token)) {
                    return res.status(401).send({ message: 'Login Again' })
                }
            } catch (error) {
                return res.status(500).send({ message: error.message })
            }
        } else {
            try {
                const Blacklist = await BlacklistModel.findOne({ user_id: decoded.id })
                const tokens = Blacklist.tokens;
                if (tokens.some(index => index == token)) {
                    return res.status(401).send({ message: 'Login Again' })
                }
            } catch (error) {
                return res.status(500).send({ message: error.message })
            }
        }
        req.body.token = decoded;
        next()
    });
}

module.exports = {
    authentication
}