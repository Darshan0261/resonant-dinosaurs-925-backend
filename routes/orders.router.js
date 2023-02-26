const express = require('express');
const { authorization } = require('../middlewares/AdminAuthorization.middleware');
const { authentication } = require('../middlewares/Authentication.middleware');
const { OrdersModel } = require('../models/Orders.model');
const { UserModel } = require('../models/Users.model');

const ordersRouter = express.Router();

ordersRouter.get('/', authentication, async (req, res) => {
    const { token } = req.body;
    const userId = token.id;
    const role = token.role;
    if (role == 'admin') {
        try {
            const orders = await OrdersModel.find();
            return res.send(orders)
        } catch (error) {
            return res.status(500).send({ message: error.message });
        }
    }
    try {
        const orders = await OrdersModel.find({ userId });
        res.send(orders)
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
})

ordersRouter.post('/place', authentication, async (req, res) => {
    const { token } = req.body;
    const { addressId } = req.body;
    const userId = token.id;
    try {
        const user = await UserModel.findOne({ _id: userId })
        if (!user) {
            return res.status(401).send({ message: 'Access Denied' })
        }
        const addresses = user.address;
        let address;
        addresses.forEach(add => {
            if (add._id == addressId) {
                address = add;
            }
        })
        if (address == undefined) {
            return res.status(404).send({ message: 'Address Invalid' })
        }
        const orders = user.cart;
        if (orders.length == 0 || !orders) {
            return res.status(404).send({ message: 'Cart not found' })
        }
        let price = 0;
        orders.forEach(product => {
            price = price + product.price*product.quantity;
        })
        const placedAt = Date.now();
        try {
            const order = new OrdersModel({
                order: orders, placedAt, price, address, userId
            })
            await order.save();
            user.cart = [];
            await user.save()
            res.send({ messge: 'Order Placed Sucessfully' })
        } catch (error) {
            res.status(500).send({ message: error.message })
        }
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
})

ordersRouter.delete('/remove', authentication, async (req, res) => {
    const { token, orderId } = req.body;
    const userId = token.id;
    const role = token.role;
    const order = await OrdersModel.findOne({ _id: orderId });
    if (role == 'admin' || order.userId == userId) {
        if (order.status == 'delivered' || order.status == 'onroad') {
            return res.status(400).send({ message: 'Order Removal Failed' })
        }
        try {
            await OrdersModel.findOneAndDelete({ _id: orderId });
            res.send({ message: 'Order Removed Sucessfully' })
        } catch (error) {
            res.status(500).send({ message: error.message })
        }
    } else {
        res.status(401).send({ message: 'Access Denied' })
    }
})

module.exports = {
    ordersRouter
}