const { EmbedBuilder } = require('discord.js')
function help(message, args){
    if(!args[0]){
        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(`Disgassen ヘルプ一覧`)
            .addFields(
             //   { name: '\u200B', value: '\u200B' },
                { name: '`::help`', value: 'コマンド名と使い方を確認！'},
                { name: '`::map`', value: 'テラリアをプレイ！\n現在の位置を見ることができます'},
                { name: '`::atk`', value: '敵を攻撃します！'},
                { name: '`::pinfo`', value: 'プレイヤーの情報を表示！'},
                { name: '`::btohex`', value: '10進数を16進数に変換します'},
                { name: '`::hextob`', value: '16進数を10進数に変換します！'},
                { name: '`::inv`', value: '自分の持ち物を確認できます'})
        message.channel.send({ embeds: [embed] });
    } else if(args[0] == "st"){
        message.channel.send("```\n\n```")
    }
}
module.exports = {
    help:help
}