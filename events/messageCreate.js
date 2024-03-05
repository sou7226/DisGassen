const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { PrismaClient } = require('@prisma/client');
const { binToHex } = require('../commands/binToHex.js');
const { hexToBin } = require('../commands/hexToBin.js');
const { reverseBinary } = require('../commands/reverseBinary.js');
const { generateMap } = require('../commands/map/generateMap.js');
const { battle } = require('../commands/battle/battle.js')
const prefix = process.env.PREFIX;
require('dotenv').config();
const prisma = new PrismaClient();
const upMessage = ["u", "up", "↑", "上", "うえ", "ue", "う"];
const rightMessage = ["r", "right", "→", "右", "みぎ", "migi", "み"];
const leftMessage = ["l", "left", "←", "左", "ひだり", "hidari", "ひ"];
const downMessage = ["d", "down", "↓", "下", "した", "sita", "し"];

module.exports = {
    name: 'messageCreate',
    async execute(message, client, mapInfo, monsterInfo, friend, playerInfo) {
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
        } else if (command === 'battle') {
            await battle(message, prisma, playerInfo, monsterInfo);
        } else if (command === 'st') {
            await battleStatus(message);
        } else if (command === 'pinfo') {
            await playerStatus(prisma, message);
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
            let mapAttachment = await generateMap(mapInfo, playerInfo);
            const mapMessage = await message.channel.send({ files: [mapAttachment] });
            while (true) {
                try {
                    console.log(message.author.id)
                    const collected = await message.channel
                        .awaitMessages({
                            filter: (m) => message.author.id === m.author.id,
                            max: 1,
                            time: 30_000,
                            errors: ['time']
                        });
                    const responseMessage = collected.first();
                    if (responseMessage.content === "0") {
                        message.channel.send('終了します。');
                        break;
                    } else if (upMessage.includes(responseMessage.content)) {
                        await responseMessage.delete()
                        playerInfo.y--;
                        await prisma.user.update({
                            where: { id: message.author.id },
                            data: { y: playerInfo.y }
                        })
                        mapAttachment = await generateMap(mapInfo, playerInfo);
                        mapMessage.edit({ files: [mapAttachment] })
                    } else if (downMessage.includes(responseMessage.content)) {
                        await responseMessage.delete()
                        playerInfo.y++;
                        await prisma.user.update({
                            where: { id: message.author.id },
                            data: { y: playerInfo.y }
                        })
                        mapAttachment = await generateMap(mapInfo, playerInfo);
                        mapMessage.edit({ files: [mapAttachment] })
                    } else if (leftMessage.includes(responseMessage.content)) {
                        await responseMessage.delete()
                        playerInfo.x--;
                        await prisma.user.update({
                            where: { id: message.author.id },
                            data: { x: playerInfo.x }
                        })
                        mapAttachment = await generateMap(mapInfo, playerInfo);
                        mapMessage.edit({ files: [mapAttachment] })
                    } else if (rightMessage.includes(responseMessage.content)) {
                        await responseMessage.delete()
                        playerInfo.x++;
                        await prisma.user.update({
                            where: { id: message.author.id },
                            data: { x: playerInfo.x }
                        })
                        mapAttachment = await generateMap(mapInfo, playerInfo);
                        mapMessage.edit({ files: [mapAttachment] })
                    }
                } catch (error) {
                    return message.channel.send('時間切れです。');
                }
            }
        }
    },
};