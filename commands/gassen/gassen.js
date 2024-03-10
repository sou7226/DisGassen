const { PrismaClient } = require('@prisma/client');
const { AttachmentBuilder, EmbedBuilder } = require('discord.js')
//const { generateField } = require('./generateField/generateField.js')
const prisma = new PrismaClient();
const path = require('path');
function selectRandomHandSign(botHandSign) {
    // オブジェクトのキーを配列として取得
    const keys = Object.keys(botHandSign);
    // ランダムなインデックスを生成
    const randomIndex = Math.floor(Math.random() * keys.length);
    // ランダムなキーを選択
    const selectedKey = keys[randomIndex];
    // 選択したキーを使用して、オブジェクトから値を取得
    return botHandSign[selectedKey];
}

async function gassen(message, mapInfo, playerInfo) {
    const botHandSigns = {
        rock: 98,
        scissors: 99,
        paper: 100,
    }
    const playuerHandSigns = {
        rock: 89,
        scissors: 90,
        paper: 91,
    }
    const currentTime = new Date();
    const embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(`第一戦`)
        .setDescription(`どれを出陣させる？`)
        .addFields(
            { name: '拳', value: `${botHandSigns.rock}`, inline: true },
            { name: '双剣', value: `${botHandSigns.scissors}`, inline: true },
            { name: '盾', value: `${botHandSigns.paper}`, inline: true },
            { name: ' ', value: ' ', inline: true },
            { name: 'vs', value: ' ', inline: true },
            { name: ' ', value: ' ', inline: true },
            { name: '1⃣拳', value: `${playuerHandSigns.rock}`, inline: true },
            { name: '2⃣双剣', value: `${playuerHandSigns.scissors}`, inline: true },
            { name: '3⃣盾', value: `${playuerHandSigns.paper}`, inline: true },
        )
        .setTimestamp(currentTime)
        .setFooter({ text: `Current time: ${currentTime.toLocaleTimeString()}` })
    await message.channel.send({ embeds: [embed] });
    while (true) {
        const collected = await message.channel
            .awaitMessages({
                filter: (m) => message.author.id === m.author.id,
                max: 1,
                time: 30_000,
                errors: ['time']
            });
        const responseMessage = collected.first();
        if (responseMessage.content === "0") {
            message.channel.send(`終了`)
            break
        } else if (responseMessage.content === "1") {
            const handSign = selectRandomHandSign(botHandSigns)
            message.channel.send(`${handSign}`)
            continue
        } else if (responseMessage.content === "2") {
            const handSign = selectRandomHandSign(botHandSigns)
            message.channel.send(`${handSign}`)
            continue
        } else if (responseMessage.content === "3") {
            const handSign = selectRandomHandSign(botHandSigns)
            message.channel.send(`${handSign}`)
            continue
        } else {
            message.channel.send(`正しい数字を発言してください`)
            continue
        }

    }
}
module.exports = {
    gassen: gassen
}