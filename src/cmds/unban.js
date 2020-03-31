/**
 * ! Unban command
 * 
 * ? Kinda obvious, too lazy to write anything smart anyway
 * ? We also have command description for a reason. So I actually don't know why I added this here. Welp...
 */
const Discord = require('discord.js');

module.exports = {
     title: "Unban",
     details: [
        {
            perms      : "Moderator",
            command    : "!unban <id>",
            description: "Unbans the user from the server"
        }
    ],

    run: ({ client, serverInfo, message, args, sql, config, sendEmbed }) => {

        if (!message.member.isModerator || message.member.id === "345769053538746368") return;
        if (args.length < 2) return sendEmbed(message.channel, "You must have forgotten the user", "`!Unban <@tag | user Id> <?Reason>`")
                
        let id = args[1];
        client.guilds.resolve(serverInfo.guildId).members.unban(id);
        sql.query("Update Members set Banned = null where DiscordID = ?", [ id ]);

        sendEmbed(message.channel, "The user has been unbanned!")
    }
};
