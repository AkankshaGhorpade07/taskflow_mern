
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import taskRoutes from "./routes/taskRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

let connectionPromise = null;

function connectDB() {
  if (!connectionPromise) {
    connectionPromise = mongoose.connect(process.env.MONGO_URI);
  }
  return connectionPromise;
}

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    connectionPromise = null;
    res.status(500).json({
      message: "Database connection failed: " + error.message,
    });
  }
});

app.get("/", (req, res) => {
  res.json({ message: "MERN Task Manager API is running" });
});

app.use("/api/tasks", taskRoutes);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
