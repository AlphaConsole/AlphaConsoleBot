const Discord = require('discord.js');
const keys = require("../tokens.js");

module.exports = {
    title: "lastseen",
    perms: "Support",
    commands: ["!lastseen <@tag/ID/SteamID>"],
    description: ["Returns last seen in DB and Discord if applicable"],
    
    run: async(client, serverInfo, message ,args) => {
        if(hasRole(message.member, 'Support') || hasRole(message.member, "Moderator") || hasRole(message.member, "Admin") || hasRole(message.member, "Developer")) {
            var request = require('request');
            var url = keys.LastSeenURL;
            var user;
            if (args[1] == undefined) {
                message.reply('Need a parameter');
                return;
            } else if (isNaN(args[1])) {
                //discord
                url += '?DiscordID=' + message.mentions.users.first().id;
                user = message.mentions.users.first();
            } else if (args[1].length == 18) {
                url += '?DiscordID=' + args[1];
                user = client.users.find('id', args[1]);
            } else if (args[1].length == 17) {
                //steam
                url += '?SteamID=' + args[1];
                user = args[1];
            } else {
                message.reply('Incorrect parameter');
                return;
            }
            request({
                method: 'GET',
                url: url
            }, function (err, response, body) {
                if (body) {
                    var dbTime = convertUnixTime(body.trim());
                    if (isNaN(user)) {
                        if (user.lastMessage == null || user.lastMessage == undefined) {
                            const embed = new Discord.MessageEmbed()
                            .setColor([255,255,0])
                            .setAuthor('Last Seen Check', serverInfo.logo)
                            .addField("User", user)
                            .addField("Last Seen in DB", `${dbTime}`)
                            .addField('Discord Information', `Info could not be retrieved. Message was not cached`)
                            message.channel.send(embed)
                        } else {
                            const embed = new Discord.MessageEmbed()
                            .setColor([255,255,0])
                            .setAuthor('Last Seen Check', serverInfo.logo)
                            .addField("User", user)
                            .addField("Last Seen in DB", `${dbTime}`)
                            .addField("Last Message on Discord", `${user.lastMessage}`)
                            .addField("Date of Last Message", `${user.lastMessage.createdAt}`)
                            message.channel.send(embed)
                        }
                    } else {
                        const embed = new Discord.MessageEmbed()
                        .setColor([255,255,0])
                        .setAuthor('Last Seen Check', serverInfo.logo)
                        .addField("User", user)
                        .addField("Last Seen in DB", `${dbTime}`)
                        message.channel.send(embed)
                    }
                    
                } else {
                    message.reply('Their was an error. Please try again.');
                }
            });


        }  
    }
}

function convertUnixTime(timestamp) {
    var d = new Date(timestamp * 1000),	// Convert the passed timestamp to milliseconds
		yyyy = d.getFullYear(),
		mm = ('0' + (d.getMonth() + 1)).slice(-2),	// Months are zero based. Add leading 0.
		dd = ('0' + d.getDate()).slice(-2),			// Add leading 0.
		hh = d.getHours(),
		h = hh,
		min = ('0' + d.getMinutes()).slice(-2),		// Add leading 0.
		ampm = 'AM',
		time;
			
	if (hh > 12) {
		h = hh - 12;
		ampm = 'PM';
	} else if (hh === 12) {
		h = 12;
		ampm = 'PM';
	} else if (hh == 0) {
		h = 12;
	}
	
	return yyyy + '-' + mm + '-' + dd + ', ' + h + ':' + min + ' ' + ampm;
}

//Functions used to check if a player has the desired role
function pluck(array) {
    return array.map(function(item) { return item["name"]; });
}
function hasRole(mem, role)
{
    if (pluck(mem.roles).includes(role))
    {
        return true;
    } else {
        return false;
    }

}