const express = require("express");
const router = express.Router();

const {
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
} = require("../../controllers/admin/adminOrderController");

const { protect } = require("../../middleware/authMiddleware");
const adminMiddleware = require("../../middleware/adminMiddleware");

router.use(protect);
router.use(adminMiddleware);

router.get("/", getAllOrders);

router.put("/:id",updateOrderStatus);

router.delete("/:id",deleteOrder);

module.exports = router;