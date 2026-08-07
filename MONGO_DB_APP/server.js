import 'dotenv/config'
import express from 'express'
import connectDB from "./config/db.js"
import userRoutes from './routes/auth.js'
import skillRoutes from './routes/skills.js'
import projectRoutes from './routes/projects.js'
import analyticsRoutes from './routes/analytics.js'
import syllabusRoutes from './routes/syllabus.js'
import socialRoutes from './routes/social.js'
import session from "express-session";
import passport from "./config/passport.js";
import cors from 'cors'
import http from "http";
import jwt from "jsonwebtoken";
import { WebSocketServer } from "ws";
import { addClient, removeClient } from "./realtime.js";
// dotenv.config() is no longer needed here as it's handled by 'import "dotenv/config"'
connectDB()
const app = express()

// Activity image attachments are sent as data URLs, so allow a bounded multi-megabyte request.
app.use(express.json({ limit: "8mb" }))
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://syllbu-iq.vercel.app",
      "https://hemanth-portfolio117-4sop.vercel.app/"
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(
    session({
        secret: "github_secret",
        resave: false,
        saveUninitialized: false,
    })
);

app.use(passport.initialize());

app.use(passport.session());
app.use('/api/auth', userRoutes)
app.use("/api/user", userRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/syllabus", syllabusRoutes);
app.use("/api/social", socialRoutes);
const server = http.createServer(app);
const webSocketServer = new WebSocketServer({ noServer: true });

server.on("upgrade", (request, socket, head) => {
    if (!request.url.startsWith("/ws")) {
        socket.destroy();
        return;
    }
    const token = new URL(request.url, "http://localhost").searchParams.get("token");
    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        webSocketServer.handleUpgrade(request, socket, head, (client) => {
            client.userId = user.id;
            webSocketServer.emit("connection", client);
        });
    } catch {
        socket.destroy();
    }
});

webSocketServer.on("connection", (socket) => {
    addClient(socket.userId, socket);
    socket.on("close", () => removeClient(socket.userId, socket));
});

const port = process.env.PORT || 5001


server.listen(port, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${port}`)
})
