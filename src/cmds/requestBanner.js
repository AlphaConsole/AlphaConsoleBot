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

    run: ({ client, serverInfo, message, args, sql, config, sendEmbed, member, discord }) => {
			if (!member.isBeta) return;

			let url;
			if (message.attachments.first()) 
				url = message.attachments.first().url
			else if (ValidURL(message.content)) 
				url = message.content
			else 
				return;

			if (!cooldown[message.author.id]) cooldown[message.author.id] = 0;
			if (cooldown[message.author.id] > new Date().getTime())
				return;

			cooldown[message.author.id] = new Date().getTime() + 10000;

			sql.query(`Select * from Players where DiscordID = ?`, [ message.author.id ], (err, res) => {
				const user = res[0];

				if (!user) 
					return message.channel.send("Hi, in order to use our custom title service (and thereby also the banners) you must authorize your discord account. \n" +
										"Please click this link: http://alphaconsole.net/auth/index.php and login with your discord account.");

				probe(url.split(" ").join("%20"), function (err, result) {

					if (result.type !== "png")
						return message.channel.send("Currently we only accept .png files.");

					if (result.width !== 420 || result.height !== 100)
						return message.channel.send("The dimensions of a banner is **420x100**. We thereby only accept those dimensions!");

					sendEmbed(message.channel, "Banner request sent. Please be patient.")

					return client.channels.get(serverInfo.channels.banners).send(`**New Banner Request**\nUser:${message.author}`, {
						files: [result.url]
					}).then(async m => {
						await m.react("✅");
						await m.react("❌");
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