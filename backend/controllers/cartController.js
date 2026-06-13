const Cart = require("../models/Cart");
const mongoose = require("mongoose");


const getCartWithProducts = (userId) => {
  return Cart.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId) } },
    { $unwind: { path: "$products", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "products",
        localField: "products.product",
        foreignField: "_id",
        as: "products.productDetails",
       
        pipeline: [
          { $project: { name: 1, price: 1, image: 1, stock: 1, sizes: 1 } },
        ],
      },
    },
    {
      $addFields: {
        "products.productDetails": {
          $arrayElemAt: ["$products.productDetails", 0],
        },
      },
    },
    {
      $group: {
        _id: "$_id",
        user: { $first: "$user" },
        createdAt: { $first: "$createdAt" },
        updatedAt: { $first: "$updatedAt" },
        products: { $push: "$products" },
      },
    },
  ])
}


const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, size = "" } = req.body;
    const userId = req.user.id;

    // Single atomic upsert — no pre-fetch, no in-memory findIndex
    // Step 1: Try to increment quantity on an existing matching product+size entry
    const updated = await Cart.findOneAndUpdate(
      { user: userId, "products.product": productId, "products.size": size },
      { $inc: { "products.$.quantity": quantity } },
      { new: false }  // we only care whether a doc was matched, not the result
    );

    if (!updated) {
      // Step 2: No matching product+size found — push new entry (or create cart)
      await Cart.findOneAndUpdate(
        { user: userId },
        { $push: { products: { product: productId, quantity, size } } },
        { upsert: true }  // creates the cart doc if user has none yet
      );
    }

    const [updatedCart] = await getCartWithProducts(userId);

    res.status(200).json({
      success: true,
      message: "Product added to cart",
      data: updatedCart || { user: userId, products: [] },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const [cart] = await getCartWithProducts(userId);

    if (!cart) {
      return res.status(200).json({
        success: true,
        message: "Cart is empty",
        data: { user: userId, products: [] },
      })
    }

    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}


const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params
    const { size = "" } = req.body
    const userId = req.user.id

    // findOneAndUpdate does the existence check + pull in one round-trip
    const cart = await Cart.findOneAndUpdate(
      { user: new mongoose.Types.ObjectId(userId) },
      {
        $pull: {
          products: {
            product: new mongoose.Types.ObjectId(productId),
            size,
          },
        },
      },
      { new: false } // we only need to know if the doc existed
    );

    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    const [updatedCart] = await getCartWithProducts(userId);

    res.status(200).json({
      success: true,
      message: "Product removed from cart",
      data: updatedCart,   
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateCartQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity, size = "" } = req.body;
    const userId = req.user.id;

    const updatedCart = await Cart.findOneAndUpdate(
      {
        user: userId,
        products: {
          $elemMatch: {
            product: new mongoose.Types.ObjectId(productId),
            size: size,
          },
        },
      },
      { $set: { "products.$.quantity": quantity } },
      { new: true }
    );

    if (!updatedCart) {
      return res.status(404).json({ success: false, message: "Cart or product not found in cart" });
    }

    const [cartWithProducts] = await getCartWithProducts(userId);

    res.status(200).json({
      success: true,
      message: "Quantity updated successfully",
      data: cartWithProducts,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await Cart.findOneAndUpdate(
      { user: new mongoose.Types.ObjectId(userId) },
      { $set: { products: [] } },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ success: false, message: "Cart not found" })
    }

    res.status(200).json({
      success: true,
      message: "Cart cleared",
      data: result,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

module.exports = {
  addToCart,
  getCart,
  removeFromCart,
  updateCartQuantity,
  clearCart,
}