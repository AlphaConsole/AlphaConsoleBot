const Discord = require('discord.js');

module.exports.run = async(client, serverInfo, sql, message, args) => {
    if (message.channel.id == serverInfo.BotSpam) {
        if (args[1].toLowerCase() == "giveaways" || args[1].toLowerCase() == "ga") {
            if (message.member.roles.has(serverInfo.EventsRole)) {
                message.member.removeRole(serverInfo.EventsRole)
                const embed = new Discord.MessageEmbed()
                .setColor([255,255,0])
                .setAuthor("Role removed from your profile.", serverInfo.logo)
                message.channel.send(embed)
            } else {
                message.member.addRole(serverInfo.EventsRole)
                const embed = new Discord.MessageEmbed()
                .setColor([255,255,0])
                .setAuthor("Role added to your profile.", serverInfo.logo)
                message.channel.send(embed)
            }
        }
    }
}