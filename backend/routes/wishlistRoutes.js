const express = require("express");
const router = express.Router();

const {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  toggleWishlist,
} = require("../controllers/wishlistController");

const {protect} = require("../middleware/authMiddleware");

router.post("/:productId", protect, addToWishlist);
router.get("/", protect, getWishlist);
router.delete("/:productId", protect, removeFromWishlist);
router.patch("/:productId", protect, toggleWishlist);

module.exports = router;