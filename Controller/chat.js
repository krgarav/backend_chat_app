const Chats = require("../Models/chat");
const { Sequelize, Op } = require("sequelize");
const User = require("../Models/user");
const GroupTable = require("../Models/grouptable");
const UserGroup = require("../Models/usergroup");
const S3services = require("../Services/s3services");

exports.postMessage = async (req, res) => {
    try {
        const enteredMessage = req.body.message;
        const groupId = req.body.groupId;
        const fileUrl = req.body.fileUrl;
        const response = await req.user.createChat({ message: enteredMessage, name: req.user.name, fileUrl, groupTableId: groupId });
        res.status(200).json({ message: "Message stored successfully", data: response });
    } catch (err) {
        res.status(500).json({ message: "Message storation failed" });
        console.log(err)
    }
}

exports.getMessage = async (req, res) => {
    const lastMessageId = +req.query.lastMessageId;
    const groupId = JSON.parse(req.query.groupId);
    try {
        if (lastMessageId === 1) {
            const pageSize = 10; // Number of results per page
            const totalRows = await Chats.count();
            const offset = Math.max(totalRows - pageSize, 0); // Ensure offset is not negative
            const chats = await Chats.findAll({
                where: {
                    groupTableId: groupId
                },
            });
            res.status(200).json({ chats: chats });
        } else {
            const chats = await Chats.findAll({
                where: {
                    id: {
                        [Sequelize.Op.gt]: lastMessageId
                    },
                    groupTableId: groupId
                },
                order: [['id', 'ASC']],
                limit: 100 // Adjust the limit to your preferred batch size
            });
            res.status(200).json({ chats: chats })
        }
    } catch (err) {
        res.status(404).json({ message: "data not found" });
        console.log(err)
    }
}

exports.createGroup = async (req, res) => {
    try {
        const adminUserId = req.user.id;
        const allUsersId = req.body.users;
        const groupName = req.body.name;
        const group = await GroupTable.create({
            name: groupName,
        });
        //   await Promise.all([allUsersId].map(userId => UserGroup.create({ groupTableId: group.id, userId })));
        await UserGroup.create({ groupTableId: group.id, userId: adminUserId, isAdmin: true })
        for (const userId of allUsersId) {
            await UserGroup.create({
                groupTableId: group.id,
                userId: userId
            });
        }
        // await UserGroup.findAll({gro})
        res.status(200).json({ message: "Successfully added", data: group });
    } catch (err) {
        console.log(err);
        res.status(404).json({ message: "Error Occured" });
    }
}

exports.userGroupName = async (req, res) => {
    try {
        const loggedUserId = req.user.id
        const allGroupIds = await UserGroup.findAll({ where: { userId: loggedUserId }, attributes: ['groupTableId'] })
        // let groupNames = [];
        // for (const groupId of allGroupIds) {
        //     const groupName = await GroupTable.findAll({ where: { id: groupId }, attributes: ['name'] })
        //     groupNames.push(groupName)
        // }
        // const userIds = allGroupIds.map(entry => entry.userId);
        const groupIds = allGroupIds.map(entry => entry.groupTableId);
        const groupNames = await GroupTable.findAll({
            where: {
                id: {
                    [Op.in]: groupIds
                }
            },
            attributes: ['id', 'name']
        });
        // console.log(userIds)
        // const userNames = await User.findAll({
        //     where: {
        //         id: {
        //             [Op.in]: userIds
        //         }
        //     },
        //     attributes: ['id', 'name']
        // });
        res.status(201).json({ groupInfo: groupNames });
    } catch (err) {
        console.log(err);
        res.status(404).json({ message: "Error occured" })
    }
}

exports.allUserPresentInGroup = async (req, res) => {
    try {
        const loggedUserId = req.user.id;
        const groupId = req.params.groupId;
        const usersId = await UserGroup.findAll({ where: { groupTableId: groupId }, attributes: ['userId', 'isAdmin'] });

        const userIDs = usersId.map(entry => entry.userId);
        const userNames = await User.findAll({ where: { id: { [Op.in]: userIDs } }, attributes: ['id', 'name'] });
        const userIdToNameMap = {};
        userNames.forEach(user => {
            userIdToNameMap[user.id] = user.name;
        });
        const response = usersId.map(entry => {
            return {
                id: entry.userId,
                name: userIdToNameMap[entry.userId],
                isAdmin: entry.isAdmin,
            };
        });
        let adminStatus = false;
        for (const item of response) {
            if (item.id === loggedUserId && item.isAdmin === true) {
                adminStatus = true
            }
        }
        res.status(200).json({ allUserIds: response, isAdminUser: adminStatus });
    } catch (err) {
        console.log(err);
    }
}

exports.getGroupChats = async (req, res) => {
    try {
        const groupId = req.params.groupId;
        const chats = await Chats.findAll({ where: { groupTableId: groupId } });
        res.status(200).json({ chats: chats });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error occured" });
    }
}

exports.updateGroupInfo = async (req, res) => {
    try {
        const groupId = req.body.groupId;
        const changedName = req.body.name;
        const removeUsersId = req.body.users;
        const makeAdmin = req.body.isAdmin;
        if (changedName) {
            const group = await GroupTable.findOne({ where: { id: groupId } });
            group.name = changedName;
            await group.save();
        }
        const allUsers = await UserGroup.findAll({ where: { groupTableId: groupId, userId: removeUsersId } });
        for (const usergroup of allUsers) {
            await usergroup.destroy();
        }
        await UserGroup.update({ isAdmin: true }, { where: { groupTableId: groupId, userId: makeAdmin } });
        res.status(200).json({ message: "Updated GroupInfo" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "error occured" });
    }
}

exports.uploadfile = async (req, res) => {
    try {
        const uploadedFile = req.file;
        const fileName = uploadedFile.originalname;
        const fileURL = await S3services.uploadToS3(uploadedFile.buffer, fileName);
        res.status(200).json({ data: fileURL });
    } catch (err) {
        console.log(err);
    }

}