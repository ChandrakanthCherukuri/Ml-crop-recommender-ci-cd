import mongoose from "mongoose";

export const connectDB = async (uri) => {
  try {
    await mongoose.connect(uri);
    console.log("Database Connected Successfully");

    mongoose.connection.on("connected", () => {
      console.log("🔌 Mongoose connected to DB");
    });
 
    mongoose.connection.on("error", (err) => {
      console.error("⚠️ Mongoose connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("❗ Mongoose disconnected");
    });

    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("🛑 Mongoose connection closed due to app termination");
      process.exit(0);
    });
  } catch (error) {
    console.log("Database Connection Error", error);
    process.exit(1);
  }
};
