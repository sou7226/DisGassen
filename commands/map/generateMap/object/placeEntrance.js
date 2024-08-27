const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function placeEntrance(ctx, entranceImage, playerInfo, mapInfo) {
    const building = await prisma.building.findMany({
        where: {
            user_id: playerInfo.id,
            building_id: 2
        },
    })
    if (building.length === 0) {
        const availablePositions = [];
        for (let y = 0; y < 15; y++) {
            for (let x = 0; x < 10; x++) {
                availablePositions.push({ x, y });
            }
        }
        const randomIndex = Math.floor(Math.random() * availablePositions.length);
        const { x, y } = availablePositions.splice(randomIndex, 1)[0];
        ctx.drawImage(entranceImage, x * 20, y * 20, mapInfo.TILE_SIZE, mapInfo.TILE_SIZE);
        await prisma.building.create({
            data: {
                user_id: playerInfo.id,
                building_id: 2,
                x: x,
                y: y
            }
        })
        return ctx
    } else {
        for (let i = 0; i < building.length; i++) {
            ctx.drawImage(entranceImage, building[i].x * 20, building[i].y * 20, mapInfo.TILE_SIZE, mapInfo.TILE_SIZE);
        }
        return ctx
    }
}
module.exports = {
    placeEntrance: placeEntrance
}