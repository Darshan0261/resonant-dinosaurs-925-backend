const mongoose = require('mongoose');

const AddressSchema = mongoose.Schema({
    name: { type: String, required: true },
    mobile: { type: Number, required: true },
    pin: { type: Number, required: true },
    house: { type: String, required: true },
    locality: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    address_type: { type: String, enum: ['home', 'work'], default: 'home' },
    user_id: { type: String, required: true, index: true },
    selected: { type: Boolean, default: false }
})

const AddressModel = mongoose.model('address', AddressSchema)

module.exports = {
    AddressModel
}