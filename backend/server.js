import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from 'dotenv';
import connectDB from "./db.js";
import router from "./routes/courseRoute.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
connectDB();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.set("io", io);

app.use('',router)

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

server.listen(port, () => console.log(`Server running on port ${port}`));
