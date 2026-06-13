const express = require("express");
const router = express.Router();

const { protect } = require("../../middleware/authMiddleware");
const adminMiddleware = require("../../middleware/adminMiddleware");

const {
  getAllContacts,
  deleteContact,
  updateContact,
} = require("../../controllers/contactController");




router.get("/", protect, adminMiddleware, getAllContacts);


router.delete("/:id", protect, adminMiddleware, deleteContact);

router.put("/:id", protect, adminMiddleware, updateContact);

module.exports = router;