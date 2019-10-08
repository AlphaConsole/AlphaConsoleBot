/**
 * ! Auto Response functionality
 * 
 * ? For faster support we set up a couple of words that needs to be triggered for the bot to answer
 * ? This often includes FAQ questions and does help a lot of the time
 */
const Discord = require("discord.js");

module.exports = {
    title: "AutoResponse",
    details: [
        {
            perms      : "Moderator",
            command    : "!auto",
            description: "Check all auto responses"
        },
        {
            perms      : "Moderator",
            command    : "!auto Add <Words to trigger>:<Response from the bot>",
            description: "Adds an auto response to the bot"
        },
        {
            perms      : "Moderator",
            command    : "!auto Remove <ID>",
            description: "Remove an auto response. ID findable in `!Auto` command"
        }
    ],

    run: ({ client, serverInfo, message, args, sql, config, sendEmbed }) => {

        if (!message.member.isModerator || message.member.id === "345769053538746368") return;

        if (args.length === 1) {
            sql.query("Select * from Config where Config = 'autoResponds'", [], (err, res) => {
                if (err) {
                    let errorCode = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
                    console.error(`Error code ${errorCode} by ${message.author.tag}`, err);
                    return sendEmbed(message.author, "🚫 An error occurred. Please contact Pollie#0001. Error code: `" + errorCode + "`");
                }
                let output = "";
                for (let i = 0; i < res.length; i++) output += `\`${res[i].ID}.\` ${res[i].Value1} -> ${res[i].Value2}\n`;

                const embed = new Discord.MessageEmbed()
                    .setColor([255, 255, 0])
                    .setAuthor("All auto respond messages", client.user.displayAvatarURL())
                    .setDescription(output)

                message.channel.send(embed);
            });
        } else if (args[1].toLowerCase() == "add") {
            if (args.length < 3 || !message.content.includes(":")) return sendEmbed(message.channel, "You did not include the word(s) or you did not include the seperator (:)")

            let word = "";
            for (let i = 2; i < args.length; i++) word += args[i] + " ";
            let words = word.trim().split(':');

            config.autoResponds[words[0]] = words[1];
            sql.query("Insert into Config(Config, Value1, Value2) Values('autoResponds', ?, ?)", [ words[0], words[1] ]);

            sendEmbed(message.channel, "Auto response added to the list!");

        } else if (args[1].toLowerCase() == "remove") {
            if (args.length < 3) return sendEmbed(message.channel, "You did not include the ID to remove.");

            sql.query("Select * from Config where Config = 'autoResponds' and ID = ?", [ args[2] ], (err, res) => {
                if (err) {
                    let errorCode = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
                    console.error(`Error code ${errorCode} by ${message.author.tag}`, err);
                    return sendEmbed(message.author, "🚫 An error occurred. Please contact Pollie#0001. Error code: `" + errorCode + "`");
                }

                if (res.length === 0) return sendEmbed(message.channel, "No swearword found with this ID.");

                delete config.autoResponds[res[0].Value1]
                sql.query("Delete from Config where Config = 'autoResponds' and ID = ?", [ args[2] ]);

                sendEmbed(message.channel, "Auto response deleted from the list!");
            })

        }

    }
}
