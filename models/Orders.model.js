const mongoose = require('mongoose');
const { CartSchema } = require('../schemas/Cart.Schema');

const OrderSchema = mongoose.Schema({
    order: {type: [CartSchema], required: true},
    price: {type: Number, required: true},
    placedAt: {type: Date, required: true},
    deliveredOn: Date,
    address_id : {type: String, required: true},
    status: {
        type: String, 
        enum: ['inprocess', 'declined', 'placed', 'delivered', 'onroad', 'cancelled'],
        default: 'placed'
    },
    user_id: {type: String, required: true}
})

const OrdersModel = mongoose.model('order', OrderSchema);

module.exports = {
    OrdersModel
}