const User = require("../Models/user");
const bcrypt = require("bcrypt");


exports.authSignup=async(req,res)=>{
    const email = req.body.email;
    const password= req.body.password;
    const phone = req.body.phone;
    const name = req.body.name;
 
    try {
        const users = await User.findAll();
        const userExists = users.find((user) => user.email === email);
        if (userExists) {
            return res.status(301).json({ error: "Email id already exists" });
        }
        bcrypt.hash(password, 10, async (err, hash) => {
            if (err) {
                throw new Error(err)
            }
            await User.create({ name, email, password: hash, phone:phone });
            res.status(200).json({ data: "success" });
        })

    } catch (err) {
        console.log(err);
    }

}