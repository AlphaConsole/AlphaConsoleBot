/**
 * ! Get title command
 */

module.exports = {
    title: "GetTitle",
    details: [
        {
            perms      : "Everyone",
            command    : "!get title",
            description: "Returns your current title"
        }
    ],

    run: ({ client, serverInfo, message, args, sql, config, sendEmbed }) => {

        if (message.channel.id !== serverInfo.channels.setTitle) return;
        if (args.length < 2 || !(args[1] && args[1].toLowerCase() === "title")) return;

        sql.query("Select * from Players where DiscordID = ?", [ message.author.id ], (err, rows) => {
            const user = rows[0];
            
            if (!user)
                return sendEmbed(message.author, "An error occured", `It appears you have not signed up for our title service. Please click this link and makes sure you are logging in with the correct account.\n\nhttp://www.alphaconsole.net/auth/index.php`)

            if (user.Title === "X" || user.Color === "X")
                return sendEmbed(message.author, "Your title information", `Discord: <@${user.DiscordID}>\nSteam: [${user.SteamID}](https://steamcommunity.com/profiles/${user.SteamID})\n\nInformation: You have your title disabled. Set a new title & color to enable your title again.`);

            sendEmbed(message.author, "Your title information", `Discord: <@${user.DiscordID}>\nSteam: [${user.SteamID}](https://steamcommunity.com/profiles/${user.SteamID})\n\nTitle: ${user.Title}\nColor: ${user.Color}\nGlow: ${user.GlowColor}`);            
        })

        /* try {
            var url = config.keys.CheckdbURL + "?DiscordID=" + message.author.id;
            var user = message.author;
            request({ method: "GET", url: url }, function (err, response, body) {
                if (err) {
                    let errorCode = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
                    console.error(`Error code ${errorCode} by ${message.author.tag}`, err);
                    return sendEmbed(message.author, "🚫 An error occurred. Please contact Pollie#0001. Error code: `" + errorCode + "`");
                }

                let result = "";

                if (body) {
                    if (body.toLowerCase().includes("not signed up for db")) {
                        sendEmbed(message.author, "An error occured", `It appears you have not signed up for our title service. Please click this link and makes sure you are logging in with the correct account.\n\nhttp://www.alphaconsole.net/auth/index.php`)
                        
                    } else if (body.toLowerCase().includes("no title set")) {
                        sendEmbed(message.author, "An error occured", `No title set. Go to #set-title and set a title!`);
                            
                    } else {
                        var info = body.split(" ");
                        var colour = info[info.length - 3];
                        var steamID = info[info.length - 2];
                        for (let index = 0; index < info.length - 3; index++) result += info[index] + " ";

                        if (result.trim() == "X" && returnColour(colour) == "Cycling Colours") {
                            sendEmbed(message.author, "Database Check", `User: ${user}\nSteam: https://steamcommunity.com/profiles/${steamID}\nInformation: User has disabled their title.`);
                        } else {
                            sendEmbed(message.author, "Database Check", `User: ${user}\nSteam: https://steamcommunity.com/profiles/${steamID}\nTitle: ${result.trim()}\nColour: ${returnColour(colour)}`);                        
                        }
                    }
                } else {
                    sendEmbed(message.author, "An error occured", "There was an error. Please try again. If this problem continues please contact an admin.")
                }
            });
        } catch (error) {
            console.log(error)
        } */

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