import mongoose from "mongoose";
import { PaymentType } from "../../types";

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Types.ObjectId, ref: "User" },
  hotelId: { type: mongoose.Types.ObjectId, ref: "Hotel" },

  firstName: String,
  lastName: String,
  email: String,
  adultCount: Number,
  childCount: Number,
  checkIn: Date,
  checkOut: Date,

  numberOfNights: Number,
  amount: Number,
  authority: String,

  status: {
    type: String,
    enum: ["PENDING", "PAID", "FAILED"],
    default: "PENDING",
  },
  refId: String,
});

const Payment = mongoose.model<PaymentType>("Payment", paymentSchema);

export default Payment;
