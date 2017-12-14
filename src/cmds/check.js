const Discord = require('discord.js');

module.exports = {
    title: "check",
    perms: "Support",
    commands: ["!Check <@tag or ID>"],
    description: ["Checks the persons Warnings and shows them"],
    
    run: async(client, serverInfo, sql, message ,args) => {
        if(hasRole(message.member, 'Support') || hasRole(message.member, "Moderator") || hasRole(message.member, "Admin") || hasRole(message.member, "Developer")) {
            if (message.mentions.users.first() == undefined) {
                var DiscordID = args[1];
            } else {
                var DiscordID = message.mentions.users.first().id;
            }

            sql.get(`select * from Members where DiscordID = '${DiscordID}'`).then(row => {
                if (row) {

                    const embed = new Discord.MessageEmbed()
                    .setColor([255,255,0])
                    .setAuthor(`User check on ${message.guild.members.get(DiscordID).user.username}`, serverInfo.logo) 

                    if (row.Warnings != 0) {
                        var Reasons = "";
                        console.log("Checking reasons..")

                        sql.all(`Select * from logs where Member = '${DiscordID}' and Action = 'warn' order by Time ASC`).then(rows => {
                            rows.forEach(row => {
                                Reasons += row.ID + ". " + row.Reason + "\n";
                            });
                            embed.addField("Warnings", rows.length)
                            embed.addField("Reasons", Reasons)
                            message.channel.send(embed);
                        })
                    } else {
                        embed.addField("Warnings", row.Warnings)
                        message.channel.send(embed);
                    }


                } else {
                    const embed = new Discord.MessageEmbed()
                    .setColor([255,255,0])
                    .setAuthor('No user found in the database', serverInfo.logo) 
                    message.channel.send(embed);
                }
            })
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