const { PrismaClient } = require('@prisma/client');
require('dotenv').config();
const prisma = new PrismaClient();
async function migrate(message, playerInfo){
    if(0 <= playerInfo.x <= 14 && 0 <= playerInfo.y <= 9 ){
        await prisma.user.update({
            where: { id: playerInfo.id },
            data: { 
                x: playerInfo.x,
                y: playerInfo.y
            }})
            return playerInfo
    }else if(playerInfo.x < 0){
        playerInfo.x = 0
    }else if(9 < playerInfo.x){
        playerInfo.x = 9
    }else if(playerInfo.y < 0){
        playerInfo.y = 0
    }else if(14 < playerInfo.y) {
        playerInfo.y = 14
    }else {
        message.channel.send("ようこそ虚数の世界へ")
    }
    message.channel.send("それ以上は進むことができませんよ！")
    return playerInfo

}
module.exports = {
    migrate:migrate
}