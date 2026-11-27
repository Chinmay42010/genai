const express = require("express");

const app = express();
app.use(express.json());

// Import the routes
const authRouter = require("./routes/auth.route.js");

// Using the routes
app.use("/api/auth", authRouter);

module.exports = app;
