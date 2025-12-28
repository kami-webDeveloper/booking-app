import mongoose from "mongoose";
import type { UserType } from "../../types";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema<UserType>({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      message: "Invalid email format",
    },
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: { type: String, required: true },
});

userSchema.pre("save", async function () {
  if (this.isModified("password"))
    this.password = await bcrypt.hash(this.password, 8);
});

const User = mongoose.model<UserType>("User", userSchema);

export default User;
