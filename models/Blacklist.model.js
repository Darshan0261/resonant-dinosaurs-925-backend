const mongoose = require('mongoose');

const BlacklistSchema = mongoose.Schema({
    user_id: String,
    admin_id: String,
    tokens: {type: [String], default: []}
})

const BlacklistModel = mongoose.model('blacklist', BlacklistSchema)

module.exports = {
    BlacklistModel
}