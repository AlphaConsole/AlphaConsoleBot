/**
 * ! Ban command
 * 
 * ? Kinda obvious, too lazy to write anything smart anyway
 * ? We also have command description for a reason. So I actually don't know why I added this here. Welp...
 */
const Discord = require('discord.js');

module.exports = {
     title: "Ban",
     details: [
        {
            perms      : "Moderator",
            command    : "!ban <@tag> <?Reason>",
            description: "Bans the person with the given reason"
        }
    ],

    run: ({ client, serverInfo, message, args, sql, config, sendEmbed }) => {

        if (!message.member.isModerator) return;
        if (args.length < 2) return sendEmbed(message.channel, "You must have forgotten the user", "`!Ban <@tag | user Id> <?Reason>`")

        let user = message.mentions.users.first() ? message.mentions.users.first().id : args[1];
        message.guild.members.fetch(user).then(m => {
            require('../helpers/checkUser').run(config.sql, m.user, (err, user) => {
                
                if (isStaff(m, serverInfo)) 
                    return sendEmbed(message.channel, "You cannot ban a staff member.");

                let reason = "";
                for (i = 2; i < args.length; i++) reason += args[i] + " ";
                if (reason === "") reason = "No reason provided";

                m.ban({ reason: reason });

                config.sql.query("Insert into `Logs`(Action, Member, Moderator, Reason, Time, ChannelID) values(?, ?, ?, ?, ?, ?)", 
                [ 'ban', m.id, message.author.id, reason, new Date().getTime(), message.channel.id ], (err, res) => {
                    if (err) return console.error(err);

                    let caseId = res.insertId;
                    sendEmbed(message.channel, `${m.user.tag} has been banned from the server. Case number: ${caseId}`);

                    const embedlog = new Discord.MessageEmbed()
                        .setColor([255, 255, 0])
                        .setAuthor(`Case ${caseId} | User ban`, client.user.displayAvatarURL({ format: "png" }))
                        .setDescription(`**${m.user.tag}** (${ m.id }) has been banned by ${message.member}`)
                        .setTimestamp()
                        .addField("Reason", reason);
                    message.guild.channels.get(serverInfo.channels.modlog).send(embedlog).then(msg => {
                        config.sql.query(`update Logs set MessageID = ? where ID = ?`, [ msg.id, caseId ]);
                    });

                });

            });
        }).catch(e => {
            console.log(e);
            sendEmbed(message.channel, "User not found..")
        })
    }
};

function isStaff(m, serverInfo) {
    if (m.roles.has(serverInfo.roles.staff)) return true;
    if (m.roles.has(serverInfo.roles.support)) return true;
    if (m.roles.has(serverInfo.roles.moderator)) return true;
    if (m.roles.has(serverInfo.roles.admin)) return true;
    if (m.roles.has(serverInfo.roles.developer)) return true;
    return false;
}