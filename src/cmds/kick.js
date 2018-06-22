/**
 * ! Kick command
 * 
 * ? Kinda obvious, too lazy to write anything smart anyway
 * ? We also have command description for a reason. So I actually don't know why I added this here. Welp...
 */
const Discord = require('discord.js');

module.exports = {
     title: "Kick",
     details: [
        {
            perms      : "Moderator",
            command    : "!Kick <@tag> <?Reason>",
            description: "Kicks the person with the given reason"
        }
    ],

    run: ({ client, serverInfo, message, args, sql, config, sendEmbed }) => {

        if (!message.member.isModerator) return;
        if (args.length < 2) return sendEmbed(message.channel, "You must have forgotten the user", "`!Kick <@tag | user Id> <?Reason>`")

        let user = message.mentions.users.first() ? message.mentions.users.first().id : args[1];
        message.guild.members.fetch(user).then(m => {
            require('../helpers/checkUser').run(sql, m.user, (err, user) => {
                
                if (isStaff(m, serverInfo)) 
                    return sendEmbed(message.channel, "You cannot kick a staff member.");

                let reason = "";
                for (i = 2; i < args.length; i++) reason += args[i] + " ";
                if (reason === "") reason = "No reason provided";

                m.kick(reason);

                sql.query("Insert into `Logs`(Action, Member, Moderator, Reason, Time, ChannelID) values(?, ?, ?, ?, ?, ?)", 
                [ 'kick', m.id, message.author.id, reason, new Date().getTime(), message.channel.id ], (err, res) => {
                    if (err) return console.error(err);

                    let caseId = res.insertId;
                    sendEmbed(message.channel, `${m.user.tag} has been kicked from the server. Case number: ${caseId}`);

                    const embedlog = new Discord.MessageEmbed()
                        .setColor([255, 255, 0])
                        .setAuthor(`Case ${caseId} | User Kick`, client.user.displayAvatarURL({ format: "png" }))
                        .setDescription(`**${m.user.tag}** (${ m.id }) has been kicked by ${message.member}`)
                        .setTimestamp()
                        .addField("Reason", reason);
                    message.guild.channels.get(serverInfo.channels.modlog).send(embedlog).then(msg => {
                        sql.query(`update Logs set MessageID = ? where ID = ?`, [ msg.id, caseId ]);
                    });

                });

            });
        }).catch(e => {
            if (e.message == "Unknown Member")
                sendEmbed(message.channel, "User not found..")
            else
                console.log(e);
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