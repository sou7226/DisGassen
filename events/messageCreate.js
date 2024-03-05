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
module.exports = {
    name: 'messageCreate',
    async execute(message, mapInfo, monsterInfo, friend, playerInfo) {
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
            const mapAttachment = await generateMap(prisma, mapInfo, playerInfo);
            const controllButton = new ActionRowBuilder()
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
            await message.channel.send({ files: [mapAttachment], components: [controllButton] });
        }
    },
};