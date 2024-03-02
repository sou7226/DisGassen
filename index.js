const { Client, GatewayIntentBits, EmbedBuilder, AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const { createCanvas, loadImage } = require('canvas');
const { PrismaClient } = require('@prisma/client');
const fs = require('fs').promises;
const https = require('https');
const path = require('path');
require('dotenv').config();
const mapWidth = 300; // マップの幅
const mapHeight = 200; // マップの高さ
const tilePath = './img/tails/rock_tail1.png'; // タイルのパス
const hallPath = './img/tails/black.png'; // タイルのパス
const TILE_SIZE = 20;
const prisma = new PrismaClient();
const client = new Client({
    intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ],
});
let playerPosition = { x: 6, y: 0 }; // プレイヤーの初期位置（適宜調整）
async function generateMap(message) {
    const canvas = createCanvas(mapWidth, mapHeight);
    const ctx = canvas.getContext('2d');
    const tileImage = await loadImage(tilePath);
    const hallImage = await loadImage(hallPath);
    const avatarUrl = message.author.displayAvatarURL({ format: 'png', size: 1024 });
    const playerImage = await loadImage(avatarUrl);
    const terrain = await prisma.terrain.findMany({
        where: { user_id: message.author.id },
    })
    for (let y = 0; y < mapHeight; y += TILE_SIZE) {
        for (let x = 0; x < mapWidth; x += TILE_SIZE) {
            ctx.drawImage(tileImage, x, y, TILE_SIZE, TILE_SIZE);
            for (let i = 0; i < terrain.length; i++) {
                ctx.drawImage(hallImage, terrain[i].x * 20, terrain[i].y * 20, TILE_SIZE, TILE_SIZE);
            }
        }
    }
    const user = await prisma.user.findUnique({
        where: { id: message.author.id },
    })
    if (user) {
        playerPosition.x = user.x;
        playerPosition.y = user.y;
    }
    ctx.drawImage(playerImage, playerPosition.x * 20, playerPosition.y * 20, TILE_SIZE, TILE_SIZE);
    const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'map.png' });
    return attachment;
}
function binToHex(bin) {
    // 二進数を整数に変換
    const decimal = parseInt(bin, 2);
    // 整数を16進数に変換
    const hex = decimal.toString(16);
    return hex;
}
function reverseBinary(binaryString) {
    // 二進数文字列の各文字を反転させる
    const reversedBinary = binaryString.split('').map(bit => bit === '0' ? '1' : '0').join('');
    return reversedBinary;
}
function hexToBin(hexString, space = null) {
    // 16進数を2進数に変換
    const binaryString = parseInt(hexString, 16).toString(2);
    if (space) {
        const formattedBinary = binaryString.substring(0, space) + " " + binaryString.substring(space);
        return formattedBinary;
    }
    return binaryString;
}
const prefix = process.env.PREFIX;
async function getRandomImage(directory) {
    try {
        const files = await fs.readdir(directory);
        const pngFiles = files.filter(file => file.endsWith('.png'));
        if (!pngFiles.length) throw new Error('No PNG files found.');
        const randomFile = pngFiles[Math.floor(Math.random() * pngFiles.length)];
        return path.join(directory, randomFile);
    } catch (err) {
        console.error(err);
        throw err; // Re-throw the error to handle it in the calling context
    }
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
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    if (command === 'btohex') {
        const charArray = Array.from(args[0]);
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
        await handleBattleCommand(message);
    } else if (command === 'dig') {
        await prisma.terrain.create({
            data: {
                user_id: message.author.id,
                x: playerPosition.x,
                y: playerPosition.y
            }
        })
        message.channel.send("掘りました！");
    } else if (command === 'map') {
        const mapAttachment = await generateMap(message);

        // ボタンを作成
        const row = new ActionRowBuilder()
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

        // メッセージとボタンを送信
        message.channel.send({ files: [mapAttachment], components: [row] });
    }
});

client.on('interactionCreate', async interaction => {
    // インタラクションがボタンクリックでなければ処理をスキップ
    if (!interaction.isButton()) return;

    // ボタンのカスタムIDに応じて条件分岐
    switch (interaction.customId) {
        case 'up':
            playerPosition.y--;
            await prisma.user.update({
                where: { id: interaction.user.id },
                data: { y: playerPosition.y }
            })
            await interaction.reply('上に移動しました！');
            break;
        case 'down':
            playerPosition.y++;
            await prisma.user.update({
                where: { id: interaction.user.id },
                data: { y: playerPosition.y }
            })
            await interaction.reply('下に移動しました！');
            break;
        case 'left':
            playerPosition.x--;
            await prisma.user.update({
                where: { id: interaction.user.id },
                data: { y: playerPosition.x }
            })
            await interaction.reply('左に移動しました！');
            break;
        case 'right':
            playerPosition.x++;
            await prisma.user.update({
                where: { id: interaction.user.id },
                data: { y: playerPosition.x }
            })
            await interaction.reply('右に移動しました！');
            break;
        default:
            await interaction.reply('不明な操作です。');
            break;
    }
});
async function handleBattleCommand(message) {
    const userAvatarURL = message.author.avatarURL();
    const currentTime = new Date();

    for (let i = 1; i <= 3; i++) {
        const randomImagePath = await getRandomImage('./img/monsters');
        const attachment = new AttachmentBuilder(randomImagePath, { name: path.basename(randomImagePath) });
        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(`バトル開始！ - Round ${i}`)
            .setAuthor({ name: message.author.username, iconURL: userAvatarURL })
            .setDescription(`第${i}戦目`)
            .setImage(`attachment://${attachment.name}`)
            .setTimestamp(currentTime)
            .setFooter({ text: `Current time: ${currentTime.toLocaleTimeString()}` });
        const sentMessage = await message.channel.send({ files: [attachment], embeds: [embed] });
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
}

client.login(process.env.TOKEN);
