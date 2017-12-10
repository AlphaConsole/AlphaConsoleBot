const Discord = require('discord.js');

module.exports.run = async(client, serverInfo, sql, message ,args) => {
    if(hasRole(message.member, 'Support') || hasRole(message.member, "Moderator") || hasRole(message.member, "Server Admin") || hasRole(message.member, "Developer")) {
        if (message.mentions.users.first() == undefined) {
            const embedChannel = new Discord.MessageEmbed()
            .setColor([255,255,0])
            .setTitle('Please tag the user to be warned') 
            return message.channel.send(embedChannel)
        } else {

            //Let's first check if the user even exists in the db
            sql.get(`select * from Members where DiscordID = '${message.mentions.users.first().id}'`).then(row => {
                if (!row) {
                    var today = new Date().getTime();
                    sql.run(`Insert into Members(DiscordID, Username, JoinedDate)VALUES('${message.mentions.users.first().id}', '${mysql_real_escape_string(message.mentions.users.first().username)}', '${today}')`)
                        .catch(err => console.log(err));
                }

                WarnUser(client, serverInfo, sql, message, row, args);
            }).catch(err => console.log(err))
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

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}



function WarnUser(client, serverInfo, sql, message, row, args) {

    var user = message.mentions.users.first();

    if (args.length == 2) {
        var TheReason = "No reason provided"
    } else {
        var TheReason = ""
        
        for (let i = 2; i < args.length; i++) {
            TheReason += args[i] + " ";
        }
    }

    sql.run(`Insert Into Warnlogs(Member, Moderator, Reason, Time) VALUES('${user.id}', '${message.author.id}', '${mysql_real_escape_string(TheReason)}', '${new Date().getTime()}')`)
    const embedChannel = new Discord.MessageEmbed()
    .setColor([255,255,0])
    .setTitle(`${user.username} has been warned!`) 
    message.channel.send(embedChannel)

    if (row.Warnings == 0) {
        const embed = new Discord.MessageEmbed()
        .setColor([255,255,0])
        .setTitle("You have received a warning. Next warning will result in a temporary mute!") 
        user.send(embed)

        message.channel.messages.fetch({limit:100}).then(messages => {
            messages.forEach(themessage => {
                if (themessage.author.id == user.id) {
                    themessage.delete();
                }
            });
        });

        const embedLog = new Discord.MessageEmbed()
        .setColor([0,255,0])
        .setTitle('=== WARNING 1 ===')
        .setDescription('New warning of <@' + user.id + '> by <@' + message.author.id + '>')
        .addField("Reason", TheReason)
        client.guilds.get(serverInfo.guildId).channels.get(serverInfo.modlogChannel).send(embedLog);

        sql.run(`update Members set Warnings = '1' where DiscordID = '${user.id}'`);


    } else if (row.Warnings == 1) {

        const embed = new Discord.MessageEmbed()
        .setColor([255,255,0])
        .setTitle("You have received a second warning! You'll now be muted for 15 minutes, you are warned!") 
        user.send(embed)

        message.channel.messages.fetch({limit:100}).then(messages => {
            messages.forEach(themessage => {
                if (themessage.author.id == user.id) {
                    themessage.delete();
                }
            });      
        });

        const embedLog = new Discord.MessageEmbed()
        .setColor([255,177,0])
        .setTitle('=== WARNING 2 ===')
        .setDescription('New warning of <@' + user.id + '> by <@' + message.author.id + '>')
        .addField("Reason", TheReason)
        client.guilds.get(serverInfo.guildId).channels.get(serverInfo.modlogChannel).send(embedLog);
        
        timeextra = new Date().getTime({limit:100}) + 1000 * 60 * 15;
        sql.run(`update Members set Warnings = '2', MutedUntil = '${timeextra}' where DiscordID = '${user.id}'`);

        let TheRole = message.guild.roles.find('name', 'Muted');
        let TheUser = message.guild.member(message.mentions.users.first().id);
        TheUser.addRole(TheRole);

    } else if (row.Warnings > 1) {

        const embed = new Discord.MessageEmbed()
        .setColor([255,255,0])
        .setTitle("You have received another warning! You'll now be muted, and the staff will look into your behaviour for further actions.") 
        user.send(embed)

        message.channel.messages.fetch({limit:100}).then(messages => {
            messages.forEach(themessage => {
                if (themessage.author.id == user.id) {
                    themessage.delete();
                }
            });      
        });

        const embedLog = new Discord.MessageEmbed()
        .setColor([255,0,0])
        .setTitle('=== WARNING 3 ===')
        .setDescription('New warning of <@' + user.id + '> by <@' + message.author.id + '>')
        .addField("Reason", TheReason)
        client.guilds.get(serverInfo.guildId).channels.get(serverInfo.modlogChannel).send(embedLog);
        
        sql.run(`update Members set Warnings = '3' where DiscordID = '${user.id}'`);

        let TheRole = message.guild.roles.find('name', 'Muted');
        let TheUser = message.guild.member(message.mentions.users.first().id);
        TheUser.addRole(TheRole);
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