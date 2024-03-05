const { Client, GatewayIntentBits, EmbedBuilder, AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { PrismaClient } = require('@prisma/client');
const { binToHex } = require('./commands/binToHex.js');
const { hexToBin } = require('./commands/hexToBin.js');
const { reverseBinary } = require('./commands/reverseBinary.js');
const { generateMap } = require('./commands/map/generateMap.js');
const fs = require('fs').promises;
const path = require('path');
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
friend.speed = 40// プレイヤーの初期位置（適宜調整）
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
                x: playerInfo.x,
                y: playerInfo.y
            }
        })
        message.channel.send("掘りました！");
    } else if (command === 'map') {
        playerInfo.id = message.author.id
        playerInfo.avaterURL = message.author.displayAvatarURL({ format: 'png', size: 1024 })
        const mapAttachment = await generateMap(prisma, mapInfo, playerInfo);

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
    if (!monsterInfo.hp) {
        monsterInfo.level = 1
        monsterInfo.hp = 50
        monsterInfo.power = 10
        monsterInfo.speed = 30
        await spawnMonster(message, battle)
    } else if (monsterInfo.hp >= 0) {
        keepFighting(message, battle)
    } else if (playerInfo.hp <= 0) {
        message.channel.send("あなたはもうやられている！")

    } else if (monsterInfo.hp <= 0) {
        monsterInfo.hp = null
        monsterInfo.power = null
        monsterInfo.speed = null
        const user = await prisma.user.findUnique({
            where: { id: message.author.id },
        })
        if (user) {
            await prisma.user.update({
                where: { id: message.author.id },
                data: { exp: user.exp + monsterInfo.level }
            })
        } else {
            await prisma.user.create({
                data: {
                    id: message.author.id,
                    exp: monsterInfo.level
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
        .setDescription(`モンスターのHP:${monsterInfo.hp}\n攻撃力:${monsterInfo.power}`)
        .setImage(`attachment://${attachment.name}`)
        .setTimestamp(currentTime)
        .setFooter({ text: `Current time: ${currentTime.toLocaleTimeString()}` });
    await message.channel.send({ files: [attachment], embeds: [embed] });
}
function keepFighting(message, battle) {
    if (playerInfo.speed > monsterInfo.speed) {
        playerAttackProcess(message, battle)
        monstetrAttackProcess(message, battle)

    } else if (playerInfo.speed < monsterInfo.speed) {
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
    monsterInfo.hp = monsterInfo.hp - playerInfo.power
    message.channel.send(`プレイヤーの攻撃！\nモンスターに${playerInfo.power}のダメージ！\nモンスターの残りHP:${monsterInfo.hp < 0 ? 0 : monsterInfo.hp}`)
}
function monstetrAttackProcess(message, battle) {
    playerInfo.hp = playerInfo.hp - monsterInfo.power
    message.channel.send(`モンスターの攻撃！\nプレイヤーに${monsterInfo.power}のダメージ！\nプレイヤーの残りHP:${playerInfo.hp < 0 ? 0 : playerInfo.hp}`)
}
client.login(process.env.TOKEN);
