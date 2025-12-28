import type { Request, Response, NextFunction } from "express";
import User from "../models/user.model";
import * as jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import { DecodedToken } from "../../types";

// sending express-validator errors in response
const checkForErrors = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty())
    return res.status(400).json({
      status: "fail",
      message: errors.array().map((err) => err.msg),
    });
};

// Sending jwt through cookie logic
const createSendToken = (id, res) => {
  const token = (jwt.sign as any)({ id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRE_TIME || "1d",
  });

  // Development
  // res.cookie(process.env.JWT_TOKEN_NAME.toString(), token, {
  //   httpOnly: true,
  //   secure: process.env.NODE_ENV === "production",
  //   maxAge: +process.env.JWT_COOKIE_EXPIRE_TIME || 24 * 60 * 60 * 1000,
  // });

  // Vercel hosting
  res.cookie(process.env.JWT_TOKEN_NAME as string, token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: +process.env.JWT_COOKIE_EXPIRE_TIME || 24 * 60 * 60 * 1000,
  });
};

// Controller object to handle routes
export const userController = {
  // <--- user signup --->
  register: async (req: Request, res: Response) => {
    try {
      checkForErrors(req, res);

      const { email, password, firstName, lastName } = req.body;

      const userExists = await User.findOne({ email });

      if (userExists)
        return res
          .status(400)
          .json({ status: "fail", message: "User already exists" });

      const newUser = await User.create({
        email,
        password,
        firstName,
        lastName,
      });

      createSendToken(newUser._id.toString(), res);

      res.status(200).json({
        status: "success",
        message: "User registered successfully.",
      });
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: "Something went wrong" });
    }
  },

  // <--- user login --->
  login: async (req: Request, res: Response) => {
    try {
      checkForErrors(req, res);

      const { email, password } = req.body;

      const targetUser = await User.findOne({ email });

      if (!targetUser)
        return res.status(404).json({
          status: "fail",
          message: "Invalid credentials",
        });

      if (!(await bcrypt.compare(password, targetUser.password)))
        return res
          .status(400)
          .json({ status: "fail", message: "Invalid email or password" });

      createSendToken(targetUser._id.toString(), res);

      res
        .status(200)
        .json({ status: "success", message: "User logged in successfully" });
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: "Something went wrong" });
    }
  },

  logout: (req: Request, res: Response) => {
    // Development
    // res.cookie(process.env.JWT_TOKEN_NAME as string, "", {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   expires: new Date(0),
    // });

    // Vercel hosting
    res.cookie(process.env.JWT_TOKEN_NAME as string, "", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      expires: new Date(0),
    });

    res
      .status(200)
      .json({ status: "success", message: "Logged out successfully" });
  },

  // protecting routes from un authenticated users
  protect: async (req: Request, res: Response, next: NextFunction) => {
    try {
      let token;

      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
      )
        token = req.headers.authorization.split(" ")[1];
      else if (req.cookies[process.env.JWT_TOKEN_NAME as string])
        token = req.cookies[process.env.JWT_TOKEN_NAME as string];

      if (!token)
        return res.status(401).json({
          status: "fail",
          message: "You are not logged in! Please login to access.",
        });

      const decodedTokenPayload = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as DecodedToken;

      const currentUser = await User.findById(decodedTokenPayload.id);

      if (!currentUser)
        return res.status(401).json({
          status: "fail",
          message: "User does not exist with this token.",
        });

      req.user = currentUser;
      next();
    } catch (err) {
      console.log(err);
      res.status(401).json({ status: "fail", message: "Unauthorized" });
    }
  },

  // Sending user doc to check user is logged in
  getMe: async (req: Request, res: Response) => {
    const { _id } = req.user;

    const user = await User.findById(_id).select("-__v -password");

    if (!user)
      return res.status(401).json({
        status: "fail",
        message: "User not found",
      });

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  },
};
