const { PrismaClient } = require('@prisma/client');
require('dotenv').config();
const prisma = new PrismaClient();
async function placeBuilding(ctx, shopImage, playerInfo, mapInfo) {
    const building = await prisma.building.findMany({
        where: { user_id: playerInfo.id },
    })
    if (building.length === 0) {
        const availablePositions = [];
        for (let x = 0; x < 10; x++) {
            for (let y = 0; y < 15; y++) {
                availablePositions.push({ x, y });
            }
        }
        for (let i = 0; i < 6; i++) {
            const randomIndex = Math.floor(Math.random() * availablePositions.length);
            const { x, y } = availablePositions.splice(randomIndex, 1)[0];
            ctx.drawImage(shopImage, x * 20, y * 20, mapInfo.TILE_SIZE, mapInfo.TILE_SIZE);
            await prisma.building.create({
                data: {
                    user_id: playerInfo.id,
                    building_id : 1,
                    x: x,
                    y: y
                }
            })
        }
        return ctx
    } else {
        for (let i = 0; i < building.length; i++) {
            ctx.drawImage(shopImage, building[i].x * 20, building[i].y * 20, mapInfo.TILE_SIZE, mapInfo.TILE_SIZE);
        }
        return ctx
    }
}
module.exports = {
    placeBuilding: placeBuilding
}