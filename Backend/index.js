const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const Canvas = require("./models/CanvasModel");
const Comment = require("./models/CommentsModel");
const jwt = require("jsonwebtoken");
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

const canvasCache = new Map();
const canvasCommentsCache = new Map();

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  socket.on("join-canvas", async (canvasId) => {
    socket.join(canvasId);
  });

  socket.on("load-canvas", async (canvasId) => {
    // get from cache if available
    if (!canvasCache.has(canvasId)) {
      const canvasDoc = await Canvas.findById(canvasId);
      if (canvasDoc) {
        canvasCache.set(canvasId, canvasDoc.elements);
      }
    }
    socket.emit("canvas-data", canvasCache.get(canvasId) || []);
  });

  socket.on("load-comments", async (canvasId) => {
    if (!canvasCommentsCache.has(canvasId)) {
      const comments = await Comment.find({ canvasId }).sort({ createdAt: 1 });
      canvasCommentsCache.set(canvasId, comments);
    }

    const comments = canvasCommentsCache.get(canvasId) || [];
    socket.emit("comments-data", comments);
  });

  socket.on("add-comment", async (canvasId, content) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) throw new Error("No token provided");

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userEmail = decoded.email;

      console.log(userEmail, "added comment", content);

      const comment = await Comment.createComment(canvasId, userEmail, content);

      if (!canvasCommentsCache.has(canvasId)) {
        canvasCommentsCache.set(canvasId, [comment]);
      } else {
        canvasCommentsCache.get(canvasId).push(comment);
      }

      io.to(canvasId).emit("comments-data", canvasCommentsCache.get(canvasId));
    } catch (error) {
      console.log("Error adding comment:", error.message);
    }
  });

  socket.on("update-canvas", async (canvasId, elements) => {
    // console.log(socket.id, "updated canvas", canvasId);
    canvasCache.set(canvasId, elements);
    socket.to(canvasId).emit("canvas-data", elements);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
  });
});

server.listen(port, () => {
  console.log(`Server runnung on port http://localhost:${port}`);
});
