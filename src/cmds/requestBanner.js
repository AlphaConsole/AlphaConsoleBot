const jimp = require('jimp');
const fs = require('fs');
const request = require('request');
let cooldown = {};

module.exports = {
    title: "Request custom banner",
    details: [
        {
            perms      : "Everyone",
            command    : "Image URL or attachement in DM",
            description: "Request a server side custom banner."
        }
    ],

    run: ({ client, serverInfo, message, args, sql, config, sendEmbed }, override) => {
		if (!override) {
			if (message.channel.id !== serverInfo.channels.setBanner)
				return;
			
			try {
				let url;
				if (message.attachments.first()) 
					url = message.attachments.first().url
				else if (ValidURL(args[2])) 
					url = args[2]
				else {
					sql.query("SELECT * FROM Banners WHERE Name = ? OR ID = ?", [ args[2], args[2] ], (err, res) => {
						if (res[0]) {
							sql.query("UPDATE Players SET Banner = ? WHERE DiscordID = ?", [ res[0].Path, message.author.id ]);
							message.author.send("Your banner has been set to:", { files: [ config.keys.cdn_banners + "thumbnail/" + res[0].Path + ".png" ] })
						}
					})

					return message.delete().catch(e => {});
				} 

				if (!message.member.isBeta) 
					return message.delete().catch(e => {});

				if (!cooldown[message.author.id]) cooldown[message.author.id] = 0;
				if (cooldown[message.author.id] > new Date().getTime())
					return message.delete().catch(e => {}) ;

				cooldown[message.author.id] = new Date().getTime() + 10000;

				sql.query(`Select * from Players where DiscordID = ?`, [ message.author.id ], (err, res) => {
					if (err)
						return message.delete().catch(e => {}); 

					const user = res[0];

					if (!user) {
						message.author.send("Hi, in order to use our custom title service (and thereby also the banners) you must authorize your discord account. \n" +
											"Please click this link: http://alphaconsole.net/auth/index.php and login with your discord account.");
						return message.delete().catch(e => {});
					}


					jimp.read(url.split(" ").join("%20"), (err, image) => {
						if (err) {
							sendEmbed(message.author, "Invalid URL / image")
							return message.delete().catch(e => {});
						}

						message.delete().catch(e => {}) 
						let imgPath = "images/" + message.author.id + ".png";

						image
							.resize(420, 100) // resize
							.write(imgPath); // save

						//* If person is moderator+ then automatically approve the request
						//* Otherwise put in a request
						if (message.member.isModerator) {
							config.sql.query(`Select * from Players where DiscordID = ?`, [ message.author.id ], (err, res) => {

								let url = config.keys.SetBannerURL +  "?id=" + res[0].SteamID +
									"&key=" + config.keys.Password +
									"&url=" + message.attachments.first().url.split(" ").join("%20");
		
								request(url, function(err, res, body) {
									if (err) 
										return console.error(err);
		
									if (body.toLowerCase().startsWith("fail")) 
										return user.send("Something went wrong: " + body);
		
									config.sql.query("Update Players set Banner = ? where DiscordID = ?", [body.trim(), message.author.id], (err) => {
										if (err)
											return console.error(err);
										
										sendEmbed(message.author, "Your banner has been applied", undefined, undefined, message.attachments.first().url);
										message.delete();
									})
								})
							})
						} else {
							return client.channels.get(serverInfo.channels.banners).send(`**New Banner Request**\nUser:${message.author}`, {
								files: [ imgPath ]
							}).then(async m => {
								message.delete().catch(e => {}) 
								await m.react("✅");
								await m.react("❌");
								fs.unlinkSync(imgPath)
		
								sendEmbed(message.author, "Banner request sent. Please be patient.", undefined, undefined, m.attachments.first().url);
							});
						}
						
					});

				});
			} catch (error) {
				console.log("Gone wrong:", error);
			}
			return;
		}

		
		if (!message.member.isModerator) return;
 		/* Override version */
		const id = message.mentions.users.first() ? message.mentions.users.first().id : args[2];
		let url;
		if (message.attachments.first()) 
			url = message.attachments.first().url
		else if (ValidURL(args[3])) 
			url = args[3]
		else {
			sql.query("SELECT * FROM Banners WHERE Name = ? OR ID = ?", [ args[3], args[3] ], (err, res) => {
				if (res[0]) {
					sql.query("UPDATE Players SET Banner = ? WHERE DiscordID = ?", [ res[0].Path, id ]);
					message.author.send(`<@${id}>'s banner has been updated to:`, { files: [ config.keys.cdn_banners + "thumbnail/" + res[0].Path + ".png" ] })
				}
			})
 			return message.delete().catch(e => {});
		} 
 		console.log()
 		sql.query(`Select * from Players where DiscordID = ?`, [ id ], (err, res) => {
 			let call_url = config.keys.SetBannerURL +  "?id=" + res[0].SteamID +
				"&key=" + config.keys.Password +
				"&url=" + url.split(" ").join("%20");
 			request(call_url, function(err, res, body) {
				if (err) 
					return console.error(err);
 				if (body.toLowerCase().startsWith("fail")) 
					return user.send("Something went wrong: " + body);
 				sql.query("Update Players set Banner = ? where DiscordID = ?", [body.trim(), id], (err) => {
					if (err)
						return console.error(err);
					
						message.author.send(`<@${id}>'s banner has been updated to:`, { files: [ url ] })
					message.delete();
				})
			})
		})
    }
}


function ValidURL(s) {
	var regexp = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
	return regexp.test(s);
 }