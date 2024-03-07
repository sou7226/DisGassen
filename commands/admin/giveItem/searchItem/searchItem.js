const { items } = require('../../../../items/items.js')
async function searchItem(args) {
    try {
        const item = items.find(item => item.item_id === parseInt(args));
        if (item) {
            console.log(`アイテムが見つかりました: ${item.name}`);
            return true
        } else {
            const item = items.find(item => item.name === args);
            if (item) {
                console.log(`アイテムが見つかりました: ${item.name}`);
                return true
            }
            return false
        }
    } catch (err) {
        return false
    }
}

module.exports = {
    searchItem: searchItem
}