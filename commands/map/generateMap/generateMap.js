const { createCanvas, loadImage } = require('canvas');
const { AttachmentBuilder } = require('discord.js')
const { placeMonster } = require('./object/placeMonster.js')
const { placeHall } = require('./object/placeHall.js')
const { placeGrass } = require('./object/placeGrass.js')
const { placePlayer } = require('./object/placePlayer.js')
const { placeBuilding } = require('./object/placeBuilding.js');
require('dotenv').config();
async function generateMap(mapInfo, playerInfo) {
    const canvas = createCanvas(mapInfo.Width, mapInfo.Height);
    const tileImage = await loadImage(mapInfo.tilePath);
    const grassTileImage = await loadImage(mapInfo.grassTilePath);
    const hallImage = await loadImage(mapInfo.hallPath);
    const playerImage = await loadImage(mapInfo.redPinPath);
    const shopImage = await loadImage(mapInfo.shopPath);
    let ctx = canvas.getContext('2d');
    ctx = placeGrass(ctx, grassTileImage, mapInfo)
    ctx = await placeHall(ctx, hallImage, playerInfo, mapInfo)
    ctx = await placeMonster(ctx, tileImage, playerInfo, mapInfo)
    ctx = await placePlayer(ctx, playerImage, playerInfo, mapInfo)
    ctx = await placeBuilding(ctx, shopImage, playerInfo, mapInfo)
    const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'map.png' });
    return attachment;
}
module.exports = {
    generateMap: generateMap
}