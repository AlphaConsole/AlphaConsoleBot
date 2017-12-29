const Discord = require('discord.js');

module.exports = {
    title: "lockdown",
    perms: "Admin",
    commands: ["!lockdown"],
    description: ["Disables all channels which rely on the bot heavily."],

    run: async(client, serverInfo, message, args) => {
        if (hasRole(message.member, "Admin") || hasRole(message.member, "Developer")) {
            client.guilds.get(serverInfo.guildId).channels.get(serverInfo.setTitleChannel).overwritePermissions(message.guild.id, {
                SEND_MESSAGES: false
            });
            client.guilds.get(serverInfo.guildId).channels.get(serverInfo.showcaseChannel).overwritePermissions(message.guild.id, {
                SEND_MESSAGES: false
            });
            client.guilds.get(serverInfo.guildId).channels.get(serverInfo.suggestionsChannel).overwritePermissions(message.guild.id, {
                SEND_MESSAGES: false
            });
            client.guilds.get(serverInfo.guildId).channels.get(serverInfo.setSpecialTitleChannel).overwritePermissions(message.guild.id, {
                SEND_MESSAGES: false
            });
            const embedChannel = new Discord.MessageEmbed()
                .setColor([255,255,0])
                .setAuthor('All bot reliant channels have been locked down.', serverInfo.logo) 
                return message.channel.send(embedChannel)
        } else {
            message.delete();
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

/**
 * Returns true if user is part of staff
 * @param {user} user 
 */
function isStaff(user) {
    if (hasRole(user, "Developer") ||hasRole(user, "Admin") || hasRole(user, "Moderator") || hasRole(user, "Support")) {
        return true;
    } else {
        return false;
    }
}