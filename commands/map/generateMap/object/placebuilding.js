const { PrismaClient } = require('@prisma/client');
require('dotenv').config();
const prisma = new PrismaClient();
async function placeBuilding(ctx, tileImage, playerInfo, mapInfo) {
    const building = await prisma.building.findMany({
        where: { user_id: playerInfo.id },
    })
    if (building.length === 0) {
        for (let i = 0; i <= 5; i++) {
            const x = Math.floor(Math.random() * 10);
            const y = Math.floor(Math.random() * 15);
            ctx.drawImage(tileImage, x * 20, y * 20, mapInfo.TILE_SIZE, mapInfo.TILE_SIZE);
            await prisma.building.create({
                data: {
                    user_id: playerInfo.id,
                    x: x,
                    y: y
                }
            })
        }
        return ctx
    } else {
        for (let i = 0; i < building.length; i++) {
            ctx.drawImage(tileImage, building[i].x * 20, building[i].y * 20, mapInfo.TILE_SIZE, mapInfo.TILE_SIZE);
        }
        return ctx
    }
}
module.exports = {
    placeBuilding: placeBuilding
}