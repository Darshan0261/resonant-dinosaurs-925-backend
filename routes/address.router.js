const express = require('express');
const { authentication } = require('../middlewares/Authentication.middleware')
const { UserModel } = require('../models/Users.model')
const addressRouter = express.Router();

addressRouter.get('/', authentication, async (req, res) => {
    const { token } = req.body;
    const userId = token.id;
    try {
        const user = await UserModel.findOne({ _id: userId });
        const addresses = user.address;
        res.send(addresses)
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
})

addressRouter.post('/add', authentication, async (req, res) => {
    const { token } = req.body;
    const userId = token.id;
    try {
        const user = await UserModel.findOne({ _id: userId });
        if (!user) {
            return res.status(401).send({ message: 'Access Denied' })
        }
    } catch (error) {
        return res.status(500).send({ message: error.message })
    }
    const { name, mobile, house, city, state, locality, pin, type } = req.body;
    if (!name || !mobile || !locality || !house || !city || !state || !pin) {
        return res.status(400).send({ message: 'address fields not provided' })
    }
    try {
        await UserModel.findOneAndUpdate(
            { _id: userId },
            {
                $push: {
                    address: {
                        name, mobile, house, city, state, locality, pin, type
                    }
                }
            }
        )
        res.send({ message: 'Address added' })
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: error.message })
    }
})

addressRouter.delete('/remove/:id', authentication, async (req, res) => {
    const { token } = req.body;
    const userId = token.id;
    try {
        const user = await UserModel.findOne({ _id: userId });
        if (!user) {
            return res.status(401).send({ message: 'Access Denied' })
        }
    } catch (error) {
        return res.status(500).send({ message: error.message })
    }
    const addressId = req.params['id'];
    const address = user.address;
    if (!address.some(index => index._id == addressId)) {
        return res.status(404).send({ message: 'Address not found' })
    }
    try {
        await UserModel.findOneAndUpdate({ _id: userId },
            {
                $pull:
                    { address: { _id: addressId } }
            })
        res.send({ message: 'Address Removed' })
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
})

addressRouter.patch('/edit/:id', authentication, async (req, res) => {
    const { token } = req.body;
    const userId = token.id;
    try {
        const user = await UserModel.findOne({ _id: userId });
        if (!user) {
            return res.status(401).send({ message: 'Access Denied' })
        }
    } catch (error) {
        return res.status(500).send({ message: error.message })
    }
    const addressId = req.params['id'];
    const address = user.address;
    if (!address.some(index => index._id == addressId)) {
        return res.status(404).send({ message: 'Address not found' })
    }
    const payload = req.body;
    try {
        address.forEach(index => {
            if (index._id == addressId) {
                for (let chr in payload) {
                    index[chr] = payload[chr];
                }
            }
        })
        await user.save()
        res.send({ message: 'Address Updated' })
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
})

module.exports = {
    addressRouter
}