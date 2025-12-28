import type { Request, Response } from "express";
import Hotel from "../models/hotel.model";
import cloudinary from "cloudinary";
import { Types } from "mongoose";
import { constructSearchQuery } from "./constructSearchQuery";
import { validationResult } from "express-validator";

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
};
