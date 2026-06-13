const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/Order");

const razorpay = new Razorpay({
  key_id: process.env.VITE_RAZORPAY_KEY_ID,
  key_secret: process.env.VITE_RAZORPAY_KEY_SECRET,
});

const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body; // amount in rupees

    const options = {
      amount: Math.round(amount * 100), // convert to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);
    res.json({ success: true, order: razorpayOrder });
  } catch (err) {
    res.status(500).json({ message: "Failed to create order" });
  }
};

// Step 2: Verify payment signature after success
const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderData, // your cart/order info
    } = req.body;

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    // Save order to DB after verified
    const newOrder = new Order({
      ...orderData,
      paymentId: razorpay_payment_id,
      paymentStatus: "Paid",
      status: "Pending",
    });
    await newOrder.save();

    res.json({ success: true, message: "Payment verified", order: newOrder });
  } catch (err) {
    res.status(500).json({ message: "Verification error" });
  }
};

module.exports = { createRazorpayOrder, verifyPayment };