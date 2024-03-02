const { Client, GatewayIntentBits, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');
const { PrismaClient } = require('@prisma/client');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();
const mapWidth = 300; // マップの幅
const mapHeight = 200; // マップの高さ
const tilePath = './img/rock_tail1.png'; // タイルのパス
const playerPath = './img/red_pin.png'; // プレイヤーのパス
const playerPosition = { x: 50, y: 50 }; // プレイヤーの初期位置（適宜調整）
const TILE_SIZE = 20;
const PLAYER_SIZE = 20;
const prisma = new PrismaClient();
const client = new Client({
    intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ],
});
// 画像を指定されたサイズにリサイズする関数
async function resizeImage(imagePath, width, height) {
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    const image = await loadImage(imagePath);
    // 指定されたサイズで画像をキャンバスに描画（リサイズ）
    ctx.drawImage(image, 0, 0, width, height);
    return canvas.toBuffer();
}

// マップを生成する関数を修正して、リサイズされたタイルとプレイヤー画像を使用
async function generateMap() {
    const canvas = createCanvas(mapWidth, mapHeight);
    const ctx = canvas.getContext('2d');

    // 地面のタイルとプレイヤーの画像をリサイズ
    const tileBuffer = await resizeImage(tilePath, TILE_SIZE, TILE_SIZE); // TILE_SIZEはタイルの新しいサイズ
    const playerBuffer = await resizeImage(playerPath, PLAYER_SIZE, PLAYER_SIZE); // PLAYER_SIZEはプレイヤー画像の新しいサイズ

    const tileImage = await loadImage(tileBuffer);
    const playerImage = await loadImage(playerBuffer);

    // 地面のタイルをキャンバスに敷き詰める
    for (let y = 0; y < mapHeight; y += TILE_SIZE) {
        for (let x = 0; x < mapWidth; x += TILE_SIZE) {
            ctx.drawImage(tileImage, x, y, TILE_SIZE, TILE_SIZE);
        }
    }

    // プレイヤーの画像を指定された位置に描画
    ctx.drawImage(playerImage, playerPosition.x, playerPosition.y, PLAYER_SIZE, PLAYER_SIZE);

    // キャンバスからバッファを生成し、そのバッファをもとにAttachmentを作成
    const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'map.png' });

    return attachment;
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

    if (command === 'show_coin') {
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
    } else if (command === 'map') {
        const mapAttachment = await generateMap();
        message.channel.send({ files: [mapAttachment] });
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
