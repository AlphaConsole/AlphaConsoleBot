const Discord = require('discord.js');

module.exports = {
    title: "Spam Check",
    description: "Checks for spam",
    
    run: async(client, serverInfo, message, authors, messagelog, warned, banned, sql) => {
        const warnBuffer = 3;
        const maxBuffer = 5;
        const interval = 1000;
        const maxDuplicatesWarning = 4;
        const maxDuplicatesBan = 10;


        // Anti-Spam
        var now = Math.floor(Date.now());
        authors.push({
        "time": now,
        "author": message.author.id
        });
        messagelog.push({
        "message": message.content,
        "author": message.author.id
        });

        // Check how many times the same message has been sent.
        var messageMatch = 0;
        for (var i = 0; i < messagelog.length; i++) {
            if (messagelog[i].message == message.content && (messagelog[i].author == message.author.id) && (message.author.id !== client.user.id)) {
                messageMatch++;
            }
        }

        // Check matched count
        if (messageMatch == maxDuplicatesWarning && !warned.includes(message.author.id)) {
          message.reply('warned');
          message.member.addRole(message.guild.roles.find('name', 'Muted'));

          //Let's first check if the user even exists in the db
          await sql.get(`select * from Members where DiscordID = '${message.author.id}'`).then(row => {
            if (!row) {
                var today = new Date().getTime();
                sql.run(`Insert into Members(DiscordID, Username, JoinedDate)VALUES('${message.author.id}', '${mysql_real_escape_string(message.author.username)}', '${today}')`)
                    .then(() => {
                        //Calculate the extra hours to be added
                        MutedUntil = new Date().getTime() + 1 * 3600000; //args is the amount of hours. 3600000 transfers it to ms

                        //Update Database with the newest time of when to be muted to
                        sql.run(`Update Members set MutedUntil = ${MutedUntil} where DiscordID = '${message.author.id}'`)
                            .catch(err => console.log(err));
                    })
                    .catch(err => console.log(err));
            } else {
                //Calculate the extra hours to be added
                MutedUntil = new Date().getTime() + 1 * 3600000; //args is the amount of hours. 3600000 transfers it to ms

                //Update Database with the newest time of when to be muted to
                sql.run(`Update Members set MutedUntil = ${MutedUntil} where DiscordID = '${message.author.id}'`)
                    .catch(err => console.log(err));

            }
          }).catch(err => console.log(err))

          await sql.run(`Insert into logs(Action, Member, Moderator, value, Reason, Time, ChannelID) VALUES('mute', '${message.author.id}', '${client.user.id}', '1','Automated mute by spam protection', '${new Date().getTime()}', '${message.channel.id}')`)
          .then(() => {
              var CaseID = "Error";
              sql.get(`select * from logs where Member = '${message.author.id}' order by ID desc`).then(roww => {
                  if (roww) CaseID = roww.ID

                  const embedlog = new Discord.MessageEmbed()
                  .setColor([255,255,0])
                  .setAuthor(`Case ${CaseID} | User Mute`, serverInfo.logo)
                  .setDescription(`${message.member} (${message.author.id}) has been muted for 1 hour by the bot (Spam Protection)`)
                  .setTimestamp()
                  .addField("Reason", roww.Reason)
                  message.guild.channels.get(serverInfo.modlogChannel).send(embedlog).then(msg => {
                      sql.run(`update logs set MessageID = '${msg.id}' where ID = '${CaseID}'`)
                  })
              });
          })
          .catch(err => console.log(err));
        }
        if (messageMatch == maxDuplicatesBan && !banned.includes(message.author.id)) {
          message.reply('banned');
          message.member.addRole(message.guild.roles.find('name', 'Muted'));

          await sql.run(`Insert into logs(Action, Member, Moderator, value, Reason, Time, ChannelID) VALUES('mute', '${message.author.id}', '${client.user.id}', '0','Automated mute by spam protection', '${new Date().getTime()}', '${message.channel.id}')`)
          .then(() => {
              var CaseID = "Error";
              sql.get(`select * from logs where Member = '${message.author.id}' order by ID desc`).then(roww => {
                  if (roww) CaseID = roww.ID

                  const embedlog = new Discord.MessageEmbed()
                  .setColor([255,255,0])
                  .setAuthor(`Case ${CaseID} | User Mute`, serverInfo.logo)
                  .setDescription(`${message.member} (${message.author.id}) has been permanent muted by the bot (Spam Protection)`)
                  .setTimestamp()
                  .addField("Reason", roww.Reason)
                  message.guild.channels.get(serverInfo.modlogChannel).send(embedlog).then(msg => {
                      sql.run(`update logs set MessageID = '${msg.id}' where ID = '${CaseID}'`)
                  })
              });
          })
          .catch(err => console.log(err));
        }

        matched = 0;

        for (var i = 0; i < authors.length; i++) {
          if (authors[i].time > now - interval) {
            matched++;
            if (matched == warnBuffer && !warned.includes(message.author.id)) {
                message.reply('warned');
                message.member.addRole(message.guild.roles.find('name', 'Muted'));

                //Let's first check if the user even exists in the db
                await sql.get(`select * from Members where DiscordID = '${message.author.id}'`).then(row => {
                  if (!row) {
                      var today = new Date().getTime();
                      sql.run(`Insert into Members(DiscordID, Username, JoinedDate)VALUES('${message.author.id}', '${mysql_real_escape_string(message.author.username)}', '${today}')`)
                          .then(() => {
                              //Calculate the extra hours to be added
                              MutedUntil = new Date().getTime() + 1 * 3600000; //args is the amount of hours. 3600000 transfers it to ms

                              //Update Database with the newest time of when to be muted to
                              sql.run(`Update Members set MutedUntil = ${MutedUntil} where DiscordID = '${message.author.id}'`)
                                  .catch(err => console.log(err));
                          })
                          .catch(err => console.log(err));
                  } else {
                      //Calculate the extra hours to be added
                      MutedUntil = new Date().getTime() + 1 * 3600000; //args is the amount of hours. 3600000 transfers it to ms

                      //Update Database with the newest time of when to be muted to
                      sql.run(`Update Members set MutedUntil = ${MutedUntil} where DiscordID = '${message.author.id}'`)
                          .catch(err => console.log(err));

                  }
                }).catch(err => console.log(err))

                await sql.run(`Insert into logs(Action, Member, Moderator, value, Reason, Time, ChannelID) VALUES('mute', '${message.author.id}', '${client.user.id}', '1','Automated mute by spam protection', '${new Date().getTime()}', '${message.channel.id}')`)
                .then(() => {
                    var CaseID = "Error";
                    sql.get(`select * from logs where Member = '${message.author.id}' order by ID desc`).then(roww => {
                        if (roww) CaseID = roww.ID

                        const embedlog = new Discord.MessageEmbed()
                        .setColor([255,255,0])
                        .setAuthor(`Case ${CaseID} | User Mute`, serverInfo.logo)
                        .setDescription(`${message.member} (${message.author.id}) has been muted for 1 hour by the bot (Spam Protection)`)
                        .setTimestamp()
                        .addField("Reason", roww.Reason)
                        message.guild.channels.get(serverInfo.modlogChannel).send(embedlog).then(msg => {
                            sql.run(`update logs set MessageID = '${msg.id}' where ID = '${CaseID}'`)
                        })
                    });
                })
                .catch(err => console.log(err));
            }
            else if (matched == maxBuffer) {
              if (!banned.includes(message.author.id)) {
                message.reply('banned');
                message.member.addRole(message.guild.roles.find('name', 'Muted'));

                await sql.run(`Insert into logs(Action, Member, Moderator, value, Reason, Time, ChannelID) VALUES('mute', '${message.author.id}', '${client.user.id}', '0','Automated mute by spam protection', '${new Date().getTime()}', '${message.channel.id}')`)
                .then(() => {
                    var CaseID = "Error";
                    sql.get(`select * from logs where Member = '${message.author.id}' order by ID desc`).then(roww => {
                        if (roww) CaseID = roww.ID

                        const embedlog = new Discord.MessageEmbed()
                        .setColor([255,255,0])
                        .setAuthor(`Case ${CaseID} | User Mute`, serverInfo.logo)
                        .setDescription(`${message.member} (${message.author.id}) has been permanent muted by the bot (Spam Protection)`)
                        .setTimestamp()
                        .addField("Reason", roww.Reason)
                        message.guild.channels.get(serverInfo.modlogChannel).send(embedlog).then(msg => {
                            sql.run(`update logs set MessageID = '${msg.id}' where ID = '${CaseID}'`)
                        })
                    });
                })
                .catch(err => console.log(err));
              }
            }
          }
          else if (authors[i].time < now - interval) {
            authors.splice(i);
            warned.splice(warned.indexOf(authors[i]));
            banned.splice(warned.indexOf(authors[i]));
          }
          if (messagelog.length >= 200) {
            messagelog.shift();
          }
        }

    }
};

