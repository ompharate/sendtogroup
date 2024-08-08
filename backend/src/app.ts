import express from "express";
import cors from "cors";
import { errorMiddleware } from "./middlewares/error.js";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config({ path: "./.env" });
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const envMode = process.env.NODE_ENV?.trim() || "DEVELOPMENT";
const port = process.env.PORT || 3000;
const uploadDir = path.join(__dirname, "../dist/uploads/");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(file.filename)
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const uploadStorage = multer({ storage: storage });

app.post("/api/upload", uploadStorage.single("file"), (req, res) => {
  console.log(req.file);
  return res.json({
    uploaded: true,
    file: req.file?.filename,
  });
});
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

app.get("/", (req, res) => {
  res.send("Hello, World!");
});
app.get("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Page not found",
  });
});

app.use(errorMiddleware);

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("join", (roomId) => {
    console.log(`User joined room: ${roomId}`);
    socket.join(roomId);
    io.to(roomId).emit("newUser", "a new user joined the room");
  });
  socket.on("leave", (roomId) => {
    console.log(`User left the room: ${roomId}`);
    socket.leave(roomId);
    io.to(roomId).emit("newUser", "a new user left the room");
  });

  socket.on("newMessage", ({ activeRoomId, message }) => {
    console.log(`User sent message in room: ${activeRoomId}`, message);
    socket.to(activeRoomId).emit("message", message);
  });

  socket.on("upload-file", ({ fileName, activeRoomId }) => {
    console.log("File received:", fileName);
    socket.to(activeRoomId).emit("file-received", fileName);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(port, () =>
  console.log(`Server is working on Port: ${port} in ${envMode} Mode.`)
);
