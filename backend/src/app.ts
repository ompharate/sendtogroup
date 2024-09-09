import express, { Request, Response } from "express";
import cors from "cors";
import { errorMiddleware } from "./middlewares/error.js";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

dotenv.config({ path: "./.env" });
const app = express();

export const envMode = process.env.NODE_ENV?.trim() || "DEVELOPMENT";
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

const s3Client = new S3Client({
  region: process.env.AWS_REGION as string,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

app.get("/generatePresignedUrl", async (req: Request, res: Response) => {
  try {
    const { filename, filetype } = req.query;

    if (!filename || !filetype) {
      return res
        .status(400)
        .json({ message: "Filename and filetype are required." });
    }

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: filename as string,
      ContentType: filetype as string,
    });

    const url = await getSignedUrl(s3Client, command);

    res.json({ url });
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    res.status(500).json({ message: "Failed to generate presigned URL." });
  }
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
  socket.on("join", (roomIdToJoin) => {
    socket.join(roomIdToJoin);
    const numberOfUsers = io.sockets.adapter.rooms.get(roomIdToJoin);
    io.to(roomIdToJoin).emit("newUser", numberOfUsers?.size);
  });
  socket.on("leave", (roomId) => {
    socket.leave(roomId);
    const numberOfUsers = io.sockets.adapter.rooms.get(roomId);
    io.to(roomId).emit("newUser", numberOfUsers?.size);
  });

  socket.on("newMessage", ({ activeRoomId, message }) => {
    io.to(activeRoomId).emit("message", message);
  });

  socket.on("codeChange", ({ newCode, activeRoomId }) => {
    socket.to(activeRoomId).emit("updateCode", newCode);
  });

  socket.on("upload-file", ({ fileName, activeRoomId }) => {
    socket.to(activeRoomId).emit("file-received", fileName);
  });

  socket.on("progress", ({ percentComplete, activeRoomId, fileName }) => {
    io.to(activeRoomId).emit("progress", { percentComplete, fileName });
  });

  socket.on("disconnect", () => {});
});

server.listen(port, () =>
  console.log(`Server is working on Port: ${port} in ${envMode} Mode.`)
);
