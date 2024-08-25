function binToHex(bin) {
    // 二進数を整数に変換
    const decimal = parseInt(bin, 2);
    // 整数を16進数に変換
    const hex = decimal.toString(16);
    return hex;
}

module.exports = {
    binToHex:binToHex
}