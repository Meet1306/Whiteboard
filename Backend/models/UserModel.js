const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

userSchema.statics.register = async function (name, email, password) {
  try {
    //   validate the email and password using the validator
    if (!validator.isEmail(email)) {
      throw new Error("Email is invalid");
    }
    if (!validator.isStrongPassword(password)) {
      throw new Error("Password is too weak");
    }

    const emailExists = await this.findOne({ email });
    if (emailExists) {
      throw new Error("Email already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await this.create({ name, email, password: hashedPassword });

    return user;
  } catch (err) {
    throw err;
  }
};

userSchema.statics.login = async function (email, password) {
  try {
    const user = await this.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }
    return user;
  } catch (err) {
    throw new Error(err);
  }
};

const user = mongoose.model("user", userSchema);

module.exports = user;
