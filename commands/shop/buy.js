const { updateItem } = require('./db/updateItem.js')
const { updateUserCoin } = require('./db/updateUserCoin.js')
const { findUserCoin } = require('./db/findUserCoin.js')
async function buy(message, items, number) {
    let itemNumber = Number(number);
    if (isNaN(itemNumber)) {
        return message.channel.send('`wwbuy {数字}`で答えてください');
    } else if (Number(message.content) <= items.length) {
        return message.channel.send('そのアイテムは存在しません...');
    }
    let totalPrice = 0
    const coin = await findUserCoin(message.author.id)
    for (let i = 0; i < items.length; i++) {
        if (items[i].item_id === itemNumber) {
            totalPrice = coin - items[i].value
        }
    }
    if (totalPrice < 0) {
        return message.channel.send('あらら、お金が足りないみたい..');
    }
    await updateUserCoin(message.author.id, items, itemNumber, totalPrice)
    await updateItem(message.author.id, items, itemNumber)
    message.channel.send('購入ありがとう～！');
}
module.exports = {
    buy: buy
}