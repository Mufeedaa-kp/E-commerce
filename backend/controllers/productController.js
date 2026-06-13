const Product = require("../models/Products");
const mongoose = require("mongoose");


const createProduct = async (req, res) => {
  try {

     const { name, price, category } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      minPrice,
      maxPrice,
      featured,
      search,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    const pageNum  = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit))); 
    const skip     = (pageNum - 1) * limitNum;

    
    const matchStage = {
      isActive: { $ne: false },
    };

   if (category?.trim()) {
  matchStage.category = category.trim();
}
    if (featured !== undefined) matchStage.featured = featured === "true";

    if (minPrice || maxPrice) {
      matchStage.price = {};
      if (minPrice) matchStage.price.$gte = Number(minPrice);
      if (maxPrice) matchStage.price.$lte = Number(maxPrice);
    }
    if (search) {
      matchStage.$text = { $search: search };
    }

    // const sortOrder = order === "asc" ? 1 : -1;
    // const sortStage = { [sortBy]: sortOrder };

    const allowedSortFields = [
  "price",
  "rating",
  "createdAt",
  "name",
];

const sortField = allowedSortFields.includes(sortBy)
  ? sortBy
  : "createdAt";
    
    const pipeline = [
      { $match: matchStage },
      { $sort:{[sortField]: order === "asc" ? 1 : -1 }},
      {
        $facet: {
          
          data: [
            { $skip: skip },
            { $limit: limitNum },
            {
              $project: {
                name: 1,
                price: 1,
                image: 1,
                category: 1,
                rating: 1,
                stock: 1,
                featured: 1,
              },
            },
          ],
          
          totalCount: [
            { $count: "count" },
          ],
        },
      },
      {
        $project: {
          data: 1,
          total: { $ifNull: [{ $arrayElemAt: ["$totalCount.count", 0] }, 0] },
        },
      },
    ];

    const [result] = await Product.aggregate(pipeline);

    res.status(200).json({
      success: true,
      total: result.total,
      page: pageNum,
      pages: Math.ceil(result.total / limitNum),
      limit: limitNum,
      data: result.data,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}


const getProductById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid product ID" });
    }

    const product = await Product.findById(req.params.id).lean();

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid product ID" });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).lean

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const deleteProduct = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid product ID" });
    }

    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
}
