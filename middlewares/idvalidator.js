const { ProductModel } = require("../models/Products.model");

const idvalidator = async (req, res, next) => {
    let id = req.params['id'];
    if (id.length !== 24) {
        return res.status(404).send({ message: "Product not found" });
    }
    try {
        const product = await ProductModel.findOne({ _id: id });
        if (product) {
            next();
        }
        else {
            res.status(404).send({ message: "Product not found" });
        }
    } catch (error) {
        res.status(500).send({ message: error.message});
    }

}

module.exports = {
    idvalidator
}