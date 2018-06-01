const Discord = require("discord.js");
const keys = require("../tokens.js");

module.exports = {
	title: "newMessage",
	description: "Checks for custom commands, auto responds and links on a new message",

	run: async (
		client,
		serverInfo,
		sql,
		message,
		args,
		AllowedLinksSet,
		AutoResponds,
		SwearWordsSet,
		permits,
		keys
	) => {



		// Custom Commands
		if (message.content.startsWith("!") && !noCustomCommandsChannel(message.channel.id, serverInfo)) {
			sql
				.get(
					`Select * from Commands where Command = '${mysql_real_escape_string(
              args[0].substring(1).toLowerCase()
            )}'`
				)
				.then(command => {
					if (command) {
						//Let's first check if the user even exists in the db
						sql
							.get(
								`select * from Members where DiscordID = '${message.author.id}'`
							)
							.then(row => {
								if (!row) {
									sql
										.run(
											`Insert into Members(DiscordID, Username, JoinedDate)VALUES('${
                          message.author.id
                        }', '${mysql_real_escape_string(
                          message.author.username
                        )}', '${new Date().getTime()}')`
										)
										.catch(err => console.log(err));
									sql
										.get(
											`select * from Members where DiscordID = '${
                          message.author.id
                        }'`
										)
										.then(row => {
											if (row.ccCooldown < new Date().getTime()) {
												var theUser = message.mentions.users.first()


												if (theUser == undefined) {
													message.channel.send(command.Response);
												} else {
													message.channel.send(
														theUser + " " + command.Response
													);
												}
												sql.run(
													`update Members set ccCooldown = '${new Date().getTime() +
                              5000}' where DiscordID = '${message.author.id}'`
												);
											}
										});
								} else {
									if (row.ccCooldown < new Date().getTime()) {

										var theUser;
										if (message.mentions.users.first() != undefined) {
											theUser = message.mentions.users.first();
										}

										if (theUser != undefined) {
											message.channel.send(theUser + " " + command.Response);
										} else {
											message.channel.send(command.Response);
										}
										sql.run(
											`update Members set ccCooldown = '${new Date().getTime() +
                          5000}' where DiscordID = '${message.author.id}'`
										);
									}
								}
							})
							.catch(err => console.log(err));
					}
				});
		}

		// !ToggleLinks Functionality && check for swear words
		var messageAllowed = true;

		// #Showcase & #Suggestion channels
		if (
			message.channel.id == serverInfo.suggestionsChannel ||
			message.channel.id == serverInfo.showcaseChannel
		) {
			if (message.channel.id == serverInfo.showcaseChannel && message.attachments.size != 1) {
				message.delete();
				const embed = new Discord.MessageEmbed()
					.setColor([255, 255, 0])
					.setAuthor("Only images allowed in Showcase channel.", serverInfo.logo);
				return message.author.send(embed).catch(e => message.guild.channels.get(serverInfo.BotSpam).send(
					`${message.member}, your DM's are disabled and we were not able to send you information through DM.`
				));
			}

			//Let's first check if the user even exists in the db
			sql
				.get(`select * from Members where DiscordID = '${message.author.id}'`)
				.then(row => {
					if (!row) {
						var today = new Date().getTime();
						sql
							.run(
								`Insert into Members(DiscordID, Username, JoinedDate)VALUES('${
                  message.author.id
                }', '${mysql_real_escape_string(
                  message.author.username
                )}', '${today}')`
							)
							.then(() => {
								sql
									.get(
										`select * from Members where DiscordID = '${
                      message.author.id
                    }'`
									)
									.then(row => {
										if (message.channel.id == serverInfo.suggestionsChannel) {
											if (row.Suggestion < new Date().getTime()) {
												message.react("👍").then(() => {
													message.react("👎").then(() => {
														message.react("❌");
													});
												});

												sql.run(`update Members set Suggestion = '${new Date().getTime() + 300000}' where DiscordID = '${message.author.id}'`);

												postPin(message, sql, serverInfo, "suggestion")
											} else {
												message.delete();
												const embed = new Discord.MessageEmbed()
													.setColor([255, 255, 0])
													.setAuthor(
														"Your suggestion has been removed since you can only send in once every 5 minutes!",
														serverInfo.logo
													);
												message.author
													.send(embed)
													.catch(e =>
														message.guild.channels
														.get(serverInfo.BotSpam)
														.send(
															`${
                                  message.member
                                }, your DM's are disabled and we were not able to send you information through DM.`
														)
													);
											}
										} else if (
											message.channel.id == serverInfo.showcaseChannel
										) {
											if (row.Showcase < new Date().getTime()) {
												message.react("👍").then(() => {
													message.react("👎").then(() => {
														message.react("❌");
													});
												});
												sql.run(
													`update Members set Showcase = '${new Date().getTime() +
                            300000}' where DiscordID = '${message.author.id}'`
												);

												postPin(message, sql, serverInfo, "showcase")
											} else {
												message.delete();
												const embed = new Discord.MessageEmbed()
													.setColor([255, 255, 0])
													.setAuthor(
														"Your Showcase has been removed since you can only send in once every 5 minutes!",
														serverInfo.logo
													);
												message.author
													.send(embed)
													.catch(e =>
														message.guild.channels
														.get(serverInfo.BotSpam)
														.send(
															`${
                                  message.member
                                }, your DM's are disabled and we were not able to send you information through DM.`
														)
													);
											}
										}
									});
							})
							.catch(err => console.log(err));
					} else {
						sql
							.get(
								`select * from Members where DiscordID = '${message.author.id}'`
							)
							.then(row => {
								if (message.channel.id == serverInfo.suggestionsChannel) {
									if (row.Suggestion < new Date().getTime()) {
										message.react("👍").then(() => {
											message.react("👎").then(() => {
												message.react("❌");
											});
										});

										sql.run(
											`update Members set Suggestion = '${new Date().getTime() +
                        300000}' where DiscordID = '${message.author.id}'`
										);

										postPin(message, sql, serverInfo, "suggestion")
									} else {
										message.delete();
										const embed = new Discord.MessageEmbed()
											.setColor([255, 255, 0])
											.setAuthor(
												"Your suggestion has been removed since you can only send in suggestions once every 5 minutes!",
												serverInfo.logo
											);
										message.author
											.send(embed)
											.catch(e =>
												message.guild.channels
												.get(serverInfo.BotSpam)
												.send(
													`${
                              message.member
                            }, your DM's are disabled and we were not able to send you information through DM.`
												)
											);
									}
								} else if (message.channel.id == serverInfo.showcaseChannel) {
									if (row.Showcase < new Date().getTime()) {
										message.react("👍").then(() => {
											message.react("👎").then(() => {
												message.react("❌");
											});
										});
										sql.run(
											`update Members set Showcase = '${new Date().getTime() +
                        300000}' where DiscordID = '${message.author.id}'`
										);

										postPin(message, sql, serverInfo, "showcase")
									} else {
										message.delete();
										const embed = new Discord.MessageEmbed()
											.setColor([255, 255, 0])
											.setAuthor(
												"Your Showcase has been removed since you can only send in suggestions once every 5 minutes!",
												serverInfo.logo
											);
										message.author
											.send(embed)
											.catch(e =>
												message.guild.channels
												.get(serverInfo.BotSpam)
												.send(
													`${
                              message.member
                            }, your DM's are disabled and we were not able to send you information through DM.`
												)
											);
									}
								}
							});
					}
				})
				.catch(err => console.log(err));
		}

		// Auto Responder checker && Invite Guard
		if (!hasRole(message.member, "Admin") &&
			!hasRole(message.member, "Developer")
		) {
			if (!noAutoResponceChannel(message.channel.id, serverInfo)) {
				for (var [key, value] of AutoResponds) {
					var argsKey = key.toLowerCase().split(/[ ]+/);
					counter = 0;

					for (let i = 0; i < argsKey.length; i++) {
						if (
							message.content
							.toLowerCase()
							.includes(argsKey[i].toLowerCase().trim())
						) {
							counter++;
						}
					}

					if (counter == argsKey.length) {
						message.channel.send(`${message.author}, ${value}`);
					}
				}
			}
			if (
				message.content.includes("discord.me/") ||
				message.content.includes("discord.gg/") ||
				(message.content.includes("discordapp.com/invite/") &&
					message.channel.parentID != "360838298677149720")
			) {
				if (!message.content.includes("discord.gg/alphaconsole")) {
					if (
						permits[message.author.id] &&
						permits[message.author.id].channel == message.channel.id
					) {
						if (permits[message.author.id].until < new Date().getTime())
							return message.delete();
					} else {
						return message.delete();
					}
				}
			}
		}

		if (message.channel.id == serverInfo.betaSteamIDS) {
			message.delete();

			//maybe move this to commands so you can force a user aswell
			//Maybe question if it's the correct URL??
			function setBeta(member, steamID) {
				var request = require("request");
				var url = keys.SetBetaURL;
				url +=
					"?DiscordID=" +
					member.id +
					"&key=" +
					keys.Password +
					"&SteamID=" +
					steamID;
				request({
						method: "GET",
						url: url
					},
					function (err, response, body) {
						if (err)
							member.send("An error occured. Please try again later.");
						if (body) {
							member.send(body);
						}
					});
			}

			function getSteamID(args) {
				if (args.length != 1) {
					message.author.send("Your input is incorrect. Valid inputs are: Steam link, SteamID64 or Steam Custom URL.");
					return;
				} else {
					var incorrectInput = false;
					var steamID = args[0];
					var shouldQuerySteamAPI = false;
					if (steamID.includes("steamcommunity.com")) {
						var splited = steamID.split("/").filter(v => v != '');
						var commIndex = splited.indexOf("steamcommunity.com");
						if (splited.length > commIndex + 2) {
							var field = splited[commIndex + 1];
							if (!(field == "id" || field == "profiles")) {
								message.author.send("Your input is incorrect. Valid inputs are: Steam link, SteamID64 or Steam Custom URL.");
								return;
								return;
							} else {
								steamID = splited[commIndex + 2];
							}
						} else {
							message.author.send("Your input is incorrect. Valid inputs are: Steam link, SteamID64 or Steam Custom URL.");
							return;
						}
					} else {
						if (steamID.match(/^[a-z0-9]+$/i) === null) incorrectInput = true;
					}
					if (!steamID.match(/^7\d{16}$/)) shouldQuerySteamAPI = true;
					if (shouldQuerySteamAPI) {
						var request = require("request");
						var url = keys.SteamAPIURL;
						url += '?key=' + keys.SteamAPIKey + '&vanityurl=' + steamID;
						request({
								method: "GET",
								url: url
							},
							function (err, response, body) {
								if (err) {
									message.author.send("An error occured. Please try again later.");
									return;
								} else {
									if (body) {
										var jsonObject = JSON.parse(body);
										if (jsonObject != null && jsonObject.response && jsonObject.response.success) {
											if (jsonObject.response.success == 1) {
												steamID = jsonObject.response.steamid;
												setBeta(message.author, steamID);
											} else {
												message.author.send("Your input is incorrect. Valid inputs are: Steam link, SteamID64 or Steam Custom URL.");
												return;
											}
										} else {
											message.author.send("An error occured. Please try again later.");
											return;
										}

									} else {
										message.author.send("An error occured. Please try again later.");
										return;
									}
								}
							}
						);
					} else {
						setBeta(message.author, steamID);
					}
				}
			}
			getSteamID(args);
		}


		if (
			message.channel.id == serverInfo.setTitleChannel ||
			message.channel.id == serverInfo.setSpecialTitleChannel
		) {
			sql
				.get(`select Value from CurrentStats where Type = 'messagestitles'`)
				.then(row => {
					var oldVal = row.Value;
					var newVal = row.Value + 1;

					if (oldVal == undefined || oldVal == null || oldVal < 0) {
						newVal = 1;
					}

					sql
						.run(
							`Update CurrentStats set Value = '${newVal}' where Type = 'messagestitles'`
						)
						.catch(e => console.log(e));
				});
		} else if (
			message.channel.id != serverInfo.aclogChannel &&
			message.channel.id != serverInfo.serverlogChannel &&
			message.channel.id != serverInfo.modlogChannel
		) {
			sql
				.get(`select Value from CurrentStats where Type = 'messagesgeneral'`)
				.then(row => {
					var oldVal = row.Value;
					var newVal = row.Value + 1;

					if (oldVal == undefined || oldVal == null || oldVal < 0) {
						newVal = 1;
					}

					sql
						.run(
							`Update CurrentStats set Value = '${newVal}' where Type = 'messagesgeneral'`
						)
						.catch(e => console.log(e));
				});
		}

		if (!hasRole(message.member, "Staff") &&
			!hasRole(message.member, "Moderator") &&
			!hasRole(message.member, "Admin") &&
			!hasRole(message.member, "Developer") &&
			!hasRole(message.member, "Community Helper") &&
			!hasRole(message.member, "Links") &&
			message.channel.parentID != "360838298677149720"
		) {
			if (!AllowedLinksSet.has(message.channel.id)) {
				args.forEach(word => {
					if (
						new RegExp(
							"(https?://(?:www.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|www.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|https?://(?:www.|(?!www))[a-zA-Z0-9].[^s]{2,}|www.[a-zA-Z0-9].[^s]{2,})"
						).test(word)
					) {
						if (!word.includes("alphaconsole.net") && !word.includes("twitter.com/alphaconsole") && !word.includes("twitch.tv/alphaconsole")) {

							if (!word.includes("imgur.com") &&
								!word.includes("reddit.com") &&
								!word.includes("gyazo.com") &&
								!word.includes("prntscr.com")
							) {
								if (
									permits[message.author.id] &&
									permits[message.author.id].channel == message.channel.id
								) {
									if (permits[message.author.id].until < new Date().getTime())
										return message.delete();
								} else {
									return message.delete();
								}
							} else {
								if (message.channel.id == 297536247734206464) { //removes links from general chat
									return message.delete();
								}
							}
						}
					}
				});
			}

			for (let word of SwearWordsSet) {
				if (message.content.toLowerCase().includes(word.toLowerCase())) {
					return message.delete();
				}
			}
		}


		// Title Report functionality
		if (message.channel.id == serverInfo.titleReporting && !message.content.startsWith(".")) {
			message.delete();

			let request = require("request");
			request(`${keys.CheckdbURLnew}?DiscordID=${message.content}`, (err, res, body) => {
				if (err) return console.error(err);

				if (body !== "Not signed up for DB") {
					reportTitle(client, serverInfo, sql, message, body, message.author.id)
				} else {
					request(`${keys.CheckdbURLnew}?SteamID=${message.content}`, (error, result, bodydata) => {
						if (error) return console.error(error);

						if (bodydata !== "Not signed up for DB") {
							reportTitle(client, serverInfo, sql, message, bodydata, message.author.id)
						} else {
							message.author.send("I did not find any title based on that DiscordID / SteamID. Please **only** provide me the ID in that channel")
						}
					})
				}
			})
		}

		console.log(message.channel.id == serverInfo.ingameReports, message.author)
		if (message.channel.id == serverInfo.ingameReports && message.author.username == "Title reports") {
			let data = JSON.parse(message.content);
			
			if (data.Issuer.GoodReports >= data.Issuer.BadReports) {

				message.guild.channels.get(serverInfo.titleReporting).send(`
**================================**
Reports by <@${data.Issuer.DiscordID}>
\`👍 ${data.Issuer.GoodReports}\`
\`👎 ${data.Issuer.BadReports}\` 
`)

				for (let i = 0; i < data.Users.length; i++) {
					let r = data.Users[i];
					
					reportTitle(client, serverInfo, sql, message, `${r.Title} ? ${r.SteamID} ${r.DiscordID}`, data.Issuer.DiscordID);
				}
			}
		}



		// Add reaction when bot is mentioned
		message.mentions.users.forEach(user => {
			if (user.id == 328581069995507722 || user.id == 328632005627478019) {
				message.react(":pingsock:395678894650294274");
			}
		});

		/* if (
		  args.indexOf("bot") > -1 &&
		  message.mentions.users.first() == undefined
		) {
		  sentiment(message);
		} */

	}
};

