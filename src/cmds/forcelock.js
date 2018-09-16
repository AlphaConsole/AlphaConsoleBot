/**
 * ! Lockdown command
 * 
 * ? Kinda obvious, too lazy to write anything smart anyway
 * ? We also have command description for a reason. So I actually don't know why I added this here. Welp...
 */
const Discord = require('discord.js');

module.exports = {
     title: "Forcelock",
     details: [
        {
            perms      : "Admin",
            command    : "!Forcelock",
            description: "Disables all channels in case of a raid."
        }
    ],

    run: ({ client, serverInfo, message, args, sql, config, sendEmbed }) => {

      if (!message.member.isAdmin) return;
      
      try {
        let channels = client.guilds.get(serverInfo.guildId).channels.filter(c => c.parentID !== serverInfo.channels.staffChannelsCat && c.type === "text");

        if (args[0].toLowerCase() === "!forcelock") {
          channels.forEach(c => {
            c.updateOverwrite(message.guild.id, {
              SEND_MESSAGES: false
            });
          });
          sendEmbed(message.channel, "All channels have been locked down.")
        }

        if (args[0].toLowerCase() === "!forceunlock") {
          serverInfo.publicChannels.forEach(id => {
            if (client.guilds.get(serverInfo.guildId) && client.guilds.get(serverInfo.guildId).channels.get(id)) {
              client.guilds.get(serverInfo.guildId).channels.get(id)
              .updateOverwrite(message.guild.id, {
                SEND_MESSAGES: true
              });
            }
          });
          sendEmbed(message.channel, "All channels have been unlocked.")
        }

      } catch (error) {
          console.log(error)
      }
    }
};