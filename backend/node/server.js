const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const multer = require("multer");
const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");
const path = require("path");
dotenv.config();
connectDB();

const app = express();

const corsOptions = {
  origin: "http://localhost:5173", // Replace with your frontend URL
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
};

// Use CORS with options
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.json());

// Set up multer for file uploads
const upload = multer({ dest: "uploads/" }); // Temporary storage for uploaded files

// Authentication Routes
app.use("/api/auth", authRoutes);

// Chat Route - Redirected to /llm-chat
app.post("/api/chat", async (req, res) => {
  try {
    const message = req.body.message;

    // Call the Python backend /llm-chat endpoint
    const response = await axios.post("http://localhost:8000/llm-chat", {
      message: message,
    });

    // Forward the response from Python backend to the frontend
    res.json(response.data);
  } catch (error) {
    console.error("Error in chat:", error.message);
    if (error.response) {
      console.error("Python backend error:", error.response.data);
    }
    res.status(500).json({
      message: "Error processing message",
      error: error.message,
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));
