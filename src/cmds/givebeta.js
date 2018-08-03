/**
 * ! givebeta command
 * 
 * ? Kinda obvious, too lazy to write anything smart anyway
 * ? We also have command description for a reason. So I actually don't know why I added this here. Welp...
 */
const Discord = require('discord.js');

module.exports = {
     title: "givebeta",
     details: [
        {
            perms      : "Moderator",
            command    : "!givebeta <@tag>",
            description: "Give the beta role to @tag for 1 day"
        }
    ],

    run: ({ client, serverInfo, message, args, sql, config, sendEmbed }) => {

        if (!message.member.isModerator) return;
        if (args.length < 2) return sendEmbed(message.channel, "You must have forgotten the user", "`!givebeta <@tag | user Id>`")

        let user = message.mentions.users.first() ? message.mentions.users.first().id : args[1];
        message.guild.members.fetch(user).then(m => {
            require('../helpers/checkUser').run(sql, m.user, (err, user) => {
                if (err) {
                    let errorCode = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
                    console.error(`Error code ${errorCode} by ${message.author.tag}`, err);
                    return sendEmbed(message.author, "🚫 An error occurred. Please contact Pollie#0001. Error code: `" + errorCode + "`");
                }
                
                m.roles.add(serverInfo.roles.beta);
                let betaUntil = new Date().getTime() + 86400000;
                sql.query("Update Members set tempBeta = ? where DiscordID = ?", [ betaUntil, m.id ]);

                sendEmbed(message.channel, "Beta given to " + m.user.tag + " for one day.");

                const embedlog = new Discord.MessageEmbed()
                    .setColor([255, 255, 0])
                    .setAuthor("1 day beta", client.user.displayAvatarURL())
                    .addField("Given to", `${m} (${m.id})`)
                    .addField("By", `**${message.author.tag}** (${message.member})`)
                    .setThumbnail(message.author.displayAvatarURL())
                    .setTimestamp();
                message.guild.channels.get(serverInfo.channels.aclog).send(embedlog);

            });
        }).catch(e => {
            if (e.message == "Unknown Member")
                sendEmbed(message.channel, "User not found..")
            else
                console.log(e);
        })
    }
};
