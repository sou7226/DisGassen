function monsterAttackProcess(message, playerInfo, monsterInfo) {
    playerInfo.hp = playerInfo.hp - monsterInfo.power
    message.channel.send(`モンスターの攻撃！\nプレイヤーに${monsterInfo.power}のダメージ！\nプレイヤーの残りHP:${playerInfo.hp < 0 ? 0 : playerInfo.hp}`)
}
module.exports = {
    monsterAttackProcess:monsterAttackProcess
}