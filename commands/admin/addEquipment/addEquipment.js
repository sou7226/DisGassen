const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addEquipment(message, userId, equipId, level = 1) {
  try {
    const newEquipment = await prisma.equipment.create({
      data: {
        user_id: userId,
        equip_id: equipId,
        level: level
      },
    });

    message.channel.send(`New equipment added:\n${JSON.stringify(newEquipment, null, 2)}`);

  } catch (error) {
    console.error('Error adding equipment:', error);
  }
}
module.exports = {
  addEquipment: addEquipment
}