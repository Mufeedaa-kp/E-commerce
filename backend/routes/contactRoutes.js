const express = require("express");
const router = express.Router();

const {
  createContact,
  getAllContacts,
  deleteContact,
  updateContact,
} = require("../controllers/contactController");

router.post("/", createContact);

router.get("/", getAllContacts);

router.put("/:id", updateContact);

router.delete("/:id", deleteContact);

module.exports = router;