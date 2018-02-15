const Discord = require('discord.js');

module.exports = {
    title: "mute",
    perms: "Support",
    commands: ["!Mute <@tag> <Length[TimeUnit(d,h,m,s) - default: h]> <?Reason>"],
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

                var timeArg = args[2].toLowerCase(); // Lower case it so it's easier to check
                var originalTime = args[2].toLowerCase();
                var timeunitDisplay = "hours"; //Default time unit string representation for messages and logs.

                if(timeArg.includes("d")){ // Days is selected explicitly
                    timeArg = timeArg.replace("d", "");
                    timeunitDisplay = "days"; // Change time unit to days

                }else if(timeArg.includes("h")){ // Hours is selected explicitly
                    timeArg = timeArg.replace("h", "");
                    timeunitDisplay = "hours"; // Change time unit to hours

                }else if(timeArg.includes("m")){ // Minutes is selected explicitly
                    timeArg = timeArg.replace("m", "");
                    timeunitDisplay = "minutes"; // Change time unit to minutes

                }else if(timeArg.includes("s")){ // Seconds is selected explicitly...for some reason...
                    timeArg = timeArg.replace("s", "");
                    timeunitDisplay = "seconds"; // Change time unit to seconds
                }

                // timeArg should now be a number
                if(timeArg == ""){
                    // Tried to trick system with only a time unit, so it would not have a number... cheeki breeki ~Nameless
                    const embed = new Discord.MessageEmbed()
                    .setColor([255,255,0])
                    .setAuthor('You did not specify a length of time. Please use 0 for permanent mute', serverInfo.logo) 
                    return message.channel.send(embed)
                }

                if (!isNumber(timeArg)) {
                    const embed = new Discord.MessageEmbed()
                    .setColor([255,255,0])
                    .setAuthor(`${timeArg} is not a valid number. Please use 0 for permanent mute`, serverInfo.logo) 
                    return message.channel.send(embed)
                }

                // Only change this once now, slightly more efficient than replacing also saves 4 lines of code I guess
                originalTime = timeArg;

                switch(timeunitDisplay){
                    case "days":
                    timeArg = (timeArg * 86400000); // 86400000 milliseconds in 1 day
                    break;

                    case "hours":
                    timeArg = (timeArg * 3600000); // 3600000 milliseconds in 1 hour
                    break;

                    case "minutes":
                    timeArg = (timeArg * 60000); // 60000 milliseconds in 1 minute
                    break;

                    case "seconds":
                    timeArg = (timeArg * 1000); // 1000 milliseconds in 1 second
                    break;

                    default:
                        // Shouldn't get here...
                        break;
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

                
                if (timeArg == 0) {

                    sql.run(`Insert into logs(Action, Member, Moderator, value, Reason, Time, ChannelID) VALUES('mute', '${MutedUser.id}', '${message.author.id}', ${mysql_real_escape_string(timeArg)},'${mysql_real_escape_string(TheReason)}', '${new Date().getTime()}', '${message.channel.id}')`)
                    .then(() => {
                        var CaseID = "Error";
                        sql.get(`select * from logs where Member = '${message.mentions.users.first().id}' order by ID desc`).then(roww => {
                            if (!roww) return message.channel.send("An error occured.")
                            
                            CaseID = roww.ID

                            //Make a notice & Log it to the log-channel
                            const embed = new Discord.MessageEmbed()
                            .setColor([255,255,0])
                            .setAuthor(`${message.mentions.users.first().tag} has been permanently muted. Case number: ${CaseID}`, serverInfo.logo) 
                            message.channel.send(embed) //Remove this line if you don't want it to be public.

        
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
                    await sql.get(`select * from Members where DiscordID = '${message.mentions.users.first().id}'`).then(row => {
                        if (!row) {
                            var today = new Date().getTime();
                            sql.run(`Insert into Members(DiscordID, Username, JoinedDate)VALUES('${message.mentions.users.first().id}', '${mysql_real_escape_string(message.mentions.users.first().username)}', '${today}')`)
                                .then(() => {
                                    //Calculate the extra time to be added
                                    MutedUntil = new Date().getTime() + timeArg; //timeArg is the amount of time, already converted to milliseconds.

                                    //Update Database with the newest time of when to be muted to
                                    sql.run(`Update Members set MutedUntil = ${MutedUntil} where DiscordID = '${message.mentions.users.first().id}'`)
                                        .catch(err => console.log(err));
                                })
                                .catch(err => console.log(err));
                        } else {
                            //Calculate the extra time to be added
                            MutedUntil = new Date().getTime() + timeArg; //timeArg is the amount of time, already converted to milliseconds.

                            //Update Database with the newest time of when to be muted to
                            sql.run(`Update Members set MutedUntil = ${MutedUntil} where DiscordID = '${message.mentions.users.first().id}'`)
                                .catch(err => console.log(err));

                        }
                    }).catch(err => console.log(err))

                    await sql.run(`Insert into logs(Action, Member, Moderator, value, Reason, Time, ChannelID) VALUES('mute', '${MutedUser.id}', '${message.author.id}', ${timeArg},'${mysql_real_escape_string(TheReason)}', '${new Date().getTime()}', '${message.channel.id}')`)
                    .then(() => {
                        var CaseID = "Error";
                        sql.get(`select * from logs where Member = '${MutedUser.id}' order by ID desc`).then(roww => {
                            if (!roww) return message.channel.send("An error occured.")
                            
                            CaseID = roww.ID

                            //Make a notice & Log it to the log-channel
                            const embed = new Discord.MessageEmbed()
                            .setColor([255,255,0])
                            .setAuthor(`${message.mentions.users.first().tag} has been muted for ${originalTime} ${timeunitDisplay}. Case number: ${CaseID}`, serverInfo.logo) 
                            message.channel.send(embed) //Remove this line if you don't want it to be public.

        
                            const embedlog = new Discord.MessageEmbed()
                            .setColor([255,255,0])
                            .setAuthor(`Case ${CaseID} | User Mute`, serverInfo.logo)
                            .setDescription(`${message.guild.members.get(message.mentions.users.first().id)} (${message.mentions.users.first().id}) has been muted for ${originalTime} ${timeunitDisplay} by ${message.member}`)
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
                const embed = new Discord.MessageEmbed()
                .setColor([255,255,0])
                .setAuthor('!Mute <@tag> <Length[TimeUnit(d,h,m,s) - default: h]> <?Reason>', serverInfo.logo) 
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