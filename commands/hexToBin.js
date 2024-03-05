function hexToBin(hexString, space = null) {
    // 16進数を2進数に変換
    const binaryString = parseInt(hexString, 16).toString(2);
    if (space) {
        const formattedBinary = binaryString.substring(0, space) + " " + binaryString.substring(space);
        return formattedBinary;
    }
    return binaryString;
}
module.exports = {
    hexToBin:hexToBin
}