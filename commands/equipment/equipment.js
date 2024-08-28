async function equipment(){
    const equipment = await prisma.equipment.findMany({
        where: {
            user_id: playerInfo.id
        },
    });
    content = `:package: 装備一覧\n`
    let elements = []
    for (let i = 0; i < equipment.length; i++) {
        const item = items.find(item => item.item_id === equipment[i].item_id);
        elements.push(`${item.name}: \`${equipment[i].quantity}\` `)
    }
    return content + elements.join("\n")
}
module.exports = {
    equipment: equipment
}