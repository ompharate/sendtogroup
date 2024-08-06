import express from "express";
import cors from "cors";
import { errorMiddleware } from "./middlewares/error.js";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";

dotenv.config({ path: "./.env" });

export const envMode = process.env.NODE_ENV?.trim() || "DEVELOPMENT";
const port = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

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

  socket.on("newMessage", ({activeRoomId, message}) => {
    console.log(`User sent message in room: ${activeRoomId}`, message);
    io.to(activeRoomId).emit("message", message);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(port, () =>
  console.log(`Server is working on Port: ${port} in ${envMode} Mode.`)
);
