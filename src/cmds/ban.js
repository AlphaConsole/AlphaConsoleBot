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

        let reason = "";
        for (i = 2; i < args.length; i++) reason += args[i] + " ";
        if (reason === "") reason = "No reason provided";
                
        let user = message.mentions.users.first() ? message.mentions.users.first().id : args[1];
        client.guilds.get(serverInfo.guildId).members.fetch(user).then(m => {
            require('../helpers/checkUser').run(sql, m.user, (err, user) => {
                if (err) {
                    let errorCode = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
                    console.error(`Error code ${errorCode} by ${message.author.tag}`, err);
                    return sendEmbed(message.author, "🚫 An error occurred. Please contact Pollie#0001. Error code: `" + errorCode + "`");
                }
                
                if (isStaff(m, serverInfo)) 
                    return sendEmbed(message.channel, "You cannot ban a staff member.");

                m.ban({ reason: reason });

                sql.query("Insert into `Logs`(Action, Member, Moderator, Reason, Time, ChannelID) values(?, ?, ?, ?, ?, ?)", 
                [ 'ban', m.id, message.author.id, reason, new Date().getTime(), message.channel.id ], (err, res) => {
                    if (err) {
                        let errorCode = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
                        console.error(`Error code ${errorCode} by ${message.author.tag}`, err);
                        return sendEmbed(message.author, "🚫 An error occurred. Please contact Pollie#0001. Error code: `" + errorCode + "`");
                    }

                    let caseId = res.insertId;
                    sendEmbed(message.channel, `${m.user.tag} has been banned from the server. Case number: ${caseId}`);
                    message.delete()

                    const embedlog = new Discord.MessageEmbed()
                        .setColor([255, 255, 0])
                        .setAuthor(`Case ${caseId} | User ban`, client.user.displayAvatarURL({ format: "png" }))
                        .setDescription(`**${m.user.tag}** (${ m.id }) has been banned by ${message.member}`)
                        .setTimestamp()
                        .addField("Reason", reason);
                    client.guilds.get(serverInfo.guildId).channels.get(serverInfo.channels.modlog).send(embedlog).then(msg => {
                        sql.query(`update Logs set MessageID = ? where ID = ?`, [ msg.id, caseId ]);
                    });

                });

            });
        }).catch(e => {
            if (e.message == "Unknown Member") {
                sql.query("Select * from Members where DiscordID = ?", [ user ], (err, res) => {
                    let dbUser = res[0];
                    if (dbUser) {
                        sql.query("Update Members set Banned = 1 where DiscordID = ?", [ user ]);

                        sql.query("Insert into `Logs`(Action, Member, Moderator, Reason, Time, ChannelID) values(?, ?, ?, ?, ?, ?)", 
                        [ 'ban', user, message.author.id, reason, new Date().getTime(), message.channel.id ], (err, res) => {
                            if (err) {
                                let errorCode = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
                                console.error(`Error code ${errorCode} by ${message.author.tag}`, err);
                                return sendEmbed(message.author, "🚫 An error occurred. Please contact Pollie#0001. Error code: `" + errorCode + "`");
                            }

                            let caseId = res.insertId;
                            sendEmbed(message.channel, `Ban on rejoin. Case number: ${caseId}`, "I could not find the user in this server but I did find the user in the database.\nOn his next rejoin he'll automatically be banned.");

                            const embedlog = new Discord.MessageEmbed()
                                .setColor([255, 255, 0])
                                .setAuthor(`Case ${caseId} | User ban`, client.user.displayAvatarURL({ format: "png" }))
                                .setDescription(`**${dbUser.Username}** (${ user }) has been banned by ${message.member}`)
                                .setTimestamp()
                                .addField("Reason", reason);
                            client.guilds.get(serverInfo.guildId).channels.get(serverInfo.channels.modlog).send(embedlog).then(msg => {
                                sql.query(`update Logs set MessageID = ? where ID = ?`, [ msg.id, caseId ]);
                            });

                        });
                    }
                })
            }
            else
                console.log(e);
        })
    }
};

function isStaff(m, serverInfo) {
    if (m.roles.has(serverInfo.roles.staff)) return true;
    if (m.roles.has(serverInfo.roles.support)) return true;
    if (m.roles.has(serverInfo.roles.seniorS)) return true;
    if (m.roles.has(serverInfo.roles.moderator)) return true;
    if (m.roles.has(serverInfo.roles.admin)) return true;
    return false;
}
