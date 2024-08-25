const { PrismaClient } = require('@prisma/client');
require('dotenv').config();
const prisma = new PrismaClient();
async function updateCoords(playerInfo) {
    console.log(playerInfo)
    await prisma.user.update({
        where: { user_id: playerInfo.id },
        data: {
            x: playerInfo.x,
            y: playerInfo.y
        }
    })
    return playerInfo
}
module.exports = {
    updateCoords: updateCoords
}