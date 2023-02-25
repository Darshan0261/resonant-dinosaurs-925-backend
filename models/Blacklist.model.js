const mongoose = require('mongoose');

const BlacklistSchema = mongoose.Schema({
    userId: String,
    tokens: {type: [String], default: []}
})

const BlacklistModel = mongoose.model('blacklist', BlacklistSchema)

module.exports = {
    BlacklistModel
}