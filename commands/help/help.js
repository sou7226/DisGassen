const { EmbedBuilder } = require('discord.js')
function help(message, args){
    if(!args[0]){
        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(`Disgassen ヘルプ一覧`)
            .addFields(
             //   { name: '\u200B', value: '\u200B' },
                { name: '`help`', value: 'コマンド名と使い方を確認！'},
                { name: '`map`', value: 'テラリアをプレイ！\n現在の位置を見ることができます'},
                { name: '`atk`', value: '敵を攻撃します！'},
                { name: '`gassen`', value: '敵を攻撃します！'},
                { name: '`pinfo`', value: 'プレイヤーの情報を表示！'},
                { name: '`btohex`', value: '10進数を16進数に変換します'},
                { name: '`hextob`', value: '16進数を10進数に変換します！'},
                { name: '`inv`', value: '自分の持ち物を確認できます'})
        message.channel.send({ embeds: [embed] });
    } else if(args[0] == "help"){
        message.channel.send("```\nhelp\n各コマンドについて大まかに説明します！\n```")
    } else if(args[0] == "map"){
        message.channel.send("```\nマップを表示し、現在位置を確認できます！\n```")
    } else if(args[0] == "atk"){
        message.channel.send("```\n出現したモンスターとバトルができます！\n```")
    } else if(args[0] == "pinfo"){
        message.channel.send("```\nあなたのステータスを確認することができます！\n```")
    }else if(args[0] == "gassen"){
        message.channel.send("```\n敵軍と自軍とでバトルができます\n```")
    } else if(args[0] == "btohex"){
        message.channel.send("```\n10進数を2進数に変換できます！\n```")
    }else if(args[0] == "hextob"){
        message.channel.send("```\n2進数を10進数に変換できます！\n```")
    } else if(args[0] == "inv"){
        message.channel.send("```\nあなたのインベントリを確認することができます！\n```")
    }
}

module.exports = {
    help:help
}