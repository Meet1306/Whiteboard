const user = require("../models/UserModel");
const canvas = require("../models/CanvasModel");

const getAllCanvas = async (req, res) => {
  try {
    //req.user is already added by the authmiddleware
    const allCanvas = await canvas.getAllCanvas(req.user.email);

    res.status(200).json(allCanvas);
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

async function loadCanvas(req, res, next) {
  try {
    const { canvasId } = req.params;
    const email = req.user.email;
    const canvasDoc = await canvas.loadCanvas(email, canvasId);
    res.status(200).json(canvasDoc);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

async function updateCanvas(req, res, next) {
  try {
    const { canvasId } = req.params;
    const email = req.user.email;
    const { elements } = req.body;

    const canvasDoc = await canvas.updateCanvas(email, canvasId, elements);
    res.status(200).json(canvasDoc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateCanvasName(req, res, next) {
  try {
    const { canvasId } = req.params;
    const email = req.user.email;
    const { name } = req.body;
    const canvasDoc = await canvas.updateCanvasName(email, canvasId, name);
    res.status(200).json(canvasDoc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function shareCanvas(req, res, next) {
  try {
    const { canvasId } = req.params;
    const sharedWithEmail = req.body.email;

    const canvasDoc = await canvas.shareCanvas(
      req.user.email,
      canvasId,
      sharedWithEmail
    );
    res.status(200).json(canvasDoc); //only the email of the user is shared
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function unshareCanvas(req, res, next) {
  try {
    const { canvasId } = req.params;
    const sharedWithEmail = req.body.email;
    // console.log(sharedWithEmail);

    const canvasDoc = await canvas.unshareCanvas(
      req.user.email,
      canvasId,
      sharedWithEmail
    );
    // console.log(canvasDoc);

    res.status(200).json(canvasDoc.sharedWith); //only the email of the user is shared
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getAllCanvas,
  createCanvas,
  deleteCanvas,
  loadCanvas,
  updateCanvas,
  updateCanvasName,
  shareCanvas,
  unshareCanvas,
  unshareCanvas,
};
