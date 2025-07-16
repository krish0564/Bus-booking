const { User } = require("../models/RelationalModel");

//const AppError = require("../utils/appErr");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const generateToken = require("..//utlis/generateToken"); // Should be generateTokenandCookies
//Signup API
exports.signup = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const user = await User.create({ email, password, role });
    generateToken(user.id, user.role, res);
    // Avoid sending the full user instance (circular structure)
    res.status(201).json({
      id: user.id,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
// login API
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new Error("Please provide email and password");
    }
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error("Invalid email or password");
    }
    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid email or password");
    }
    generateToken(user.id, user.role, res);
    res.status(200).json({
      status: "Success",
      data: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

//logout
exports.logout = async (req, res, next) => {
  res.cookie("authToken", "", { maxAge: 0 });
  res.status(200).json({ message: "logged out successfully" });
};
