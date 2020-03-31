/**
 * ! Delete command command
 * 
 * ? Simply deletes a custom command.
 */
const Discord = require('discord.js');

module.exports = {
    title: "DeleteCommand",
    details: [
        {
            perms      : "Staff",
            command    : "!delcom <command>",
            description: "Deletes a command"
        }
    ],

    run: ({ client, serverInfo, message, args, sql, config, sendEmbed }) => {
        if (!message.member.isStaff) return;
        if (args.length < 2) return sendEmbed(message.channel, "You did not include the command")

        let command = args[1].startsWith('!') ? args[1].substring(1,0) : args[1];

        sql.query("Select * from Commands where Command = ?", [ command ], (err, res) => {
            if (err) {
                let errorCode = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
                console.error(`Error code ${errorCode} by ${message.author.tag}`, err);
                return sendEmbed(message.author, "🚫 An error occurred. Please contact Pollie#0001. Error code: `" + errorCode + "`");
            }
            if (res.length === 0) return sendEmbed(message.channel, `Command "${command}" not found!`);

            sql.query("delete from Commands where Command = ?", [ command ]);
            sendEmbed(message.channel, "Custom command deleted!");

            const embedlog = new Discord.MessageEmbed()
              .setColor([255, 255, 0])
              .setAuthor("Custom Command Deleted", client.user.displayAvatarURL())
              .addField("Command", command)
              .addField("Deleted by", `**${message.author.tag}** (${message.member})`)
              .setThumbnail(message.author.displayAvatarURL())
              .setTimestamp();
            message.guild.channels.resolve(serverInfo.channels.aclog).send(embedlog);
        })
    }
}