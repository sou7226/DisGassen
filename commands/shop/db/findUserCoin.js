const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function findUserCoin(userId) {
    const user = await prisma.user.findUnique({
        where: { user_id: userId }
    });
    return user.coin
}

module.exports = {
    findUserCoin: findUserCoin
}
