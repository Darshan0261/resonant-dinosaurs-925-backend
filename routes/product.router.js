const express = require("express");
const { ProductModel } = require("../models/Products.model");
const { idvalidator } = require("../middlewares/idvalidator");
const { authentication } = require('../middlewares/Authentication.middleware')
const { authorization } = require('../middlewares/AdminAuthorization.middleware');


const productRouter = express.Router();

productRouter.get("/", async (req, res) => {
    try {
        const data = await ProductModel.find();
        res.send(data);
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
})

productRouter.post("/add", authentication, authorization, async (req, res) => {
    const payload = req.body;
    try {
        const product = new ProductModel(payload)
        await product.save()
        res.send({ message: "Product added" });
    } catch (error) {
        return res.status(500).send({ message: error.message })
    }
});

productRouter.get('/search', async (req, res) => {
    const payload = req.query;
    if (payload.title) {
        let title = payload.title.toLowerCase();
        try {
            const products = await ProductModel.find({ title: { $regex: '(?i)' + title } });
            return res.send(products)
        } catch (error) {
            return res.send({ message: error.message })
        }
    }
    try {
        const products = await ProductModel.find(payload)
        res.send(products)
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
})


productRouter.get("/:id", idvalidator, async (req, res) => {
    const id = req.params['id'];
    try {
        const product = await ProductModel.findOne({ _id: id })
        res.send(product)
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
})


productRouter.patch("/update/:id", authentication, authorization, idvalidator, async (req, res) => {
    let id = req.params.id;
    const update = req.body;
    try {
        await ProductModel.findByIdAndUpdate(id, update);
        res.send({ message: "Product Updated Sucessfully" });
    }
    catch (error) {
        res.status(500).send({ message: error.message })
    }
})

productRouter.delete("/delete/:id", authentication, authorization, idvalidator, async (req, res) => {
    let id = req.params.id;
    try {
        await ProductModel.findByIdAndDelete(id);
        res.send({ message: "Product Removed Sucessfully" });
    }
    catch (error) {
        res.status(500).send({ message: error.message })
    }
})

module.exports = {
    productRouter
}