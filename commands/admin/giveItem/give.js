const { items } = require('../../../items/items.js')
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function give(playerInfo, args) {
    if (typeof args[0] === 'string') {
        const item = items.find(item => item.name === args[0]);
        console.log(playerInfo.id, item.name)
        if (item) {
            const existingItem = await prisma.playerItem.findFirst({
                where: {
                    user_id: playerInfo.id,
                    item_id: item.item_id,
                },
            });
            console.log("existingItem:", existingItem)
            if (existingItem) {
                await prisma.playerItem.update({
                    where: {
                        id: existingItem.id
                    },
                    data: { quantity: existingItem.quantity + parseInt(args[1]) },
                });
                return
            }
            await prisma.playerItem.create({
                data: {
                    user_id: playerInfo.id,
                    item_id: item.item_id,
                    quantity: parseInt(args[1]),
                },
            });
            return
        }
    }
}
module.exports = {
    give: give
}