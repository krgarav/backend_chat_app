const { Sequelize, Op } = require("sequelize");
const User = require("../Models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.authSignup = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const phone = req.body.phone;
    const name = req.body.name;

    try {
        const users = await User.findAll();
        const userExists = users.find((user) => user.email === email);
        const phoneExists = users.find((user) => user.phone === phone)
        if (userExists) {
            return res.status(301).json({ error: "Email id already exists" });
        } else if (phoneExists) {
            return res.status(301).json({ error: "Phone number already exists" });

        }
        bcrypt.hash(password, 10, async (err, hash) => {
            if (err) {
                throw new Error(err)
            }
            await User.create({ name, email, password: hash, phone: phone });
            res.status(200).json({ data: "success" });
        })

    } catch (err) {
        console.log(err);
    }

}

const generateToken = (id, name) => {
    return jwt.sign({ user_id: id, name: name }, "secrettoken");
}
exports.authLogin = async (req, res) => {
    try {
        const enteredEmail = req.body.email;
        const enteredPassword = req.body.password;
        const users = await User.findAll();
        const userExists = users.find((user) => {
            return user.email === enteredEmail;
        });

        if (userExists) {
            bcrypt.compare(enteredPassword, userExists.password, (err, result) => {
                if (err) {
                    throw new Error(err)
                }

                if (result === true) {
                    res.status(200).json({
                        data: "user successfully logged in",
                        token: generateToken(userExists.id, userExists.name),
                        userId:userExists.id
                    });

                } else {
                    res.status(401).json({ error: "Entered password is wrong" });
                }
            })

        } else {
            res.status(404).json({ error: "Email id  does not exists" });
        }

    } catch (err) {
        console.log(err);
    }
}

exports.getAllUserName = async (req, res) => {
    const userId = req.user.id
    try {
        const users = await User.findAll({
            where: {
                id: {
                    [Op.notIn]: [userId]
                }
            },
            attributes: ['id', 'name'] // Specify the attributes you want to retrieve
        });
        res.status(201).json({ user: users });
    } catch (err) {
        console.log(err)
        res.status(400).json({ message: "Something went wrong" });
    }
}