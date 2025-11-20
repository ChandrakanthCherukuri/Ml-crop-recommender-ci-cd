import Assignment from "../models/assign.model.js";
import User from "../models/user.model.js";
import logger from "../utils/logger.js";

// Helper to check role
const isAgronomist = async (id) => {
  const user = await User.findById(id);
  return user && user.role === "agronomist";
};

// 1️⃣ Assign farmers to agronomist
export const assignFarmersToAgronomist = async (req, res) => {
  const { agronomistId, farmerIds } = req.body;

  try {
    if (!(await isAgronomist(agronomistId))) {
      return res.status(400).json({ message: "Invalid Agronomist Id" });
    }

    // Ensure all farmer IDs exist and are farmers
    const farmerDocs = await User.find({ _id: { $in: farmerIds }, role: "farmer" });
    if (farmerDocs.length !== farmerIds.length) {
      return res.status(400).json({ message: "Some farmer IDs are invalid" });
    }

    let assignment = await Assignment.findOne({ agronomist: agronomistId });
    if (!assignment) {
      assignment = new Assignment({ agronomist: agronomistId, farmers: farmerIds });
    } else {
      assignment.farmers.push(...farmerIds);
      // remove duplicates
      assignment.farmers = [...new Set(assignment.farmers.map(f => f.toString()))];
    }

    await assignment.save();

    res.status(200).json({
      message: "Farmers assigned successfully",
      data: assignment,
    });
  } catch (error) {
    logger.error("assignFarmersToAgronomist Controller Error: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// 2️⃣ Get farmers of an agronomist
export const getFarmersOfAgronomist = async (req, res) => {
  const { id } = req.params;

  try {
    const assignment = await Assignment.findOne({ agronomist: id }).populate("farmers", "name email");
    if (!assignment) return res.status(404).json({ message: "No farmers assigned" });

    res.status(200).json({ 
      data: { 
        agronomist: id, 
        farmers: assignment.farmers 
      } 
    });
  } catch (error) {
    logger.error("getFarmersOfAgronomist Controller Error: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// 3️⃣ Get agronomist of a farmer
export const getAgronomistOfFarmer = async (req, res) => {
  const { id } = req.params;

  try {
    const assignment = await Assignment.findOne({ farmers: id }).populate("agronomist", "name email");
    if (!assignment) return res.status(404).json({ message: "No agronomist assigned" });

    res.status(200).json({ 
      data: { 
        farmer: id, 
        agronomist: assignment.agronomist 
      } 
    });
  } catch (error) {
    logger.error("getAgronomistOfFarmer Controller Error: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// 4️⃣ Get all assignments (Admin)
export const getAllAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find()
      .populate("agronomist", "name email")
      .populate("farmers", "name email");

    res.status(200).json({ data: assignments });
  } catch (error) {
    logger.error("getAllAssignments Controller Error: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
