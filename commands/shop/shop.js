
const { PrismaClient } = require('@prisma/client');
const { AttachmentBuilder, EmbedBuilder } = require('discord.js')
const prisma = new PrismaClient();
const path = require('path');
async function shop(message, items) {
    const userAvatarURL = message.author.avatarURL();
    const currentTime = new Date();
    const buildingPath = path.join('./img/buildings/', 'shop.png');
    const attachment = new AttachmentBuilder(buildingPath, { name: "shop.png" });
    let lists = []
    for (let i = 0; i < items.length; i++) {
        lists.push({ name: `\`${items[i].item_id}.\`${items[i].name}`, value: items[i].effect, inline: true })
    }
    const embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(`アイテムショップ`)
        .setThumbnail(`attachment://${attachment.name}`)
        .setAuthor({ name: message.author.username, iconURL: userAvatarURL })
        .setDescription(`いらっしゃい～！見ていってね！`)
        .setTimestamp(currentTime)
        .setFooter({ text: `Current time: ${currentTime.toLocaleTimeString()}` })
        .addFields(lists)
    await message.channel.send({ files: [attachment], embeds: [embed] });
}
module.exports = {
    shop: shop
}