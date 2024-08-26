const { PrismaClient } = require('@prisma/client');
require('dotenv').config();
const prisma = new PrismaClient();
async function isObjectAtDestination(message){//移動した先にeventが発生するオブジェクトに当たっているかを判断する関数
const playerInfo = await prisma.user.findFirst({
    where: { user_id: message.author.id }
})
 const building = await prisma.building.findMany({
    where:{
        user_id: message.author.id
    }
 })
 const monster = await prisma.monster.findMany({
    where:{
        user_id: message.author.id
    }
 })
 for(let i = 0; i < building.length; i++){
    if (building[i].x === playerInfo.x && building[i].y === playerInfo.y) {
        return message.channel.send("ここに建造物があります！");
    }
 }
 for(let j = 0; j < monster.length; j++){
    if (monster[j].x === playerInfo.x && monster[j].y === playerInfo.y) {
        return message.channel.send("ここにモンスターがいます！");
    }
 }
 
}
module.exports = {
    isObjectAtDestination:isObjectAtDestination
}