const express = require("express");
const userRouter = express.Router();
const jwt = require("jsonwebtoken");

const User = require("../models/UserModel");
const authMiddleware = require("../Middlewares/Auth");

const JWT_SECRET = process.env.JWT_SECRET;

userRouter.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = await User.register(name, email, password);
    res.status(201).send(user);
  } catch (err) {
    res.status(400).json({ error: err.message }); // Send only error message
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const token = jwt.sign(
      {
        email: user.email,
        id: user._id,
      },
      JWT_SECRET
    );
    //this token is send to the client side and stored in the local storage of the browser and is used to authenticate the user

    res.send({ user, token });
  } catch (err) {
    res.status(400).json({ error: err.message }); // Send only error message
  }
});

module.exports = userRouter;
