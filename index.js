const { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { PrismaClient } = require('@prisma/client');
const { binToHex } = require('./commands/binToHex.js');
const { hexToBin } = require('./commands/hexToBin.js');
const { reverseBinary } = require('./commands/reverseBinary.js');
const { generateMap } = require('./commands/map/generateMap.js');
const { battle } = require('./commands/battle/battle.js')
const prefix = process.env.PREFIX;
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
let mapMessage, controllButton;
let mapInfo = {
    Width:300, // マップの幅
    Height:200,
    tilePath:'./img/tails/rock_tail1.png',
    hallPath:'./img/tails/black.png',
    redPinPath:'./img/red_pin.png',
    TILE_SIZE:20
}
let monsterInfo = {
    level: null,
    hp: null,
    power: null,
    speed: null
}
let friend = {
    hp: null,
    power: null,
    speed: null
}
let playerInfo = {
    id: null,
    avaterURL: null,
    level: null,
    hp: null,
    power: null,
    speed: null,
    x:6,
    y:0
}
playerInfo.hp = 100
playerInfo.power = 30
playerInfo.speed = 40
friend.hp = 100
friend.power = 30
friend.speed = 40
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
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    if (command === 'btohex') {
        message.channel.send(`${binToHex(args[0])}`)
    } else if (command === 'hextob') {
        message.channel.send(`${hexToBin(args[0], 10)}`)
    } else if (command === 'reverse') {
        message.channel.send(`${reverseBinary(args[0])}`)
    } else if (command === 'show_coin') {
        const user = await prisma.user.findUnique({
            where: { id: message.author.id },
        });
        if (user) {
            message.channel.send(`You have \`${user.coin}\` coins.`);
        } else {
            await prisma.user.create({
                data: { id: message.author.id, coin: 0 }
            });
            message.channel.send("データがありません。");
        }
    } else if (command === 'battle') {
        await battle(message, prisma, playerInfo, monsterInfo);
    } else if (command === 'st') {
        await battleStatus(message);
    } else if (command === 'pinfo') {
        await playerStatus(prisma, message);
    } else if (command === 'tag') {
        await battleTag(message);
    } else if (command === 'dig') {
        await prisma.terrain.create({
            data: {
                user_id: message.author.id,
                x: playerInfo.x,
                y: playerInfo.y
            }
        })
        message.channel.send("掘りました！");
    } else if (command === 'map') {
        const mapAttachment = await generateMap(prisma, mapInfo, playerInfo);
        controllButton = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('up')
                    .setLabel('↑')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('left')
                    .setLabel('←')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('right')
                    .setLabel('→')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('down')
                    .setLabel('↓')
                    .setStyle(ButtonStyle.Primary),
            );
        mapMessage = await message.channel.send({ files: [mapAttachment], components: [controllButton] });
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;

    let mapAttachment;
    switch (interaction.customId) {
        case 'up':
            playerInfo.y--;
            await prisma.user.update({
                where: { id: interaction.user.id },
                data: { y: playerInfo.y }
            })
            mapAttachment = await generateMap(prisma, mapInfo, playerInfo);
            mapMessage.edit({ files: [mapAttachment] })
            await interaction.reply({ content: '上に移動しました！', fetchReply: true })
                .then(sentMessage => {
                    // 2秒後に返信を削除
                    setTimeout(() => {
                        interaction.deleteReply().catch(console.error);
                    }, 2000);
                })
                .catch(console.error);
            break;
        case 'down':
            playerInfo.y++;
            await prisma.user.update({
                where: { id: interaction.user.id },
                data: { y: playerInfo.y }
            })
            mapAttachment = await generateMap(prisma, mapInfo, playerInfo);
            mapMessage.edit({ files: [mapAttachment] })
            await interaction.reply({ content: '下に移動しました！', fetchReply: true })
                .then(sentMessage => {
                    // 2秒後に返信を削除
                    setTimeout(() => {
                        interaction.deleteReply().catch(console.error);
                    }, 2000);
                })
                .catch(console.error);
            break;
        case 'left':
            playerInfo.x--;
            await prisma.user.update({
                where: { id: interaction.user.id },
                data: { x: playerInfo.x }
            })
            mapAttachment = await generateMap(prisma, mapInfo, playerInfo);
            mapMessage.edit({ files: [mapAttachment] })
            await interaction.reply({ content: '左に移動しました！', fetchReply: true })
                .then(sentMessage => {
                    // 2秒後に返信を削除
                    setTimeout(() => {
                        interaction.deleteReply().catch(console.error);
                    }, 2000);
                })
                .catch(console.error);
            break;
        case 'right':
            playerInfo.x++;
            await prisma.user.update({
                where: { id: interaction.user.id },
                data: { x: playerInfo.x }
            })
            mapAttachment = await generateMap(prisma, mapInfo, playerInfo);
            mapMessage.edit({ files: [mapAttachment] })
            await interaction.reply({ content: '右に移動しました！', fetchReply: true })
                .then(sentMessage => {
                    // 2秒後に返信を削除
                    setTimeout(() => {
                        interaction.deleteReply().catch(console.error);
                    }, 2000);
                })
                .catch(console.error);
            break;
        default:
            await interaction.reply('不明な操作です。');
            break;
    }
});
async function battleStatus(message) {

}
async function battleTag(message) {

}
client.login(process.env.TOKEN);
