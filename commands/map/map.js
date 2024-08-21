const { generateMap } = require('./generateMap/generateMap.js');
const { migrate } = require('./migrate/migrate.js')
const upMessage = ["u", "up", "↑", "上", "うえ", "ue", "う"];
const rightMessage = ["r", "right", "→", "右", "みぎ", "migi", "み"];
const leftMessage = ["l", "left", "←", "左", "ひだり", "hidari", "ひ"];
const downMessage = ["d", "down", "↓", "下", "した", "sita", "し"];
require('dotenv').config();

async function map(message, mapInfo, playerInfo) {
    playerInfo.id = message.author.id
    const mapWidth = 14;
    const mapHeight = 9;
    let mapAttachment = await generateMap(mapInfo, playerInfo);
    const mapMessage = await message.channel.send({ files: [mapAttachment] });
    while (true) {
        try {
            const collected = await message.channel 
                .awaitMessages({
                    filter: (m) => message.author.id === m.author.id, //messageはコマンド送信者のみに限定
                    max: 1, //messageの数は一つまで
                    time: 30_000, //時間は30秒
                    errors: ['time'] //時間超過したらエラーを発生
                });
            const responseMessage = collected.first();
            console.log(playerInfo.y)
            if (responseMessage.content === "0") { //0なら終了
                message.channel.send('終了します。');
                break;
            } else if (upMessage.includes(responseMessage.content)) { //上がるメッセージを受信
                await responseMessage.delete()//対象のメッセージを削除
                if (playerInfo.y - 1 >= 0) { //yが0以上の場合(マップからはみ出さない場合)
                    playerInfo.y--;
                    playerInfo = await migrate(playerInfo)
                    mapAttachment = await generateMap(mapInfo, playerInfo);
                    mapMessage.edit({ files: [mapAttachment] })
                } else {//0以下の場合(マップからはみ出る場合)
                    await message.channel.send("これ以上は進むことはできませんよ！");
                }
            } else if (downMessage.includes(responseMessage.content)) { //下がるメッセージを受信
                await responseMessage.delete()
                if (playerInfo.y + 1 <= mapHeight) { //yが9以下の場合(マップからはみ出さない場合)
                    playerInfo.y++;
                    playerInfo = await migrate(playerInfo)
                    mapAttachment = await generateMap(mapInfo, playerInfo);
                    mapMessage.edit({ files: [mapAttachment] })
                } else {//mapHeigh以上になる場合(マップからはみ出る場合)
                    await message.channel.send("これ以上は進むことはできませんよ！");
                }
            } else if (leftMessage.includes(responseMessage.content)) {
                await responseMessage.delete()
                if (playerInfo.x - 1 >= 0) {
                    playerInfo.x--;
                    playerInfo = await migrate(playerInfo)
                    mapAttachment = await generateMap(mapInfo, playerInfo);
                    mapMessage.edit({ files: [mapAttachment] })
                } else {//0以下の場合(マップからはみ出る場合)
                    await message.channel.send("これ以上は進むことはできませんよ！");
                }
            } else if (rightMessage.includes(responseMessage.content)) {
                await responseMessage.delete()
                if (playerInfo.x + 1 <= mapWidth) {
                    playerInfo.x++;
                    playerInfo = await migrate(playerInfo)
                    mapAttachment = await generateMap(mapInfo, playerInfo);
                    mapMessage.edit({ files: [mapAttachment] })
                } else {//mapWidth以上の場合(マップからはみ出る場合)
                    await message.channel.send("これ以上は進むことはできませんよ！");
                }
            }
        } catch (error) {
            return message.channel.send('時間切れです。');
        }
    }
}
module.exports = {
    map: map
}