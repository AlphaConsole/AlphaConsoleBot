/**
 * ! Unlockdown command
 * 
 * ? Kinda obvious, too lazy to write anything smart anyway
 * ? We also have command description for a reason. So I actually don't know why I added this here. Welp...
 */
const Discord = require('discord.js');

module.exports = {
     title: "Unlockdown",
     details: [
        {
            perms      : "Admin",
            command    : "!Unlock",
            description: "Enables all channels which rely on the bot heavily."
        }
    ],

    run: ({ client, serverInfo, message, args, sql, config, sendEmbed }) => {

        if (!message.member.isAdmin) return;
        
        client.guilds
            .get(serverInfo.guildId)
            .channels.get(serverInfo.channels.setTitle)
            .updateOverwrite(message.guild.id, {
                SEND_MESSAGES: true
            });

        client.guilds
            .get(serverInfo.guildId)
            .channels.get(serverInfo.channels.showcase)
            .updateOverwrite(message.guild.id, {
                SEND_MESSAGES: true
            });

        client.guilds
            .get(serverInfo.guildId)
            .channels.get(serverInfo.channels.suggestion)
            .updateOverwrite(message.guild.id, {
                SEND_MESSAGES: true
            });

        client.guilds
            .get(serverInfo.guildId)
            .channels.get(serverInfo.channels.setSpecialTitle)
            .updateOverwrite(message.guild.id, {
                SEND_MESSAGES: true
            });

        client.guilds
            .get(serverInfo.guildId)
            .channels.get(serverInfo.channels.betaSteamIDS)
            .updateOverwrite(message.guild.id, {
                SEND_MESSAGES: true
            });


        sendEmbed(message.channel, "All bot reliant channels have been re-enabled.")
    }
};