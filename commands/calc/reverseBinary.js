function reverseBinary(binStr) {
    // 二進数文字列の各文字を反転させる
    const bin = binStr.split('').map(bit => bit === '0' ? '1' : '0').join('');
    return bin;
}

module.exports = {
    reverseBinary:reverseBinary
}