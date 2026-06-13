const express = require("express");
const router = express.Router();

const { protect } = require("../../middleware/authMiddleware");
const adminMiddleware = require("../../middleware/adminMiddleware");

const {
  getSubscribers,
  deleteSubscriber,
} = require("../../controllers/subscriberController");




router.get("/", protect, adminMiddleware, getSubscribers);


router.delete("/:id", protect, adminMiddleware, deleteSubscriber);

module.exports = router;