const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getUserById,
  deleteUser,
  toggleBlockUser,
  updateUser,
} = require("../../controllers/admin/adminUserController");

const { protect } = require("../../middleware/authMiddleware");
const adminMiddleware = require("../../middleware/adminMiddleware");


router.use(protect);
router.use(adminMiddleware);


router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.delete("/:id", deleteUser);
router.patch("/:id/block", toggleBlockUser);
router.put("/:id", updateUser);

module.exports = router;


