const express = require("express");
const {
  registerUser,
  loginUser,
  getUsers,
  updateProfile,
} = require("../controllers/authController");
const { protect } = require("../middleware/auth");

const router = express.Router();

// Register route
router.post("/register", registerUser);

// Login route
router.post("/login", loginUser);

// Get user profile
router.get("/profile", protect, async (req, res) => {
  try {
    // Since we attached the user in protect middleware, we can access it here
    const user = req.user;
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      address: user.address,
      gender: user.gender
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile" });
  }
});

// Update profile
router.put("/profile", protect, updateProfile);

module.exports = router;
