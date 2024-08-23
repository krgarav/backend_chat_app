const Chats = require("../Models/chat");
const ArchiveTable = require("../Models/archiveTable");
const { Sequelize, Op } = require("sequelize");

async function copyData() {
    try {
        const oneDayAgo = new Date();
        oneDayAgo.setDate(oneDayAgo.getDate() - 1);

        const sourceData = await Chats.findAll({
            where: {
                createdAt: {
                    [Sequelize.Op.lte]: oneDayAgo
                }
            }
        });


        const transformedData = sourceData.map(chat => ({

            name: chat.name,
            message: chat.message,
            fileUrl: chat.fileUrl,
            createdAt: chat.createdAt,
            updatedAt: chat.updatedAt,
            userId: chat.userId,
            groupTableId: chat.groupTableId

        }));
        await ArchiveTable.bulkCreate(transformedData);
        await Chats.destroy({
            where: {
                createdAt: {
                    [Sequelize.Op.lte]: oneDayAgo
                }
            }
        });

        console.log('Data copied successfully and deleted successfullu.');
    } catch (error) {
        console.error('Error copying data:', error);
    }
}

// const cron = require('node-cron');
// cron.schedule('0 0 * * *', () => {  // runs at every midnight
//     copyData()
// })