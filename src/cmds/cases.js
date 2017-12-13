const Discord = require('discord.js');

module.exports.run = async(client, serverInfo, sql, message ,args) => {
    if(hasRole(message.member, 'Support') || hasRole(message.member, "Moderator") || hasRole(message.member, "Admin") || hasRole(message.member, "Developer")) {

        if (message.mentions.users.first() == undefined) {
            if (message.guild.members.get(args[1]) == undefined) {
                const embed = new Discord.MessageEmbed()
                .setColor([255,255,0])
                .setAuthor(`User not found`, serverInfo.logo)
                return message.channel.send(embed)
            } else {
                var TheUser = message.guild.members.get(args[1]).user;
            }
        } else {
            var TheUser = message.mentions.users.first();
        }

        const embed = new Discord.MessageEmbed()
        .setColor([255,255,0])
        .setAuthor(`All cases of ${TheUser.tag}`, serverInfo.logo)

        sql.all(`select * from logs where Member = '${TheUser.id}' AND Action = 'mute'`).then(mutes => {
            embed.addField("Mutes", mutes.length, true)

            sql.all(`select * from logs where Member = '${TheUser.id}' AND Action = 'warn'`).then(warns => {
                embed.addField("Warnings", warns.length, true)
                embed.setThumbnail('http://www.cityrider.com/fixed/43aspect.png')

                sql.all(`select * from logs where Member = '${TheUser.id}' AND Action = 'kick'`).then(kicks => {
                    embed.addField("kicks", kicks.length, true)

                    sql.all(`select * from logs where Member = '${TheUser.id}' AND Action = 'ban'`).then(bans => {
                        embed.addField("Bans", bans.length, true)

                        sql.all(`select * from logs where Member = '${TheUser.id}' LIMIT 5`).then(cases => {

                            var output = ""
                            cases.forEach(element => {
                                output += element.ID + ': ' + capitalizeFirstLetter(element.Action) + " - " + element.Reason + "\n"
                            });
                            
                            embed.addField("Last 5 cases", output)
                            message.channel.send(embed)
                        })
                    })
                })
            })
        })

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