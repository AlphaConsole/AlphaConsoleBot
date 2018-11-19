/**
 * ! Disable command
 */
const request = require('request');

module.exports = {
    title: "Disable",
    details: [
        {
            perms      : "Everyone",
            command    : "!Disable",
            description: "Disables your custom title or banner"
        }
    ],

    run: ({ client, serverInfo, message, args, sql, config, sendEmbed }) => {
		switch (message.channel.id) {
		  case serverInfo.channels.setBanner:
				sql.query("UPDATE Players SET Banner = null WHERE DiscordID = ?", [ message.author.id ]);
				sendEmbed(message.author, "Your banner has been disabled.");
				break;

			case serverInfo.channels.setTitle:
			case serverInfo.channel.setSpecialTitle:
				sql.query("UPDATE Players SET Title = 'X' WHERE DiscordID = ?", [ message.author.id ]);
				sendEmbed(message.author, "Your title has been disabled.");
				break;

			default:
				break;
		}
      

    }
};