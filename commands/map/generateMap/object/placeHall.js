function placeHall(ctx, hallImage, terrain, mapInfo) {
    for (let i = 0; i < terrain.length; i++) {
        ctx.drawImage(hallImage, terrain[i].x * 20, terrain[i].y * 20, mapInfo.TILE_SIZE, mapInfo.TILE_SIZE);
    }
    return ctx
}
module.exports = {
    placeHall: placeHall
}