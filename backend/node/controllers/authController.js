const User = require("../models/UserAuth");

// Register a new user
const registerUser = async (req, res) => {
  const { name, email, password, address, gender } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new User({
      name,
      email,
      password,
      address,
      gender
    });

    await user.save();

    const token = user.generateToken();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Login a user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Email not registered" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const token = user.generateToken();

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all users (Protected Route)
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { name, email, address, gender } = req.body;

    // Update user fields
    user.name = name || user.name;
    user.email = email || user.email;
    user.address = address || user.address;
    user.gender = gender || user.gender;

    await user.save();

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      address: user.address,
      gender: user.gender
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating profile" });
  }
};


module.exports = { 
  registerUser, 
  loginUser, 
  getUsers, 
  updateProfile 
};
