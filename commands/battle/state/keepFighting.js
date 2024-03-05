const{ playerAttackProcess } = require('../attackProcess/playerAttackProcess.js')
const{ monsterAttackProcess } = require('../attackProcess/monsterAttackProcess.js')
function keepFighting(message, playerInfo, monsterInfo) {
    if (playerInfo.speed > monsterInfo.speed) {
        playerAttackProcess(message, playerInfo, monsterInfo)
        monsterAttackProcess(message, playerInfo, monsterInfo)

    } else if (playerInfo.speed < monsterInfo.speed) {
        monsterAttackProcess(message, playerInfo, monsterInfo)
        playerAttackProcess(message, playerInfo, monsterInfo)
    } else {
        switch (~~(2 * Math.random())) {
            case 0:
                playerAttackProcess(message, playerInfo, monsterInfo)
                monsterAttackProcess(message, playerInfo, monsterInfo)
                break;
            case 1:
                monsterAttackProcess(message, playerInfo, monsterInfo)
                playerAttackProcess(message, playerInfo, monsterInfo)
                break;
        }
    }
}

module.exports = {
    keepFighting:keepFighting
}