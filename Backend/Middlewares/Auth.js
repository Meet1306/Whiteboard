const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");

//will take token from the header
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res
        .status(401)
        .json({ error: "Access denied. No token provided." });
    }

    const data = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({ email: data.email });
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = user;
    // console.log(req.user);

    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;
