const express = require("express");
const { authentication } = require("../middlewares/Authentication.middleware");
const { UserModel } = require("../models/Users.model");
const { idvalidator } = require("../middlewares/idvalidator");
const { ProductModel } = require("../models/Products.model");
const WishlistRouter = express.Router();

WishlistRouter.get("/", authentication, async (req, res) => {
  const { token } = req.body;
  const userId = token.id;
  const user = await UserModel.findOne({ _id: userId });
  const wishlist = user.wishlist;
  res.send(wishlist);
});


WishlistRouter.post("/add/:id", idvalidator, authentication, async (req, res) => {
    const { token } = req.body;
    const productId = req.params["id"];
    const userId = token.id;
    const user = await UserModel.findOne({ _id: userId });
    if (!user) {
      return res.status(401).send({ message: "Access Denied" });
    }
    const product = await ProductModel.findOne({ _id: productId });
    const wishlist = user.wishlist;
    if (wishlist.some((index) => index.productId == productId)) {
      return res.status(409).send({ message: "Product already in wishlist" });
    } else {
      try {
        await UserModel.findOneAndUpdate(
          { _id: userId },
          {
            $push: {
                wishlist: {
                productId,
                price: product.price,
              },
            },
          }
        );
        res.send({ message: "Product added to wishlist" });
      } catch (error) {
        console.log(error);
        return res.status(500).send({ message: error.message });
      }
    }
  });
  
  WishlistRouter.delete(
    "/remove/:id",
    idvalidator,
    authentication,
    async (req, res) => {
      const { token } = req.body;
      const productId = req.params["id"];
      const userId = token.id;
      const user = await UserModel.findOne({ _id: userId });
      if (!user) {
        return res.status(401).send({ message: "Access Denied" });
      }
      const wishlist = user.wishlist;
      if (wishlist.some((index) => index.productId == productId)) {
        try {
          await UserModel.findOneAndUpdate(
            { _id: userId },
            {
              $pull: { wishlist: { productId } },
            }
          );
          res.send({ message: `Product with id ${productId} removed from wishlist` });
        } catch (error) {
          return res.status(500).send({ message: error.message });
        }
      } else {
        return res.status(404).send({ message: "Product not found in wishlist" });
      }
    }
  );
  module.exports = {
    WishlistRouter,
  };
  