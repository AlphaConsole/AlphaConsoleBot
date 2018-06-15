/**
 * ! Lockdown command
 * 
 * ? Kinda obvious, too lazy to write anything smart anyway
 * ? We also have command description for a reason. So I actually don't know why I added this here. Welp...
 */
const Discord = require('discord.js');

module.exports = {
     title: "Lockdown",
     details: [
        {
            perms      : "Admin",
            command    : "!Lockdown",
            description: "Disables all channels which rely on the bot heavily."
        }
    ],

    run: ({ client, serverInfo, message, args, sql, config, sendEmbed }) => {

        if (!message.member.isAdmin) return;
        
        client.guilds
            .get(serverInfo.guildId)
            .channels.get(serverInfo.channels.setTitle)
            .overwritePermissions(message.guild.id, {
                SEND_MESSAGES: false
            });
        client.guilds
            .get(serverInfo.guildId)
            .channels.get(serverInfo.channels.showcase)
            .overwritePermissions(message.guild.id, {
                SEND_MESSAGES: false
            });
        client.guilds
            .get(serverInfo.guildId)
            .channels.get(serverInfo.channels.suggestion)
            .overwritePermissions(message.guild.id, {
                SEND_MESSAGES: false
            });
        client.guilds
            .get(serverInfo.guildId)
            .channels.get(serverInfo.channels.setSpecialTitle)
            .overwritePermissions(message.guild.id, {
                SEND_MESSAGES: false
            });
        client.guilds
            .get(serverInfo.guildId)
            .channels.get(serverInfo.channels.betaSteamIDS)
            .overwritePermissions(message.guild.id, {
                SEND_MESSAGES: false
            });

        sendEmbed(message.channel, "All bot reliant channels have been locked down.")
    }
};