const Discord = require('discord.js');

module.exports.run = async(client, serverInfo, oldMember, newMember) => {

    if (oldMember.username != newMember.username) {
                
        client.guilds.get(serverInfo.guildId).channels.get(serverInfo.serverlogChannel).send(":spy: `["+ new Date().toTimeString().split(' ')[0] +"]` **" + oldMember.tag + "** changed their Discord name to **" + newMember.tag + "**")            
    }

};
