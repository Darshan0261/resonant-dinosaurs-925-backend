
var PaytmChecksum = require("./PaytmChecksum");

var paytmParams = {};


paytmParams["MID"] = "YOUR_MID_HERE";
paytmParams["ORDERID"] = "YOUR_ORDER_ID_HERE";

var paytmChecksum = PaytmChecksum.generateSignature(paytmParams, "YOUR_MERCHANT_KEY");
paytmChecksum.then(function(result){
	console.log("generateSignature Returns: " + result);
	var verifyChecksum =  PaytmChecksum.verifySignature(paytmParams, "YOUR_MERCHANT_KEY",result);
	console.log("verifySignature Returns: " + verifyChecksum);
}).catch(function(error){
	console.log(error);
});


body = "{\"mid\":\"YOUR_MID_HERE\",\"orderId\":\"YOUR_ORDER_ID_HERE\"}"

var paytmChecksum = PaytmChecksum.generateSignature(body, "YOUR_MERCHANT_KEY");
paytmChecksum.then(function(result){
	console.log("generateSignature Returns: " + result);
	var verifyChecksum =  PaytmChecksum.verifySignature(body, "YOUR_MERCHANT_KEY",result);
	console.log("verifySignature Returns: " + verifyChecksum);
}).catch(function(error){
	console.log(error);
});