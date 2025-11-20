import express from "express";
import {
  assignFarmersToAgronomist,
  getFarmersOfAgronomist,
  getAgronomistOfFarmer,
  getAllAssignments,
} from "../controllers/assign.controller.js";
import { protectRoute, authorizeRoles } from "../middlewares/protectRoute.js"
import { validateAssignment } from "../middlewares/validations.js";

const router = express.Router();

router.post(
  "/",
  protectRoute,
  authorizeRoles("admin"),
  validateAssignment,
  assignFarmersToAgronomist
);

router.get(
  "/agronomist/:id",
  protectRoute,
  authorizeRoles("admin", "agronomist"),
  getFarmersOfAgronomist
);

router.get(
  "/farmer/:id",
  protectRoute,
  authorizeRoles("admin", "farmer"),
  getAgronomistOfFarmer
);

router.get("/", protectRoute, authorizeRoles("admin"), getAllAssignments);

export default router;
