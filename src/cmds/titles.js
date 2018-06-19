/**
 * ! Titles command
 */
const request = require('request');
const Discord = require('discord.js');

module.exports = {
    title: "Titles",
    details: [
        {
            perms      : "Everyone",
            command    : "!set Title <Title Name>",
            description: "Use this to set your in game title"
        },
        {
            perms      : "Everyone",
            command    : "!set Color <Color Number>",
            description: "Use this to set your in game title color"
        }
    ],

    run: ({ client, serverInfo, message, args, sql, config, sendEmbed, member }) => {
		try {
			
		
			//* Just to make it easy since we'll use it by times
			let blacklist = config.blacklistedWords;
			let keys = config.keys;

			/**
			 * ! All functions used for the titles section.
			 * 
			 * ? This is above the handler because it must be loaded BEFORE we call it.
			 * ? That's why all functions we need will be here at the top.
			 * 
			 * ? Why don't we just put the outside the module.exports?
			 * ? This way we don't have to send serverInfo & those vars to every single function over & over again.
			 */

			function setUsersTitle(id, title, ignoreMsg) {
				let url = keys.SetTitleURL + 
					"?DiscordID=" + id +
					"&key=" + keys.Password +
					"&title=" + escape(title);
				request({ method: "GET", url: url }, (err, res, body) => {
					if (err)
						return sendEmbed(message.author, "Their was an error updating your title. Please pm an admin.");

					if (body) {
						if (args[0].toLowerCase() == "!set") {
							if (body.toLowerCase().includes("done")) 
								if (!ignoreMsg) sendEmbed(message.author, "Your title has been updated to: `" + title + "`")
							else if (body.toLowerCase().includes("the user does not exist"))
								sendEmbed(message.author, "Hi, in order to use our custom title service you must authorize your discord account. \n" +
								"Please click this link: http://alphaconsole.net/auth/index.php and login with your discord account.")
						} else {
							if (body.toLowerCase().includes("done")) 
								sendEmbed(message.author, `User Title update`, `Updated title of <@${id}> to \`${title}\``)
							else
								sendEmbed(message.author, "There appears to have been an error.")
						}
					} else {
						sendEmbed(message.author, "There was an error. Please try again. If this problem continues please contact an admin.");
					}
				})
			}

			function setUsersColour(id, colour, ignoreMsg) {
				let url = keys.SetTitleURL + 
					"?DiscordID=" + id +
					"&key=" + keys.Password +
					"&color=" + escape(colour);
				request({ method: "GET", url: url }, (err, res, body) => {
					if (err)
						return sendEmbed(message.author, "Their was an error updating your colour. Please pm an admin.");

					if (body) {
						if (args[0].toLowerCase() == "!set") {
							if (body.toLowerCase().includes("done")) 
							 	if (!ignoreMsg) sendEmbed(message.author, "Your colour has been updated to: `" + colour + "`")
							else if (body.toLowerCase().includes("the user does not exist"))
								if (!ignoreMsg) sendEmbed(message.author, "Hi, in order to use our custom title service you must authorize your discord account. \n" +
								"Please click this link: http://alphaconsole.net/auth/index.php and login with your discord account.")
						} else {
							if (body.toLowerCase().includes("done")) 
								sendEmbed(message.author, `User Colour update`, `Updated colour of <@${id}> to \`${colour}\``)
							else
								sendEmbed(message.author, "There appears to have been an error.")
						}
					} else {
						sendEmbed(message.author, "There was an error. Please try again. If this problem continues please contact an admin.");
					}
				})
			}




			function setTitle() {
				if (message.channel.id !== serverInfo.channels.setTitle || args.length < 3) return;
				let userTitle = createTitle(args, 2);
				let titles = userTitle.split(/[::]+/);

				if (titles.length > 5)
					return sendEmbed(message.author, "AlphaConsole does not support more than 5 rotations in your custom title. Please try again.")

				if (userTitle.includes("\n"))
					return sendEmbed(message.author, "Your title cannot be multiple lines. It must be in 1 line.")

				let valid = isValidTitle(message, blacklist, userTitle, serverInfo);
				if (valid)
					setUsersTitle(message.author.id, userTitle);
				else 
					sendEmbed(message.author, "Error whilst setting title", "Your custom title was not set because it contained a blacklisted phrase. \n" +
					"AlphaConsole does not allow faking of real titles. If you continue to try and bypass the blacklist system, it could result in loss of access to our custom titles.")
			}

			function overrideTitle() {
				if (!(message.member && message.member.isModerator) && !(member && member.isModerator)) return;
				if (message.mentions.users.first()) 
					id = message.mentions.users.first().id;
				else 
					id = args[2];

				let url = config.keys.CheckdbURL

				if (id.length === 17)
					url += "?SteamID=" + id;
				else
					url += "?DiscordID=" + id;
				request({ method: "GET", url: url }, function (err, response, body) {
					if (err)
						return sendEmbed(message.author, "There was an error. Send this to Pollie or Root", err);
						
					let oldTitle = "";

					if (body) {
						if (body.toLowerCase().includes("not signed up for db")) {
							oldTitle = ":x: Not signed up in database"
							
						} else if (body.toLowerCase().includes("no title set")) {
							oldTitle = ":x: No title set yet"
								
						} else {
							var info = body.split(" ");
							id = info[info.length - 1];
							for (let index = 0; index < info.length - 3; index++) oldTitle += info[index] + " ";
						}
					} else {
						oldTitle = ":x: Couldn't fetch his title from the server"
					}


					let title = createTitle(args, 3);
					if (title.includes("\n"))
						return sendEmbed(message.author, "The title cannot be multiple lines. It must be in 1 line.")
					setUsersTitle(id, title);

					const embedlog = new Discord.MessageEmbed()
						.setColor([255, 255, 0])
						.setAuthor("Custom title override", client.user.displayAvatarURL())
						.addField("Old Title", oldTitle)
						.addField("New Title", title)
						.addField("Title of", `**<@${id}>** (${id})`)
						.addField("Edited by", message.author.tag)
						.setTimestamp();
					client.guilds.get(serverInfo.guildId).channels.get(serverInfo.channels.aclog).send(embedlog);
				});
			}

			function setColour() {
				if (message.channel.id !== serverInfo.channels.setTitle || args.length < 3) return;
				let colours = args[2].split("::");

				let valid = isValidColor(message, colours, serverInfo);
				if (valid)
					setUsersColour(message.author.id, args[2]);
				else
					sendEmbed(message.author, "Error whilst setting colour", "Hi, you have either chosen an invalid colour or a colour you do not have access to." +
					"\nSubscribe to our twitch for access to more colours! \nhttps://www.twitch.tv/alphaconsole")
			}

			function overrideColour() {
				if (!(message.member && message.member.isModerator) && !(member && member.isModerator)) return;
				if (message.mentions.users.first()) 
					id = message.mentions.users.first().id;
				else 
					id = args[2];

				let url = config.keys.CheckdbURL

				if (id.length === 17)
					url += "?SteamID=" + id;
				else
					url += "?DiscordID=" + id;
				request({ method: "GET", url: url }, function (err, response, body) {

					if (err)
						return sendEmbed(message.author, "There was an error. Send this to Pollie or Root", err);
						
					let colour = "";

					if (body) {
						if (body.toLowerCase().includes("not signed up for db")) {
							colour = ":x: Not signed up in database"
							
						} else if (body.toLowerCase().includes("no title set")) {
							colour = ":x: No title set yet"
								
						} else {
							var info = body.split(" ");
							id = info[info.length - 1];
							colour = info[info.length - 3];
						}
					} else {
						colour = ":x: Couldn't fetch his title from the server"
					}

					setUsersColour(id, args[3]);

					const embedlog = new Discord.MessageEmbed()
						.setColor([255, 255, 0])
						.setAuthor("Custom title override", client.user.displayAvatarURL())
						.addField("Old Color", colour)
						.addField("New Color", args[3])
						.addField("Title of", `**<@${id}>** (${id})`)
						.addField("Edited by", message.author.tag)
						.setTimestamp();
					client.guilds.get(serverInfo.guildId).channels.get(serverInfo.channels.aclog).send(embedlog);
				});
			}

			function setSpecialTitle() {
				if (message.channel.id !== serverInfo.channels.setSpecialTitle || args.length < 3) return;

				sql.query("select * from SpecialTitles where ID = ?", [ args[2] ], (err, res) => {
					if (err) return console.error(err);

					if (res.length === 0) return sendEmbed(message.author, "Error setting special title", "No special title found with provided id.");
					
					let preset = res[0];
					let roles = JSON.parse(preset.PermittedRoles);

					let valid = userInOnOfRoles(message.member, roles);
					if (valid) {

						setUsersTitle(message.author.id, preset.Title, true);
						setUsersColour(message.author.id, preset.Color, true);

						sendEmbed(message.author, "Your special title has been set!", `Title: ${preset.Title}\nColor: ${preset.Color}`)

					} else {
						sendEmbed(message.author, "Error setting special title", "You are not allowed to use this preset.")
					}
				})
			}

			/**
			 * ! Handler
			 * 
			 * ? This will redirect the right commands to the right functions
			 * ? We're keeping all titles related stuff to 1 file so we can re-use functions
			 */

			switch (args[1].toLowerCase()) {
				case "title":
					args[0].toLowerCase() == "!set"
						? setTitle()
						: overrideTitle();
					break;
				case "color":
				case "colour":
					args[0].toLowerCase() == "!set"
						? setColour()
						: overrideColour();
					break;
				case "special":
					setSpecialTitle();
					break;
				default:
					break;
			}
		} catch (error) {
			console.log(error)
		}
    }
};

