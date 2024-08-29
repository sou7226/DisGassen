const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function placeHall(ctx, hallImage, playerInfo, mapInfo) {
    const terrain = await prisma.terrain.findMany({
        where: { 
            user_id: playerInfo.id,
            layer: playerInfo.layer
        },
    })
    for (let i = 0; i < terrain.length; i++) {
        ctx.drawImage(hallImage, terrain[i].x * 20, terrain[i].y * 20, mapInfo.TILE_SIZE, mapInfo.TILE_SIZE);
    }
    return ctx
}
module.exports = {
    placeHall: placeHall
}