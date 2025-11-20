import assignRoute from "../routes/assign.route.js";
import mlRoute from "../routes/ml.route.js";
import sensorRoute from "../routes/sensorData.route.js";
import authRoute from "../routes/user.route.js";

const apis = (app) => {
  app.use("/api/auth", authRoute);
  app.use("/api/sensor", sensorRoute);
  app.use("/api/assign", assignRoute);
  app.use("/api/ml", mlRoute);
};

export default apis;
