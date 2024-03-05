const { PrismaClient } = require('@prisma/client');
const { generateMap } = require('../commands/map/generateMap.js');
require('dotenv').config();
const prisma = new PrismaClient();

module.exports = {
    name: 'interactionCreate',
async execute(interaction, mapInfo, monsterInfo, friend, playerInfo) {
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
            client.mapMessage?.edit({ files: [mapAttachment] })
            await interaction.reply({ content: '上に移動しました！', fetchReply: true });         
            break;
        case 'down':
            playerInfo.y++;
            await prisma.user.update({
                where: { id: interaction.user.id },
                data: { y: playerInfo.y }
            })
            mapAttachment = await generateMap(prisma, mapInfo, playerInfo);
            client.mapMessage?.edit({ files: [mapAttachment] })
            await interaction.reply({ content: '下に移動しました！', fetchReply: true })
            break;
        case 'left':
            playerInfo.x--;
            await prisma.user.update({
                where: { id: interaction.user.id },
                data: { x: playerInfo.x }
            })
            mapAttachment = await generateMap(prisma, mapInfo, playerInfo);
            client.mapMessage?.edit({ files: [mapAttachment] })
            await interaction.reply({ content: '左に移動しました！', fetchReply: true })
            break;
        case 'right':
            playerInfo.x++;
            await prisma.user.update({
                where: { id: interaction.user.id },
                data: { x: playerInfo.x }
            })
            mapAttachment = await generateMap(prisma, mapInfo, playerInfo);
            client.mapMessage?.edit({ files: [mapAttachment] })
            await interaction.reply({ content: '右に移動しました！', fetchReply: true })
            break;
        default:
            await interaction.reply('不明な操作です。');
            break;
    }
    setTimeout(() => {
        interaction.deleteReply().catch(console.error);
    }, 1000);   
}};