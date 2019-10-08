/**
 * ! Swear words
 * 
 * ? To check, remove & add swear words
 * ? If these words are in any message they'll be removed automatically
 */
const Discord = require("discord.js");

module.exports = {
    title: "Swearwords",
    details: [
        {
            perms      : "Moderator",
            command    : "!swearwords",
            description: "Check all swearwords"
        },
        {
            perms      : "Moderator",
            command    : "!swearwords Add <Words to trigger the remove>",
            description: "Adds words to swearwords list"
        },
        {
            perms      : "Moderator",
            command    : "!swearwords Remove <ID>",
            description: "Removes a swear word. ID findable in `!SwearWords` command"
        }
    ],

    run: ({ client, serverInfo, message, args, sql, config, sendEmbed }) => {
        if (!message.member.isModerator || message.member.id === "345769053538746368") return;

        if (args.length === 1) {
            sql.query("Select * from Config where Config = 'swearwords'", [], (err, res) => {
                if (err) {
                    let errorCode = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
                    console.error(`Error code ${errorCode} by ${message.author.tag}`, err);
                    return sendEmbed(message.author, "🚫 An error occurred. Please contact Pollie#0001. Error code: `" + errorCode + "`");
                }

                let output = "";
                for (let i = 0; i < res.length; i++) output += `\`${res[i].ID}.\` ${res[i].Value1}\n`;

                const embed = new Discord.MessageEmbed()
                    .setColor([255, 255, 0])
                    .setAuthor("All swear words", client.user.displayAvatarURL())
                    .setDescription(output)

                message.channel.send(embed);
            });

        } else if (args[1].toLowerCase() == "add") {
            if (args.length < 3) return sendEmbed(message.channel, "You did not include the word(s) to blacklist.")

            let word = "";
            for (let i = 2; i < args.length; i++) word += args[i] + " ";

            config.swearwords.push(word.trim())
            sql.query("Insert into Config(Config, Value1) Values('swearwords', ?)", [ word.trim() ]);

            sendEmbed(message.channel, "Swearword added to the list!");

        } else if (args[1].toLowerCase() == "remove") {
            if (args.length < 3) return sendEmbed(message.channel, "You did not include the ID to remove.");

            sql.query("Select * from Config where Config = 'swearwords' and ID = ?", [ args[2] ], (err, res) => {
                if (err) {
                    let errorCode = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
                    console.error(`Error code ${errorCode} by ${message.author.tag}`, err);
                    return sendEmbed(message.author, "🚫 An error occurred. Please contact Pollie#0001. Error code: `" + errorCode + "`");
                }

                if (res.length === 0) return sendEmbed(message.channel, "No swearword found with this ID.");

                config.swearwords.splice(config.swearwords.indexOf(res[0].Value1), 1)
                sql.query("Delete from Config where Config = 'swearwords' and ID = ?", [ args[2] ]);

                sendEmbed(message.channel, "Swearword deleted from the list!");
            })

        }

    }
}
