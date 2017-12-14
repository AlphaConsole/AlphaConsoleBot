const Discord = require('discord.js');

module.exports = {
    title: "messageDelete",
    description: "Logs the message that got removed",
    
    run: async(client, serverInfo, message) => {

        var args = message.content.split(/[ ]+/);

        var ResponseText = "";
        for (i = 0; i < args.length; i++) {
            if (args[i] == "@everyone") {
                ResponseText += "`@everyone` ";
            } else if (args[i] == "@here") {
                ResponseText += "`@here` ";
            } else if (message.mentions.roles.has(args[i].substring(3, 21))) {
                ResponseText += '**' + message.mentions.roles.get(args[i].substring(3, 21)).name + '** '
            } else if (message.mentions.users.has(args[i].substring(2, 20))) {
                ResponseText += '**' + message.mentions.users.get(args[i].substring(2, 20)).tag + '** '
            } else {
                ResponseText += args[i] + " ";
            }
        }

        client.guilds.get(serverInfo.guildId).channels.get(serverInfo.serverlogChannel).send(":pencil: `["+ new Date().toTimeString().split(' ')[0] +"]` **Channel: <#" + message.channel.id + "> " + message.member.user.tag + "**'s message was deleted. Content: " + ResponseText)
    }
};
