const mongoose = require("mongoose");

const CartSchema = mongoose.Schema(
  {
    productId: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
  },
  { _id: false }
);

module.exports = {
  CartSchema,
};
