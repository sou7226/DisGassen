const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const client = new Client({
    intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ],
});
client.mapMessage;
client.controllButton;
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
client.commands = new Map();

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client, mapInfo, monsterInfo, friend, playerInfo));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client, mapInfo, monsterInfo, friend, playerInfo));
    }
}
client.login(process.env.TOKEN);
