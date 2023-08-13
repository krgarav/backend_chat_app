const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const authRoute = require("./Routes/auth")
const sequelize = require("./Utils/database");
const app = express();
app.use(cors({
    origin:"*",
}))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/user/", authRoute);


sequelize
// .sync({force:true})
.sync()
.then(() => {
    app.listen(3000, () => {
        console.log("Server is running on port 3000");
    })
})
