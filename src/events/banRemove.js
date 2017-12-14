const Discord = require('discord.js');

module.exports = {
    title: "banRemove",
    description: ["Logs whenever a ban got removed"],
    
    run: async(client, serverInfo, user) => {
        const embedlog = new Discord.MessageEmbed()
        .setColor([255,255,0])
        .setAuthor('MEMBER UNBANNED', serverInfo.logo)
        .setDescription('<@' + user.id + '> is unbanned')
        .setTimestamp()
        client.guilds.get(serverInfo.guildId).channels.get(serverInfo.modlogChannel).send(embedlog);
    }
}