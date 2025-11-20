import mongoose from "mongoose";

const mlPredictionSchema = new mongoose.Schema(
  {
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { 
      type: String, 
      enum: ["crop-recommendation", "disease-detection"], 
      required: true 
    },
    input: { type: Object, required: true },
    output: { type: Object, required: true }, 
    python_version: { type: String },
    image_path: { type: String }, 
    status: { type: String, default: "success" },
  },
  { timestamps: true }
);

const MLPrediction = mongoose.model("MLPrediction", mlPredictionSchema);
export default MLPrediction;
