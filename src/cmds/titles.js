/**
 * ! Titles command
 */
const request = require('request');

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

    run: ({ client, serverInfo, message, args, sql, config, sendEmbed }) => {
		try {
			
		
			//* Just to make it easy since we'll use it by times
			let blacklist = config.blacklistedWords;
			let keys = config.keys;
			message.delete().catch(() => {});

			/**
			 * ! All functions used for the titles section.
			 * 
			 * ? This is above the handler because it must be loaded BEFORE we call it.
			 * ? That's why all functions we need will be here at the top.
			 * 
			 * ? Why don't we just put the outside the module.exports?
			 * ? This way we don't have to send serverInfo & those vars to every single function over & over again.
			 */

			function setUsersTitle(id, title) {
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
								sendEmbed(message.author, "Your title has been updated to: `" + title + "`")
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

			function setUsersColour(id, colour) {
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
								sendEmbed(message.author, "Your title has been updated to: `" + colour + "`")
							else if (body.toLowerCase().includes("the user does not exist"))
								sendEmbed(message.author, "Hi, in order to use our custom title service you must authorize your discord account. \n" +
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
				if (message.channel.id !== serverInfo.channels.setTitle) return;
				let userTitle = createTitle(args, 2);
				let titles = userTitle.split(/[::]+/);

				if (titles.length > 5)
					return sendEmbed(message.author, "AlphaConsole does not support more than 5 rotations in your custom title. Please try again.")

				let valid = isValidTitle(message, blacklist, userTitle, serverInfo);
				if (valid)
					setUsersTitle(message.author.id, userTitle);
				else 
					sendEmbed(message.author, "Error whilst setting title", "Your custom title was not set because it contained a blacklisted phrase. \n" +
					"AlphaConsole does not allow faking of real titles. If you continue to try and bypass the blacklist system, it could result in loss of access to our custom titles.")
			}

			function overrideTitle() {
				if (!message.member.isModerator) return;
				if (message.mentions.users.first()) 
					id = message.mentions.users.first().id;
				else 
					id = args[2];

				let title = createTitle(args, 3);
				setUsersTitle(id, title);
			}

			function setColour() {
				if (message.channel.id !== serverInfo.channels.setTitle) return;
				let colours = args[2].split("::");

				let valid = isValidColor(message, colours, serverInfo);
				if (valid)
					setUsersColour(message.author.id, args[2]);
				else
					sendEmbed(message.author, "Error whilst setting colour", "Hi, you have either chosen an invalid colour or a colour you do not have access to." +
					"\nSubscribe to our twitch for access to more colours! \nhttps://www.twitch.tv/alphaconsole")
			}

			function overrideColour() {
				if (!message.member.isModerator) return;
				if (message.mentions.users.first()) 
					id = message.mentions.users.first().id;
				else 
					id = args[2];

				setUsersTitle(id, args[3]);
			}

			function setSpecialTitle() {

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
				console.log(badWord);
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