/**
 * ! Spam Protection
 * 
 * ? Every message gets checked and added to a list to detect spam.
 * ? In case the users spams we'll take action :)
 */
const Discord = require('discord.js');
let authors = {};
let warned = [];
let mutes = {};

module.exports.run = ({ client, serverInfo, message, args, sql, config, sendEmbed }) => {
    
    // Set options
    const warnBuffer = 5;
    const maxBuffer = 7;
    const interval = 2000;
    const reason = "Spamming when already been warned.";
    
    if (!authors[message.author.id]) authors[message.author.id] = [];
    let now = new Date().getTime();
    authors[message.author.id].push({
        date: now,
        message: message
    })
    
    let messagesInInterval = authors[message.author.id].filter(r => r.date > now - interval).length;
    if (messagesInInterval >= warnBuffer && !warned.includes(message.author.id)) {
        if (!mutes[message.author.id] || (mutes[message.author.id] && mutes[message.author.id] < new Date().getTime())) {
            //* User has been spamming for the first time. Warn him and add it to the warned list
            message.author.send("Alright buddy... Keep it calm, reduce the spam or you'll be muted.");
            sendEmbed(message.channel, `${message.author.tag} has been warned.`)
            warned.push(message.author.id);
        }

    } else if (messagesInInterval >= maxBuffer || (messagesInInterval >= warnBuffer && warned.includes(message.author.id))) {
        //* User kept spamming OR has been spamming again. User will be muted for an hour.
        
        if (!mutes[message.author.id] || (mutes[message.author.id] && mutes[message.author.id] < new Date().getTime())) {
            mutes[message.author.id] = new Date().getTime() + 3000;
            sendEmbed(message.channel, `${message.author.tag} has been muted for an hour.`);
            warned.splice(warned.indexOf(message.author.id), 1);

            message.guild.members.fetch(message.author.id).then(m => {
                require('../helpers/checkUser').run(sql, m.user, (err, user) => {
                    m.addRole(serverInfo.roles.muted);
                    m.send(`The bot has muted you for 1 hour.\n\n__For the following reason:__\n${reason}\n\nFor more information, please read the <#448536110537244672> channel in the server.`);

                    let MutedUntil = new Date().getTime() + 3600000;
                    sql.query("Update Members set MutedUntil = ? where DiscordID = ?", [ MutedUntil, m.id ]);

                    sql.query("Insert into `Logs`(Action, Member, Moderator, value, Reason, Time, ChannelID) values(?, ?, ?, ?, ?, ?, ?)", 
                    [ 'mute', m.id, "bot", 3600000, reason, new Date().getTime(), message.channel.id ], (err, res) => {
                        if (err) return console.error(err);

                        let caseId = res.insertId;
                        //* Add it to the logs :)
                        const embedlog = new Discord.MessageEmbed()
                            .setColor([255, 255, 0])
                            .setAuthor(`Case ${caseId} | User Mute`, client.user.displayAvatarURL({ format: "png" }))
                            .setDescription(`${m} (${m.id}) has been muted for 1 hour by the bot`)
                            .setTimestamp()
                            .addField("reason", reason);
                        message.guild.channels
                            .get(serverInfo.channels.modlog)
                            .send(embedlog).then(msg => {
                                sql.query(`update \`Logs\` set MessageID = ? where ID = ?`, [ msg.id, caseId ]);
                            });

                        //* Wait 2 seconds to confirm he has the role yet. Then send the same message in muted-reasons
                        setTimeout(() => {
                            message.guild.channels
                                .get(serverInfo.channels.muted)
                                .send(embedlog)
                        }, 2000);
                    })
                });
            });
        }
    }
}