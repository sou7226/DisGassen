const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildBans,
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
        console.log("受信2")
        const userAvatarURL = message.author.avatarURL();
        const currentTime = new Date();
        const exampleEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('バトル開始！')
            .setAuthor({ name: 'Some name', iconURL: userAvatarURL })
            .setDescription('第一戦目')
            .addFields(
                { name: 'Inline field title', value: 'Some value here', inline: true },
                { name: 'Inline field title', value: 'Some value here', inline: true },
            )
            .setImage('https://i.imgur.com/AfFp7pu.png')
            .setTimestamp()
            .setFooter({ text: `Current time: ${currentTime.toLocaleTimeString()}` });

        message.channel.send({ embeds: [exampleEmbed] });
    }
});

client.login(process.env.TOKEN);
