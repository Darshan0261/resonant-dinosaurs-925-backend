const express = require('express');
const jwt = require('jsonwebtoken');
const cookie = require('cookie')
const bcrypt = require('bcrypt');
const { AdminModel } = require('../models/Admin.model');
const { authentication } = require('../middlewares/Authentication.middleware');
const { AdminAuth } = require('../middlewares/Authorization.middleware');
const { BlacklistModel } = require('../models/Blacklist.model');
require('dotenv').config()

const adminRouter = express.Router();

adminRouter.post('/register', async (req, res) => {
    const { first_name, last_name, email, password, mobile, adminkey } = req.body;
    if (!adminkey || adminkey != process.env.ADMIN_LOGIN_KEY) {
        return res.status(401).send({ message: 'Access Denied' })
    }

    if (!mobile || !first_name || !last_name || !password) {
        return res.status(401).send({ message: 'Please provide all fields' })
    }

    try {
        let check = await AdminModel.findOne({ mobile });
        if (check) {
            return res.status(409).send({ message: 'Admin already registerd' })
        }
    } catch (error) {
        return res.status(501).send({ message: error.message })
    }

    bcrypt.hash(password, +process.env.saltRounds, async function (err, hashedPass) {
        if (err) {
            console.log(err);
            return res.status(404).send({ message: err.message })
        }
        try {
            const user = new AdminModel({
                first_name, last_name, email, password: hashedPass, mobile
            })
            await user.save()
            const Blacklist = new BlacklistModel({ admin_id: user._id });
            await Blacklist.save();
            res.send({ message: 'Admin Registered Sucessfully' })
        } catch (error) {
            console.log(error)
            return res.status(404).send({ message: error.message })
        }
    });

})

adminRouter.post('/login', async (req, res) => {
    const { mobile, password } = req.body;
    if (!mobile || !password) {
        return res.status(401).send({ message: 'Access Denied' })
    }
    try {
        const user = await AdminModel.findOne({ mobile });
        if (!user) {
            return res.status(401).send({ message: 'Access Denied' })
        }

        bcrypt.compare(password, user.password, async function (err, result) {
            if (err) {
                return res.status(404).send({ message: err.message })
            }
            if (result) {
                var token = jwt.sign({ id: user._id, role: 'admin' }, process.env.LOGIN_TOKEN_SECRET);
                res.cookie('token', token);
                const userInfo = {
                    mobile: user.mobile,
                    email: user.email,
                    role: user.role,
                    name: user.first_name + ' ' + user.last_name
                }
                res.cookie('userInfo', userInfo)
                return res.send({ message: 'Login Sucessful', token, name: user.name })
            } else {
                res.status(403).send({ message: 'Wrong Credentials' })
            }
        });
    } catch (error) {
        return res.status(501).send({ message: error.message })
    }
})

adminRouter.get('/logout', authentication, AdminAuth, async (req, res) => {
    const token = req.cookies.token || req.headers.authorization;
    const { id } = req.body.token;
    try {
        const Blacklist = await BlacklistModel.findOne({ admin_id: id });
        Blacklist.token.push(token);
        await Blacklist.save();
        return res.send({ message: 'Logout Successfull' })
    } catch (error) {
        return res.status(501).send({ message: error.message })
    }
})


module.exports = {
    adminRouter
}