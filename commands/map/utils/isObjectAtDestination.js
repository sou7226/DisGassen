const { PrismaClient } = require('@prisma/client');
require('dotenv').config();
const prisma = new PrismaClient();
async function isObjectAtDestination(message){//移動した先にeventが発生するオブジェクトに当たっているかを判断する関数
const playerInfo = await prisma.user.findFirst({
    where: { user_id: message.author.id }
})
 const building = await prisma.building.findMany({
    where:{
        user_id: playerInfo.id
    }
 })
 const monster = await prisma.monster.findMany({
    where:{
        user_id: playerInfo.id
    }
 })
}
module.exports = {
    isObjectAtDestination:isObjectAtDestination
}