function playerAttackProcess(message, playerInfo, monsterInfo) {
    monsterInfo.hp = monsterInfo.hp - playerInfo.power
    message.channel.send(`\`\`\`ansi\n[0;45mプレイヤーの攻撃！\n[0;34mモンスターに${playerInfo.power}のダメージ！\n[0;34mモンスターの残りHP:${monsterInfo.hp < 0 ? 0 : monsterInfo.hp}\n\`\`\``)
}
module.exports = {
    playerAttackProcess: playerAttackProcess
}