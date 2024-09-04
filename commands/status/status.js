async function status(prisma, message) {
    const user = await prisma.user.findUnique({
        where: { user_id: message.author.id },
    })
    if (user) {
        const content = `所持金:${user.coin}\n現在の階層${user.layer}\n経験値:${user.exp}\n討伐数:${user.monstersDefeated}`
        message.channel.send(content)
    } else {
        await prisma.user.create({
            data: { id: message.author.id }
        })
    }
}
module.exports = {
    status: status
}