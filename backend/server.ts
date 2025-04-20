import express, { Application } from "express";
import mongoose from "mongoose";
import cors from "cors";

import todoRoutes from "./routes/todoRoutes";
import userRoutes from "./routes/userRoutes";
import dotenv from "dotenv";
dotenv.config();


const app: Application = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/todos", todoRoutes);
app.use("/api/users", userRoutes);

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI as string;
mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