function reportTitle(client, serverInfo, sql, message, titleInfo, Reporter) {
	let titleDetails = titleInfo.split(/[ ]+/);
	let discordID = titleDetails[titleDetails.length - 1];
	let steamID = titleDetails[titleDetails.length - 2];
	let color = titleDetails[titleDetails.length - 3];
	let title = titleDetails.splice(0, titleDetails.length - 3);
	title = title.join(" ");

	sql.get(`select * from titleReports where SteamID = ${steamID} order by ID desc`).then(row => {
		if (row && row.Permitted == 1) {
			return message.author.send("This user has been reported before and has been permitted to use this title.")
		}
		if (row && row.Fixed == 0) {
			return message.author.send("This user has an open report currently.")
		}

		message.guild.channels.get(serverInfo.titleReporting).send(`\`DiscordID: ${discordID} | SteamID: ${steamID} | title: ${title}\``).then(async m => {
			sql.run(`Insert into titleReports(DiscordID, SteamID, Title, Color, MessageID, Reporter) VALUES ('${discordID}', '${steamID}', '${mysql_real_escape_string(title)}', '${color}', '${m.id}', '${Reporter}')`)
			await m.react("🔨");
			await m.react("✅");
			await m.react("❎");
			await m.react("❌");
		})
	})
}

