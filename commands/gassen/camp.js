const { EmbedBuilder } = require('discord.js')
const { getPlayerSoldier } = require('./db/getPlayerSoldiers')
async function camp(message){
    const gassen = await getPlayerSoldier(message)
    const embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(`第一戦`)
        .setDescription("あなたの陣営\n`wwchange {handsign} {number}`")
        .addFields(
            { name: '拳', value: `${gassen.rock}`, inline: true },
            { name: '双剣', value: `${gassen.scissors}`, inline: true },
            { name: '盾', value: `${gassen.paper}`, inline: true }
        )
        .setTimestamp(currentTime)
        .setFooter({ text: `Current time: ${currentTime.toLocaleTimeString()}` })
    message.channel.send({ embeds: [embed] });
}
module.exports = {
    camp: camp
}