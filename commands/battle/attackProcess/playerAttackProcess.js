function playerAttackProcess(message, playerInfo, monsterInfo) {
    monsterInfo.hp = monsterInfo.hp - playerInfo.power
    message.channel.send(`\`\`\`ansi\n[0;45m`+`プレイヤーの攻撃\n`+`[0;34m`+`モンスターに${playerInfo.power}のダメージ！`+`\n[0;34m`+`プレイヤーの残りHP:${monsterInfo.hp < 0 ? 0 : monsterInfo.hp}\n\`\`\``)
}
module.exports = {
    playerAttackProcess: playerAttackProcess
}