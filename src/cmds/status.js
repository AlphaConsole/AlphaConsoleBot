const Discord = require('discord.js');

module.exports = {
    title: "status",
    perms: "Admin",
    commands: [
        "!Status",
        "!Status Add <Watching / Playing /Streaming / Listening> <Rest of status>",
        "!Status Remove <ID>"
    ],
    description: [
        "Shows all statuses of the bot",
        "Adds a status to the bot to cycle through",
        "Removes a status. ID findable in `!Status`"
    ],
    
    run: async(client, serverInfo, sql, message, args) => {
    
        if (hasRole(message.member, "Admin") || hasRole(message.member, "Developer"))                                                                                                  // <---   If you would like to change role perms. Change [BontControl] to your role name
        {
            if (args.length == 1) {
                sql.all("Select * from Statuses").then(rows => {

                    if(rows.length != 0) {
                        StatusMSG = ""
                        rows.forEach(row => {
                            StatusMSG += row.ID + ": " + row.StatusType + " " + row.StatusText;
                            if (row.Active == 1) StatusMSG += " [ACTIVE]";
                            StatusMSG += "\n"
                        });
                    } else {
                        StatusMSG = "No statuses found.";
                    }

                    const embed = new Discord.MessageEmbed()
                    .setColor([255,255,0])
                    .setAuthor("Bot Statuses", serverInfo.logo)
                    .setDescription(StatusMSG)
                    message.channel.send(embed);
                    
                })
            } else if (args[1].toLowerCase() == "add" && args.length > 2) {
                if (args[2].toLowerCase() == 'watching') StatusType = "WATCHING"
                else if (args[2].toLowerCase() == 'playing') StatusType = "PLAYING"
                else if (args[2].toLowerCase() == 'streaming') StatusType = "STREAMING"
                else if (args[2].toLowerCase() == 'listening') StatusType = "LISTENING"
                else {
                    const embed = new Discord.MessageEmbed()
                    .setColor([255,255,0])
                    .setAuthor("Status type not found!", serverInfo.logo)
                    .setDescription("Supported types: Watching, Playing, Streaming & Listening.")
                    return message.channel.send(embed)
                }

                var StatusText = '';
                for (i = 3; i < args.length; i++) {
                    StatusText += args[i] + " ";
                }        

                sql.all("Select * from Statuses").then(rows => {
                    if (rows.length == 0) {
                        if (StatusText.trim() == "counter") {
                            client.user.setActivity(`with ${client.guilds.get(serverInfo.guildId).memberCount} users`, {url: "https://www.twitch.tv/alphaconsole"});
                        } else {
                            client.user.setActivity(StatusText, {type: StatusType, url: "https://www.twitch.tv/alphaconsole"});
                        }
                    }
                });


                sql.run(`Insert into Statuses(StatusType, StatusText) VALUES ('${mysql_real_escape_string(StatusType)}', '${mysql_real_escape_string(StatusText)}')`).then(() => {
                    const embed = new Discord.MessageEmbed()
                    .setColor([255,255,0])
                    .setAuthor("Status added to the list.", serverInfo.logo)
                    message.channel.send(embed)
                })
            } else if (args[1].toLowerCase() == "remove") {
                sql.run(`delete from Statuses where ID = '${mysql_real_escape_string(args[2])}'`).then(() => {
                    const embed = new Discord.MessageEmbed()
                    .setColor([255,255,0])
                    .setAuthor("Status removed from the list.", serverInfo.logo)
                    message.channel.send(embed)

                    sql.all("Select * from Statuses").then(rows => {
                        if (rows.length == 0) {
                            client.user.setActivity(`with ${message.guild.memberCount} users`, {url: "https://www.twitch.tv/alphaconsole"});
                        }
                    });
                })

            } else if (args[1].toLowerCase() == "removeall") {
                sql.run(`Delete from Statuses;`).then(() => {
                    sql.run("delete from sqlite_sequence where name='Statuses'").then(() => {
                        const embed = new Discord.MessageEmbed()
                        .setColor([255,255,0])
                        .setAuthor("Status list reset.", serverInfo.logo)
                        message.channel.send(embed)
                        client.user.setActivity(`with ${message.guild.memberCount} users`, {url: "https://www.twitch.tv/alphaconsole"});
                    })
                })

            }
        }
    }
}

//Functions used to check if a player has the desired role
function pluck(array) {
    return array.map(function(item) { return item["name"]; });
}
function hasRole(mem, role)
{
    if (pluck(mem.roles).includes(role))
    {
        return true;
    } else {
        return false;
    }

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