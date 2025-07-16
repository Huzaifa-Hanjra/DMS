import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import adminRouter from "./routes/adminRoute.js";

// Setup dirname (for ES Modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env
dotenv.config();

// App config
const app = express();
const port = process.env.PORT || 4000;

// Connect DB & Cloudinary
connectDB();
connectCloudinary();

// Middlewares
app.use(express.json());
app.use(cors());

// API endpoints
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);

// Serve React frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API Working");
  });
}

// Start server
app.listen(port, () => console.log(`Server started on PORT: ${port}`));
