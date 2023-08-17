const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const authRoute = require("./Routes/auth");
const chatRoute = require("./Routes/chat");
const sequelize = require("./Utils/database");
const User =require("./Models/user");
const Chat = require("./Models/chat");
const Grouptable = require("./Models/grouptable");
const UserGroup = require("./Models/usergroup")
const app = express();
app.use(cors({
    origin:"*",
}))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/user/", authRoute);
app.use(chatRoute);

User.hasMany(Chat);
Chat.belongsTo(User);

// Grouptable.hasMany(User);
// User.hasMany(Grouptable);
Grouptable.hasMany(Chat);
Chat.belongsTo(Grouptable);

User.belongsToMany(Grouptable, { through: UserGroup });
Grouptable.belongsToMany(User, { through: UserGroup });


sequelize
// .sync({force:true})
.sync()
.then(() => {
    app.listen(3000, () => {
        console.log("Server is running on port 3000");
    })
})
