import express from "express";
import { userController } from "../controllers/users.controller";
import { check } from "express-validator";

const router = express.Router();

router.post(
  "/register",
  [
    check("firstName", "First Name is required").isString(),
    check("lastName", "Last Name is required").isString(),
    check("email", "Email is required").isEmail(),
    check("password", "Password with 6 or more characters required").isLength({
      min: 6,
    }),
  ],
  userController.register
);

router.post(
  "/login",
  [
    check("email", "Email is required").isEmail(),
    check("password", "Password with 6 or more characters required").isLength({
      min: 6,
    }),
  ],
  userController.login
);

router.get("/logout", userController.logout);

router.get("/validate-token", userController.protect, userController.getMe);

export default router;
