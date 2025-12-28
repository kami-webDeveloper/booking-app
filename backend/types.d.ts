import { UserDocument } from "../models/user.model";

export type UserType = {
  _id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

export interface DecodedToken extends jwt.JwtPayload {
  id: string;
}

export type HotelType = {
  _id: string;
  userId: SchemaDefinitionProperty;
  name: string;
  city: string;
  country: string;
  description: string;
  type: string;
  adultCount: number;
  childCount: number;
  facilities: string[];
  pricePerNight: number;
  starRating: number;
  images: { url: string; publicId: string }[];
  lastUpdated: Date;
  bookings: BookingType[];
};

export type BookingType = {
  _id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  adultCount: number;
  childCount: number;
  checkIn: Date;
  checkOut: Date;
  totalCost: number;
};

declare global {
  namespace Express {
    interface Request {
      user?: UserDocument;
    }
  }
}
