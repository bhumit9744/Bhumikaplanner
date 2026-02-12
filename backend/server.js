const express = require("express");
const http = require("http");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server, {
  cors: { origin: "*" }
  });

  app.use("/api/missions", require("./routes/missionRoutes"));
  app.use("/api/scratchpad", require("./routes/scratchpadRoutes"));
  app.use("/api/reminders", require("./routes/reminderRoutes"));

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
    });

    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => console.log("Server running on", PORT));
    