const { getRandomImage } = require('./assets/getRandomImage.js')
const { AttachmentBuilder, EmbedBuilder } = require('discord.js')
const path = require('path');

async function spawnMonster(message, monsterInfo) {
    const userAvatarURL = message.author.avatarURL();
    const currentTime = new Date();
    const randomImagePath = await getRandomImage('./img/monsters');
    const attachment = new AttachmentBuilder(randomImagePath, { name: path.basename(randomImagePath) });
    const embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(`バトル開始！ - Round 1`)
        .setAuthor({ name: message.author.username, iconURL: userAvatarURL })
        .setDescription(`モンスターのHP:${monsterInfo.hp}\n攻撃力:${monsterInfo.power}`)
        .setImage(`attachment://${attachment.name}`)
        .setTimestamp(currentTime)
        .setFooter({ text: `Current time: ${currentTime.toLocaleTimeString()}` });
    await message.channel.send({ files: [attachment], embeds: [embed] });
}
module.exports = {
    spawnMonster:spawnMonster
}