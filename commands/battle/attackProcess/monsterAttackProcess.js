function monsterAttackProcess(message, playerInfo, monsterInfo) {
    playerInfo.hp = playerInfo.hp - monsterInfo.power
    message.channel.send("```ansi\n[0;41mモンスターの攻撃！\n[0;31mプレイヤーに${monsterInfo.power}のダメージ！\n[0;31mプレイヤーの残りHP:${playerInfo.hp < 0 ? 0 : playerInfo.hp}\n```")
}
module.exports = {
    monsterAttackProcess:monsterAttackProcess
}