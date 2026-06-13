const Product = require("../../models/Products");
const Order = require("../../models/Order");
const User = require("../../models/User");

const getDashboardStats = async (req, res) => {
  try {
   const [products, orders, users] = await Promise.all([
  Product.countDocuments({ isActive: { $ne: false } }),
  Order.find().select("status"),
  User.countDocuments({ role: { $ne: "admin" } }),
]);
     

    const revenueResult = await Order.aggregate([
  {
    $match: {
      status: "Delivered",
    },
  },
  {
    $group: {
      _id: null,
      totalRevenue: { $sum: "$totalAmount" },
    },
  },
]);

    const revenue = revenueResult?.[0]?.totalRevenue || 0;

    res.status(200).json({
      success: true,
      data: {
        products,
        orders,
        users,
        revenue,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
};