const User = require("../models/User");
const mongoose = require("mongoose");


const getWishlistAggregation = (userId) => {
  return User.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(userId) } },
    {
      $lookup: {
        from: "products",
        localField: "wishlist",
        foreignField: "_id",
        as: "wishlistDetails",
        pipeline: [
          { $project: { name: 1, price: 1, image: 1, category: 1, rating: 1 } },
        ],
      },
    },
    { $project: { wishlistDetails: 1 } },
  ]);
};


const addToWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.productId;

    // Use $addToSet directly — it's idempotent; no need to fetch and .some() first.
    // Match only if the product is NOT already in the wishlist to detect duplicates.
    const updated = await User.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(userId),
        wishlist: { $ne: new mongoose.Types.ObjectId(productId) },
      },
      { $addToSet: { wishlist: new mongoose.Types.ObjectId(productId) } },
      { new: true }
    );

    // If no document was updated, either user doesn't exist or product already in wishlist
    if (!updated) {
      const user = await User.exists({ _id: userId });
      if (!user) return res.status(404).json({ message: "User not found" });
      return res.status(400).json({ message: "Already in wishlist" });
    }

    const [result] = await getWishlistAggregation(userId);

    res.json({
      message: "Added to wishlist",
      wishlist: result?.wishlistDetails || [],
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getWishlist = async (req, res) => {
  try {
    const [result] = await getWishlistAggregation(req.user.id);

    if (!result) return res.status(404).json({ message: "User not found" });

    res.json(result.wishlistDetails || []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.productId;

    // Use findOneAndUpdate to confirm user exists in a single query
    const updated = await User.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(userId) },
      { $pull: { wishlist: new mongoose.Types.ObjectId(productId) } },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "User not found" });

    const [result] = await getWishlistAggregation(userId);

    res.json({
      message: "Removed from wishlist",
      wishlist: result?.wishlistDetails || [],
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const toggleWishlist = async (req, res) => {
  try {
    const userId    = req.user.id;
    const productId =  new mongoose.Types.ObjectId(req.params.productId);

    

    const userExists = await User.exists({
  _id: userId,
});

if (!userExists) {
  return res.status(404).json({
    message: "User not found",
  });
}


    const exists = await User.exists({
      _id: userId,
      wishlist: productId,
    });
    const update = exists
      ? { $pull:    { wishlist:(productId) } }
      : { $addToSet: { wishlist:(productId) } };

    await User.updateOne({ _id: userId }, update)

    res.json({ message: exists ? "Removed from wishlist" : "Added to wishlist" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  toggleWishlist,
}