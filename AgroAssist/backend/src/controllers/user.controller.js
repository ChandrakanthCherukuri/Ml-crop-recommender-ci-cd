import User from "../models/user.model.js";
import generateToken from "../utils/generateToken.js";
import logger from "../utils/logger.js";

export const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User already exists with this email" });
    }
    const newUser = await User.create({
      name,
      email,
      password,
      role,
    });
    logger.info(`New User Registration ${newUser._id}`);
    const token = generateToken(newUser._id, newUser.role);
    res.status(201).json({
      token: token,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    logger.error(`registerUser Controller Error: ${error}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and Password are required" });
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = generateToken(user._id, user.role);
    logger.info(`${user._id} Logged in`);
    res.status(200).json({
      token: token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error(`loginUser Controller Error: ${error}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const profile = async (req, res) => {
  const id = req.user.id;
  try {
    const user = await User.findById(id);
    res.status(200).json({
      profile: user,
    });
  } catch (error) {
    logger.error(`profile Controller Error: ${error}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUsers = async (req, res) => {
  try {
    const { role, search, page = 1, limit = 10 } = req.query;

    const query = {};
    if (role) query.role = role;
    if (search) {
      query.name = { $regex: search, $options: "i" };
      query.email = { $regex: search, $options: "i" };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const users = await User.find(query).skip(skip).limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.status(200).json({
      data: users,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (error) {
    logger.error(`getUsers Controller Error: ${error.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
