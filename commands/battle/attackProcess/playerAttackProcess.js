function playerAttackProcess(message, playerInfo, monsterInfo) {
    monsterInfo.hp = monsterInfo.hp - playerInfo.power
    message.channel.send(`プレイヤーの攻撃！\nモンスターに${playerInfo.power}のダメージ！\nモンスターの残りHP:${monsterInfo.hp < 0 ? 0 : monsterInfo.hp}`)
}
module.exports = {
    playerAttackProcess:playerAttackProcess
}