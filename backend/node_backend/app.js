require('dotenv').config();

const express = require("express");
const cors = require("cors");
const transactionRoutes = require('./routes/transactionRoutes'); // Import the new router

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(cors());

// API Routes
app.use("/api", transactionRoutes); // Use the transaction router with a /api prefix

app.listen(PORT, () => {
  console.log(`🚀 Node.js server running on port ${PORT}`);
});

module.exports = { app };