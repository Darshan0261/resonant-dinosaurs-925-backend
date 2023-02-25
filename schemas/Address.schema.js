const mongoose = require('mongoose');

const AddressSchema = mongoose.Schema({
    name: {type: String, required: true},
    mobile: {type: Number, required: true},
    pin: {type: Number, required: true},
    street: {type: String, required: true},
    town: {type: String, required: true},
    type: {type: String, enum: ['home', 'work'], default: 'home'}
})

module.exports = {
    AddressSchema
}