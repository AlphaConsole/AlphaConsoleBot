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

        if (!message.member.isModerator) return;
        if (args.length < 2) return sendEmbed(message.channel, "You must have forgotten the user", "`!Unban <@tag | user Id> <?Reason>`")
                
        let id = args[1];
        message.guild.unban(id);
        sql.query("Update Members set Banned = null where DiscordID = ?", [ id ]);

        sendEmbed(message.channel, "The user has been unbanned!")
    }
};

function isStaff(m, serverInfo) {
    if (m.roles.has(serverInfo.roles.staff)) return true;
    if (m.roles.has(serverInfo.roles.support)) return true;
    if (m.roles.has(serverInfo.roles.moderator)) return true;
    if (m.roles.has(serverInfo.roles.admin)) return true;
    return false;
}