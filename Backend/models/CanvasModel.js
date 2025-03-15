const mongoose = require("mongoose");
const User = require("./UserModel");

// we would need a id, nameOfCanvas, owner, elements(data), timestamps, sharedWith
const canvasSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    elements: [{ type: mongoose.Schema.Types.Mixed }], //array of objects
    shared: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

// write a static method to getAllcanvas of the user and the sharedWith of the user
canvasSchema.statics.getAllCanvas = async function (email) {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }

    const userId = new mongoose.Types.ObjectId(user._id); //user._id can be a string and we need to convert it to ObjectId

    const allCanvas = await this.find({
      $or: [{ owner: userId }, { sharedWith: userId }],
    })
      .select("name owner sharedWith createdAt updatedAt")
      .populate("owner", "name email");
    // console.log(allCanvas);

    return allCanvas;
  } catch (err) {
    throw err;
  }
};

canvasSchema.statics.createCanvas = async function (email, name) {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }
    const userId = new mongoose.Types.ObjectId(user._id);
    const Canvas = await this.create({
      name,
      owner: userId,
      elements: [],
      sharedWith: [],
    });
    return Canvas;
  } catch (err) {
    throw err;
  }
};

canvasSchema.statics.deleteCanvas = async function (email, canvasId) {
  try {
    const owner = await User.findOne({ email });
    const CanvasDoc = await this.findById(canvasId);
    if (!CanvasDoc) {
      throw new Error("Canvas not found");
    }
    if (!owner) {
      throw new Error("User not found");
    }
    if (owner._id.toString() !== CanvasDoc.owner.toString()) {
      throw new Error("You are not the owner of this canvas");
    }
    await this.findByIdAndDelete(canvasId);
  } catch (err) {
    throw err;
  }
};

// only the one which is clicked will be loaded so sending canvasId in params
canvasSchema.statics.loadCanvas = async function (email, canvasId) {
  try {
    const user = await User.findOne({ email }).select("_id");
    if (!user) {
      throw new Error("User not found");
    }
    const userId = user._id;
    const canvasDoc = await this.findOne({
      _id: canvasId,
      $or: [{ owner: userId }, { sharedWith: userId }],
    });
    if (!canvasDoc) {
      throw new Error("Canvas not found");
    }
    return canvasDoc;
  } catch (err) {
    throw err;
  }
};

canvasSchema.statics.updateCanvas = async function (email, canvasId, elements) {
  try {
    const user = await User.findOne({ email }).select("_id");
    if (!user) {
      throw new Error("User not found");
    }
    const userId = user._id;

    const canvasDoc = await this.findOne({
      _id: canvasId,
      $or: [{ owner: userId }, { sharedWith: userId }],
    });

    if (!canvasDoc) {
      throw new Error("Canvas not found");
    }
    // console.log(elements.elements);

    canvasDoc.elements = elements.elements;
    await canvasDoc.save();

    return canvasDoc;
  } catch (err) {
    throw err;
  }
};

canvasSchema.statics.updateCanvasName = async function (email, canvasId, name) {
  try {
    const user = await User.findOne({ email }).select("_id");
    if (!user) {
      throw new Error("User not found");
    }
    const userId = user._id;
    const canvasDoc = await this.findOne({
      _id: canvasId,
      $or: [{ owner: userId }, { sharedWith: userId }],
    });

    if (!canvasDoc) {
      throw new Error("Canvas not found");
    }
    canvasDoc.name = name;
    await canvasDoc.save();
    return { name: canvasDoc.name, _id: canvasDoc._id };
  } catch (err) {
    throw err;
  }
};

const canvas = mongoose.model("canvas", canvasSchema);

module.exports = canvas;
