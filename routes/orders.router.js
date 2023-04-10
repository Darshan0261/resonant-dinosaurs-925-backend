const express = require('express');
const { authentication } = require('../middlewares/Authentication.middleware');
const { OrdersModel } = require('../models/Orders.model');
const { UserModel } = require('../models/Users.model');
const { AddressModel } = require('../models/Address.model');

const ordersRouter = express.Router();

ordersRouter.get('/', authentication, async (req, res) => {
    const { token } = req.body;
    const userId = token.id;
    const role = token.role;
    try {
        if (role == 'admin') {
            const orders = await OrdersModel.find();
            return res.send(orders)
        } else {
            const orders = await OrdersModel.find({ user_id: userId });
            return res.send(orders)
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
})

ordersRouter.post('/place', authentication, async (req, res) => {
    const { token } = req.body;
    const userId = token.id;
    try {
        const user = await UserModel.findOne({ _id: userId })
        if (!user) {
            return res.status(401).send({ message: 'Access Denied' })
        }
        const address = await AddressModel.findOne({ user_id: userId, selected: true });
        if (!address) {
            return res.status(404).send({ message: 'Address Not Found' })
        }
        const orders = user.cart;
        if (orders.length == 0 || !orders) {
            return res.status(404).send({ message: 'Cart not found' })
        }
        let price = 0;
        orders.forEach(product => {
            price = price + product.price;
        })
        const placedAt = Date.now();
        try {
            const order = new OrdersModel({
                order: orders, placedAt, price, address_id: address._id, user_id: userId
            })
            await order.save();
            user.cart = [];
            await user.save()
            res.send({ messge: 'Order Placed Sucessfully' })
        } catch (error) {
            res.status(501).send({ message: error.message })
        }
    } catch (error) {
        res.status(501).send({ message: error.message })
    }
})

ordersRouter.delete('/cancel/:id', authentication, async (req, res) => {
    const { token } = req.body;
    const { orderId } = req.params['id'];
    const userId = token.id;
    const role = token.role;
    try {
        const order = await OrdersModel.findOne({ _id: orderId });
        if (role == 'admin' || order.userId == userId) {
            if (order.status == 'delivered' || order.status == 'onroad') {
                return res.status(400).send({ message: `${order.status} Order Cannot Be Cancelled` })
            }
            try {
                order.status = 'cancelled';
                await order.save();
                res.send({ message: 'Order Cancelled Sucessfully' })
            } catch (error) {
                res.status(500).send({ message: error.message })
            }
        } else {
            res.status(401).send({ message: 'Access Denied' })
        }
    } catch (error) {
        return res.status(501).send({ message: error.message })
    }
})

module.exports = {
    ordersRouter
}