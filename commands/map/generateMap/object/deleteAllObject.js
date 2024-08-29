const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function deleteAllObject(ctx, tileImage, playerInfo, mapInfo)  {
    await prisma.building.deleteMany({
      where: {
        user_id: playerInfo.id,
        layer: playerInfo.layer,
        x: 6,
        y: 0
      },
    });
    await prisma.monster.deleteMany({
        where: {
          user_id: playerInfo.id,
          layer: playerInfo.layer,
          x: 6,
          y: 0
        },
      });
    ctx.drawImage(tileImage, 6 * 20, 0 * 20, mapInfo.TILE_SIZE, mapInfo.TILE_SIZE);
    return ctx
}
module.exports = {
    deleteAllObject:deleteAllObject
}
