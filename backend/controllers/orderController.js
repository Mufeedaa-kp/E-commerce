const Order = require("../models/Order");
const mongoose = require("mongoose");
const Product = require("../models/Products");


const getUserOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const pageNum  = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip     = (pageNum - 1) * limitNum;

    const matchStage = { user: new mongoose.Types.ObjectId(req.user.id) };
    if (status) {matchStage.status = status;}
    matchStage.isDeleted = { $ne: true };

    const pipeline = [
      { $match: matchStage },
      { $sort: { createdAt: -1 } },
      {
        $facet: {
          data: [
            { $skip: skip },
            { $limit: limitNum },
        
            {
              $lookup: {
                from: "products",
                localField: "items.product",
                foreignField: "_id",
                as: "_productsList",
                pipeline: [
                  { $project: { name: 1, price: 1, image: 1 } },
                ],
              },
            },
           
            {
              $addFields: {
                items: {
                  $map: {
                    input: "$items",
                    as: "item",
                    in: {
                      $mergeObjects: [
                        "$$item",
                        {
                          product: {
                            $arrayElemAt: [
                              {
                                $filter: {
                                  input: "$_productsList",
                                  as: "p",
                                  cond: { $eq: ["$$p._id", "$$item.product"] },
                                },
                              },
                              0,
                            ],
                          },
                        },
                      ],
                    },
                  },
                },
              },
            },
            { $project: { _productsList: 0 } },
          ],
          totalCount: [{ $count: "count" }],
        },
      },
      {
        $project: {
          data: 1,
          total: { $ifNull: [{ $arrayElemAt: ["$totalCount.count", 0] }, 0] },
        },
      },
    ];

    const [result] = await Order.aggregate(pipeline);

    res.status(200).json({
      success: true,
      total: result.total,
      page: pageNum,
      pages: Math.ceil(result.total / limitNum),
      data: result.data,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const createOrder = async (req, res) => {
  try {
   const {
      phone, shippingAddress, items,
      subtotal, shipping, tax, discountAmount, totalAmount,
      paymentMethod, status,
    } = req.body;

   const order = await Order.create({
      user: req.user._id,
      phone,
      shippingAddress,
      items,
      subtotal,
      shipping,
      tax,
      discountAmount,
      totalAmount,
      paymentMethod: paymentMethod || "COD",
      paymentStatus: paymentMethod === "Razorpay" ? "Paid" : "Pending",
      status: status || "Pending",
    });

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const getOrderById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid order ID" });
    }

    const [order] = await Order.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(req.params.id) } },
     
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
          pipeline: [{ $project: { name: 1, email: 1 } }],
        },
      },
      { $unwind: "$user" },
      
      {
        $lookup: {
          from: "products",
          localField: "items.product",
          foreignField: "_id",
          as: "_productsList",
          pipeline: [{ $project: { name: 1, price: 1, image: 1 } }],
        },
      },
      {
        $addFields: {
          items: {
            $map: {
              input: "$items",
              as: "item",
              in: {
                $mergeObjects: [
                  "$$item",
                  {
                    product: {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: "$_productsList",
                            as: "p",
                            cond: { $eq: ["$$p._id", "$$item.product"] },
                          },
                        },
                        0,
                      ],
                    },
                  },
                ],
              },
            },
          },
        },
      },
      { $project: { _productsList: 0 } },
    ]);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const updateOrderStatus = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid order ID" });
    }

    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      { new: true, runValidators: true, lean: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteOrder = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid order ID" });
    }
 
    const order = await Order.findByIdAndDelete(req.params.id);
 
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
 
    res.status(200).json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
}