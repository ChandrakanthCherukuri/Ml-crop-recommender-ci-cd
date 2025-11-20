import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
      select: false,
    },
    role: {
      type: String,
      enum: ["admin", "farmer", "agronomist"],
      default:"farmer"
    },
  },
  { timestamps: true }
);
userSchema.pre("save", async function (next) {
  if (this.isModified("email")) {
    this.email = this.email.toLowerCase();
  }
  if (!this.isModified("password") || !this.password) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
const User = mongoose.model("User", userSchema);
export default User;
