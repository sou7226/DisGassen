
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
    for( let i = 0; i < items.length; i++){
        lists.push({name: `\`${items[i].name}\``, value: items[i].effect})
    }
    const embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(`人形`)
        .setThumbnail(`attachment://${attachment.name}`)
        .setAuthor({ name: message.author.username, iconURL: userAvatarURL })
        .setDescription(`人形`)
        .setTimestamp(currentTime)
        .setFooter({ text: `Current time: ${currentTime.toLocaleTimeString()}` })
        .addFields(lists)
    console.log(items)
    await message.channel.send({ files: [attachment], embeds: [embed] });
}
module.exports = {
    shop: shop
}