const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  createRequest,
  getIncomingRequests,
  getOutgoingRequests,
  updateRequestStatus
} = require("../controllers/requestController");

router.post("/", auth, createRequest);
router.get("/incoming", auth, getIncomingRequests);
router.get("/outgoing", auth, getOutgoingRequests);
router.put("/:id/status", auth, updateRequestStatus);

module.exports = router;