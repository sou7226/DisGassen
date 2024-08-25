const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function dig(message) {
    const terrain = await prisma.terrain.findMany({
        where: { user_id: message.author.id }
    })
    const playerInfo = await prisma.user.findFirst({
        where: { user_id: message.author.id }
    })
    for (let i = 0; i < terrain.length; i++) {
        if (terrain[i].x === playerInfo.x && terrain[i].y === playerInfo.y) {
            return message.channel.send("ここは既に掘られています！");
        }
      }
    await prisma.terrain.create({
        data: {
            user_id: message.author.id,
            x: playerInfo.x,
            y: playerInfo.y
        }
    })
    message.channel.send("掘りました！");
}

module.exports = {
    dig: dig
}