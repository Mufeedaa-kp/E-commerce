const Subscriber = require("../models/Subscriber");

const subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    const existingSubscriber =
      await Subscriber.findOne({ email });

    if (existingSubscriber) {
      return res.status(400).json({
        success: false,
        message: "Already subscribed",
      });
    }

    const subscriber =
      await Subscriber.create({ email });
console.log(req.body);
    res.status(201).json({
      success: true,
      data: subscriber,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getSubscribers = async (req, res) => {
  try {
    const subscribers =
      await Subscriber.find().sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      data: subscribers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteSubscriber = async (req, res) => {
  try {
    await Subscriber.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: "Subscriber removed",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  subscribe,
  getSubscribers,
  deleteSubscriber,
};