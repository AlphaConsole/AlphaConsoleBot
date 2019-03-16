/**
 * ! Check command
 * 
 * ? Kinda obvious, too lazy to write anything smart anyway
 * ? We also have command description for a reason. So I actually don't know why I added this here. Welp...
 */
const Discord = require('discord.js');

module.exports = {
     title: "Check",
     details: [
        {
            perms      : "Support",
            command    : "!Check <@tag | user Id>",
            description: "Checks all warns, mutes etc... from the user."
        }
    ],

    run: ({ client, serverInfo, message, args, sql, config, sendEmbed }) => {

        if (!message.member.isSupport) return;
        if (args.length < 2) return sendEmbed(message.channel, "You must have forgotten the user", "`!Check <@tag | user Id>`")

        let user = message.mentions.users.first() ? message.mentions.users.first().id : args[1];
        sql.query("Select * from Logs where Member = ? order by Time desc", [ user ], (err, res) => {
            if (err) {
                let errorCode = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
                console.error(`Error code ${errorCode} by ${message.author.tag}`, err);
                return sendEmbed(message.author, "🚫 An error occurred. Please contact Pollie#0001. Error code: `" + errorCode + "`");
            }

            let mutes = res.filter(c => c.Action === "mute");
            let warns = res.filter(c => c.Action === "warn");
            let kicks = res.filter(c => c.Action === "kick");
            let bans = res.filter(c => c.Action === "ban");
            
            const embed = new Discord.MessageEmbed()
                .setAuthor("Cases check", client.user.displayAvatarURL({ format: "png" }))
                .setColor([255, 255, 0])
                .setThumbnail("http://www.pngmart.com/files/5/Snow-PNG-Transparent-Image.png")
                .addField(`Mutes (${mutes.size})`, mutes.map(c => `\`${c.ID}.\` ${c.Reason}`).join("\n") === "" ? "Nothing found" : mutes.map(c => `\`${c.ID}.\` ${c.Reason}`).join("\n").substring(0, 245), true)
                .addField(`Warnings (${warns.size})`, warns.map(c => `\`${c.ID}.\` ${c.Reason}`).join("\n") === "" ? "Nothing found" : warns.map(c => `\`${c.ID}.\` ${c.Reason}`).join("\n").substring(0, 245), true)
                .addField(`Kicks (${kicks.size})`, kicks.map(c => `\`${c.ID}.\` ${c.Reason}`).join("\n") === "" ? "Nothing found" : kicks.map(c => `\`${c.ID}.\` ${c.Reason}`).join("\n").substring(0, 245), true)
                .addField(`Bans (${bans.size})`, bans.map(c => `\`${c.ID}.\` ${c.Reason}`).join("\n") === "" ? "Nothing found" : bans.map(c => `\`${c.ID}.\` ${c.Reason}`).join("\n").substring(0, 245), true)
            message.channel.send(embed);
        })

    }
};
