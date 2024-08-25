const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function updateItem(userId, items, itemNumber) {
  const item = await prisma.playerItem.findFirst({
    where: {
      user_id: userId, // user_idでレコードを検索
      item_id: itemNumber,
    },
  });
  if (item) {
    await prisma.playerItem.update({
      where: {
        id: item.id, // プライマリーキーを使用
      },
      data: {
        quantity: {
          increment: 1,
        },
      },
    });
  } else {
    await prisma.playerItem.create({
      data: {
        user_id: userId, // user_idでレコードを検索
        item_id: itemNumber,
        quantity: 1
      },
    });
  }
}
module.exports = {
  updateItem: updateItem
}