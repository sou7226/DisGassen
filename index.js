const { Client, GatewayIntentBits, EmbedBuilder, AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');
const { PrismaClient } = require('@prisma/client');
const { binToHex } = require('./commands/binToHex.js')
const { hexToBin } = require('./commands/hexToBin.js')
const { reverseBinary } = require('./commands/reverseBinary.js')
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();
const mapWidth = 300; // マップの幅
const mapHeight = 200; // マップの高さ
const tilePath = './img/tails/rock_tail1.png'; // タイルのパス
const hallPath = './img/tails/black.png'; // タイルのパス
const redPinPath = './img/red_pin.png'
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
let mapMessage, controllButton;
let battle = {
    monster: {
        level: null,
        hp: null,
        power: null,
        speed: null
    },
    player: {
        level: null,
        hp: null,
        power: null,
        speed: null
    }
}
let friend = {
    hp: null,
    power: null,
    speed: null
}
let player = {
    id: null,
    avaterURL: null
}
battle.player.hp = 100
battle.player.power = 30
battle.player.speed = 40
friend.hp = 100
friend.power = 30
friend.speed = 40
let playerPosition = { x: 6, y: 0 }; // プレイヤーの初期位置（適宜調整）
async function generateMap(player) {
    const canvas = createCanvas(mapWidth, mapHeight);
    const ctx = canvas.getContext('2d');
    const tileImage = await loadImage(tilePath);
    const hallImage = await loadImage(hallPath);
    const playerImage = await loadImage(redPinPath);
    const terrain = await prisma.terrain.findMany({
        where: { user_id: player.id },
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
        where: { id: player.id },
    })
    if (user) {
        playerPosition.x = user.x;
        playerPosition.y = user.y;
    }
    ctx.drawImage(playerImage, playerPosition.x * 20, playerPosition.y * 20, TILE_SIZE, TILE_SIZE);
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
        await handleBattleCommand(message);
    } else if (command === 'st') {
        await BattleStatus(message);
    } else if (command === 'pinfo') {
        await playerStatus(message);
    } else if (command === 'tag') {
        await BattleTag(message);
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
        player.id = message.author.id
        player.avaterURL = message.author.displayAvatarURL({ format: 'png', size: 1024 })
        const mapAttachment = await generateMap(player);

        // ボタンを作成
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

        // メッセージとボタンを送信
        mapMessage = await message.channel.send({ files: [mapAttachment], components: [controllButton] });
    }
});

client.on('interactionCreate', async interaction => {
    // インタラクションがボタンクリックでなければ処理をスキップ
    if (!interaction.isButton()) return;

    let mapAttachment;
    switch (interaction.customId) {
        case 'up':
            playerPosition.y--;
            await prisma.user.update({
                where: { id: interaction.user.id },
                data: { y: playerPosition.y }
            })
            mapAttachment = await generateMap(player);
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
            playerPosition.y++;
            await prisma.user.update({
                where: { id: interaction.user.id },
                data: { y: playerPosition.y }
            })
            mapAttachment = await generateMap(player);
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
            playerPosition.x--;
            await prisma.user.update({
                where: { id: interaction.user.id },
                data: { x: playerPosition.x }
            })
            mapAttachment = await generateMap(player);
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
            playerPosition.x++;
            await prisma.user.update({
                where: { id: interaction.user.id },
                data: { x: playerPosition.x }
            })
            mapAttachment = await generateMap(player);
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
async function playerStatus(message) {
    const user = await prisma.user.findUnique({
        where: { id: message.author.id },
    })
    if (user) {
        const content = `所持金:${user.coin}\n現在の階層${user.layer}\n経験値:${user.exp}`
        message.channel.send(content)
    } else {
        await prisma.user.create({
            data: { id: message.author.id }
        })
    }


}
async function BattleStatus(message) {

}
async function BattleTag(message) {

}
async function handleBattleCommand(message) {
    if (!battle.monster.hp) {
        battle.monster.level = 1
        battle.monster.hp = 50
        battle.monster.power = 10
        battle.monster.speed = 30
        await spawnMonster(message, battle)
    } else if (battle.monster.hp >= 0) {
        keepFighting(message, battle)
    } else if (battle.player.hp <= 0) {
        message.channel.send("あなたはもうやられている！")

    } else if (battle.monster.hp <= 0) {
        battle.monster.hp = null
        battle.monster.power = null
        battle.monster.speed = null
        const user = await prisma.user.findUnique({
            where: { id: message.author.id },
        })
        if (user) {
            await prisma.user.update({
                where: { id: message.author.id },
                data: { exp: user.exp + battle.monster.level }
            })
        } else {
            await prisma.user.create({
                data: {
                    id: message.author.id,
                    exp: battle.monster.level
                }
            })
        }
        message.channel.send("勝利")
    }

}
async function spawnMonster(message, battle) {
    const userAvatarURL = message.author.avatarURL();
    const currentTime = new Date();
    const randomImagePath = await getRandomImage('./img/monsters');
    const attachment = new AttachmentBuilder(randomImagePath, { name: path.basename(randomImagePath) });
    const embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(`バトル開始！ - Round 1`)
        .setAuthor({ name: message.author.username, iconURL: userAvatarURL })
        .setDescription(`モンスターのHP:${battle.monster.hp}\n攻撃力:${battle.monster.power}`)
        .setImage(`attachment://${attachment.name}`)
        .setTimestamp(currentTime)
        .setFooter({ text: `Current time: ${currentTime.toLocaleTimeString()}` });
    await message.channel.send({ files: [attachment], embeds: [embed] });
}
function keepFighting(message, battle) {
    if (battle.player.speed > battle.monster.speed) {
        playerAttackProcess(message, battle)
        monstetrAttackProcess(message, battle)

    } else if (battle.player.speed < battle.monster.speed) {
        monstetrAttackProcess(message, battle)
        playerAttackProcess(message, battle)
    } else {
        switch (~~(2 * Math.random())) {
            case 0:
                playerAttackProcess(message, battle)
                monstetrAttackProcess(message, battle)
                break;
            case 1:
                monstetrAttackProcess(message, battle)
                playerAttackProcess(message, battle)
                break;
        }
    }
}
function playerAttackProcess(message, battle) {
    battle.monster.hp = battle.monster.hp - battle.player.power
    message.channel.send(`プレイヤーの攻撃！\nモンスターに${battle.player.power}のダメージ！\nモンスターの残りHP:${battle.monster.hp < 0 ? 0 : battle.monster.hp}`)
}
function monstetrAttackProcess(message, battle) {
    battle.player.hp = battle.player.hp - battle.monster.power
    message.channel.send(`モンスターの攻撃！\nプレイヤーに${battle.monster.power}のダメージ！\nプレイヤーの残りHP:${battle.player.hp < 0 ? 0 : battle.player.hp}`)
}
client.login(process.env.TOKEN);
