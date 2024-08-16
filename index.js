const { Client, GatewayIntentBits } = require('discord.js');
const { friendInfo } = require('./informations/friendInfo')
const { mapInfo } = require('./informations/mapInfo')
const { monsterInfo } = require('./informations/monsterInfo')
const { playerInfo } = require('./informations/playerInfo')
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

playerInfo.hp = 100
playerInfo.power = 30
playerInfo.speed = 40
friendInfo.hp = 100
friendInfo.power = 30
friendInfo.speed = 40

client.commands = new Map();

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client, mapInfo, monsterInfo, friendInfo, playerInfo));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client, mapInfo, monsterInfo, friendInfo, playerInfo));
    }
}
client.login(process.env.TOKEN);
