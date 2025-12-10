const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  createSession,
  getMySessions,
  getSessionById,
  confirmSession,
  getBlockchainStats
} = require("../controllers/sessionController");

router.post("/", auth, createSession);
router.get("/my", auth, getMySessions);
router.get("/:id", auth, getSessionById);
router.put("/:id/confirm", auth, confirmSession);
router.get("/blockchain/stats", auth, getBlockchainStats);

module.exports = router;