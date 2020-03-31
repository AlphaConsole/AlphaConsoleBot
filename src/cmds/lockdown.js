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
        
        try {
            
            client.guilds
                .get(serverInfo.guildId)
                .channels.resolve(serverInfo.channels.setTitle)
                .updateOverwrite(message.guild.id, {
                    SEND_MESSAGES: false
                });
            client.guilds
                .get(serverInfo.guildId)
                .channels.resolve(serverInfo.channels.showcase)
                .updateOverwrite(message.guild.id, {
                    SEND_MESSAGES: false
                });
            client.guilds
                .get(serverInfo.guildId)
                .channels.resolve(serverInfo.channels.suggestion)
                .updateOverwrite(message.guild.id, {
                    SEND_MESSAGES: false
                });
            client.guilds
                .get(serverInfo.guildId)
                .channels.resolve(serverInfo.channels.setSpecialTitle)
                .updateOverwrite(message.guild.id, {
                    SEND_MESSAGES: false
                });
            client.guilds
                .get(serverInfo.guildId)
                .channels.resolve(serverInfo.channels.betaSteamIDS)
                .updateOverwrite(message.guild.id, {
                    SEND_MESSAGES: false
                });

        } catch (error) {
            console.log(error)
        }

        sendEmbed(message.channel, "All bot reliant channels have been locked down.")
    }
};