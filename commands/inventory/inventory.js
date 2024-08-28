const { PrismaClient } = require('@prisma/client');
const { items } = require('../../items/items.js')
const { weapons } = require('../../items/weapons.js')
const prisma = new PrismaClient();
async function inventory(playerInfo) {
    const existingItem = await prisma.item.findMany({
        where: {
            user_id: playerInfo.id
        },
    });
    const equipment = await prisma.equipment.findMany({
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
    for (let i = 0; i < equipment.length; i++) {
        const weapon = weapons.find(weapon => weapon.weapon_id === equipment[i].equip_id);
        elements.push(`${weapon.name}: \`lv.${equipment[i].level}\` `)
    }
    return content + elements.join("\n")
}
module.exports = {
    inventory: inventory
}