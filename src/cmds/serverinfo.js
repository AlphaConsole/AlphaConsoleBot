const Discord = require('discord.js');
var monthNames = ["Jan", "Feb", "March", "April", "May", "June",
  "July", "Aug", "Sep", "Oct", "Nov", "Dec"
];

module.exports = {
    title: "serverinfo",
    perms: "everyone",
    commands: ["!ServerInfo"],
    description: ["For information of the server [Only works in #bot-spam]"],

    run: async(client, serverInfo, sql, message, args) => {
        if (message.channel.id == serverInfo.BotSpam || message.channel.id == serverInfo.basementChannel || message.channel.id == serverInfo.staffChannel || message.channel.id == "378420714941972480") {
            var guild = client.guilds.get(serverInfo.guildId)
            var creationDate = new Date(guild.createdTimestamp)

            var now = new Date();
            var timeDiff = Math.abs(now.getTime() - creationDate.getTime());
            var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

            if (!guild.region || guild.region.length < 1) console.log("Region failed")
            if (!guild.channels.array().filter(c => c.type.toLowerCase() == "text").length) console.log("Text Channels failed")
            if (!guild.channels.array().filter(c => c.type.toLowerCase() == "voice").length) console.log("voice Channels failed")
            if (!guild.roles.size) console.log("Roles failed")
            if (!guild.owner.user.tag || guild.owner.user.tag.length < 1) console.log("Owner failed")
            if (!guild.emojis.map(m => m.toString()).join(" ") || guild.emojis.map(m => m.toString()).join(" ").length < 1) console.log("Emojis failed")
            
            const embed = new Discord.MessageEmbed()
            .setColor([255,255,0])
            .setThumbnail(guild.iconURL({format: "png"}))
            .addField(guild.name, `Created ${creationDate.getDate()} ${monthNames[creationDate.getMonth()]} ${creationDate.getFullYear()} ${creationDate.getUTCHours()}:${creationDate.getMinutes()}. That's over ${diffDays} days ago!`)
            .addField("Region", guild.region, true)
            .addField("Users", `${guild.members.array().filter(m => m.presence.status.toLowerCase() !== "offline").length}/${guild.memberCount}`, true)
            .addField("Text Channels", guild.channels.array().filter(c => c.type.toLowerCase() == "text").length, true)
            .addField("Voice Channels", guild.channels.array().filter(c => c.type.toLowerCase() == "voice").length, true)
            .addField("Roles", guild.roles.size, true)
            .addField("Owner", guild.owner.user.tag, true)
            //.addField("Emojis", guild.emojis.map(m => m.toString()).join(" "))
            message.channel.send(embed)
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
