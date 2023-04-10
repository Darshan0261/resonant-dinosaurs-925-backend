const mongoose = require('mongoose');
const { CartSchema } = require('../schemas/Cart.Schema')
const { WishlistSchema } = require('../schemas/Wishlist.Schema')

const UserSchema = mongoose.Schema({
    first_name:{type:String, required: true},
    last_name: {type:String, required: true},
    email: {type:String, required: true},
    gender: { type: String, enum: ['male', 'female','other'], required: true },
    mobile: { type: Number, required: true },
    password: { type: String, required: true },
    cart: {
        type: [CartSchema],
        default: []
    },
    wishlist: {
        type: [WishlistSchema],
        default: []
    }
})

const UserModel = mongoose.model('user', UserSchema);

module.exports = {
    UserModel
}