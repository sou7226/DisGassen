function monsterAttackProcess(message, playerInfo, monsterInfo) {
    playerInfo.hp = playerInfo.hp - monsterInfo.power
    message.channel.send(`\`\`\`ansi\n[0;41m?????????\n[0;31m??????${monsterInfo.power}??????\n[0;31m????????HP:${playerInfo.hp < 0 ? 0 : playerInfo.hp}\n\`\`\``)
}
module.exports = {
    monsterAttackProcess: monsterAttackProcess
}