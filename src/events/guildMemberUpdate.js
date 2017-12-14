const Discord = require('discord.js');

module.exports = {
    title: "guildMemberUpdate",
    description: ["Logs a message if someone changed his name on the Discord or when roles are changed"],
    
    run: async(client, serverInfo, oldMember, newMember, sql) => {

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

            var newRolesID = ""
            newMember.roles.array().forEach(role => {
                if (role.name != '@everyone') newRolesID += " " + role.id;
            });

            //Let's first check if the user even exists in the db
            sql.get(`select * from Members where DiscordID = '${newMember.user.id}'`).then(row => {
                if (!row) {
                    var today = new Date().getTime();
                    sql.run(`Insert into Members(DiscordID, Username, JoinedDate)VALUES('${newMember.user.id}', '${mysql_real_escape_string(newMember.user.username)}', '${today}')`)
                        .catch(err => console.log(err));
                }
            }).catch(err => console.log(err))

            sql.run(`update Members set Roles = '${newRolesID.substring(2)}' where DiscordID = '${newMember.user.id}'`);

            if (oldMember.roles.size == 1) {
                client.guilds.get(serverInfo.guildId).channels.get(serverInfo.serverlogChannel).send(":man_with_gua_pi_mao: `["+ new Date().toTimeString().split(' ')[0] +"]` **" + newMember.user.tag + "**'s roles have changed. Old: '' | New: `" + newRoles.substring(2) + "`")                
            } else {
                client.guilds.get(serverInfo.guildId).channels.get(serverInfo.serverlogChannel).send(":man_with_gua_pi_mao: `["+ new Date().toTimeString().split(' ')[0] +"]` **" + newMember.user.tag + "**'s roles have changed. Old: `" + oldRoles.substring(2) + "` | New: `" + newRoles.substring(2) + "`")                
            }


        }
    }
};
