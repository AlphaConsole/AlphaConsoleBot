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
                .overwritePermissions({
                    overwrites: [
                        {
                           id: message.guild.id,
                           allowed: ['SEND_MESSAGES'],
                        },
                    ]
                });
            client.guilds
                .get(serverInfo.guildId)
                .channels.get(serverInfo.channels.showcase)
                .overwritePermissions({
                    overwrites: [
                        {
                           id: message.guild.id,
                           allowed: ['SEND_MESSAGES'],
                        },
                    ]
                });
            client.guilds
                .get(serverInfo.guildId)
                .channels.get(serverInfo.channels.suggestion)
                .overwritePermissions({
                    overwrites: [
                        {
                           id: message.guild.id,
                           allowed: ['SEND_MESSAGES'],
                        },
                    ]
                });
            client.guilds
                .get(serverInfo.guildId)
                .channels.get(serverInfo.channels.setSpecialTitle)
                .overwritePermissions({
                    overwrites: [
                        {
                           id: message.guild.id,
                           allowed: ['SEND_MESSAGES'],
                        },
                    ]
                });
            client.guilds
                .get(serverInfo.guildId)
                .channels.get(serverInfo.channels.betaSteamIDS)
                .overwritePermissions({
                    overwrites: [
                        {
                           id: message.guild.id,
                           allowed: ['SEND_MESSAGES'],
                        },
                    ]
                });

        sendEmbed(message.channel, "All bot reliant channels have been re-enabled.")
    }
};