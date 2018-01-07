const Discord = require('discord.js');

module.exports = {
    title: "guildMemberUpdate",
    description: ["Logs a message if someone changed his name on the Discord or when roles are changed"],
    
    run: async(client, serverInfo, oldMember, newMember, sql, keys) => {

        if (oldMember.nickname != newMember.nickname) {
                    
            if (newMember.nickname == null) {
                client.guilds.get(serverInfo.guildId).channels.get(serverInfo.serverlogChannel).send(":man_with_gua_pi_mao: `["+ new Date().toTimeString().split(' ')[0] +"]` **" + newMember.user.tag + "** has reset their nickname to **" + newMember.user.username + "**")            
            } else {
                client.guilds.get(serverInfo.guildId).channels.get(serverInfo.serverlogChannel).send(":man_with_gua_pi_mao: `["+ new Date().toTimeString().split(' ')[0] +"]` **" + newMember.user.tag + "** has changed their nickname to **" + newMember.nickname + "**")
                
            }    
        }
        //Not the best way to check difference but becase every time a role is added/removed 
        //it has its own event, this will work.
        if (oldMember.roles.array().length != newMember.roles.array().length) {
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

            if (oldRoles.includes('Twitch Sub') && !newRoles.includes('Twitch Sub')) {
                var request = require('request');
                var url = keys.SetTitleURL;
                user = newMember;
                url += '?DiscordID=' + user.id + '&key=' + keys.Password + "&color=1";
                request({
                    method: 'GET',
                    url: url
                }, function (err, response, body) {
                });
                oldMember.send('Hi, your Twitch Subscription to AlphaConsole has ended therefor your access to the' 
                +' subscriber features has been removed and your title colour has been reset. If you subscribe again you will have access to those ' +
            ' features again. \n<https://www.twitch.tv/alphaconsole> \nHave a great day!');

            const embedlog = new Discord.MessageEmbed()
            .setColor([255,255,0])
            .setAuthor('Title Colour Auto Reset', serverInfo.logo)
            .setDescription('<@' + user.id + '>\'s colour has been reset because Twitch Subscription ended.')
            .setTimestamp()
            client.guilds.get(serverInfo.guildId).channels.get(serverInfo.modlogChannel).send(embedlog);
            }
        

            //Let's first check if the user even exists in the db
            sql.get(`select * from Members where DiscordID = '${newMember.user.id}'`).then(row => {
                if (!row) {
                    var today = new Date().getTime();
                    sql.run(`Insert into Members(DiscordID, Username, JoinedDate)VALUES('${newMember.user.id}', '${mysql_real_escape_string(newMember.user.username)}', '${today}')`)
                        .then(() => {
                            sql.run(`update Members set Roles = '${newRolesID.substring(1)}' where DiscordID = '${newMember.user.id}'`);          
                        })
                        .catch(err => console.log(err));
                } else {
                    sql.run(`update Members set Roles = '${newRolesID.substring(1)}' where DiscordID = '${newMember.user.id}'`);                    
                }
            }).catch(err => console.log(err))

            if (oldMember.roles.size == 1) {
                client.guilds.get(serverInfo.guildId).channels.get(serverInfo.serverlogChannel).send(":man_with_gua_pi_mao: `["+ new Date().toTimeString().split(' ')[0] +"]` **" + newMember.user.tag + "**'s roles have changed. Old: '' | New: `" + newRoles.substring(2) + "`")                
            } else {
                client.guilds.get(serverInfo.guildId).channels.get(serverInfo.serverlogChannel).send(":man_with_gua_pi_mao: `["+ new Date().toTimeString().split(' ')[0] +"]` **" + newMember.user.tag + "**'s roles have changed. Old: `" + oldRoles.substring(2) + "` | New: `" + newRoles.substring(2) + "`")                
            }


        }
    }
};



function mysql_real_escape_string (str) {
    return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
        switch (char) {
            case "\0":
                return "\\0";
            case "\x08":
                return "\\b";
            case "\x09":
                return "\\t";
            case "\x1a":
                return "\\z";
            case "\n":
                return "\\n";
            case "\r":
                return "\\r";
            case "\"":
            case "'":
            case "\\":
            case "%":
                return char+char; // prepends a backslash to backslash, percent,
                                  // and double/single quotes
        }
    });
}