const Discord = require('discord.js');

module.exports = {
    title: "guildMemberRemove",
    description: "Logs when a member leaves the server",
    
    run: async(client, serverInfo, member) => {
        client.guilds.get(serverInfo.guildId).channels.get(serverInfo.serverlogChannel).send(":x: `["+ new Date().toTimeString().split(' ')[0] +"]` **" + member.user.tag + "** left the guild. Total members: **" + numberWithSpaces(client.guilds.get(serverInfo.guildId).members.size) + "**")
    }
};


function numberWithSpaces(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}