const Discord = require('discord.js');

module.exports.run = async(client, serverInfo, message) => {

    client.guilds.get(serverInfo.guildId).channels.get(serverInfo.serverlogChannel).send(":pencil: `["+ new Date().toTimeString().split(' ')[0] +"]` **Channel: <#" + message.channel.id + "> " + message.member.user.tag + "**'s message was deleted. Content: " + message.content)

};
