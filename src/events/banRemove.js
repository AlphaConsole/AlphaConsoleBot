const Discord = require('discord.js');

module.exports.run = async(client, serverInfo, user) => {
    const embedlog = new Discord.MessageEmbed()
    .setColor([0,255,0])
    .setTitle('=== MEMBER UNBANNED ===')
    .setDescription('<@' + user.id + '> is unbanned')
    .setTimestamp()
    client.guilds.get(serverInfo.guildId).channels.get(serverInfo.modlogChannel).send(embedlog);
}