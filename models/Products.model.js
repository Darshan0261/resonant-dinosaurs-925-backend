const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: {type: String, required: true},
    brand: { type: String, required: true },
    category: { type: String, required: true },
    gender: { type: String, enum: ["male", "female", "both"], default: "both" },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    image_1: { type: String, required: true },
    image_2: { type: String, required: true },
    image_3: { type: String, required: true },
    image_4: { type: String, required: true },
    color: String
})

const ProductModel = mongoose.model("product", ProductSchema);

module.exports = {
    ProductModel
}