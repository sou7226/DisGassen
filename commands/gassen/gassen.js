const { EmbedBuilder } = require('discord.js')
const { getGassenPlayerInfo } = require('./gassenInit.js')
function selectRandomHandSign(botHandSign) {
    const keys = Object.keys(botHandSign);
    const randomIndex = Math.floor(Math.random() * keys.length);
    const selectedKey = keys[randomIndex];
    return botHandSign[selectedKey];
}

async function gassen(message, mapInfo, playerInfo) {
    const {playerHandSigns, botHandSigns} = getGassenPlayerInfo()
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
            { name: '1⃣拳', value: `${playerHandSigns.rock}`, inline: true },
            { name: '2⃣双剣', value: `${playerHandSigns.scissors}`, inline: true },
            { name: '3⃣盾', value: `${playerHandSigns.paper}`, inline: true },
        )
        .setTimestamp(currentTime)
        .setFooter({ text: `Current time: ${currentTime.toLocaleTimeString()}` })
    await message.channel.send({ embeds: [embed] });
    while (true) {
        try{
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
        }catch(error){
            message.channel.send(`終了`)
            break
        }


    }
}
module.exports = {
    gassen: gassen
}