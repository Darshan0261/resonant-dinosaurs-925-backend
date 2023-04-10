const mongoose = require("mongoose");

const WishlistSchema = mongoose.Schema(
  {
    productId: { type: String, required: true },
    price: { type: Number, required: true },
  },
  { _id: false }
);

module.exports = {
    WishlistSchema,
};
