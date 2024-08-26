function playerAttackProcess(message, playerInfo, monsterInfo) {
    monsterInfo.hp = monsterInfo.hp - playerInfo.power
    message.channel.send(`\`\`\`ansi\n[0;45m?????????\n[0;34m??????${playerInfo.power}??????\n[0;34m????????HP:${monsterInfo.hp < 0 ? 0 : monsterInfo.hp}\n\`\`\``)
}
module.exports = {
    playerAttackProcess: playerAttackProcess
}