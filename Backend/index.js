const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const Canvas = require("./models/CanvasModel");
const dotenv = require("dotenv");
dotenv.config();

const userRouter = require("./routes/UserRouter");
const canvasRouter = require("./routes/CanvasRouter");

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/user", userRouter);
app.use("/api/canvas", canvasRouter);

// io.on("connection", (socket) => {
//   console.log("A user connected", socket.id);

//   socket.on("join-canvas", async (canvasId) => {
//     const canvasDoc = await Canvas.findById(canvasId);
//     socket.join(canvasId);
//   });

//   socket.on("update-canvas", async (canvasId, elements) => {
//     const canvasDoc = await Canvas.findById(canvasId);
//     socket.to(canvasId).emit("canvas-data", elements);
//   });

//   socket.on("disconnect", () => {
//     console.log("A user disconnected", socket.id);
//   });
// });

server.listen(port, () => {
  console.log(`Server runnung on port http://localhost:${port}`);
});
