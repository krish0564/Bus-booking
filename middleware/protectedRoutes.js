const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

const protectRoutes = async (req, res, next) => {
  try {
    const token = req.cookies.authToken;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized access" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ error: "Unauthorized access" });
    }

    // Find user based on decoded userId and exclude password
    const user = await User.findByPk(decoded.userId);

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = user; // Attach user to request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token has expired" });
    }
    console.error("Auth Middleware Error:", error); // Log any unexpected errors
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = protectRoutes;
