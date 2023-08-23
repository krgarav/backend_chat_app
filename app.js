const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const socketIo = require('socket.io');
const authRoute = require("./Routes/auth");
const chatRoute = require("./Routes/chat");
const sequelize = require("./Utils/database");
const User = require("./Models/user");
const Chat = require("./Models/chat");
const Grouptable = require("./Models/grouptable");
const UserGroup = require("./Models/usergroup");
const app = express();
const server = http.createServer(app);
const builtPath = path.join(__dirname, "../ChatAppFrontend/dist");
dotenv.config();

// Initialize Socket.IO server and listen for connections
const io = socketIo(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    }
},);

io.on('connection', (socket) => {
    console.log('A client connected to socket.io', socket.id);

    // socket.on('setup', (userToken) => {
    //     socket.join(userToken);
    //     socket.emit("connection");

    // });

    // socket.on('join chat', (room) => {
    //     socket.join(room);
    //     // console.log("user joined room ===================" + room)
    // })

    socket.on('new message', (obj) => {
        // let alluser = obj.usersPresent;


        // if (!chat) return

        io.emit("message received", obj)
        // alluser.forEach(user => {
        //     if (user.id === message.userId) return
        //     console.log(user.id)
        //     socket.in(user.id).emit("message received", message);
        // });


    })
    // Handle Socket.IO events here
});

app.use(cors({
    origin: '*',  // Allow requests from this origin
    methods: ['OPTIONS', 'POST', 'GET', 'DELETE'], // Allow these HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'],  // Allow these headers
}));

app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Origin-Agent-Cluster', 'true');
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use("/user/", authRoute);
app.use(chatRoute);
app.use(express.static(builtPath));
app.use((req, res) => {
    res.sendFile(path.join(__dirname, "../ChatAppFrontend/dist/index.html"));
})
User.hasMany(Chat);
Chat.belongsTo(User);

Grouptable.hasMany(Chat);
Chat.belongsTo(Grouptable);

User.belongsToMany(Grouptable, { through: UserGroup });
Grouptable.belongsToMany(User, { through: UserGroup });


sequelize
    // .sync({force:true})
    .sync()
    .then(() => {
        server.listen(process.env.PORT || 5000, () => {
            console.log("Server is running on port 5000");
        })
    });
