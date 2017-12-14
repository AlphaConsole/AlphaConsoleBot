const Discord = require('discord.js');

module.exports = {
    title: "guildMemberUpdate",
    description: ["Logs a message if someone changed his name on the Discord or when roles are changed"],
    
    run: async(client, serverInfo, oldMember, newMember) => {

        if (oldMember.nickname != newMember.nickname) {
                    
            if (newMember.nickname == null) {
                client.guilds.get(serverInfo.guildId).channels.get(serverInfo.serverlogChannel).send(":man_with_gua_pi_mao: `["+ new Date().toTimeString().split(' ')[0] +"]` **" + newMember.user.tag + "** has reset their nickname to **" + newMember.user.username + "**")            
            } else {
                client.guilds.get(serverInfo.guildId).channels.get(serverInfo.serverlogChannel).send(":man_with_gua_pi_mao: `["+ new Date().toTimeString().split(' ')[0] +"]` **" + newMember.user.tag + "** has changed their nickname to **" + newMember.nickname + "**")
                
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

            if (oldMember.roles.size == 1) {
                client.guilds.get(serverInfo.guildId).channels.get(serverInfo.serverlogChannel).send(":man_with_gua_pi_mao: `["+ new Date().toTimeString().split(' ')[0] +"]` **" + newMember.user.tag + "**'s roles have changed. Old: '' | New: `" + newRoles.substring(2) + "`")                
            } else {
                client.guilds.get(serverInfo.guildId).channels.get(serverInfo.serverlogChannel).send(":man_with_gua_pi_mao: `["+ new Date().toTimeString().split(' ')[0] +"]` **" + newMember.user.tag + "**'s roles have changed. Old: `" + oldRoles.substring(2) + "` | New: `" + newRoles.substring(2) + "`")                
            }


        }
    }
};
