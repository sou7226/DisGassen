const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function dig(message, playerInfo) {
    const terrain = await prisma.terrain.findFirst({
        where: { user_id: message.author.id }
    })
    console.log(terrain)
    console.log(playerInfo) //
    if (terrain.x === playerInfo.x && terrain.y === playerInfo.y) {
        return message.channel.send("ここは既に掘られています！");
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