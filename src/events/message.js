/**
 * ! New message event
 * 
 * ? Every single message being sent is being validated by this file
 * ? For example checking for links, checking for swear words etc...
 */
const Discord = require('discord.js');

module.exports.run = ({ client, serverInfo, message, args, sql, config, sendEmbed }, cmd) => {
    let keys = config.keys;

    //! First all the filters before continueing

    //* Swear words filter
    if (!message.member.isStaff) {
        for (let i = 0; i < config.swearwords.length; i++) {
            if (message.content.includes(config.swearwords[i])) {
                message.delete().catch(e => { });
            }
        }
    }

    //* Links filter
    if (!message.member.isCH) {
        if (!(config.permits[message.author.id] && config.permits[message.author.id].channel === message.channel.id && config.permits[message.author.id].until > new Date().getTime())) {
            if (!config.whitelistedLinksChannel.includes(message.channel.id)) {
                let matches = message.content.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/ig));
                let filtered = matches ? matches.filter(m => !m.endsWith("discord.gg/alphaconsole")) : null;

                if (filtered && filtered[0]) {
                    message.delete().catch(e => { });
                    sendEmbed(message.author, "Links are not allowed in this channel.")
                }
            }
        }
    }

    //* Invite guard
    if (!message.member.isAdmin) {
        if (!(config.permits[message.author.id] && config.permits[message.author.id].channel === message.channel.id && config.permits[message.author.id].until > new Date().getTime())) {
            if ((message.content.includes("discord.me/") || message.content.includes("discord.gg/") || message.content.includes("discordapp.com/invite/"))
                && !message.content.includes("discord.gg/alphaconsole")) {

                message.delete().catch(e => { });
                sendEmbed(message.author, "Discord invites are not allowed in this channel")
            }
        }
    }

    //* Auto responds
    if (!message.member.isStaff && !AutoResponseChannel(message.channel.id, serverInfo.channels)) {
        for (const word in config.autoResponds) {
            if (config.autoResponds.hasOwnProperty(word)) {
                let words = word.split(/[ ]+/);
                let counter = 0;

                for (let i = 0; i < words.length; i++) {
                    if (message.content.includes(words[i])) counter++;
                }

                if (counter == words.length) {
                    message.channel.send(`${message.member}, ${config.autoResponds[word]}`)
                }
                
            }
        }
    }

    // ! End of filters. Start of other functionalities
    if (message.content.startsWith('!') && !CustomCommandsChannel(message.channel.id, serverInfo.channels)) {
        sql.query('select * from Commands where Command = ?', [ cmd ], (err, res) => {
            if (err) return console.error(err);

            if (res.length !== 0) {
                let user = message.mentions.users.first() ? message.mentions.users.first().id : args.length === 1 ? "123456" : args[1];
                message.guild.members.fetch(user).then(m => {
                    message.channel.send(`<@${m.id}>, ${res[0].Response}`)
                }).catch(e => {
                    message.channel.send(res[0].Response)
                })
            }
        })
    }

    // ! Showcase & Suggestions
    if (message.channel.id === serverInfo.channels.showcase) {
        if (message.attachments.size !== 1) {
            message.delete().catch(e => { });
            return sendEmbed(message.author, "Only images allowed in Showcase channel.");
        }

        require('../helpers/checkUser').run(sql, message.author, async (err, user) => {
            if (user.Showcase < new Date().getTime()) {
                await message.react("👍");
                await message.react("👎");
                await message.react("❌");
                postPin(client, message, sql, serverInfo, "showcase");

                sql.query("Update Members set Showcase = ? where DiscordID = ?", [ new Date().getTime() + 300000, message.author.id ]);
            } else {
                message.delete().catch(e => { });
                sendEmbed(message.author, "Your showcase has been removed since you can only send in once every 5 minutes!")
            }
        })
    }

    if (message.channel.id === serverInfo.channels.suggestion) {
        require('../helpers/checkUser').run(sql, message.author, async (err, user) => {
            if (user.Suggestion < new Date().getTime()) {
                await message.react("👍");
                await message.react("👎");
                await message.react("❌");
                postPin(client, message, sql, serverInfo, "suggestion");

                sql.query("Update Members set Suggestion = ? where DiscordID = ?", [ new Date().getTime() + 300000, message.author.id ]);
            } else {
                message.delete().catch(e => { });
                sendEmbed(message.author, "Your suggestion has been removed since you can only send in once every 5 minutes!")
            }
        })
    }

    // ! Staff title reporting
    if (message.channel.id === serverInfo.channels.ingameReports && !message.content.startsWith('.')) {
        message.delete();

        let request = require("request");
        request(`${config.keys.CheckdbURL}?DiscordID=${message.content}`, (err, res, body) => {
            if (err) return console.error(err);

            if (body !== "Not signed up for DB") {
                reportTitle(client, serverInfo, sql, message, body, message.author.id)
            } else {
                request(`${config.keys.CheckdbURL}?SteamID=${message.content}`, (error, result, bodydata) => {
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


    // ! Beta Steam IDs for instant beta signup
    if (message.channel.id === serverInfo.channels.betaSteamIDS) {
        message.delete();

        //maybe move this to commands so you can force a user aswell
        //Maybe question if it's the correct URL??
        function setBeta(member, steamID) {
            var request = require("request");
            var url = keys.SetBetaURL +
                "?DiscordID=" + member.id +
                "&key=" + keys.Password +
                "&SteamID=" + steamID;
            request({ method: "GET", url: url }, function (err, response, body) {
                if (err)
                    return member.send("An error occured. Please try again later.");

                if (body) 
                    member.send(body);    
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

    // ! Add reaction when bot is mentioned
		message.mentions.users.forEach(user => {
			if (user.id == client.user.id) 
				message.react(":pingsock:395678894650294274");
		});
}


function AutoResponseChannel(channelID, channels) {
	if (channelID === channels.aclog) return true;
	if (channelID === channels.basement) return true;
	if (channelID === channels.betaSteamIDS) return true;
	if (channelID === channels.botSpam) return true;
	if (channelID === channels.modlog) return true;
	if (channelID === channels.serverlog) return true;
	if (channelID === channels.setSpecialTitleChannel) return true;
	if (channelID === channels.setTitle) return true;
	if (channelID === channels.showcase) return true;
	if (channelID === channels.suggestion) return true;
	if (channelID === channels.staff) return true;
	//Else return false
	return false;
}

function CustomCommandsChannel(channelID, channels) {
	if (channelID === channels.aclog) return true;
	if (channelID === channels.betaSteamIDS) return true;
	if (channelID === channels.modlog) return true;
	if (channelID === channels.serverlog) return true;
	if (channelID === channels.setSpecialTitleChannel) return true;
	if (channelID === channels.setTitle) return true;
	if (channelID === channels.showcase) return true;
	if (channelID === channels.suggestion) return true;
	//Else return false
	return false;
}




/**
 * ! Bot messages
 * 
 * ? This is a small part that is very dangerous!
 * ? This does not check if we are in the right server or if the author was a bot.
 * ? This is for a functionality whereby the bot needs to respond on a message from another bot.
 */

module.exports.botMessage = (client, serverInfo, sql, message) => {
    if (message.channel.id === serverInfo.channels.ingameReports && message.author.bot && message.author.username == "Title reports") {
        let data = JSON.parse(message.content);

        message.guild.channels.get(serverInfo.channels.ingameReports).send(
            `**================================**\n` +
            `Reports by <@${data.Issuer.DiscordID}>\n` +
            `\`👍 ${data.Issuer.GoodReports}\`\n` +
            `\`👎 ${data.Issuer.BadReports}\`\n`
        ).then(m => { m.react("❌"); })

        for (let i = 0; i < data.Users.length; i++) {
            let r = data.Users[i];
            reportTitle(client, serverInfo, sql, message, `${r.Title} ? ${r.SteamID} ${r.DiscordID}`, data.Issuer.DiscordID);
        }
    }
}

function reportTitle(client, serverInfo, sql, message, titleInfo, Reporter) {
	let titleDetails = titleInfo.split(/[ ]+/);
	let discordID = titleDetails[titleDetails.length - 1];
	let steamID = titleDetails[titleDetails.length - 2];
	let color = titleDetails[titleDetails.length - 3];
	let title = titleDetails.splice(0, titleDetails.length - 3);
	title = title.join(" ");

	sql.query(`select * from TitleReports where SteamID = ? order by ID desc`, [ steamID ], (err, res) => {
        if (res[0]) {
            if (res[0].Permitted === 1) {
                if (!message.author.bot) message.author.send("This user has been reported before and has been permitted to use this title.")
                return;
            }
            if (res[0].Fixed === 0) {
                if (!message.author.bot) message.author.send("This user has an open report currently.");
                return;
            }
        }

		message.guild.channels.get(serverInfo.channels.ingameReports).send(`\`DiscordID: ${discordID} | SteamID: ${steamID} | title: ${title}\``).then(async m => {
			sql.query(`Insert into TitleReports(DiscordID, SteamID, Title, Color, MessageID, Reporter) VALUES (?, ?, ?, ?, ?, ?)`, [ discordID, steamID, title, color, m.id, Reporter ])
			await m.react("🔨");
			await m.react("✅");
			await m.react("❎");
		})
	})
}


function postPin(client, message, sql, serverInfo, something) {
	const embed = new Discord.MessageEmbed()
		.setColor([255, 255, 0])
		.setAuthor("Make sure to read the pins before sending a message here!", client.user.displayAvatarURL({ format: "png" }));

	sql.query(`select * from Misc where value = ?`, [ something ], (err, res) => {
        if (err) return console.error(err);
        let sugg = res[0];

		if (sugg) {
			message.channel.messages.fetch(sugg.message).then(msg => msg.delete())
			message.channel.send(embed).then(msg => {
				sql.query(`update Misc set message = ? where value = ?`, [ msg.id, something ])
			})
		} else {
			message.channel.send(embed).then(msg => {
				sql.query(`insert into Misc(message, value) VALUES(?, ?)`, [ msg.id, something ])
			})
		}
	})
}