const mongoose = require("mongoose");

const ProducFilterSchema = mongoose.Schema({
    category: { type: String, required: true },
    color: { type: [String], default: [] },
    brands: { type: [String], default: [] }
})

const ProducFiltertModel = mongoose.model("productfilter", ProducFilterSchema);

module.exports = {
    ProducFiltertModel
}