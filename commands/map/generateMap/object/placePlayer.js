const { PrismaClient } = require('@prisma/client');
require('dotenv').config();
const prisma = new PrismaClient();
async function placePlayer(ctx, playerImage, playerInfo, mapInfo) {
    const user = await prisma.user.findUnique({
        where: { id: playerInfo.id },
    })
    if (user) {
        playerInfo.x = user.x;
        playerInfo.y = user.y;
    }
    ctx.drawImage(playerImage, playerInfo.x * 20, playerInfo.y * 20, mapInfo.TILE_SIZE, mapInfo.TILE_SIZE);
}
module.exports = {
    placePlayer: placePlayer
}