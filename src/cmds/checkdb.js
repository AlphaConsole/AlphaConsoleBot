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
                console.log(`${config.keys.cdn_banners}${user.Banner}.png?random=${random()}`.split(" ").join("%20"))
                sendEmbed(
                    message.channel, 
                    "Database Check", `Discord: <@${user.DiscordID}>\nSteam: [${user.SteamID}](https://steamcommunity.com/profiles/${user.SteamID})\nLast seen: ${lastSeen}\n\nTitle: ${user.Title}\nColor: ${user.Color}\nGlow: ${user.GlowColor}${ user.Title === "X" || user.Color === "X" ? "\n__Information:__ This user has his title disabled.\n" : "\n" }${ betaUntil ? "\nBeta until: " + betaUntil : "" }\n**[All details of this user](http://staff.alphaconsole.net/details/${user.DiscordID})**`, 
                    undefined, 
                    undefined, 
                    user.Banner ? `${config.keys.cdn_banners}${user.Banner}.png?random=${random()}`.split(" ").join("%20") : undefined
                );            
            })
        } catch (error) {
            console.log(error)
        }

    }
};


function random() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (var i = 0; i < 10; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
} 