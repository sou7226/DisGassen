const { createCanvas, loadImage } = require('canvas');
const { AttachmentBuilder } = require('discord.js')
async function generateMap(prisma, mapInfo, playerInfo) {
    const canvas = createCanvas(mapInfo.Width, mapInfo.Height);
    const ctx = canvas.getContext('2d');
    const tileImage = await loadImage(mapInfo.tilePath);
    const hallImage = await loadImage(mapInfo.hallPath);
    const playerImage = await loadImage(mapInfo.redPinPath);
    const terrain = await prisma.terrain.findMany({
        where: { user_id: playerInfo.id },
    })
    for (let y = 0; y < mapInfo.Height; y += mapInfo.TILE_SIZE) {
        for (let x = 0; x < mapInfo.Width; x += mapInfo.TILE_SIZE) {
            ctx.drawImage(tileImage, x, y, mapInfo.TILE_SIZE, mapInfo.TILE_SIZE);
            for (let i = 0; i < terrain.length; i++) {
                ctx.drawImage(hallImage, terrain[i].x * 20, terrain[i].y * 20, mapInfo.TILE_SIZE, mapInfo.TILE_SIZE);
            }
        }
    }
    const user = await prisma.user.findUnique({
        where: { id: playerInfo.id },
    })
    if (user) {
        playerInfo.x = user.x;
        playerInfo.y = user.y;
    }
    ctx.drawImage(playerImage, playerInfo.x * 20, playerInfo.y * 20, mapInfo.TILE_SIZE, mapInfo.TILE_SIZE);
    const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'map.png' });
    return attachment;
}
module.exports = {
    generateMap:generateMap
}