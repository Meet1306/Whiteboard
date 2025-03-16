const express = require("express");
const canvasRouter = express.Router();
const {
  getAllCanvas,
  createCanvas,
  deleteCanvas,
  loadCanvas,
  updateCanvas,
  updateCanvasName,
  shareCanvas,
  unshareCanvas,
} = require("../controllers/CanvasController");

const authMiddleware = require("../Middlewares/Auth");

canvasRouter.get("/getCanvas", authMiddleware, getAllCanvas);
canvasRouter.post("/createCanvas", authMiddleware, createCanvas);
canvasRouter.delete("/deleteCanvas/:canvasId", authMiddleware, deleteCanvas);
canvasRouter.get("/load/:canvasId", authMiddleware, loadCanvas);
canvasRouter.put("/update/:canvasId", authMiddleware, updateCanvas);
canvasRouter.patch(
  "/update/canvasName/:canvasId",
  authMiddleware,
  updateCanvasName
);
canvasRouter.put("/shareWith/:canvasId", authMiddleware, shareCanvas);
canvasRouter.put("/UnshareWith/:canvasId", authMiddleware, unshareCanvas);

module.exports = canvasRouter;
