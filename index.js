const { Client, GatewayIntentBits, EmbedBuilder, AttachmentBuilder } = require('discord.js');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ],
});
const prefix = process.env.PREFIX;

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (message.content.includes(`${prefix}battle`)) {
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
