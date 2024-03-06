const { PrismaClient } = require('@prisma/client');
require('dotenv').config();
const prisma = new PrismaClient();
async function placeMonster(ctx, playerInfo, tileImage) {
    const monster = await prisma.monster.findMany({
        where: { user_id: playerInfo.id },
    })
    if (monster) {
        console.log(monster)

    } else {
        const rand = Math.floor(Math.random() * 100)
        if (rand <= 5) {
            const x = Math.floor(Math.random() * 10);
            const y = Math.floor(Math.random() * 15);
            ctx.drawImage(tileImage, x * 20, y * 20, mapInfo.TILE_SIZE, mapInfo.TILE_SIZE);
            await prisma.monster.create({
                data: {
                    user_id: message.author.id,
                    x: x,
                    y: y
                }
            })
        }
    }
    return ctx
}
module.exports = {
    placeMonster: placeMonster
}