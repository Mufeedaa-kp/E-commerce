const express = require("express");

const router = express.Router();

const {
  subscribe,
  getSubscribers,
  deleteSubscriber,
} = require("../controllers/subscriberController");

router.post("/", subscribe);

router.get("/", getSubscribers);

router.delete("/:id", deleteSubscriber);

module.exports = router;