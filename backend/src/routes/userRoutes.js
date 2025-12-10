const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  getMe,
  updateMe,
  getUser,
  getAllUsers,
  getServices
} = require("../controllers/userController");

router.get("/me", auth, getMe);
router.put("/me", auth, updateMe);
router.get("/all", getAllUsers);
router.get("/services", auth,getServices);
router.get("/:id", getUser);

module.exports = router;