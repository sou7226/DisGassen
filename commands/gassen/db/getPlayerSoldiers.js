const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function getPlayerSoldier(message){
    const gassen = await prisma.gassen.findUnique({
        where: { user_id: message.author.id },
    })
    if (!gassen)  {
        gassen = await prisma.gassen.create({
            data: {
                user_id: message.author.id,
            }
        })
    }
    return gassen
}
module.exports = {
    getPlayerSoldier: getPlayerSoldier
}