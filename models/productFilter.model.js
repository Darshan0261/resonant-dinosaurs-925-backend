const mongoose = require("mongoose");

const ProducFilterSchema = mongoose.Schema({
    product: { type: String, required: true },
    colors: { type: [String], default: [] },
    brands: { type: [String], default: [] }
})

const ProducFiltertModel = mongoose.model("productfilter", ProducFilterSchema);

module.exports = {
    ProducFiltertModel
}