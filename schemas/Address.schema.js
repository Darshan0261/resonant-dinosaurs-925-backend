const mongoose = require('mongoose');

const AddressSchema = mongoose.Schema({
    name: {type: String, required: true},
    mobile: {type: Number, required: true},
    pin: {type: Number, required: true},
    house: {type: String, required: true},
    locality: {type: String, required: true},
    city: {type: String, required: true},
    state: {type: String, required: true},
    type: {type: String, enum: ['home', 'work'], default: 'home'}
})

module.exports = {
    AddressSchema
}