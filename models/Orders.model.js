const mongoose = require('mongoose');
const { AddressSchema } = require('../schemas/Address.schema');
const { CartSchema } = require('../schemas/Cart.Schema');

const OrderSchema = mongoose.Schema({
    order: {type: [CartSchema], required: true},
    price: {type: Number, required: true},
    placedAt: {type: Date, required: true},
    deliveredOn: Date,
    address : {type: AddressSchema, required: true},
    status: {
        type: String, 
        enum: ['inprocess', 'declined', 'placed', 'delivered', 'onroad'],
        default: 'placed'
    },
    userId: {type: String, required: true}
})

const OrdersModel = mongoose.model('order', OrderSchema);

module.exports = {
    OrdersModel
}