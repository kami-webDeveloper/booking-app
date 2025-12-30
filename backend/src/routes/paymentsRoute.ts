import express from "express";
import { hotelController } from "../controllers/hotels.controller";

const router = express.Router();

router.get("/payments/callback", hotelController.verifyPayment);

export default router;
