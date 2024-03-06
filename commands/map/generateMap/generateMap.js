const { createCanvas, loadImage } = require('canvas');
const { AttachmentBuilder } = require('discord.js')
const { PrismaClient } = require('@prisma/client');
const { placeMonster } = require('./object/placeMonster.js')
const { placeHall } = require('./object/placeHall.js')
const { placeGrass } = require('./object/placeGrass.js')
require('dotenv').config();
const prisma = new PrismaClient();
async function generateMap(mapInfo, playerInfo) {
    const canvas = createCanvas(mapInfo.Width, mapInfo.Height);
    const tileImage = await loadImage(mapInfo.tilePath);
    const grassTileImage = await loadImage(mapInfo.grassTilePath);
    const hallImage = await loadImage(mapInfo.hallPath);
    const playerImage = await loadImage(mapInfo.redPinPath);
    let ctx = canvas.getContext('2d');
    const terrain = await prisma.terrain.findMany({
        where: { user_id: playerInfo.id },
    })
    ctx = placeGrass(ctx, grassTileImage, mapInfo)
    ctx = placeHall(ctx, hallImage, terrain, mapInfo)
    ctx = await placeMonster(ctx, playerInfo, tileImage)
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
    generateMap: generateMap
}