//---------------------------//
//      Helper Functions     //
//---------------------------//
function createTitle(args, indexStart) {
	var title = "";
	for (let word = indexStart; word < args.length; word++) {
	  	title += args[word] + " ";
	}
	return title.trim();
}


function isValidTitle(message, blackListedWords, userTitle, serverInfo) {
	var validTitle = true;
	if (!message.member.isAdmin) {
		if (message.member.isModerator) {
			var exemptWords = ["alphaconsole", "mod", "moderator", "staff"];
			validTitle = !inBlacklist(message, blackListedWords, userTitle, exemptWords);

		} else if (message.member.isSupport) {
			var exemptWords = ["alphaconsole", "support", "staff"];
			validTitle = !inBlacklist(message, blackListedWords, userTitle, exemptWords);

		} else if (message.member.isCH) {
			var exemptWords = ["alphaconsole", "community helper"];
			validTitle = !inBlacklist(message, blackListedWords, userTitle, exemptWords);

		} else if (message.member.roles.has(serverInfo.roles.legacy)) {
			var exemptWords = ["alphaconsole", "legacy"];
			validTitle = !inBlacklist(message, blackListedWords, userTitle, exemptWords);

		} else {
			var exemptWords = [];
			validTitle = !inBlacklist(message, blackListedWords, userTitle, exemptWords);

		}
	}
	return validTitle;
}

