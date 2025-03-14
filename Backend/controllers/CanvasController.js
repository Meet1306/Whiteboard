const user = require("../models/UserModel");
const canvas = require("../models/CanvasModel");

const getAllCanvas = async (req, res) => {
  try {
    //req.user is already added by the authmiddleware
    const allCanvas = await canvas.getAllCanvas(req.user.email);

    res.status(200).send(allCanvas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

async function createCanvas(req, res) {
  try {
    const { name } = req.body; //name will be give when the user inputs the name of the canvas
    const newCanvas = await canvas.createCanvas(req.user.email, name);

    res.status(201).json(newCanvas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteCanvas(req, res) {
  try {
    const { canvasId } = req.params;
    await canvas.deleteCanvas(req.user.email, canvasId);
    res.status(200).json({ message: "Canvas deleted successfully" });
  } catch (err) {
    // console.log(err);

    res.status(500).json({ error: err.message });
  }
}

module.exports = { getAllCanvas, createCanvas, deleteCanvas };
