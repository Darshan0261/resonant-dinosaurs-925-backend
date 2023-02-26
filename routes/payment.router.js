const express = require( 'express' );
const { authentication } = require('../middlewares/Authentication.middleware');

/**
 * express.Router() creates modular, mountable route handlers
 * A Router instance is a complete middleware and routing system; for this reason, it is often referred to as a "mini-app".
 */
const paymentRouter = express.Router();


const Insta = require('instamojo-nodejs');
const url = require('url');


// /api/bid/pay
paymentRouter.post( '/pay',authentication, ( req, res ) => {
	Insta.setKeys('test_210ddd090031ed587f6274e7eb4', 'test_f4cf7fa8d157d76602b398d4189');
    let {purpose,amount,buyer_name,redirect_url,email,phone}=req.body;
	const data = new Insta.PaymentData();
	Insta.isSandboxMode(true);

	data.purpose =  purpose;
	data.amount = amount;
	data.buyer_name =  buyer_name;
	data.redirect_url =  redirect_url;
	data.email =  email;
	data.phone =  phone;
	data.send_email =  false;
	data.webhook= 'http://www.example.com/webhook/';
	data.send_sms= false;
	data.allow_repeated_payments =  false;

	Insta.createPayment(data, function(error, response) {
		if (error) {
			// some error
		} else {
			// Payment redirection link at response.payment_request.longurl
			const responseData = JSON.parse( response );
			const redirectUrl = responseData.payment_request.longurl;
			console.log( redirectUrl );

			res.status( 200 ).json( {msg:redirectUrl} );
		}
	});

} );

/**
 * @route GET api/bid/callback/
 * @desc Call back url for instamojo
 * @access public
 */
paymentRouter.get( '/callback/', ( req, res ) => {
	let url_parts = url.parse( req.url, true),
		responseData = url_parts.query;

	if ( responseData.payment_id ) {
		return res.redirect('http://127.0.0.1:5501/Frontend/payment_page.html' );
	}

} );

// We export the router so that the server.js file can pick it up
module.exports = {paymentRouter};