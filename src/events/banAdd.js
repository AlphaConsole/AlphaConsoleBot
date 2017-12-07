const Discord = require('discord.js');

module.exports.run = async(client, channels, user) => {
    const embedlog = new Discord.MessageEmbed()
    .setColor([255,0  ,0])
    .setTitle('=== MEMBER BANNED ===')
    .setDescription('<@' + user.id + '> is banned')
    .setTimestamp()
    client.guilds.get(channels.guildID).channels.get(channels.logsChannel).send(embedlog);
    client.guilds.find('name', serverInfo.guildName).channels.find('name', serverInfo.modlogChannel);
}
