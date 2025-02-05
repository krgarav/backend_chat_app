const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const socketIo = require("socket.io");
const authRoute = require("./Routes/auth");
const chatRoute = require("./Routes/chat");
const sequelize = require("./Utils/database");
const User = require("./Models/user");
const Chat = require("./Models/chat");
const Archive = require("./Models/archiveTable");
const Grouptable = require("./Models/grouptable");
const UserGroup = require("./Models/usergroup");
const app = express();
const server = http.createServer(app);
dotenv.config();

// Initialize Socket.IO server and listen for connections
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("A client connected to socket.io", socket.id);

  socket.on("new message", (obj) => {
    io.emit("message received", obj);
  });

  socket.on("group create", (obj) => {
    const userIds = obj.userInfo.map((item) => item.id);
    io.emit("group created", obj);
  });
});
require("./Cron/cron");
app.use(
  cors({
    origin: "*",
    methods: ["OPTIONS", "POST", "GET", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Origin-Agent-Cluster", "true");
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded());

app.use("/user/", authRoute);
app.use(chatRoute);
app.use(express.static(path.join(__dirname, "dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});
User.hasMany(Chat);
Chat.belongsTo(User);

User.hasMany(Archive);
Archive.belongsTo(User);

Grouptable.hasMany(Chat);
Chat.belongsTo(Grouptable);

Grouptable.hasMany(Archive);
Archive.belongsTo(Grouptable);

User.belongsToMany(Grouptable, { through: UserGroup });
Grouptable.belongsToMany(User, { through: UserGroup });

sequelize.sync().then(() => {
  server.listen(process.env.PORT || 5000, () => {
    console.log("Server is running on port 5000");
  });
});
