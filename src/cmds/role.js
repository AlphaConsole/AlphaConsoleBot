const Discord = require('discord.js');

module.exports.run = async(client, serverInfo, sql, message, args) => {
    if (args[1].toLowerCase() == "giveaways") {
        if (message.member.roles.has(serverInfo.EventsRole)) {
            message.member.removeRole(serverInfo.EventsRole)
            const embed = new Discord.MessageEmbed()
            .setColor([255,255,0])
            .setTitle("Role removed from your profile.")
            message.channel.send(embed)
        } else {
            message.member.addRole(serverInfo.EventsRole)
            const embed = new Discord.MessageEmbed()
            .setColor([255,255,0])
            .setTitle("Role added to your profile.")
            message.channel.send(embed)
        }
    }
}