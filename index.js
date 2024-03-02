const { Client, GatewayIntentBits, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();
const client = new Client({
    intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ],
});
const prefix = process.env.PREFIX;
let getUser = async (userId) => {
    await prisma.user.findUnique({
        where: { id: userId },
    })
}
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    const user = await prisma.user.findUnique({
        where: { id: message.author.id },
    })
    if (user) {
        await prisma.user.update({
            where: { id: message.author.id },
            data: { coin: user.coin + 1 }
        })
    } else {
        await prisma.user.create({
            data: { id: message.author.id }
        })
    }
    if (message.content.includes(`${prefix}show_coin`)) {
        const user = await prisma.user.findUnique({
            where: { id: message.author.id },
        })
        if (user) {
            message.channel.send(`${user.coin}`);
        } else {
            await prisma.user.create({
                data: { id: message.author.id }
            })
            message.channel.send("データがありません");
        }

    }
    else if (message.content.includes(`${prefix}battle`)) {
        const userAvatarURL = message.author.avatarURL();
        const currentTime = new Date();
        const attachment1 = new AttachmentBuilder('./img/1.png', { name: '1.png' });
        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('バトル開始！')
            .setAuthor({ name: 'Some name', iconURL: userAvatarURL })
            .setDescription('第一戦目')
            .addFields(
                { name: 'Inline field title', value: 'Some value here', inline: true },
                { name: 'Inline field title', value: 'Some value here', inline: true },
            )
            .setImage(`attachment://${attachment1.name}`)
            .setTimestamp()
            .setFooter({ text: `Current time: ${currentTime.toLocaleTimeString()}` })
        const sentMessage = await message.channel.send({ files: [attachment1], embeds: [embed] });
        await new Promise(resolve => setTimeout(resolve, 5000));
        const attachment2 = new AttachmentBuilder('./img/2.png', { name: '2.png' });
        embed
            .setImage(`attachment://${attachment2.name}`)
            .setTimestamp()
            .setFooter({ text: `Current time: ${currentTime.toLocaleTimeString()}` })
        await sentMessage.edit({ files: [attachment2], embeds: [embed] });
    }
});
client.login(process.env.TOKEN);
