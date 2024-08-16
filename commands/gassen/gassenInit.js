function getGassenPlayerInfo(){
    let playerHandSigns;
    let botHandSigns;
    if(true){ //データベースに登録されていない場合
        playerHandSigns = {
            rock: 98,
            scissors: 99,
            paper: 100,
        }
        botHandSigns = {
            rock: 98,
            scissors: 99,
            paper: 100,
        }
    }
    return { 
        playerHandSigns: playerHandSigns, 
        botHandSigns: botHandSigns
    };
}


module.exports = {
    getGassenPlayerInfo: getGassenPlayerInfo
}