function sentiment(message) {
	var sentiment = require("sentiment");
	var sent = sentiment(message.content);
	var message2send = "";
	if (
		sent["comparative"]
		.toString()
		.replace(".", "")
		.replace("-", "").length > 2 ||
		sent["score"] == 0
	) {
		return;
	} else if (message.content.toLowerCase().includes("thanks")) {
		message = "No problem!";
	} else if (sent["score"] >= 2) {
		message2send = "Thanks!";
	} else if (sent["score"] <= -2) {
		message2send = ":worried:";
	}
	if (message2send != "") {
		message.channel.startTyping();
		setTimeout(() => {
			if (message2send != ":worried:") {
				message.reply(message2send);
			} else {
				message.channel.send(message2send);
			}
			message.channel.stopTyping();
		}, Math.random() * (1 - 2) + 1 * 1000);
	}
}

//Functions used to check if a player has the desired role
function pluck(array) {
	return array.map(function (item) {
		return item["name"];
	});
}

function hasRole(mem, role) {
	if (pluck(mem.roles).includes(role)) {
		return true;
	} else {
		return false;
	}
}

function noAutoResponceChannel(channelID, serverInfo) {
	if (channelID == serverInfo.aclogChannel) return true;
	if (channelID == serverInfo.basementChannel) return true;
	if (channelID == serverInfo.betaSteamIDS) return true;
	if (channelID == serverInfo.BotSpam) return true;
	if (channelID == serverInfo.modlogChannel) return true;
	if (channelID == serverInfo.serverlogChannel) return true;
	if (channelID == serverInfo.setSpecialTitleChannel) return true;
	if (channelID == serverInfo.setTitleChannel) return true;
	if (channelID == serverInfo.showcaseChannel) return true;
	if (channelID == serverInfo.staffChannel) return true;
	if (channelID == serverInfo.suggestionsChannel) return true;
	//Else return false
	return false;
}

