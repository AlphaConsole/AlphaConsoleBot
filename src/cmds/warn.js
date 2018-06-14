/**
 * ! Warn command
 * 
 * ? Kinda obvious, too lazy to write anything smart anyway
 * ? We also have command description for a reason. So I actually don't know why I added this here. Welp...
 */
const Discord = require('discord.js');

module.exports = {
     title: "Warn",
     details: [
        {
            perms      : "Support",
            command    : "!Warn <@tag | user Id> <?Reason>",
            description: "Adds a warning to the user and in case it’s the second warning or higher he gets muted"
        }
    ],

    run: ({ client, serverInfo, message, args, sql, config, sendEmbed }) => {

        if (!message.member.isSupport) return;
        if (args.length < 2) return sendEmbed(message.channel, "You must have forgotten the user", "`!Warn <@tag | user Id> <?Reason>`")

        let user = message.mentions.users.first() ? message.mentions.users.first().id : args[1];
        message.guild.members.fetch(user).then(m => {
            require('../helpers/checkUser').run(config.sql, m.user, (err, user) => {

                let newWarnings = parseInt(user.Warnings + 1);
                sendEmbed(message.channel, `${m.user.tag} has been warned.`)

                let reason = "";
                for (i = 2; i < args.length; i++) reason += args[i] + " ";
                if (reason === "") reason = "No reason provided";

                config.sql.query("Insert Into Logs(Action, Member, Moderator, Reason, Time, ChannelID) values(?, ?, ?, ?, ?, ?)",
                [ 'warn', m.id, message.author.id, reason, new Date().getTime(), message.channel.id ], (err, res) => {
                    if (err) return console.error(err);

                    let caseId = res.insertId;

                    //* Warning user in DM
                    let warningMsg = "You have received another warning! You'll now be muted, and the staff will look into your behaviour for further actions."
                    if (newWarnings === 1) warningMsg = "You have received a warning. Next warning will result in a temporary mute!";
                    if (newWarnings === 2) warningMsg = "You have received a second warning! You'll now be muted for 15 minutes, you are warned!";
                    sendEmbed(m.user, "Warning received.", warningMsg);

                    //* Logging
                    const embedLog = new Discord.MessageEmbed()
                        .setColor([255, 255, 0])
                        .setAuthor(`Case ${caseId} | Warn`, client.user.displayAvatarURL({ format: "png" }))
                        .setTitle("==> WARNING " + newWarnings)
                        .setDescription(`New warning of <@${m.id}> (${m.id}) by <@${message.author.id}>`)
                        .addField("Reason", reason);
                    message.guild.channels.get(serverInfo.channels.modlog).send(embedLog).then(msg => {
                        config.sql.query(`update Logs set MessageID = ? where ID = ?`, [ msg.id, caseId ]);
                    });

                    //* If he has 2 or more warnings he'll get muted.
                    if (newWarnings === 2) {
                        m.addRole(serverInfo.roles.muted);

                        let timeextra = new Date().getTime() + 1000 * 60 * 15;
                        config.sql.query("Update Members set Warnings = ?, MutedUntil = ? where DiscordID = ?", [ newWarnings, timeextra, m.id ]);

                    } if (newWarnings > 2) {
                        m.addRole(serverInfo.roles.muted);

                        config.sql.query("Update Members set Warnings = ?, MutedUntil = null where DiscordID = ?", [ newWarnings, m.id ]);

                    } else {
                        config.sql.query("Update Members set Warnings = ? where DiscordID = ?", [ newWarnings, m.id ]);
                    }
                })


            });
        }).catch(e => {
            console.log(e);
            sendEmbed(message.channel, "User not found..")
        })
    }
};