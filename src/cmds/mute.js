const Discord = require('discord.js');

module.exports = {
    title: "mute",
    perms: "Support",
    commands: ["!Mute <@tag> <Hours> <?Reason>"],
    description: ["Mutes the person for the given amount of times. If time is 0 then the person is permanently muted"],
    
    run: async(client, serverInfo, sql, message ,args) => {
        if (hasRole(message.member, "Support") || hasRole(message.member, "Moderator") || hasRole(message.member, "Admin") || hasRole(message.member, "Developer")) {

            //Check if someone is tagged
            if (message.mentions.users.first() == undefined) {
                const embed = new Discord.MessageEmbed()
                .setColor([255,255,0])
                .setAuthor('Please tag the user to be muted', serverInfo.logo) 
                return message.channel.send(embed)
            }

            if (args.length > 2) {

                if (!isNumber(args[2])) {
                    const embed = new Discord.MessageEmbed()
                    .setColor([255,255,0])
                    .setAuthor('Those hours are not known. Please use 0 for permament mute', serverInfo.logo) 
                    return message.channel.send(embed)
                }
                //First add the Muted Role to the user
                let MutedRole = message.guild.roles.find('name', 'Muted');
                let MutedUser = message.guild.member(message.mentions.users.first().id);
                MutedUser.addRole(MutedRole);

                //Check if there is a reason
                if (args.length == 3) {
                    var TheReason = "No reason provided";
                } else {
                    var TheReason = '';
                    for (i = 3; i < args.length; i++) {
                        TheReason += args[i] + " ";
                    }
                }

                
                if (args[2] == 0) {

                    //Make a notice & Log it to the log-channel
                    message.delete()
                    const embed = new Discord.MessageEmbed()
                    .setColor([255,255,0])
                    .setAuthor(`${message.mentions.users.first().tag} has been permanently muted`, serverInfo.logo) 
                    message.channel.send(embed) //Remove this line if you don't want it to be public.

                    sql.run(`Insert into logs(Action, Member, Moderator, value, Reason, Time, ChannelID) VALUES('mute', '${MutedUser.id}', '${message.author.id}', ${mysql_real_escape_string(args[2])},'${mysql_real_escape_string(TheReason)}', '${new Date().getTime()}', '${message.channel.id}')`)
                    .then(() => {
                        var CaseID = "Error";
                        sql.get(`select * from logs where Member = '${message.mentions.users.first().id}' order by ID desc`).then(roww => {
                            if (roww) CaseID = roww.ID
        
                            const embedlog = new Discord.MessageEmbed()
                            .setColor([255,255,0])
                            .setAuthor(`Case ${CaseID} | User Mute`, serverInfo.logo)
                            .setDescription(`${message.guild.members.get(message.mentions.users.first().id)} (${message.mentions.users.first().id}) has been permanently muted by ${message.member}`)
                            .setTimestamp()
                            .addField("Reason", TheReason)
                            message.guild.channels.get(serverInfo.modlogChannel).send(embedlog).then(msg => {
                                sql.run(`update logs set MessageID = '${msg.id}' where ID = '${CaseID}'`)
                            })
                        });
                    })
                    .catch(err => console.log(err))

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
                    .setAuthor(`${message.mentions.users.first().tag} has been muted for ${args[2]} hours`, serverInfo.logo) 
                    message.channel.send(embed) //Remove this line if you don't want it to be public.

                    sql.run(`Insert into logs(Action, Member, Moderator, value, Reason, Time, ChannelID) VALUES('mute', '${MutedUser.id}', '${message.author.id}', ${mysql_real_escape_string(args[2])},'${mysql_real_escape_string(TheReason)}', '${new Date().getTime()}', '${message.channel.id}')`)
                    .then(() => {
                        var CaseID = "Error";
                        sql.get(`select * from logs where Member = '${MutedUser.id}' order by ID desc`).then(roww => {
                            if (roww) CaseID = roww.ID
        
                            const embedlog = new Discord.MessageEmbed()
                            .setColor([255,255,0])
                            .setAuthor(`Case ${CaseID} | User Mute`, serverInfo.logo)
                            .setDescription(`${message.guild.members.get(message.mentions.users.first().id)} (${message.mentions.users.first().id}) has been muted for ${args[2]} hours by ${message.member}`)
                            .setTimestamp()
                            .addField("Reason", TheReason)
                            message.guild.channels.get(serverInfo.modlogChannel).send(embedlog).then(msg => {
                                sql.run(`update logs set MessageID = '${msg.id}' where ID = '${CaseID}'`)
                            })
                        });
                    })
                    .catch(err => console.log(err));
                }



            } else {
                message.delete();
                const embed = new Discord.MessageEmbed()
                .setColor([255,255,0])
                .setAuthor('__Command wrongly build:__ `!Mute @user [Time in hours] [?Reason]`', serverInfo.logo) 
                return message.channel.send(embed)
            }
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
                return char+char; // prepends a backslash to backslash, percent,
                                  // and double/single quotes
        }
    });
}


//Simple function to check if they are numbers
function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}