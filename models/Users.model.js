const mongoose = require('mongoose');
const { CartSchema } = require('../schemas/Cart.Schema')
const { AddressSchema } = require('../schemas/Address.schema')

const UserSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: String,
    gender: { type: String, enum: ['male', 'female'], required: true },
    mobile: { type: Number, required: true },
    password: { type: String, required: true },
    address: {
        type: [AddressSchema],
        default: []
    },
    cart: {
        type: [CartSchema],
        default: []
    }
})

const UserModel = mongoose.model('user', UserSchema);

module.exports = {
    UserModel
}