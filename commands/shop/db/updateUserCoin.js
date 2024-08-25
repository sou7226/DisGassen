const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateUserCoin(userId, items, itemNumber, price) {
    await prisma.user.update({
        where: { user_id: userId },
        data: {
            coin: price
        }
    });
}

module.exports = {
    updateUserCoin: updateUserCoin
};
