const Discord = require('discord.js');

module.exports.run = async(client, serverInfo, sql, message, args) => {
    if (hasRole(message.member, "Moderator") || hasRole(message.member, "Server Admin") || hasRole(message.member, "Developer")) {
        
        //Check if someone is tagged
        if (message.mentions.users.first() == undefined) {
            const embed = new Discord.MessageEmbed()
            .setColor([255,255,0])
            .setTitle('Please tag the user to be kicked') 
            return message.channel.send(embed)
        }

        //Check if there is a reason
        if (args.length == 2) {
            var TheReason = "No reason provided";
        } else {
            var TheReason = ""
            for (let i = 2; i < args.length; i++) {
                TheReason += args[i] + " "; 
            }
        }

        //Let's start kicking the user
        let KickedUser = message.guild.member(message.mentions.users.first().id);
        KickedUser.kick(TheReason);

        //Insert the log into the database
        sql.run(`Insert into logs(Action, Member, Moderator, Reason, Time) VALUES('kick', '${KickedUser.id}', '${message.author.id}', '${mysql_real_escape_string(TheReason)}', '${new Date().getTime()}')`)
            .catch(err => console.log(err));

        //Make a notice & Log it to the log-channel
        message.delete()
        const embed = new Discord.MessageEmbed()
        .setColor([255,255,0])
        .setTitle(`${message.guild.members.get(message.mentions.users.first().id)} has been kicked from the server.`) 
        message.channel.send(embed) //Remove this line if you don't want it to be public.

        const embedlog = new Discord.MessageEmbed()
        .setColor([255,140,0])
        .setTitle('=== USER KICK ===')
        .setDescription(`${message.guild.members.get(message.mentions.users.first().id)} has been kicked by ${message.member}`)
        .setTimestamp()
        .addField('Reason', TheReason)
        message.guild.channels.get(serverInfo.modlogChannel).send(embedlog);

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