/**
 * ! Status command
 * 
 * ? Kinda obvious, too lazy to write anything smart anyway
 * ? We also have command description for a reason. So I actually don't know why I added this here. Welp...
 */
const Discord = require('discord.js');

module.exports = {
     title: "Status",
     details: [
        {
            perms      : "Admin",
            command    : "!Status",
            description: "Shows all statuses of the bot"
        },
        {
            perms      : "Admin",
            command    : "!Status Add <Watching / Playing /Streaming / Listening> <Rest of status>",
            description: "Adds a status to the bot to cycle through"
        },
        {
            perms      : "Admin",
            command    : "!Status Remove <ID>",
            description: "Removes a status. ID findable in `!Status`"
        },
        {
            perms      : "Admin",
            command    : "!Status Clear",
            description: "Removes all statuses and resets the IDs"
        }
    ],

    run: async ({ client, serverInfo, message, args, sql, config, sendEmbed, checkStatus }) => {

        if (!message.member.isAdmin) return;

        if (args.length === 1) {
            //* !Status command
            sql.query("Select * from Statuses", [], (err, res) => {
                if (err) return console.error(err);

                sendEmbed(message.channel, "All statuses of the bot", res.map(r => `\`${r.ID}.\` ${r.StatusType} ${r.StatusText} ${r.Active == 1 ? "  -ACTIVE" : ""}`).join("\n"))
            })


        } else if (args[1].toLowerCase() === "add" || args[1].toLowerCase() === "a") {
            //* !Status Add command

            if (args.length < 4) return sendEmbed(message.channel, "You did not include the type or any text!");

            let type = args[2].toUpperCase();
            if (type !== "PLAYING" &&
                type !== "WATCHING" &&
                type !== "LISTENING" &&
                type !== "STREAMING") return sendEmbed(message.channel, "Status type is incorrect", "Possible values are: PLAYING, WATCHING, LISTENING or STREAMING")

            let text = "";
            for (let i = 3; i < args.length; i++) text += args[i] + " ";

            await sql.query("Insert into Statuses(StatusType, StatusText) Values(?, ?)", [ type, text.trim() ]);
            sendEmbed(message.channel, "Status added to the bot!");
            checkStatus();

        } else if (args[1].toLowerCase() === "remove" || args[1].toLowerCase() === "delete" || args[1].toLowerCase() === "r" || args[1].toLowerCase() === "d") {
            //* !Status Remove command

            sql.query("Select * from Statuses where ID = ?", [ args[2] ], async (err, res) => {
                if (err) return console.error(err);

                if (!res[0]) return sendEmbed(message.channel, "Status ID not found.");
                await sql.query("Delete from Statuses where ID = ?", [ args[2] ]);
                sendEmbed(message.channel, "Status removed.");
                checkStatus();
            })
        } else if (args[1].toLowerCase() === "clear") {
            sql.query("TRUNCATE TABLE Statuses", [])
            sendEmbed(message.channel, "All statuses have been cleared!")
        }

    }
};