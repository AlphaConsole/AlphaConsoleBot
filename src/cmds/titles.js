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
            command    : "!set Color <Hex code>",
            description: "Use this to set your in game title color"
        },
        {
            perms      : "Everyone",
            command    : "!set glow <Hex code>",
            description: "Use this to set your in game title glow color"
        }
    ],

    run: ({ client, serverInfo, message, args, sql, config, sendEmbed, member }) => {
		function saveTitleToLog(discordid, title, blacklisted) {
			sql.query("Insert into TitlesLog(DiscordID, Title, Blacklisted, Date) VALUES(?, ?, ?, ?)", [ discordid, title, blacklisted ? 1 : 0, new Date().getTime() ])
		}

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
					if (err) {
						let errorCode = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
						console.error(`Error code ${errorCode} by ${message.author.tag}`, err);
						return sendEmbed(message.author, "🚫 An error occurred. Please contact Pollie#0001. Error code: `" + errorCode + "`");
					}

					if (body) {
						if (args[0].toLowerCase() == "!set") {
							if (body.toLowerCase().includes("done")) {
								if (!ignoreMsg) sendEmbed(message.author, "Your title has been updated to: `" + title + "`")
								saveTitleToLog(id, title, false);
							} else if (body.toLowerCase().includes("the user does not exist"))
								sendEmbed(message.author, "Hi, in order to use our custom title service you must authorize your discord account. \n" +
								"Please click this link: http://alphaconsole.net/auth/index.php and login with your discord account.")
							else
								console.log("Somebody didn't receive a response from the bot due to unknown body response:", body);
						} else {
							if (body.toLowerCase().includes("done")) 
								sendEmbed(message.author, `User Title update`, `Updated title of <@${id}> to \`${title}\``)
							else
								sendEmbed(message.author, "There appears to have been an error.", "```" + body + "```")
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
					if (err) {
						let errorCode = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
						console.error(`Error code ${errorCode} by ${message.author.tag}`, err);
						return sendEmbed(message.author, "🚫 An error occurred. Please contact Pollie#0001. Error code: `" + errorCode + "`");
					}

					if (body) {
						if (args[0].toLowerCase() == "!set") {
							if (body.toLowerCase().includes("done")) 
							 	if (!ignoreMsg) sendEmbed(message.author, "Your colour has been updated to: #" + colour)
							else if (body.toLowerCase().includes("the user does not exist"))
								if (!ignoreMsg) sendEmbed(message.author, "Hi, in order to use our custom title service you must authorize your discord account. \n" +
								"Please click this link: http://alphaconsole.net/auth/index.php and login with your discord account.")
							else
								console.log("Somebody didn't receive a response from the bot due to unknown body response:", body);
						} else {
							if (body.toLowerCase().includes("done")) 
								sendEmbed(message.author, `User Colour update`, `Updated colour of <@${id}> to \`${colour}\``)
							else
								sendEmbed(message.author, "There appears to have been an error.", "```" + body + "```")
						}
					} else {
						sendEmbed(message.author, "There was an error. Please try again. If this problem continues please contact an admin.");
					}
				})
			}

			function setUsersGlow(id, colour, ignoreMsg) {
				let url = keys.SetTitleURL + 
					"?DiscordID=" + id +
					"&key=" + keys.Password +
					"&glow=" + escape(colour);
				request({ method: "GET", url: url }, (err, res, body) => {
					if (err) {
						let errorCode = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
						console.error(`Error code ${errorCode} by ${message.author.tag}`, err);
						return sendEmbed(message.author, "🚫 An error occurred. Please contact Pollie#0001. Error code: `" + errorCode + "`");
					}

					if (body) {
						if (args[0].toLowerCase() == "!set") {
							if (body.toLowerCase().includes("done")) 
							 	if (!ignoreMsg) sendEmbed(message.author, "Your glow has been updated to: #" + colour)
							else if (body.toLowerCase().includes("the user does not exist"))
								if (!ignoreMsg) sendEmbed(message.author, "Hi, in order to use our custom title service you must authorize your discord account. \n" +
								"Please click this link: http://alphaconsole.net/auth/index.php and login with your discord account.")
							else
								console.log("Somebody didn't receive a response from the bot due to unknown body response:", body);
						} else {
							if (body.toLowerCase().includes("done")) 
								sendEmbed(message.author, `User glow update`, `Updated glow of <@${id}> to \`${colour}\``)
							else
								sendEmbed(message.author, "There appears to have been an error.", "```" + body + "```")
						}
					} else {
						sendEmbed(message.author, "There was an error. Please try again. If this problem continues please contact an admin.");
					}
				})
			}




			async function setTitle() {
				if (message.channel.id !== serverInfo.channels.setTitle) {
					sendEmbed(message.author, "Use the !set title command in #set-title!")
					return message.delete().catch(e => { });
				};
				if (args.length < 3) return;
				let userTitle = createTitle(args, 2);
				let titles = userTitle.split(/[::]+/);

				if (titles.length > 5)
					return sendEmbed(message.author, "AlphaConsole does not support more than 5 rotations in your custom title. Please try again.")

				if (userTitle.includes("\n"))
					return sendEmbed(message.author, "Your title cannot be multiple lines. It must be in 1 line.");

				let url = config.keys.CheckdbURL
						+ "?DiscordID=" + message.author.id;
				request({ method: "GET", url: url }, async function (err, response, body) {
					let steamid = "";

					if (body && (!body.toLowerCase().includes("not signed up for db") && !body.toLowerCase().includes("no title set")))
						steamid = body.split(" ")[ body.split(" ").length - 2 ];

					let valid = await isValidTitle(message, blacklist, userTitle, serverInfo, sql, steamid, config.keys.RL_API_Token);
					if (valid)
						setUsersTitle(message.author.id, userTitle);
					else {
						sendEmbed(message.author, "Error whilst setting title", "Your custom title was not set because it contained a blacklisted phrase. \n" +
							"AlphaConsole does not allow faking of real titles. If you continue to try and bypass the blacklist system, it could result in loss of access to our custom titles.")
						saveTitleToLog(message.author.id, userTitle, true);
					}

				});
			}

			function overrideTitle() {
				if (!(message.member && message.member.isModerator) && !(member && member.isModerator)) return;
				message.delete().catch(e => { })
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
					if (err) {
						let errorCode = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
						console.error(`Error code ${errorCode} by ${message.author.tag}`, err);
						return sendEmbed(message.author, "🚫 An error occurred. Please contact Pollie#0001. Error code: `" + errorCode + "`");
					}
						
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
				if (message.channel.id !== serverInfo.channels.setTitle) {
					sendEmbed(message.author, "Use the !set color command in #set-title!")
					return message.delete().catch(e => { });
				};

				let c = args[2];
				if (c.trim() === "1") {
					setUsersColour(message.author.id, "FFFFFF");
					setUsersGlow(message.author.id, "000000", true);
					return;
				}
				if (c.trim() === "2") {
					setUsersColour(message.author.id, "00FFAA");
					setUsersGlow(message.author.id, "00FFFF", true);
					return;
				}
				if (c.trim() === "3") {
					setUsersColour(message.author.id, "00FFAA");
					setUsersGlow(message.author.id, "000000", true);
					return;
				}
				if (c.trim() === "4") {
					setUsersColour(message.author.id, "FFEB5C");
					setUsersGlow(message.author.id, "000000", true);
					return;
				}
				if (c.trim() === "5") {
					setUsersColour(message.author.id, "FFEB5C");
					setUsersGlow(message.author.id, "FFA300", true);
					return;
				}
				if (c.trim() === "6") {
					setUsersColour(message.author.id, "DBD2FF");
					setUsersGlow(message.author.id, "8C50FF", true);
					return;
				}
				if (c.trim() === "7") {
					setUsersColour(message.author.id, "AEF7FF");
					setUsersGlow(message.author.id, "43AFFF", true);
					return;
				}
				

				let colours = args[2].split("::");

				let colour = isValidColor(message, colours, serverInfo, sendEmbed);
				if (colour)
					setUsersColour(message.author.id, colour);
					
			}

			function overrideColour() {
				if (!(message.member && message.member.isModerator) && !(member && member.isModerator)) return;
				message.delete().catch(e => { })

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
					if (err) {
						let errorCode = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
						console.error(`Error code ${errorCode} by ${message.author.tag}`, err);
						return sendEmbed(message.author, "🚫 An error occurred. Please contact Pollie#0001. Error code: `" + errorCode + "`");
					}
						
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

			function setGlow() {
				if (message.channel.id !== serverInfo.channels.setTitle) {
					sendEmbed(message.author, "Use the !set glow command in #set-title!")
					return message.delete().catch(e => { });
				};
				let colours = args[2].split("::");

				let colour = isValidColor(message, colours, serverInfo, sendEmbed);
				if (colour)
					setUsersGlow(message.author.id, colour);
					
			}

			function overrideGlow() {
				if (!(message.member && message.member.isModerator) && !(member && member.isModerator)) return;
				message.delete().catch(e => { })

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
					if (err) {
						let errorCode = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
						console.error(`Error code ${errorCode} by ${message.author.tag}`, err);
						return sendEmbed(message.author, "🚫 An error occurred. Please contact Pollie#0001. Error code: `" + errorCode + "`");
					}
						
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

					let val = isValidColor(message, colours, serverInfo, sendEmbed);
					if (!val) return sendEmbed(message.author, "Color is invalid.")
					setUsersGlow(id, val);

					const embedlog = new Discord.MessageEmbed()
						.setColor([255, 255, 0])
						.setAuthor("Custom title override", client.user.displayAvatarURL())
						.addField("Old Glow", colour)
						.addField("New Glow", args[3])
						.addField("Title of", `**<@${id}>** (${id})`)
						.addField("Edited by", message.author.tag)
						.setTimestamp();
					client.guilds.get(serverInfo.guildId).channels.get(serverInfo.channels.aclog).send(embedlog);
				});
			}

			function setSpecialTitle() {
				if (message.channel.id !== serverInfo.channels.setSpecialTitle || args.length < 3) return;

				sql.query("select * from SpecialTitles where ID = ?", [ args[2] ], (err, res) => {
					if (err) {
						let errorCode = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
						console.error(`Error code ${errorCode} by ${message.author.tag}`, err);
						return sendEmbed(message.author, "🚫 An error occurred. Please contact Pollie#0001. Error code: `" + errorCode + "`");
					}

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
				case "glow":
					args[0].toLowerCase() == "!set"
						? setGlow()
						: overrideGlow();
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


function isValidTitle(message, blackListedWords, userTitle, serverInfo, sql, steamid, apiToken) {
	return new Promise((resolve, reject) => {
		sql.query("Select * from TitleReports where DiscordID = ? AND Title = ? AND Permitted = 1", [ message.author.id, userTitle ], (err, res) => {
			if (err) {
				console.error(err);
				return resolve(false);
			}

			var validTitle = true;

			if (res[0])
				return resolve(validTitle);

			con();

			/* if (steamid) {
				request(`https://api.rocketleague.com/api/v1/steam/playertitles/${steamid}?format=json`,
				{ headers: {
					Authorization: `Token ${apiToken}`
				}}, (req, res, body) => {
					let data = JSON.parse(body);

					if (data && data.titles) {
						for (let i = 0; i < 15; i++) {
							// Grand Champion titles
							if (userTitle.toLowerCase() === `season ${i} grand champion` && data.titles.includes(`Season${i}GrandChampion`)) return resolve(validTitle);

							let di = i.toString().length === 1 ? `0${i}` : i;

							// RLCS Titles
							if (userTitle.toLowerCase() === `rlcs season ${i} contender` && data.titles.includes(`RLCS_${di}_Contender`)) return resolve(validTitle);
							if (userTitle.toLowerCase() === `rlcs season ${i} elite` && data.titles.includes(`RLCS_${di}_Elite`)) return resolve(validTitle);
							if (userTitle.toLowerCase() === `rlcs season ${i} grand finalist` && data.titles.includes(`RLCS_${di}_Grand_Finalist`)) return resolve(validTitle);
							if (userTitle.toLowerCase() === `rlcs season ${i} world champion` && data.titles.includes(`RLCS_${di}_World_Champion`)) return resolve(validTitle);

							// RLRS Titles
							if (userTitle.toLowerCase() === `rlrs season ${i} challenger` && data.titles.includes(`RLRS_${di}_Challenger`)) return resolve(validTitle);
						}

						// ESL Titles
						if (userTitle.toLowerCase() === "esl monthly elite" && data.titles.includes('ESLMonthlyElite')) return resolve(validTitle);
						if (userTitle.toLowerCase() === "esl monthly champion" && data.titles.includes('ESLMonthlyChampion')) return resolve(validTitle);

						//Other titles
						if (userTitle.toLowerCase() === "dreamhack champion" && data.titles.includes('DreamHack_Champion')) return resolve(validTitle);
						if (userTitle.toLowerCase() === "mlg season 1 champion" && data.titles.includes('MLGSeason1Champion')) return resolve(validTitle);
						if (userTitle.toLowerCase() === "mlg season 1 elite" && data.titles.includes('MLGSeason1Elite')) return resolve(validTitle);
						if (userTitle.toLowerCase() === "pax champion" && data.titles.includes('PaxChampion')) return resolve(validTitle);
						if (userTitle.toLowerCase() === "x games champion" && data.titles.includes('X_Games_Champion')) return resolve(validTitle);
						if (userTitle.toLowerCase() === "eleague cup champion" && data.titles.includes('Eleague_Cup_Champion')) return resolve(validTitle);
					}

					con();
				})
			} else {
				con();
			} */

			function con() {
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
				resolve(validTitle)
			}
		
		})
	})
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





function isValidColor(message, colours, serverInfo, sendEmbed) {

	//TODO: Remove once multiple colors are enabled again.
	if (colours.length > 1) {
		sendEmbed(message.author, "Error whilst setting colour", "Multiple colours are currently not allowed.");
		return false;
	}

	const hex = /\b[0-9A-F]{6}\b/gi;
	let str = "";

	for (let i = 0; i < colours.length; i++) {
		if (i !== 0) str += "::";

		const regex = colours[i].match(hex);
		
		if (!(regex && regex.length === 1)) {
			sendEmbed(message.author, "Error whilst setting colour", "You need to fill in a hex value (Ex. \`#FFFFFF\`)");
			return false;
		}

		const c = regex[0].toUpperCase();
		str += c;
		
		/* switch (colours[i]) {
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
		} */
		
	}

	return str;
}

function validUser(message, serverInfo) {
	if (message.member.roles.has(serverInfo.roles.sub)) return true;
	if (message.member.roles.has(serverInfo.roles.tempRole)) return true;
	if (message.member.roles.has(serverInfo.roles.legacy)) return true;
	if (message.member.roles.has(serverInfo.roles.orgPartner)) return true;
	if (message.member.roles.has(serverInfo.roles.partnerP)) return true;
	if (message.member.roles.has(serverInfo.roles.donator)) return true;
	if (message.member.roles.has(serverInfo.roles.staff)) return true;
    if (message.member.roles.has(serverInfo.roles.support)) return true;
    if (message.member.roles.has(serverInfo.roles.moderator)) return true;
    if (message.member.roles.has(serverInfo.roles.admin)) return true;
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