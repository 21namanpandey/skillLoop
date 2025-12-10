const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  createReview,
  getUserReviews,
  checkReview,
  getMyReviews,
  getUserReputation
} = require("../controllers/reviewController");

router.post("/", auth, createReview);
router.get("/user/:userId", getUserReviews);
router.get("/check/:sessionId", auth, checkReview);
router.get("/my", auth, getMyReviews);
router.get("/reputation/:userId", getUserReputation);

module.exports = router;