function noCustomCommandsChannel(channelID, serverInfo) {
	if (channelID == serverInfo.aclogChannel) return true;
	if (channelID == serverInfo.betaSteamIDS) return true;
	if (channelID == serverInfo.modlogChannel) return true;
	if (channelID == serverInfo.serverlogChannel) return true;
	if (channelID == serverInfo.setSpecialTitleChannel) return true;
	if (channelID == serverInfo.setTitleChannel) return true;
	if (channelID == serverInfo.showcaseChannel) return true;
	if (channelID == serverInfo.suggestionsChannel) return true;
	//Else return false
	return false;
}

function getRandomIntInclusive(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function mysql_real_escape_string(str) {
	return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function(char) {
	  switch (char) {
		case "\0":
		  return "\\0";
		case "\x08":
		  return "\\b";
		case "\x09":
		  return "\\t";
		case "\x1a":
		  return "\\z";
		case "\n":
		  return "\\n";
		case "\r":
		  return "\\r";
		case "'":
		  return char + char; // prepends a backslash to backslash, percent,
		// and double/single quotes
		default:
		  return char
	  }
	});
  }

function postPin(message, sql, serverInfo, something) {
	const embed = new Discord.MessageEmbed()
		.setColor([255, 255, 0])
		.setAuthor("Make sure to read the pins before sending a message here!", serverInfo.logo);

	sql.get(`select * from misc where function = '${something}Msg'`).then(sugg => {
		if (sugg) {
			message.channel.messages.fetch(sugg.value).then(msg => msg.delete())
			message.channel.send(embed).then(msg => {
				sql.run(`update misc set value = '${msg.id}' where function = '${something}Msg'`)
			})
		} else {
			message.channel.send(embed).then(msg => {
				sql.run(`insert into misc(function, value) VALUES('${something}Msg', '${msg.id}')`)
			})
		}
	})
}