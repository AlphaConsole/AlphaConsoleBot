/**
 * ! disablebanner command
 * 
 * ? Simply removes a user's banner. For now it's left on the server but that will be updated when I have access.
 */
const Discord = require('discord.js');

module.exports = {
     title: "Status",
     details: [
        {
            perms      : "Moderator",
            command    : "!disablebanner",
            description: "Removes a user's banner"
        }
    ],

    run: async ({ client, message, args, sql, config, sendEmbed, serverInfo}) => {
        if (!message.member.isModerator && message.author.id != "345769053538746368") return;

        if(args.length < 2) return sendEmbed("An error occured", "Please supply a user who's banner you want to reset!")
        sql.query(
            "Select * from Titles where DiscordID = ?",
            [args[1]],
            (err, rows) => {
              const user = rows[0];
              //console.log(rows)
              if (!user)
                return sendEmbed(
                  message.channel,
                  "An error occured",
                  "This user has not signed up for our title service!"
                );
      
              if (user.Banner === null) {
                return sendEmbed(
                  message.channel,
                  "An error occured",
                  "This user does not have a banner to disable!"
                );
              }
              else {
                config.sql.query(`UPDATE Titles set Banner = NULL WHERE DiscordID = ?`, [
                  args[1]
                ]);
                config.sql.query("UPDATE Titles set BannerAccepted = 0 WHERE DiscordID = ?", [
                  args[1]
                ]);
                sendEmbed(message.guild.channels.get(serverInfo.channels.modlog), "Success",
                "This user's banner has successfully been reset by <@!"+message.author+">!")
                return sendEmbed(
                    message.channel,
                    "Success",
                    "This user's banner has successfully been reset by <@!"+message.author+">!"
                )
              }
            }
          );
    }
};
