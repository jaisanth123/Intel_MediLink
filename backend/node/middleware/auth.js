const jwt = require("jsonwebtoken");
const User = require("../models/UserAuth");

const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && 
        req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ 
        message: "Not authorized - No token provided" 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized - Invalid token" });
  }
};

module.exports = { protect };