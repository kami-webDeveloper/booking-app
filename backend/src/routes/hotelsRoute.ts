import express from "express";
import { hotelController } from "../controllers/hotels.controller";
import { param } from "express-validator";
import { userController } from "../controllers/users.controller";

const router = express.Router();

router.get("/search", hotelController.getSearchedHotels);

router.get(
  "/:id",
  [param("id").notEmpty().withMessage("Hotel ID is required")],
  hotelController.getHotel
);

router.post(
  "/:id/bookings/payment-intent",
  userController.protect,
  hotelController.createBookingPaymentIntent
);

router.post(
  "/:id/bookings",
  userController.protect,
  hotelController.verifyPayment
);

export default router;
