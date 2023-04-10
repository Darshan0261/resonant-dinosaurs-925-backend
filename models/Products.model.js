const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema({
    title: { type: String, required: true },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    gender: { type: String, enum: ["male", "female", "both"], default: "both" },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    rating: { type: Number, default: 1 },
    image_1: { type: String, required: true },
    image_2: { type: String, required: true },
    image_3: { type: String, required: true },
    image_4: { type: String, required: true },
    image_5: { type: String, required: true },
    image_6: { type: String, required: true },
    color: { type: String, required: true },
    types: { type: [], required: true }
})

const ProductModel = mongoose.model("product", ProductSchema);

module.exports = {
    ProductModel
}