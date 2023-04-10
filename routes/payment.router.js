const express = require('express');

/**
 * express.Router() creates modular, mountable route handlers
 * A Router instance is a complete middleware and routing system; for this reason, it is often referred to as a "mini-app".
 */
const payment = express.Router();
// const mongoose = require( 'mongoose' );
// const User = require( '../../models/User' );

const Insta = require('instamojo-nodejs');
const url = require('url');
const { authentication } = require('../middlewares/Authentication.middleware');
const { UserAuth } = require('../middlewares/Authorization.middleware');
const { AddressModel } = require('../models/Address.model');


// /api/bid/pay
payment.post('/pay', (req, res) => {
	Insta.setKeys('test_210ddd090031ed587f6274e7eb4', 'test_f4cf7fa8d157d76602b398d4189');

	const data = new Insta.PaymentData();
	Insta.isSandboxMode(true);

	data.purpose = req.body.purpose;
	data.amount = req.body.amount;
	data.buyer_name = req.body.buyer_name;
	data.redirect_url = req.body.redirect_url;
	data.email = req.body.email;
	data.phone = req.body.phone;
	data.send_email = false;
	data.webhook = 'http://www.example.com/webhook/';
	data.send_sms = false;
	data.allow_repeated_payments = false;

	Insta.createPayment(data, function (error, response) {
		if (error) {
			res.send({ msg: error })
		} else {
			// Payment redirection link at response.payment_request.longurl
			const responseData = JSON.parse(response);
			const redirectUrl = responseData.payment_request.longurl;
			console.log(redirectUrl);

			res.status(200).json({ msg: redirectUrl });
		}
	});

});

/**
 * @route GET api/bid/callback/
 * @desc Call back url for instamojo
 * @access public
 */
payment.get('/callback/', authentication, UserAuth, async (req, res) => {
	const user_id = req.body.token.id;
	const token = req.cookies.token || req.headers.authorization;
	let url_parts = url.parse(req.url, true),
		responseData = url_parts.query;

	if (responseData.payment_id) {
		// let userId = responseData.user_id;

		// Save the info that user has purchased the bid.
		// const bidData = {};
		// bidData.package = 'Bid100';
		// bidData.bidCountInPack = '10';

		// User.findOneAndUpdate( { _id: userId }, { $set: bidData }, { new: true } )
		// 	.then( ( user ) => res.json( user ) )
		// 	.catch( ( errors ) => res.json( errors ) );

		// Redirect the user to payment complete page.

		const address = await AddressModel.findOne({ user_id: user_id, selected: true })

		await fetch('http://localhost:4500/orders/place', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': token
			}
		})

		return res.redirect('http://localhost:5500/done.html');
	}

});

// We export the router so that the server.js file can pick it up
module.exports = { payment };