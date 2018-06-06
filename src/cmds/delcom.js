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
            command    : "!delcom",
            description: "Deletes a command"
        }
    ],

    run: ({ client, serverInfo, message, args, sql, config, sendEmbed }) => {
        if (!message.member.isStaff) return;
        if (args.length < 2) return sendEmbed(message.channel, "You did not include the command")

        let command = args[1].startsWith('!') ? args[1].substring(1,0) : args[1];

        sql.query("Select * from Commands where Command = ?", [ command ], (err, res) => {
            if (err) return console.error(err);
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
            message.guild.channels.get(serverInfo.channels.aclog).send(embedlog);
        })
    }
}