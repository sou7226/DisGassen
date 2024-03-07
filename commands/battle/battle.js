const { spawnMonster } = require('./state/spawnMonster.js')
const { keepFighting } = require('./state/keepFighting.js')
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function battle(message, playerInfo, monsterInfo) {
    if (!monsterInfo.hp) {
        monsterInfo.level = 1
        monsterInfo.hp = 50
        monsterInfo.power = 10
        monsterInfo.speed = 30
        await spawnMonster(message, playerInfo, monsterInfo)
    } else if (monsterInfo.hp >= 0) {
        keepFighting(message, playerInfo, monsterInfo)
    } else if (playerInfo.hp <= 0) {
        message.channel.send("あなたはもうやられている！")

    } else if (monsterInfo.hp <= 0) {
        monsterInfo.hp = null
        monsterInfo.power = null
        monsterInfo.speed = null
        const user = await prisma.user.findUnique({
            where: { id: message.author.id },
        })
        if (user) {
            await prisma.user.update({
                where: { id: message.author.id },
                data: {
                    exp: user.exp + monsterInfo.level,
                    monstersDefeated: user.monstersDefeated + 1
                }
            })
        } else {
            await prisma.user.create({
                data: {
                    id: message.author.id,
                    exp: monsterInfo.level,
                    monstersDefeated: 1
                }
            })
        }
        message.channel.send("勝利")
    }

}
module.exports = {
    battle: battle
}