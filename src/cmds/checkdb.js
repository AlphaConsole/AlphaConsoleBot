/**
 * ! Checkdb command
 * 
 * ? Kinda obvious, too lazy to write anything smart anyway
 * ? We also have command description for a reason. So I actually don't know why I added this here. Welp...
 */
const Discord = require('discord.js');
const request = require('request');

module.exports = {
     title: "Checkdb",
     details: [
        {
            perms      : "Support",
            command    : "!Checkdb <@tag | user Id>",
            description: "Check the users his title & colour"
        }
    ],

    run: ({ client, serverInfo, message, args, sql, config, sendEmbed }) => {

        if (!message.member.isCH) return;
        if (args.length < 2) return sendEmbed(message.channel, "You must have forgotten the user", "`!Checkdb <@tag | user Id>`")

        try {
            var id = message.mentions.users.first() ? message.mentions.users.first().id : args[1];
            sql.query("Select * from Players where DiscordID = ? OR SteamID = ?", [ id, id ], (err, rows) => {
                if (err) return console.error(err);
                const user = rows[0];
                
                if (!user)
                    return sendEmbed(message.channel, "An error occured", "This user was not found in the database. Here is the info for him to know:\n\n```It appears you have not signed up for our title service. Please click this link and makes sure you are logging in with the correct account.\n\nhttp://www.alphaconsole.net/auth/index.php```")
        
                let lastSeen = user.LastSeen ? new Date(user.LastSeen*1000).toUTCString() : "never";
                let betaUntil = user.BetaUntil ? new Date(user.BetaUntil*1000).toUTCString() : undefined;
                sendEmbed(message.channel, "Database Check", `Discord: <@${user.DiscordID}>\nSteam: [${user.SteamID}](https://steamcommunity.com/profiles/${user.SteamID})\nLast seen: ${lastSeen}\n\nTitle: ${user.Title}\nColor: ${user.Color}\nGlow: ${user.GlowColor}${ user.Title === "X" || user.Color === "X" ? "\n__Information:__ This user has his title disabled.\n" : "\n" }${ betaUntil ? "\nBeta until: " + betaUntil : "" }\n**[All details of this user](http://staff.alphaconsole.net/details/${user.DiscordID})**`);            
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