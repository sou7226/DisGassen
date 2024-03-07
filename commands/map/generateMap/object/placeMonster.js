const { PrismaClient } = require('@prisma/client');
require('dotenv').config();
const prisma = new PrismaClient();
async function placeMonster(ctx, tileImage, playerInfo, mapInfo) {
    const monster = await prisma.monster.findMany({
        where: { user_id: playerInfo.id },
    })
    if (monster.length === 0) {
        for (let i = 0; i <= 5; i++) {
            const x = Math.floor(Math.random() * 10);
            const y = Math.floor(Math.random() * 15);
            ctx.drawImage(tileImage, x * 20, y * 20, mapInfo.TILE_SIZE, mapInfo.TILE_SIZE);
            await prisma.monster.create({
                data: {
                    user_id: playerInfo.id,
                    x: x,
                    y: y
                }
            })
        }
        return ctx
    } else {
        for (let i = 0; i < monster.length; i++) {
            ctx.drawImage(tileImage, monster[i].x * 20, monster[i].y * 20, mapInfo.TILE_SIZE, mapInfo.TILE_SIZE);
        }
        return ctx
    }
}
module.exports = {
    placeMonster: placeMonster
}