import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";

import userRouter from "./routes/usersRoute";
import myHotelsRouter from "./routes/myHotelsRoute";
import hotelsRouter from "./routes/hotelsRoute";
import paymentsRouter from "./routes/paymentsRoute";
import { connectDB } from "./db";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(cookieParser());

// Database connection before routes for vercel
app.use(async (_req, _res, next) => {
  await connectDB();
  next();
});

// routes
app.use("/api/users", userRouter);
app.use("/api/my-hotels", myHotelsRouter);
app.use("/api/hotels", hotelsRouter);
app.use("/api/payments", paymentsRouter);

// running server and database in development
if (process.env.NODE_ENV === "development" || !process.env.VERCEL) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
