const mongoose = require("mongoose");

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
    elements: {
      type: [
        {
          type: mongoose.Schema.Types.Mixed, //holds all elements presnet in canvas
        },
      ],
    },
    sharedWith: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
      required: true,
    },
  },
  { timestamps: true }
);

const canvas = mongoose.model("canvas", canvasSchema);

module.exports = canvas;
