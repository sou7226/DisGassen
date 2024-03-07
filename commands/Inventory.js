const { PrismaClient } = require('@prisma/client');
const { items } = require('../items/items.js')
const prisma = new PrismaClient();
async function Inventory(playerInfo) {
    const existingItem = await prisma.playerItem.findMany({
        where: {
            user_id: playerInfo.id
        },
    });
    content = `:package: アイテム一覧\n`
    let elements = []
    for (let i = 0; i < existingItem.length; i++) {
        const item = items.find(item => item.item_id === existingItem[i].item_id);
        elements.push(`${item.name}: \`${existingItem[i].quantity}\` `)
    }
    return content + elements.join("\n")
}
module.exports = {
    Inventory: Inventory
}