const Discord = require('discord.js');

module.exports.run = async(client, serverInfo, oldMember, newMember) => {

    if (oldMember.nickname != newMember.nickname) {
                
        if (newMember.nickname == null) {
            client.guilds.get(serverInfo.guildId).channels.get(serverInfo.serverlogChannel).send(":man_with_gua_pi_mao:  `["+ new Date().toTimeString().split(' ')[0] +"]` **" + newMember.user.tag + "** has reset their nickname to **" + newMember.user.username + "**")            
        } else {
            client.guilds.get(serverInfo.guildId).channels.get(serverInfo.serverlogChannel).send(":man_with_gua_pi_mao:  `["+ new Date().toTimeString().split(' ')[0] +"]` **" + newMember.user.tag + "** has changed their nickname to **" + newMember.nickname + "**")
            
        }    
    }

    if (oldMember.roles != newMember.roles) {
        
        var oldRoles = ""
        oldMember.roles.array().forEach(role => {
            if (role.name != '@everyone') oldRoles += ", " + role.name;
        });

        var newRoles = ""
        newMember.roles.array().forEach(role => {
            if (role.name != '@everyone') newRoles += ", " + role.name;
        });

        client.guilds.get(serverInfo.guildId).channels.get(serverInfo.serverlogChannel).send(":man_with_gua_pi_mao:  `["+ new Date().toTimeString().split(' ')[0] +"]` **" + newMember.user.tag + "**'s have changed. Old: `" + oldRoles.substring(2) + "` | New: `" + newRoles.substring(2) + "`")

    }

};
