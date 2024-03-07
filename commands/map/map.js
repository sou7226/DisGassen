const { generateMap } = require('./generateMap/generateMap.js');
const { migrate } = require('./migrate/migrate.js')
const upMessage = ["u", "up", "↑", "上", "うえ", "ue", "う"];
const rightMessage = ["r", "right", "→", "右", "みぎ", "migi", "み"];
const leftMessage = ["l", "left", "←", "左", "ひだり", "hidari", "ひ"];
const downMessage = ["d", "down", "↓", "下", "した", "sita", "し"];
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();
const prisma = new PrismaClient();
async function map(message, mapInfo, playerInfo) {
    playerInfo.id = message.author.id
    let mapAttachment = await generateMap(mapInfo, playerInfo);
    const mapMessage = await message.channel.send({ files: [mapAttachment] });
    while (true) {
        try {
            const collected = await message.channel
                .awaitMessages({
                    filter: (m) => message.author.id === m.author.id,
                    max: 1,
                    time: 30_000,
                    errors: ['time']
                });
            const responseMessage = collected.first();
            if (responseMessage.content === "0") {
                message.channel.send('終了します。');
                break;
            } else if (upMessage.includes(responseMessage.content)) {
                await responseMessage.delete()
                playerInfo.y--;
                const isOutY = (playerInfo.y % 9) + 1
                if (isOutY !== 0) {
                    playerInfo = await migrate(playerInfo)
                } else {
                    try {
                        const sentMessage = await message.channel.send("これ以上は進むことはできませんよ！");
                        setTimeout(() => sentMessage.delete(), 3000); // 3秒後にメッセージを削除
                    } catch (error) {
                        console.error('メッセージの送信または削除に失敗しました:', error);
                    }
                }
                mapAttachment = await generateMap(mapInfo, playerInfo);
                mapMessage.edit({ files: [mapAttachment] })
            } else if (downMessage.includes(responseMessage.content)) {
                await responseMessage.delete()
                playerInfo.y++;
                const isOutY = (playerInfo.y % 9) + 1
                if (isOutY !== 0) {
                    playerInfo = await migrate(playerInfo)
                } else {
                    try {
                        const sentMessage = await message.channel.send("これ以上は進むことはできませんよ！");
                        setTimeout(() => sentMessage.delete(), 3000); // 3秒後にメッセージを削除
                    } catch (error) {
                        console.error('メッセージの送信または削除に失敗しました:', error);
                    }
                }
                mapAttachment = await generateMap(mapInfo, playerInfo);
                mapMessage.edit({ files: [mapAttachment] })
            } else if (leftMessage.includes(responseMessage.content)) {
                await responseMessage.delete()
                playerInfo.x--;
                const isOutX = (playerInfo.x % 14) + 1
                if (isOutX !== 0) {
                    playerInfo = await migrate(playerInfo)
                } else {
                    try {
                        const sentMessage = await message.channel.send("これ以上は進むことはできませんよ！");
                        setTimeout(() => sentMessage.delete(), 3000); // 3秒後にメッセージを削除
                    } catch (error) {
                        console.error('メッセージの送信または削除に失敗しました:', error);
                    }
                }
                mapAttachment = await generateMap(mapInfo, playerInfo);
                mapMessage.edit({ files: [mapAttachment] })
            } else if (rightMessage.includes(responseMessage.content)) {
                await responseMessage.delete()
                playerInfo.x++;
                const isOutX = (playerInfo.x % 14) + 1
                if (isOutX !== 0) {
                    playerInfo = await migrate(playerInfo)
                } else {
                    try {
                        const sentMessage = await message.channel.send("これ以上は進むことはできませんよ！");
                        setTimeout(() => sentMessage.delete(), 3000); // 3秒後にメッセージを削除
                    } catch (error) {
                        console.error('メッセージの送信または削除に失敗しました:', error);
                    }
                }
                mapAttachment = await generateMap(mapInfo, playerInfo);
                mapMessage.edit({ files: [mapAttachment] })
            }
        } catch (error) {
            return message.channel.send('時間切れです。');
        }
    }
}
module.exports = {
    map: map
}