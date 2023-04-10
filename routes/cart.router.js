const express = require("express");
const { authentication } = require("../middlewares/Authentication.middleware");
const { UserModel } = require("../models/Users.model");
const { idvalidator } = require("../middlewares/idvalidator");
const { ProductModel } = require("../models/Products.model");
const { AdminAuth, UserAuth } = require("../middlewares/Authorization.middleware");

const cartRouter = express.Router();

cartRouter.get("/", authentication, UserAuth, async (req, res) => {
  const { token } = req.body;
  const userId = token.id;
  try {
    const user = await UserModel.findOne({ _id: userId });
    const cart = user.cart;
    res.send(cart);
  } catch (error) {
    return res.status(501).send({ message: error.message })
  }
});

cartRouter.get("/:id", authentication, UserAuth, idvalidator, async (req, res) => {
  const { token } = req.body;
  const productId = req.params["id"];
  const userId = token.id;
  try {
    const user = await UserModel.findOne({ _id: userId });
    if (!user) {
      return res.status(401).send({ message: "Login to continue" });
    }
    const cart = user.cart;
    if (cart.some((index) => index.productId == productId)) {
      return res.send({ message: "Product already in cart" });
    }
    res.status(409).send({ message: "Product is not in cart" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

cartRouter.post("/add/:id",  authentication, UserAuth, idvalidator, async (req, res) => {
  const { token } = req.body;
  const productId = req.params["id"];
  const userId = token.id;
  const user = await UserModel.findOne({ _id: userId });
  if (!user) {
    return res.status(401).send({ message: "Access Denied" });
  }
  const product = await ProductModel.findOne({ _id: productId });
  const cart = user.cart;
  if (cart.some((index) => index.productId == productId)) {
    return res.status(409).send({ message: "Product already in cart" });
  } else {
    try {
      await UserModel.findOneAndUpdate(
        { _id: userId },
        {
          $push: {
            cart: {
              productId,
              quantity: 1,
              price: product.price,
            },
          },
        }
      );
      res.send({ message: "Product added to cart" });
    } catch (error) {
      return res.status(501).send({ message: error.message });
    }
  }
});

cartRouter.delete("/remove/:id", authentication, UserAuth, idvalidator, async (req, res) => {
  const { token } = req.body;
  const productId = req.params["id"];
  const userId = token.id;
  const user = await UserModel.findOne({ _id: userId });
  if (!user) {
    return res.status(401).send({ message: "Access Denied" });
  }
  const cart = user.cart;
  if (cart.some((index) => index.productId == productId)) {
    try {
      await UserModel.findOneAndUpdate(
        { _id: userId },
        {
          $pull: { cart: { productId } },
        }
      );
      res.send({ message: `Product with id ${productId} removed from cart` });
    } catch (error) {
      return res.status(501).send({ message: error.message });
    }
  } else {
    return res.status(404).send({ message: "Product not found in cart" });
  }
}
);

cartRouter.patch("/increase/:id", authentication, UserAuth, idvalidator, async (req, res) => {
  const { token } = req.body;
  const productId = req.params["id"];
  const userId = token.id;
  const user = await UserModel.findOne({ _id: userId });
  if (!user) {
    return res.status(401).send({ message: "Access Denied" });
  }
  const product = await ProductModel.findOne({ _id: productId });
  const price = product.price;
  const cart = user.cart;
  if (cart.some((index) => index.productId == productId)) {
    cart.forEach((index) => {
      if (index.productId == productId) {
        index.quantity++;
        index.price = index.price + price - price * product.discount;
      }
    });
    await user.save();
    res.send({ message: `Qantity increased of id ${productId}` });
  } else {
    return res.status(404).send({ message: "Product not found in cart" });
  }
}
);

cartRouter.patch("/decrease/:id", authentication, UserAuth, idvalidator,  async (req, res) => {
  const { token } = req.body;
  const productId = req.params["id"];
  const userId = token.id;
  const user = await UserModel.findOne({ _id: userId });
  if (!user) {
    return res.status(401).send({ message: "Access Denied" });
  }
  const product = await ProductModel.findOne({ _id: productId });
  const price = product.price;
  const cart = user.cart;
  if (cart.some((index) => index.productId == productId)) {
    let flag = false;
    cart.forEach((index) => {
      if (index.productId == productId) {
        if (index.quantity == 1) {
          flag = true;
        } else {
          index.quantity--;
          index.price = index.price - price - price * product.discount;
        }
      }
    });
    if (flag) {
      return res.status(409).send({ message: "Conflict in request" });
    }
    await user.save();
    res.send({ message: `Qantity decreased of id ${productId}` });
  } else {
    return res.status(404).send({ message: "Product not found in cart" });
  }
}
);

module.exports = {
  cartRouter,
};
