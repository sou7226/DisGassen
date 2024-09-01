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
 for(let i = 0; i < building.length; i++){
    if (building[i].x === playerInfo.x && building[i].y === playerInfo.y) {
        if (building[i].building_id === 1){
            return message.channel.send("ここにショップがあります！");
        } else if (building[i].building_id === 2){
            message.channel.send("```\nさらなる地下へと続いているようだ...\n中に入りますか？\nyes/noと発言\n```")
            try{
                const collected = await message.channel
                .awaitMessages({
                    filter: (m) => message.author.id === m.author.id, //messageはコマンド送信者のみに限定
                    max: 1, //messageの数は一つまで
                    time: 30_000, //時間は30秒
                    errors: ['time'] //時間超過したらエラーを発生
                });
                const responseMessage = collected.first();
                if (responseMessage.content === "yes") { 
                    await prisma.user.update({
                        where: { 
                            user_id: `${message.author.id}`,
                            },
                        data: {
                            layer: playerInfo.layer + 1,
                            x: 6,
                            y: 0
                        }
                    })
                    return message.channel.send(`${playerInfo.layer + 1}階層へ進みました！`)
                }
                else return message.channel.send('終了します。');   
            }catch (error) {
                console.log(error)
                return message.channel.send('時間切れです。');
            }

            return
        }
    }
 }
}
module.exports = {
    isObjectAtDestination:isObjectAtDestination
}