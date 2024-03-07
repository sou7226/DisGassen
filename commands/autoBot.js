
const { PrismaClient } = require('@prisma/client');
const { AttachmentBuilder, EmbedBuilder } = require('discord.js')
const prisma = new PrismaClient();
async function autoBot(message, playerInfo) {
    const userAvatarURL = message.author.avatarURL();
    const currentTime = new Date();
    const robotPath = '../img/robot/robot.png'
    const attachment = new AttachmentBuilder(robotPath, { name: "robot.png" });
    const embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(`人形`)
        .setThumbnail(`attachment://${attachment.name}`)
        .setAuthor({ name: message.author.username, iconURL: userAvatarURL })
        .setDescription(`人形`)
        .setTimestamp(currentTime)
        .setFooter({ text: `Current time: ${currentTime.toLocaleTimeString()}` });
    await message.channel.send({ files: [attachment], embeds: [embed] });
    return playerInfo
}
module.exports = {
    autoBot: autoBot
}