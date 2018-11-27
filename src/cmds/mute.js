/**
 * ! Mute command
 * 
 * ? Kinda obvious, too lazy to write anything smart anyway
 * ? We also have command description for a reason. So I actually don't know why I added this here. Welp...
 */
const Discord = require('discord.js');

module.exports = {
     title: "Mute",
     details: [
        {
            perms      : "Support",
            command    : "!Mute <@tag | user Id> <Length[TimeUnit(d,h,m,s) - default: h]> <?Reason>",
            description: "Mutes the person for the given amount of times. If time is 0 then the person is permanently muted"
        }
    ],

    run: ({ client, serverInfo, message, args, sql, config, sendEmbed }) => {

        if (!message.member.isSupport) return;
        if (args.length < 3) return sendEmbed(message.channel, "You must have forgotten the user or the time", "`!Mute <@tag> <Length[TimeUnit(d,h,m,s) - default: h]> <?Reason>`")

        let user = message.mentions.users.first() ? message.mentions.users.first().id : args[1];
        client.guilds.get(serverInfo.guildId).members.fetch(user).then(m => {
            
            let timeArg = args[2].toLowerCase();
            let originalTime = args[2].toLowerCase();
            let timeunitDisplay = "hours";

            if (timeArg.includes("d")) {
                timeArg = timeArg.replace("d", "");
                timeunitDisplay = "days";
            } else if (timeArg.includes("h")) {
                timeArg = timeArg.replace("h", "");
                timeunitDisplay = "hours";
            } else if (timeArg.includes("m")) {
                timeArg = timeArg.replace("m", "");
                timeunitDisplay = "minutes";
            } else if (timeArg.includes("s")) {
                timeArg = timeArg.replace("s", "");
                timeunitDisplay = "seconds";
            }

            if (timeArg == "") 
                return sendEmbed(message.channel, "You did not specify a length of time. Please use 0 for permanent mute");

            if (!isNumber(timeArg))
                return sendEmbed(message.channel, `${timeArg} is not a valid number. Please use 0 for permanent mute`);

            originalTime = timeArg;
            switch (timeunitDisplay) {
                case "days":
                    timeArg = timeArg * 86400000; // 86400000 milliseconds in 1 day
                    break;
      
                case "hours":
                    timeArg = timeArg * 3600000; // 3600000 milliseconds in 1 hour
                    break;
      
                case "minutes":
                    timeArg = timeArg * 60000; // 60000 milliseconds in 1 minute
                    break;
      
                case "seconds":
                    timeArg = timeArg * 1000; // 1000 milliseconds in 1 second
                    break;
      
                default:
                    break;
            }

            //* Check if there is a reason
            let reason = "";
            for (i = 3; i < args.length; i++) reason += args[i] + " ";
            if (reason === "") reason = "No reason provided";

            require('../helpers/checkUser').run(sql, m.user, async (err, user) => {
                if (err) {
                    let errorCode = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
                    console.error(`Error code ${errorCode} by ${message.author.tag}`, err);
                    return sendEmbed(message.author, "🚫 An error occurred. Please contact Pollie#0001. Error code: `" + errorCode + "`");
                }

                await m.roles.add(serverInfo.roles.muted)

                m.send(timeArg == 0 ?
                    `**<@${message.author.id}>** has **permanently** muted you.\n\n__For the following reason:__\n${reason}\n\nFor more information, please read the <#448536110537244672> channel in the server.`
                    :
                    `**<@${message.author.id}>** has muted you for **${originalTime} ${timeunitDisplay}**.\n\n__For the following reason:__\n${reason}\n\nFor more information, please read the <#448536110537244672> channel in the server.`
                );

                //* Let's save his time muted in the database
                let MutedUntil = timeArg == 0 ? null : new Date().getTime() + timeArg;
                sql.query("Update Members set MutedUntil = ? where DiscordID = ?", [ MutedUntil, m.id ]);

                //* Let's save it in the logs asswel for future reference
                sql.query("Insert into `Logs`(Action, Member, Moderator, value, Reason, Time, ChannelID) values(?, ?, ?, ?, ?, ?, ?)", 
                [ 'mute', m.id, message.author.id, timeArg, reason, new Date().getTime(), message.channel.id ], (err, res) => {
                    if (err) {
                        let errorCode = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
                        console.error(`Error code ${errorCode} by ${message.author.tag}`, err);
                        return sendEmbed(message.author, "🚫 An error occurred. Please contact Pollie#0001. Error code: `" + errorCode + "`");
                    }

                    let caseId = res.insertId;
                    sendEmbed(message.channel, timeArg == 0 ?
                        `${m.user.tag} has been permanently muted. Case number: ${caseId}`
                        :
                        `${m.user.tag} has been muted for ${originalTime} ${timeunitDisplay}. Case number: ${caseId}`
                    );

                    //* And add it to the logs :)
                    const embedlog = new Discord.MessageEmbed()
                        .setColor([255, 255, 0])
                        .setAuthor(`Case ${caseId} | User Mute`, client.user.displayAvatarURL({ format: "png" }))
                        .setDescription(timeArg == 0 ?
                            `${m} (${m.id}) has been permanently muted by ${message.member}`
                            :
                            `${m} (${m.id}) has been muted for ${originalTime} ${timeunitDisplay} by ${message.member}`
                        )
                        .setTimestamp()
                        .addField("Reason", reason);
                        client.guilds.get(serverInfo.guildId).channels
                        .get(serverInfo.channels.modlog)
                        .send(embedlog).then(msg => {
                            sql.query(`update \`Logs\` set MessageID = ? where ID = ?`, [ msg.id, caseId ]);
                        });

                    //* Wait 2 seconds to confirm he has the role yet. Then send the same message in muted-reasons
                    setTimeout(() => {
                        client.guilds.get(serverInfo.guildId).channels
                            .get(serverInfo.channels.muted)
                            .send(embedlog)
                    }, 2000);
                })


            })


        }).catch(e => {
            if (e.message == "Unknown Member")
                sendEmbed(message.channel, "User not found..")
            else
                console.log(e);
        })

    }
};

//Simple function to check if they are numbers
function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }