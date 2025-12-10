const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  createDispute,
  getMyDisputes,
  getDispute
} = require("../controllers/disputeController");

router.post("/", auth, createDispute);
router.get("/my", auth, getMyDisputes);
router.get("/:id", auth, getDispute);

module.exports = router;