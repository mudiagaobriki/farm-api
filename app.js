import dotenv from "dotenv";
import { connect } from "./config/database.js";
import express from "express";
import cron from "node-cron";
import cors from "cors";
import bodyParser from "body-parser";
import auth from "./src/middleware/auth.js";

// Import routes
import userRoute from "./src/routes/userRoute.js";
import adminRoute from "./src/routes/adminRoute.js";
import profileRoute from "./src/routes/profileRoute.js";
import whatsappRoute from "./src/routes/whatsappRoute.js";
import messageRoute from "./src/routes/messagesRoute.js";

dotenv.config();
connect();

const app = express();

// Middleware setup
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(express.json({ limit: "50mb" }));

// Routes
app.use("/api/users", userRoute);
app.use("/api/admins", adminRoute);
app.use("/api/profiles", profileRoute);
app.use("/api/whatsapp", whatsappRoute);
app.use("/api/messages", messageRoute);

// Welcome route with authentication middleware
app.get("/welcome", auth, (req, res) => {
  res.status(200).send(req.user);
});

// Handle undefined routes
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Page not found",
    error: {
      statusCode: 404,
      message: "You reached a route that is not defined on this server",
    },
  });
});

export default app;
