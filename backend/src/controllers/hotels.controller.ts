import type { Request, Response } from "express";
import Hotel from "../models/hotel.model";
import cloudinary from "cloudinary";
import { Types } from "mongoose";
import { constructSearchQuery } from "./constructSearchQuery";
import { validationResult } from "express-validator";
import Payment from "../models/payment.model";

const MERCHANT_ID = "ca81cc63-5f02-4847-8502-5a809d0bfebb";

const returnCloudinaryImages = async (files) =>
  await Promise.all(
    files.map(async (image) => {
      const b64 = Buffer.from(image.buffer).toString("base64");
      const dataURI = `data:${image.mimetype};base64,${b64}`;

      const res = await cloudinary.v2.uploader.upload(dataURI);
      return { url: res.secure_url, publicId: res.public_id };
    })
  );

export const hotelController = {
  createHotel: async (req: Request, res: Response) => {
    try {
      const imageFiles = req.files as Express.Multer.File[];

      const {
        name,
        city,
        country,
        description,
        type,
        adultCount,
        childCount,
        facilities,
        pricePerNight,
        starRating,
      } = req.body;

      // image urls
      const images = await returnCloudinaryImages(imageFiles);

      const newHotel = {
        _id: new Types.ObjectId().toString(),
        userId: req.user._id,
        name,
        city,
        country,
        description,
        type,
        adultCount: Number(adultCount),
        childCount: Number(childCount),
        facilities,
        pricePerNight: Number(pricePerNight),
        starRating: Number(starRating),
        images,
      };

      const hotel = await Hotel.create(newHotel);

      res.status(201).json({
        status: "success",
        data: { hotel },
        message: "Hotel was created successfully",
      });
    } catch (err) {
      console.log("Error creating hotel ", err);
      res.status(500).json({ message: "Something went wrong" });
    }
  },

  getUserHotels: async (req: Request, res: Response) => {
    try {
      const userId = req.user._id;

      const userHotels = await Hotel.find({ userId }).sort({ createdAt: -1 });

      res.status(200).json({ status: "success", data: { userHotels } });
    } catch (err) {
      console.log("Error getting user hotels", err);
      res.status(500).json({ message: "Something went wrong" });
    }
  },

  getUserHotel: async (req: Request, res: Response) => {
    try {
      const { id: hotelId } = req.params;

      const hotel = await Hotel.findById(hotelId);

      if (!hotel)
        return res
          .status(404)
          .json({ status: "fail", message: "Hotel does not exist" });

      res.status(200).json({ status: "success", data: { hotel } });
    } catch (err) {
      console.log("Error getting user hotel", err);
      res.status(500).json({ message: "Something went wrong" });
    }
  },

  editUserHotel: async (req: Request, res: Response) => {
    try {
      const { id: hotelId } = req.params;
      const {
        name,
        city,
        country,
        description,
        type,
        adultCount,
        childCount,
        facilities,
        pricePerNight,
        starRating,
        images,
      } = req.body;

      const hotel = await Hotel.findById(hotelId);

      if (!hotel)
        return res.status(404).json({
          status: "fail",
          message: "Hotel was not found to edit! Try editing existing hotels",
        });

      hotel.name = name;
      hotel.city = city;
      hotel.country = country;
      hotel.description = description;
      hotel.type = type;
      hotel.adultCount = Number(adultCount);
      hotel.childCount = Number(childCount);
      hotel.facilities = facilities;
      hotel.pricePerNight = Number(pricePerNight);
      hotel.starRating = Number(starRating);

      const incomingImages = Array.isArray(images) ? images : hotel.images;

      const removedImages = hotel.images.filter((img) => {
        const imgStillExists = incomingImages.some(
          (incoming) => incoming.publicId === img.publicId
        );

        return !imgStillExists;
      });

      await Promise.all(
        removedImages.map((img) => cloudinary.v2.uploader.destroy(img.publicId))
      );

      const files = req.files as Express.Multer.File[];
      const uploadedImages =
        files && files.length > 0 ? await returnCloudinaryImages(files) : [];

      hotel.images = [...incomingImages, ...uploadedImages];

      await hotel.save();

      res.status(200).json({
        status: "success",
        data: { hotel },
        message: "Hotel was updated successfully",
      });
    } catch (err) {
      console.log("Error editing user hotel", err);
      res.status(500).json({ message: "Something went wrong" });
    }
  },

  getSearchedHotels: async (req: Request, res: Response) => {
    try {
      const query = constructSearchQuery(req.query);

      let sortOptions = {};

      switch (req.query.sortOption) {
        case "starRating":
          sortOptions = { starRating: -1 };
          break;
        case "pricePerNightAsc":
          sortOptions = { pricePerNight: 1 };
          break;
        case "pricePerNightDesc":
          sortOptions = { pricePerNight: -1 };
          break;
      }

      const pageSize = +process.env.HOTELS_PAGE_SIZE as number;
      const pageNumber = parseInt(
        req.query.page ? req.query.page.toString() : "1"
      );
      const skip = (pageNumber - 1) * pageSize;

      const [hotels, totalHotels] = await Promise.all([
        Hotel.find(query)
          .sort(sortOptions)
          .select("-__v -userId -lastUpdated")
          .skip(skip)
          .limit(pageSize),
        Hotel.countDocuments(),
      ]);

      res.status(200).json({
        status: "success",
        data: {
          hotels,
          pagination: {
            total: totalHotels,
            page: pageNumber,
            pages: Math.ceil(totalHotels / pageSize),
          },
        },
      });
    } catch (err) {
      console.log("Error getting searched hotels", err);
      res.status(500).json({ message: "Something went wrong" });
    }
  },

  getHotel: async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty)
        return res
          .status(400)
          .json({ status: "fail", message: errors.array() });

      const { id } = req.params;

      const hotel = await Hotel.findById(id.toString()).select(
        "-__v -userId -lastUpdated"
      );

      if (!hotel)
        return res
          .status(404)
          .json({ status: "fail", message: "Hotel not found" });

      res.status(200).json({ status: "success", data: { hotel } });
    } catch (err) {
      console.log("Error getting the hotel", err);
      res.status(500).json({ message: "Something went wrong" });
    }
  },

  createBookingPaymentIntent: async (req: Request, res: Response) => {
    try {
      const {
        firstName,
        lastName,
        email,
        adultCount,
        childCount,
        checkIn,
        checkOut,
        numberOfNights,
      } = req.body;

      if (!numberOfNights || numberOfNights <= 0)
        return res.status(400).json({
          status: "fail",
          message: "Invalid number of nights",
        });

      const hotel = await Hotel.findById(req.params.id);

      if (!hotel)
        return res.status(404).json({
          status: "fail",
          message: "Hotel not found",
        });

      const totalCost = hotel.pricePerNight * numberOfNights;
      const amount = totalCost * 1300000; // IRR

      const response = await fetch(
        "https://sandbox.zarinpal.com/pg/v4/payment/request.json",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            merchant_id: MERCHANT_ID,
            amount,
            description: `پرداخت هزینه رزرو هتل ${hotel.name} برای ${numberOfNights} شب`,
            callback_url: `${process.env.BACKEND_URL}/api/payments/verify`,
          }),
        }
      );

      const result = await response.json();

      if (!result?.data?.authority)
        return res.status(500).json({
          status: "fail",
          message: "Failed to create payment request",
        });

      await Payment.create({
        userId: req.user._id,
        hotelId: hotel._id,
        firstName,
        lastName,
        email,
        adultCount,
        childCount,
        checkIn,
        checkOut,
        numberOfNights,
        amount,
        authority: result.data.authority,
      });

      return res.status(200).json({
        status: "success",
        data: {
          authority: result.data.authority,
          code: result.data.code,
          amount,
        },
      });
    } catch (err) {
      console.error("Error creating payment intent:", err);
      return res.status(500).json({ message: "Something went wrong" });
    }
  },

  verifyPayment: async (req: Request, res: Response) => {
    try {
      const { Authority, Status } = req.query;

      if (!Authority || Status !== "OK") {
        return res.redirect(`${process.env.FRONTEND_URL}/payment-failed`);
      }

      const payment = await Payment.findOne({ authority: Authority });

      if (!payment) {
        return res.redirect(`${process.env.FRONTEND_URL}/payment-failed`);
      }

      // Prevent double verification
      if (payment.status === "PAID") {
        return res.redirect(`${process.env.FRONTEND_URL}/my-bookings`);
      }

      const response = await fetch(
        "https://sandbox.zarinpal.com/pg/v4/payment/verify.json",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            merchant_id: MERCHANT_ID,
            authority: Authority,
            amount: payment.amount,
          }),
        }
      );

      const result = await response.json();

      if (![100, 101].includes(result?.data?.code)) {
        payment.status = "FAILED";
        await payment.save();
        return res.redirect(`${process.env.FRONTEND_URL}/payment-failed`);
      }

      payment.status = "PAID";
      payment.refId = result.data.ref_id;
      await payment.save();

      await Hotel.findByIdAndUpdate(payment.hotelId, {
        $push: {
          bookings: {
            firstName: payment.firstName,
            lastName: payment.lastName,
            email: payment.email,
            adultCount: payment.adultCount,
            childCount: payment.childCount,
            checkIn: payment.checkIn,
            checkOut: payment.checkOut,
            userId: payment.userId.toString(),
            totalCost: payment.amount,
          },
        },
      });

      return res.redirect(`${process.env.FRONTEND_URL}/my-bookings`);
    } catch (err) {
      console.error("Verify payment error:", err);
      return res.redirect(`${process.env.FRONTEND_URL}/payment-failed`);
    }
  },
};
