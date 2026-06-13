const express = require("express");
const router = express.Router();

const {
  getAllProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct

} = require("../../controllers/admin/adminProductController");

const { protect } = require("../../middleware/authMiddleware");
const adminMiddleware = require("../../middleware/adminMiddleware");

router.use(protect);
router.use(adminMiddleware);

router.get("/", getAllProducts);
router.post("/",createProduct)
router.get("/:id",getProductById)
router.patch("/:id",updateProduct)
router.delete("/:id",deleteProduct)

module.exports = router;