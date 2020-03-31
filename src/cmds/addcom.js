/**
 * ! Add command command
 * 
 * ? Simply adds a custom command.
 */
const Discord = require('discord.js');

module.exports = {
    title: "AddCommand",
    details: [
        {
            perms      : "Staff",
            command    : "!addcom <command> <response>",
            description: "Adds a custom command to the list."
        }
    ],

    run: ({ client, serverInfo, message, args, sql, config, sendEmbed }) => {
        if (!message.member.isStaff) return;
        if (args.length < 3) return sendEmbed(message.channel, "You did not include the command & the response.")

        let command = args[1].startsWith('!') ? args[1].substring(1,0) : args[1];
        let response = "";
        for (i = 2; i < args.length; i++) {
            if (args[i] == "@everyone") {
                response += "`@everyone` ";
            } else if (args[i] == "@here") {
                response += "`@here` ";
            } else if (message.mentions.roles.cache.has(args[i].replace(/[^0-9]/g, ""))) {
                response +="**" + message.mentions.roles.get(args[i].replace(/[^0-9]/g, "")).name + "** ";
            } else if (message.mentions.users.has(args[i].replace(/[^0-9]/g, ""))) {
                response += "**" + message.mentions.users.get(args[i].replace(/[^0-9]/g, "")).tag + "** ";
            } else {
                response += args[i] + " ";
            }
        }

        sql.query("Select * from Commands where Command = ?", [ command ], (err, res) => {
            if (err) {
                let errorCode = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
                console.error(`Error code ${errorCode} by ${message.author.tag}`, err);
                return sendEmbed(message.author, "🚫 An error occurred. Please contact Pollie#0001. Error code: `" + errorCode + "`");
            }
            if (res.length !== 0) return sendEmbed(message.channel, `Command "${command}" already exist!`);

            sql.query("Insert into Commands(Command, Response) Values(?, ?)", [ command, response ]);
            sendEmbed(message.channel, "Custom command added!");

            const embedlog = new Discord.MessageEmbed()
              .setColor([255, 255, 0])
              .setAuthor("Custom Command Added", client.user.displayAvatarURL())
              .addField("Command", command)
              .addField("Response", response)
              .addField("Added by", `**${message.author.tag}** (${message.member})`)
              .setThumbnail(message.author.displayAvatarURL())
              .setTimestamp();
            message.guild.channels.resolve(serverInfo.channels.aclog).send(embedlog);
        })
    }
}