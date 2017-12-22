const Discord = require('discord.js');

module.exports = {
    title: "case",
    perms: "Support",
    commands: [
        "!Case <Number>",
        "!Case edit <Number> <Reason>",
        "!Case remove <Number>"
    ],
    description: [
        "Shows all details of a case",
        "Changes the reason of a case",
        "Removes the case"
    ],

    run: async(client, serverInfo, sql, message ,args) => {
        if(hasRole(message.member, 'Support') || hasRole(message.member, "Moderator") || hasRole(message.member, "Admin") || hasRole(message.member, "Developer")) {

            if (args.length == 2) {
                CaseID = args[1];

                sql.get(`Select * from logs where ID = '${CaseID}'`).then(row => {

                    if (row) {
                        const embed = new Discord.MessageEmbed()
                        .setColor([255,255,0])
                        .setAuthor(`Case check`, serverInfo.logo)
                        .addField(`Case ID`, row.ID, true)
                        .addField(`Member`, `<@${row.Member}>`, true)
                        .addField(`Action`, capitalizeFirstLetter(row.Action))
                        .addField(`Reason`, row.Reason, true)
                        
                        if (row.Value != null) {
                            if (row.Value == 0) {
                                embed.addField(`Time`, "Permanent", true)
                            } else {
                                embed.addField(`Time`, row.Value, true)
                            }
                        }
                        
                        embed.setThumbnail('https://upload.wikimedia.org/wikipedia/commons/c/c4/600_px_Transparent_flag.png')
                        embed.addField("Case by", `<@${row.Moderator}>`, true)
                        embed.addField("At channel", `<#${row.ChannelID}>`, true)

                        var date = new Date(parseInt(row.Time)).toUTCString();
                        embed.setFooter(`Time of case: ${date}`)
                        message.channel.send(embed)
                    } else {
                        const embed = new Discord.MessageEmbed()
                        .setColor([255,255,0])
                        .setAuthor(`No case found with this ID`, serverInfo.logo)
                        message.channel.send(embed)
                    }

                })
            } else if(args.length > 3 && args[1].toLowerCase() == 'edit') {
                CaseID = args[2];

                sql.get(`Select * from logs where ID = '${CaseID}'`).then(row => {

                    if (row) {

                        var TheReason = ""
                        for (let i = 3; i < args.length; i++) {
                            TheReason += args[i] + " ";
                        }

                        sql.run(`update logs set Reason = '${mysql_real_escape_string(TheReason)}' where ID = '${CaseID}'`).then(() => {
                            const embed = new Discord.MessageEmbed()
                            .setColor([255,255,0])
                            .setAuthor(`Case ${CaseID} updated!`, serverInfo.logo)
                            message.channel.send(embed)
                        })

                    } else {
                        const embed = new Discord.MessageEmbed()
                        .setColor([255,255,0])
                        .setAuthor(`No case found with this ID`, serverInfo.logo)
                        message.channel.send(embed)
                    }

                })
            } else if(args.length == 3 && args[1].toLowerCase() == 'remove') {
                CaseID = args[2];

                sql.get(`Select * from logs where ID = '${CaseID}'`).then(row => {

                    if (row) {

                        sql.run(`delete from logs where ID = '${CaseID}'`).then(() => {
                            const embed = new Discord.MessageEmbed()
                            .setColor([255,255,0])
                            .setAuthor(`Case ${CaseID} deleted!`, serverInfo.logo)
                            message.channel.send(embed)

                            message.guild.channels.get(serverInfo.modlogChannel).messages.fetch(row.MessageID).then(msg => {
                                if (msg) msg.delete();
                            })
                        })

                    } else {
                        const embed = new Discord.MessageEmbed()
                        .setColor([255,255,0])
                        .setAuthor(`No case found with this ID`, serverInfo.logo)
                        message.channel.send(embed)
                    }

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

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
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