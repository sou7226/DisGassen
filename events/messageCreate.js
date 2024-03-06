const { PrismaClient } = require('@prisma/client');
const { binToHex } = require('../commands/binToHex.js');
const { hexToBin } = require('../commands/hexToBin.js');
const { reverseBinary } = require('../commands/reverseBinary.js');
const { battle } = require('../commands/battle/battle.js')
const { map } = require('../commands/map/map.js')
const { playerStatus } = require('../commands/playerStatus.js')
const { give } = require('../commands/admin/give.js')
const prefix = process.env.PREFIX;
const adminList = process.env.ADMIN_LIST;
require('dotenv').config();
const prisma = new PrismaClient();

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
            await battle(message, playerInfo, monsterInfo);
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
            await map(message, mapInfo, playerInfo)
        }
        if(adminList.some(message.author.id)){
            if(command === "give"){
                await give()

            }
        }
    },
};