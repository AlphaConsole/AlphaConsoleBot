/**
 * ! Server info information
 * 
 * ? Just a simple command to get information from the server.
 */

const Discord = require('discord.js');
let monthNames = [
    "Jan",
    "Feb",
    "March",
    "April",
    "May",
    "June",
    "July",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];

module.exports = {
    title: "ServerInfo",
    details: [
        {
            perms      : "Staff",
            command    : "!serverinfo",
            description: "Returns an embed with information of the server"
        }
    ],

    run: ({ client, serverInfo, message, args, sql, config, sendEmbed }) => {

        if (!message.member.isStaff) return;

        try {
          var guild = message.guild;
          var creationDate = new Date(guild.createdTimestamp);

          var now = new Date();
          var timeDiff = Math.abs(now.getTime() - creationDate.getTime());
          var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

          const embed = new Discord.MessageEmbed()
          .setColor([255, 255, 0])
          .setThumbnail(guild.iconURL({ format: "png" }))
          .addField(
            guild.name,
            `Created ${creationDate.getDate()} ${
              monthNames[creationDate.getMonth()]
            } ${creationDate.getFullYear()} ${creationDate.getUTCHours()}:${creationDate.getMinutes()}. That's over ${diffDays} days ago!`
          )
          .addField("Region", guild.region, true)
          .addField(
            "Users",
            `${guild.members.array().filter(m => m.presence.status.toLowerCase() !== "offline").length}/${guild.memberCount}`,
            true
          )
          .addField(
            "Text Channels",
            guild.channels.array().filter(c => c.type.toLowerCase() == "text").length,
            true
          )
          .addField(
            "Voice Channels",
            guild.channels.array().filter(c => c.type.toLowerCase() == "voice").length,
            true
          )
          .addField("Roles", guild.roles.size, true)
          .addField("Owner", guild.owner.user, true)
          //.addField("Emojis", guild.emojis.map(m => m.toString()).join("")) -- Somehow brakes it without any warning
          message.channel.send(embed);

        } catch (error) {
          console.log(error)
        }
    }
}