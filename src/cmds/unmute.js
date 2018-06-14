/**
 * ! Mute command
 * 
 * ? Kinda obvious, too lazy to write anything smart anyway
 * ? We also have command description for a reason. So I actually don't know why I added this here. Welp...
 */
const Discord = require('discord.js');

module.exports = {
     title: "Unmute",
     details: [
        {
            perms      : "Support",
            command    : "!Unmute <@tag | user Id>",
            description: "Unmutes an user"
        }
    ],

    run: ({ client, serverInfo, message, args, sql, config, sendEmbed }) => {

        if (!message.member.isSupport) return;
        if (args.length < 2) return sendEmbed(message.channel, "You must have forgotten the user", "`!Unmute <@tag | user Id>`")

        let user = message.mentions.users.first() ? message.mentions.users.first().id : args[1];
        message.guild.members.fetch(user).then(m => {

            if (!m.roles.has(serverInfo.roles.muted))
                return sendEmbed(message.channel, "Cannot unmute a user that isn't muted.");

            m.removeRole(serverInfo.roles.muted);
            sendEmbed(message.channel, `${m.user.tag} has been unmuted!`);

            require('../helpers/checkUser').run(sql, m.user, (err, user) => {
                sql.query("Update Members set MutedUntil = null where DiscordID = ?", [ m.id ]);
            });

            const embedlog = new Discord.MessageEmbed()
                .setColor([255, 255, 0])
                .setAuthor("No case created | User Unmuted", client.user.displayAvatarURL({ format: "png" }))
                .setDescription(`${m} (${m.id}) has been unmuted by ${message.member}`)
                .setTimestamp();
            message.guild.channels.get(serverInfo.channels.modlog).send(embedlog);

        }).catch(e => {
            console.log(e);
            sendEmbed(message.channel, "User not found..")
        })
    }
};