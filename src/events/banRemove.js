const Discord = require('discord.js');

module.exports.run = async(client, channels, user) => {
    const embedlog = new Discord.MessageEmbed()
    .setColor([0,255,0])
    .setTitle('=== MEMBER UNBANNED ===')
    .setDescription('<@' + user.id + '> is unbanned')
    .setTimestamp()
    client.guilds.get(channels.guildID).channels.get(channels.logsChannel).send(embedlog);
}