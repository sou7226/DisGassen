function placeGrass(ctx, grassTileImage, mapInfo) {
    for (let y = 0; y < mapInfo.Height; y += mapInfo.TILE_SIZE) {
        for (let x = 0; x < mapInfo.Width; x += mapInfo.TILE_SIZE) {
            ctx.drawImage(grassTileImage, x, y, mapInfo.TILE_SIZE, mapInfo.TILE_SIZE);
        }
    }
}
module.exports = {
    placeGrass: placeGrass
}