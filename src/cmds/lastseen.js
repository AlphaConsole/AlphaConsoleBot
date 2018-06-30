/**
 * ! lastseen command
 */
const request = require('request');
const Discord = require('discord.js');

module.exports = {
    title: "Lastseen",
    details: [
        {
            perms      : "Everyone",
            command    : "!Lastseen <@tag | user Id | steam Id>",
            description: "Returns last seen in DB and Discord if applicable"
        }
    ],

    run: ({ client, serverInfo, message, args, sql, config, sendEmbed }) => {

        if (!message.member.isSupport) return;

        try {   
            var url = config.keys.LastSeenURL;
            var user;
            if (args[1] == undefined) {
                return sendEmbed(message.channel, "Need a parameter.");

            } else if (isNaN(args[1]) && message.mentions.users.first()) {
                //discord
                url += "?DiscordID=" + message.mentions.users.first().id;
                user = message.mentions.users.first();

            } else if (args[1].length == 18) {
                url += "?DiscordID=" + args[1];
                user = client.users.get(args[1]);

            } else if (args[1].length == 17) {
                //steam
                url += "?SteamID=" + args[1];
                user = false
            } else {
                return sendEmbed(message.channel, "Incorrect parameter. Please use mention/discordID/steamID")
            }
            request({ method: "GET", url: url }, function (err, response, body) {
                if (err) {
                    let errorCode = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
                    console.error(`Error code ${errorCode} by ${message.author.tag}`, err);
                    return sendEmbed(message.author, "🚫 An error occurred. Please contact Pollie#0001. Error code: `" + errorCode + "`");
                }


                if (body) {
                    if (body.toLowerCase().includes("db")) 
                        return sendEmbed(message.channel, "User not found in db.")
                    
                    var dbTime = convertUnixTime(body.trim());
                    console.log(user);
                    if (user) {
                        if (user.lastMessage == null || user.lastMessage == undefined) {
                            const embed = new Discord.MessageEmbed()
                                .setColor([255, 255, 0])
                                .setAuthor("Last Seen Check", client.user.displayAvatarURL({ format: "png" }))
                                .addField("User", user)
                                .addField("Last Seen in DB", `${dbTime}`)
                                .addField(
                                    "Discord Information",
                                    `Info could not be retrieved. Message was not cached`
                                );
                            message.channel.send(embed);
                        } else {
                            const embed = new Discord.MessageEmbed()
                                .setColor([255, 255, 0])
                                .setAuthor("Last Seen Check", client.user.displayAvatarURL({ format: "png" }))
                                .addField("User", user)
                                .addField("Last Seen in DB", `${dbTime}`)
                                .addField("Last Message on Discord", `${user.lastMessage}`)
                                .addField(
                                    "Date of Last Message",
                                    `${user.lastMessage.createdAt}`
                                );
                            message.channel.send(embed);
                        }
                    } else {
                        const embed = new Discord.MessageEmbed()
                            .setColor([255, 255, 0])
                            .setAuthor("Last Seen Check", client.user.displayAvatarURL({ format: "png" }))
                            .addField("User", user)
                            .addField("Last Seen in DB", `${dbTime}`);
                        message.channel.send(embed);
                    }
                } else {
                    message.reply("There was an error. Please try again.");
                }
            });
            
        } catch (error) {
            console.log(error);
        }

    }
};



function convertUnixTime(timestamp) {
    var d = new Date(timestamp * 1000), // Convert the passed timestamp to milliseconds
    yyyy = d.getFullYear(),
    mm = ("0" + (d.getMonth() + 1)).slice(-2), // Months are zero based. Add leading 0.
    dd = ("0" + d.getDate()).slice(-2), // Add leading 0.
    hh = d.getHours(),
    h = hh,
    min = ("0" + d.getMinutes()).slice(-2), // Add leading 0.
    ampm = "AM",
    time;
  
    if (hh > 12) {
        h = hh - 12;
        ampm = "PM";
    } else if (hh === 12) {
        h = 12;
        ampm = "PM";
    } else if (hh == 0) {
        h = 12;
    }
  
    return yyyy + "-" + mm + "-" + dd + ", " + h + ":" + min + " " + ampm;
}