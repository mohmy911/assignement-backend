const express = require("express");
const verifyToken = require("./middleware/authMiddleware");
const requetLogger = require("./middleware/requestLogger");
const authRouter = require("./controllers/auth");
const profileRouter = require("./controllers/profile");
const app = express();
app.use(express.json());
app.use(requetLogger);
app.use("/api/auth", authRouter);
app.use(verifyToken);
app.use("/api/profile", profileRouter);

module.exports = app;