function inBlacklist(message, blackListedWords, userTitle, exemptWords) {
	var userTitleBad = false;
	blackListedWords.forEach(badWord => {
		if (badWord != "" && !exemptWords.includes(badWord)) {
			if (userTitle.toLowerCase().includes(badWord)) {
				userTitleBad = true;
			}
		}
	});
	return userTitleBad;
}





function isValidColor(message, colours, serverInfo) {
	let validColour = true;

	for (let i = 0; i < colours.length; i++) {
		
		switch (colours[i]) {
			case "0":
			case "1":
			case "3":
			case "4":
			case "5":
			case "7":
				break;
			case "2":
			case "6":
				if (!validUser(message, serverInfo)) 
					validColour = false;
				break;
			default:
				if (!message.member.isAdmin) 
					validColour = false;
				break;
		}
		
	}

	return validColour;
}

function validUser(message, serverInfo) {
	if (message.member.roles.has(serverInfo.roles.sub)) return true;
	if (message.member.roles.has(serverInfo.roles.legacy)) return true;
	if (message.member.roles.has(serverInfo.roles.orgPartner)) return true;
	if (message.member.roles.has(serverInfo.roles.partnerP)) return true;
	if (message.member.roles.has(serverInfo.roles.donator)) return true;
	if (message.member.roles.has(serverInfo.roles.staff)) return true;
    if (message.member.roles.has(serverInfo.roles.support)) return true;
    if (message.member.roles.has(serverInfo.roles.moderator)) return true;
    if (message.member.roles.has(serverInfo.roles.admin)) return true;
    if (message.member.roles.has(serverInfo.roles.developer)) return true;
    return false;
}





function userInOnOfRoles(member, roles) {
	let inRole = false;
	if (member.isAdmin) return true;

	for (let i = 0; i < roles.length; i++) {
		if (member.roles.has(roles[i])) inRole = true;
	}

	return inRole;
}