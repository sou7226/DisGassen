const { items } = require('../../../items/items.js')
const { searchItem } = require('./searchItem/searchItem.js')
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function give(playerInfo, args) {
    if (typeof args[0] === 'number' && Number.isInteger(args[0])) {
        const item = items.find(item => item.item_id === parseInt(args[0]));
        if (item) {
            await prisma.playerItem.updateMany({
                where: {
                    user_id: playerInfo.id,
                    item_id: item.item_id,
                },
                data: {
                    quantity: parseInt(args[1]),
                },
            });
        }
    } else if (typeof args[0] === 'string') {
        const item = items.find(item => item.name === args[0]);
        console.log(playerInfo.id, item.name)
        if (item) {
            const existingItem = await prisma.playerItem.findUnique({
                where: {
                    user_id: playerInfo.id,
                    item_id: item.item_id,
                },
            });
            console.log("existingItem:", existingItem)
            if (existingItem) {
                await prisma.playerItem.update({
                    where: {
                        user_id: playerInfo.id,
                        item_id: item.item_id,
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



async function addItemToPlayer(userId, itemId) {
    const existingItem = await prisma.playerItem.findUnique({
        where: {
            user_id_item_id: {
                user_id: userId,
                item_id: itemId,
            },
        },
    });
    if (existingItem) {
        // アイテムが既に存在する場合、数量を更新
        await prisma.playerItem.update({
            where: { player_item_id: existingItem.player_item_id },
            data: { quantity: existingItem.quantity + 1 },
        });
    } else {
        // 新しいアイテムの場合、playerItemを作成
        await prisma.playerItem.create({
            data: {
                user_id: userId,
                item_id: itemId,
                quantity: 1,
            },
        });
    }
}
async function updateItemQuantityForPlayer(userId, itemId, quantity) {
    await prisma.playerItem.updateMany({
        where: {
            user_id: userId,
            item_id: itemId,
        },
        data: {
            quantity: quantity,
        },
    });
}
async function removeItemFromPlayer(userId, itemId) {
    await prisma.playerItem.deleteMany({
        where: {
            user_id: userId,
            item_id: itemId,
            quantity: 0,
        },
    });
}

module.exports = {
    give: give
}