const { PrismaClient } = require('@prisma/client');
require('dotenv').config();
const prisma = new PrismaClient();
const { battle } = require('../../battle/battle.js')
const { monsterInfo } = require('../../../informations/monsterInfo.js')
async function isMonsterAtDestination(message){//移動した先にeventが発生するオブジェクトに当たっているかを判断する関数
const playerInfo = await prisma.user.findFirst({
    where: { user_id: message.author.id }
})
 const monster = await prisma.monster.findMany({
    where:{
        user_id: message.author.id
    }
 })
 for(let j = 0; j < monster.length; j++){
    if (monster[j].x === playerInfo.x && monster[j].y === playerInfo.y) {
        playerInfo.hp = 100
        playerInfo.power = 30
        playerInfo.speed = 40
        message.channel.send("\`\`\`\nモンスターが出現した！\n\`\`\`")
        await battle(message, playerInfo, monsterInfo);
        return 
    }
 }
}
module.exports = {
    isMonsterAtDestination:isMonsterAtDestination
}