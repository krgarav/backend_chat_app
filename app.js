const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const authRoute = require("./Routes/auth");
const chatRoute = require("./Routes/chat");
const sequelize = require("./Utils/database");
const User = require("./Models/user");
const Chat = require("./Models/chat");
const Grouptable = require("./Models/grouptable");
const UserGroup = require("./Models/usergroup");
const app = express();
const builtPath = path.join(__dirname, "../ChatAppFrontend/dist");
dotenv.config();
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
        app.listen(process.env.PORT || 5000, () => {
            console.log("Server is running on port 3000");
        })
    })
