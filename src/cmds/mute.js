const Discord = require('discord.js');

module.exports.run = async(client, serverInfo, sql, message ,args) => {
    if (hasRole(message.member, "Support")) {

        //Check if someone is tagged
        if (message.mentions.users.first() == undefined) {
            const embed = new Discord.MessageEmbed()
            .setColor([255,255,0])
            .setTitle('Please tag the user to be muted') 
            return message.channel.send(embed)
        }

        if (args.length > 2) {
            //First add the Muted Role to the user
            let MutedRole = message.guild.roles.find('name', 'Muted');
            let MutedUser = message.guild.member(message.mentions.users.first().id);
            MutedUser.addRole(MutedRole);

            //Check if there is a reason
            if (args.length == 3) {
                var TheReason = "No reason provided";
            } else {
                var TheReason = ""
                for (let i = 2; i < args.length; i++) {
                    TheReason += args[i] + " "; 
                }
            }

            if (args[2] == 0) {

                //Make a notice & Log it to the log-channel
                message.delete()
                const embed = new Discord.MessageEmbed()
                .setColor([255,255,0])
                .setTitle(`${message.guild.members.get(message.mentions.users.first().id)} has been permanently muted`) 
                message.channel.send(embed) //Remove this line if you don't want it to be public.

                const embedlog = new Discord.MessageEmbed()
                .setColor([255,0,0])
                .setTitle('=== USER MUTE ===')
                .setDescription(`${message.guild.members.get(message.mentions.users.first().id)} has been permanently muted by ${message.member}`)
                .setTimestamp()
                .addField("Reason", TheReason)
                message.guild.channels.get(serverInfo.modlogChannel).send(embedlog);

            } else {

                //Let's first check if the user even exists in the db
                sql.get(`select * from Members where DiscordID = '${message.mentions.users.first().id}'`).then(row => {
                    if (!row) {
                        var today = new Date().getTime();
                        sql.run(`Insert into Members(DiscordID, Username, JoinedDate)VALUES('${message.mentions.users.first().id}', '${mysql_real_escape_string(message.mentions.users.first().username)}', '${today}')`)
                            .catch(err => console.log(err));
                    }
                }).catch(err => console.log(err))

                //Calculate the extra hours to be added
                MutedUntil = new Date().getTime() + args[2] * 3600000; //args is the amount of hours. 3600000 transfers it to ms

                //Update Database with the newest time of when to be muted to
                sql.run(`Update Members set MutedUntil = ${MutedUntil} where DiscordID = ${message.mentions.users.first().id}`)
                    .catch(err => console.log(err));

                //Make a notice & Log it to the log-channel
                message.delete()
                const embed = new Discord.MessageEmbed()
                .setColor([255,255,0])
                .setTitle(`${message.guild.members.get(message.mentions.users.first().id)} has been muted for ${args[2]} hours`) 
                message.channel.send(embed) //Remove this line if you don't want it to be public.

                const embedlog = new Discord.MessageEmbed()
                .setColor([255,140,0])
                .setTitle('=== USER MUTE ===')
                .setDescription(`${message.guild.members.get(message.mentions.users.first().id)} has been muted for ${args[2]} hours by ${message.member}`)
                .setTimestamp()
                .addField("Reason", TheReason)
                message.guild.channels.get(serverInfo.modlogChannel).send(embedlog);
            }

            sql.run(`Insert into logs(Action, Member, Moderator, value, Reason) VALUES('mute', '${MutedUser.id}', '${message.author.id}', ${mysql_real_escape_string(args[2])},'${mysql_real_escape_string(TheReason)}')`)
            .catch(err => console.log(err));

        } else {
            message.delete();
            const embed = new Discord.MessageEmbed()
            .setColor([255,255,0])
            .setTitle('__Command wrongly build:__ `!Mute @user [Time in hours] [?Reason]`') 
            return message.channel.send(embed)
        }
    }
};

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
                return "\\"+char; // prepends a backslash to backslash, percent,
                                  // and double/single quotes
        }
    });
}