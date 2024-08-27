function monsterAttackProcess(message, playerInfo, monsterInfo) {
    playerInfo.hp = playerInfo.hp - monsterInfo.power
    message.channel.send(`\`\`\`ansi\n[0;41m` + `モンスターの攻撃！\n`+`[0;31m`+`プレイヤーに${monsterInfo.power}のダメージ！\n`+`[0;31m`+`プレイヤーの残りHP:${playerInfo.hp < 0 ? 0 : playerInfo.hp}\n\`\`\``)
}
module.exports = {
    monsterAttackProcess: monsterAttackProcess
}