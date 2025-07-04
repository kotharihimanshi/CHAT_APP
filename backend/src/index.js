// import express from "express";
// import dotenv from "dotenv";
// import cookieParser from "cookie-parser";
// import cors from "cors";

// import path from "path";

// import { connect_db } from "./lib/db.js";

// import authRoutes from "./routes/auth.routes.js";
// import messageRoutes from "./routes/message.route.js";
// import { app, server } from "./lib/socket.js";

// dotenv.config();

// const PORT = process.env.PORT;
// const __dirname = path.resolve();

// app.use(express.json({ limit: "10mb" }));
// app.use(express.urlencoded({ extended: true, limit: "10mb" }));
// app.use(cookieParser());
// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//   })
// );

// app.use("/api/auth", authRoutes);
// app.use("/api/messages", messageRoutes);

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "../frontend/dist")));

//   app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
//   });
// }

// server.listen(PORT, () => {
//   console.log("server is running on PORT:" + PORT);
//   connect_db();
// });


import express from "express";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.route.js";
import { connect_db } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from 'path';

dotenv.config();

const app = express();
const server = http.createServer(app); // ✅ create HTTP server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // your frontend origin
    credentials: true,
  },
});

// ✅ Attach io to the app for use in controllers
app.set("io", io);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// ✅ Start server
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
if(process.env.NODE_ENV=="production"){
  app,use(express.static(path.join(__dirname , "../frontend/dist")))


  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"))
  })
}

// ✅ Socket connection
io.on("connection", (socket) => {
  console.log("✅ Socket connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.id);
  });
});




server.listen(PORT, () => {
  console.log("🚀 Server running on port", PORT);
  connect_db();
});
