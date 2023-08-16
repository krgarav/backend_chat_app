const Chats = require("../Models/chat");
const Sequelize = require("sequelize");
exports.postMessage = async (req, res) => {
    try {
        const enteredMessage = req.body.message;
        await req.user.createChat({ message: enteredMessage });
        res.status(200).json({ message: "Message stored successfully" });
    } catch (err) {
        res.status(500).json({ message: "Message storation failed" });
        console.log(err)
    }
}

exports.getMessage = async (req, res) => {
    const lastMessageId = +req.query.lastMessageId;

    try {
        if (lastMessageId > 1) {
            const pageSize = 10; // Number of results per page
            const totalRows = await Chats.count();
            const offset = Math.max(totalRows - pageSize, 0); // Ensure offset is not negative
            const chats = await Chats.findAll({
                limit: pageSize,
                offset: offset,
            });
            res.status(200).json({ chats: chats });
        } else {
            const chats = await Chats.findAll({
                where: {
                    id: {
                        [Sequelize.Op.gt]: lastMessageId
                    }
                },
                order: [['id', 'ASC']],
                limit: 100 // Adjust the limit to your preferred batch size
            });
            req.status(200).json({ chats: chats })
        }
    } catch (err) {
        res.status(404).json({ message: "data not found" });
        console.log(err)
    }
}