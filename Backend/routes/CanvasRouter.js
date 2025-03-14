const express = require("express");
const canvasRouter = express.Router();
const {
  getAllCanvas,
  createCanvas,
  deleteCanvas,
} = require("../controllers/CanvasController");

const authMiddleware = require("../Middlewares/Auth");

canvasRouter.get("/getCanvas", authMiddleware, getAllCanvas);
canvasRouter.post("/createCanvas", authMiddleware, createCanvas);
canvasRouter.delete("/deleteCanvas/:canvasId", authMiddleware, deleteCanvas);

module.exports = canvasRouter;
