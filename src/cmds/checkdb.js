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

        if (!message.member.isSupport) return;
        if (args.length < 2) return sendEmbed(message.channel, "You must have forgotten the user", "`!Checkdb <@tag | user Id>`")

        try {
            var id = message.mentions.users.first() ? message.mentions.users.first().id : args[1];
            var url = config.keys.CheckdbURL + "?DiscordID=" + id;
            request({ method: "GET", url: url }, function (err, response, body) {
                if (err)
                    return sendEmbed("There was an error. Send this to Pollie or Root", err);

                let result = "";

                if (body) {
                    if (body.toLowerCase().includes("not signed up for db")) {
                        sendEmbed(message.channel, "An error occured", `It appears you have not signed up for our title service. Please click this link and makes sure you are logging in with the correct account.\n\nhttp://www.alphaconsole.net/auth/index.php`)
                        
                    } else if (body.toLowerCase().includes("no title set")) {
                        sendEmbed(message.channel, "An error occured", `No title set. Go to #set-title and set a title!`);
                            
                    } else {
                        var info = body.split(" ");
                        var colour = info[info.length - 3];
                        var steamID = info[info.length - 2];
                        for (let index = 0; index < info.length - 3; index++) result += info[index] + " ";

                        if (result.trim() == "X" && returnColour(colour) == "Cycling Colours") {
                            sendEmbed(message.channel, "Database Check", `User: <@${id}>\nSteam: https://steamcommunity.com/profiles/${steamID}\nInformation: User has disabled their title.`);
                        } else {
                            sendEmbed(message.channel, "Database Check", `User: <@${id}>\nSteam: https://steamcommunity.com/profiles/${steamID}\nTitle: ${result.trim()}\nColour: ${returnColour(colour)}`);                        
                        }
                    }
                } else {
                    sendEmbed(message.channel, "An error occured", "There was an error. Please try again. If this problem continues please contact an admin.")
                }
            });
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