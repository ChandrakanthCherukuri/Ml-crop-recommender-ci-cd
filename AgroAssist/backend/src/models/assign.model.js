import mongoose from "mongoose";

const assignSchema = new mongoose.Schema(
  {
    agronomist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    farmers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const Assignment = mongoose.model("Assignment", assignSchema);

export default Assignment;
