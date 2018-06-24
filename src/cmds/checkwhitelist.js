/**
 * ! CheckWhitelist command
 * 
 * ? Kinda obvious, too lazy to write anything smart anyway
 * ? We also have command description for a reason. So I actually don't know why I added this here. Welp...
 */
const Discord = require('discord.js');

module.exports = {
     title: "CheckWhitelist",
     details: [
        {
            perms      : "Support",
            command    : "!CheckWhitelist <@tag | user Id>",
            description: "Check if the user has whitelisted titles"
        },
        {
            perms      : "Support",
            command    : "!Checkw <@tag | user Id>",
            description: "Check if the user has whitelisted titles"
        }
    ],

    run: ({ client, serverInfo, message, args, sql, config, sendEmbed }) => {

        if (!message.member.isSupport) return;
        if (args.length < 2) return sendEmbed(message.channel, "You must have forgotten the user", "`!Checkw <@tag | user Id>`")

        try {
            var id = message.mentions.users.first() ? message.mentions.users.first().id : args[1];
            sql.query("Select * from TitleReports where (DiscordID = ? OR SteamID = ?)  AND Permitted = 1", [ id, id ], (err, res) => {
                if (err) return console.error(err);

                let text = "";
                for (let i = 0; i < res.length; i++) text += `- \`${res[i].Title}\``;
                if (text === "") text = "No whitelisted titles found.";

                sendEmbed(message.channel, "Title whitelist check", text)
            })
            
        } catch (error) {
            console.log(error)
        }

    }
};


function returnColour(colourID) {
    switch (colourID) {
        case "0":
            return "No title";
            break;
        case "1":
            return "Gray";
            break;
        case "2":
            return "Glowing Green (Twitch Subs & Legacy)";
            break;
        case "3":
            return "Non-glowing Green";
            break;
        case "4":
            return "Non-glowing Yellow";
            break;
        case "5":
            return "Glowing Yellow";
            break;
        case "6":
            return "Purple (Twitch Subs & Legacy)";
            break;
        case "7":
            return "RLCS Blue";
            break;
        case "X":
            return "Disabled (X)";
            break;
        default:
            return "Cycling Colours";
    }
}