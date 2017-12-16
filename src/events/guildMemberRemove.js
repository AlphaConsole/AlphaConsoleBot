const Discord = require('discord.js');

module.exports = {
    title: "guildMemberRemove",
    description: "Logs when a member leaves the server",
    
    run: async(client, serverInfo, member, sql) => {
        client.guilds.get(serverInfo.guildId).channels.get(serverInfo.serverlogChannel).send(":x: `["+ new Date().toTimeString().split(' ')[0] +"]` **" + member.user.tag + "** left the guild. Total members: **" + numberWithSpaces(client.guilds.get(serverInfo.guildId).members.size) + "**")
    
        var newRolesID = ""
        member.roles.array().forEach(role => {
            if (role.name != '@everyone') newRolesID += " " + role.id;
        });

        //Let's first check if the user even exists in the db
        sql.get(`select * from Members where DiscordID = '${member.user.id}'`).then(row => {
            if (!row) {
                var today = new Date().getTime();
                sql.run(`Insert into Members(DiscordID, Username, JoinedDate)VALUES('${member.user.id}', '${mysql_real_escape_string(member.user.username)}', '${today}')`)
                .then(() => {
                    sql.run(`update Members set Roles = '${newRolesID.substring(1)}' where DiscordID = '${member.user.id}'`);
            
                })
                    .catch(err => console.log(err));
            } else {
                sql.run(`update Members set Roles = '${newRolesID.substring(1)}' where DiscordID = '${member.user.id}'`);
        
            }
        }).catch(err => console.log(err))
    }
};


function numberWithSpaces(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}


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