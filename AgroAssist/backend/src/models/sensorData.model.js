import mongoose from "mongoose";

const sensorDataSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    N: { type: Number, required: true },
    P: { type: Number, required: true },
    K: { type: Number, required: true },
    temperature: { type: Number, required: true },
    humidity: { type: Number, required: true },
    ph: { type: Number, required: true },
    rainfall: { type: Number, required: true },
    label: { type: String },
  },
  { timestamps: true }
);

const SensorData = mongoose.model("SensorData", sensorDataSchema);

export default SensorData;
