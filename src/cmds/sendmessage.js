const Discord = require('discord.js');

module.exports = {
    title: "send message",
    perms: "Root",
    commands: ["!s"],
    description: ["Sends a message"],
    
    run: async(client, serverInfo, message ,args) => {
        if (message.author.id == 136607366408962048) {
            const channelID = args[1];
            var message = '';
            for (let index = 2; index < args.length; index++) {
                message+= args[index] + " ";
            }
            client.guilds.get(serverInfo.guildId).channels.get(channelID).startTyping();
            setTimeout(() => {
            client.guilds.get(serverInfo.guildId).channels.get(channelID).send(message);
            client.guilds.get(serverInfo.guildId).channels.get(channelID).stopTyping();
            }, Math.random() * (1 - 2) + 1 * 1000);
            
        } 
    }
}
