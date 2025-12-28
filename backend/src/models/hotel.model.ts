import mongoose from "mongoose";
import { HotelType } from "../../types";
import bookingSchema from "./booking.model";

const hotelSchema = new mongoose.Schema<HotelType>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "A hotel must reference to a user"],
    },
    name: {
      type: String,
      required: [true, "A hotel must have a name"],
    },
    city: {
      type: String,
      required: [true, "A hotel must have a city"],
    },
    country: {
      type: String,
      required: [true, "A hotel must have a country"],
    },
    description: {
      type: String,
      required: [true, "A hotel must have a description"],
    },
    type: {
      type: String,
      enum: [
        "Budget",
        "Boutique",
        "Luxury",
        "Ski Resort",
        "Business",
        "Family",
        "Romantic",
        "Hiking Resort",
        "Cabin",
        "Beach Resort",
        "Golf Resort",
        "Motel",
        "All Inclusive",
        "Pet Friendly",
        "Self Catering",
      ],
    },
    adultCount: { type: Number, require: true },
    childCount: { type: Number, require: true },
    facilities: [{ type: String, required: true }],
    pricePerNight: { type: Number, required: true },
    starRating: { type: Number, required: true, min: 1, max: 5 },
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
      },
    ],
    lastUpdated: { type: Date, required: true, default: new Date() },
    bookings: [bookingSchema],
  },
  { timestamps: true }
);

hotelSchema.pre("findOneAndUpdate", function () {
  this.set({ lastUpdated: new Date() });
});

const Hotel = mongoose.model<HotelType>("Hotel", hotelSchema);

export default Hotel;
