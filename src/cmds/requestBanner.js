const probe = require('probe-image-size');
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

    run: ({ client, serverInfo, message, args, sql, config, sendEmbed }) => {
		const keys = config.keys;

		if (!cooldown[message.author.id]) cooldown[message.author.id] = 0;
		if (cooldown[message.author.id] > new Date().getTime())
			return;

		cooldown[message.author.id] = new Date().getTime() + 10000;

		sql.query(`Select * from Players where DiscordID = ?`, [ message.author.id ], (err, res) => {
			sql.query(`Select * from PendingBanners where requesterDiscordID = ? AND StaffID IS NULL`, [ message.author.id ], (err, currentbanners) => {

				const user = res[0];

				if (!user) 
					return message.channel.send("Hi, in order to use our custom title service (and thereby also the banners) you must authorize your discord account. \n" +
									"Please click this link: http://alphaconsole.net/auth/index.php and login with your discord account.");

				let url;
				/* if (message.attachments.first()) 
					url = message.attachments.first().url * I KEPT THIS IN CASE WE ALLOW IMAGE POSTING THROUGH DISCORD.
				else  */if (ValidURL(message.content)) 
					url = message.content
				else 
					return;

				probe(url, function (err, result) {
					
					if (result.type !== "png")
						return message.channel.send("Currently we only accept .png files.");

					if (result.width !== 420 || result.height !== 100)
						return message.channel.send("The dimensions of a banner is **420x100**. We thereby only accept those dimensions!");

					if (currentbanners[0]) {
						sql.query("DELETE FROM PendingBanners WHERE ID = ?", [ currentbanners[0].ID ]);
						sendEmbed(message.author, "Custom banner requested. Your previous requested banner has been overwritten.")
					} else {
						sendEmbed(message.author, "Custom banner requested. Please wait for us to confirm.")
					}
					sql.query("INSERT INTO PendingBanners(RequesterDiscordID, ImageLink) VALUES(?, ?)", [ message.author.id, url ]);
				});
			});
		});

    }
}


function ValidURL(str) {
	var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
	'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
	'((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
	'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
	'(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
	'(\\#[-a-z\\d_]*)?$','i'); // fragment locator
	return pattern.test(str);
}