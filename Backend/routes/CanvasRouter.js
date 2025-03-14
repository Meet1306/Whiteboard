const express = require("express");
const canvasRouter = express.Router();
const {
  getAllCanvas,
  createCanvas,
  deleteCanvas,
  loadCanvas,
} = require("../controllers/CanvasController");

const authMiddleware = require("../Middlewares/Auth");

canvasRouter.get("/getCanvas", authMiddleware, getAllCanvas);
canvasRouter.post("/createCanvas", authMiddleware, createCanvas);
canvasRouter.delete("/deleteCanvas/:canvasId", authMiddleware, deleteCanvas);
canvasRouter.get("/load/:canvasId", authMiddleware, loadCanvas);
module.exports = canvasRouter;
