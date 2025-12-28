import express from "express";
import { hotelController } from "../controllers/hotels.controller";
import { param } from "express-validator";

const router = express.Router();

router.get("/search", hotelController.getSearchedHotels);

router.get(
  "/:id",
  [param("id").notEmpty().withMessage("Hotel ID is required")],
  hotelController.getHotel
);

export default router;
