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

    run: async ({ client, serverInfo, message, args, sql, config, sendEmbed, checkStatus }) => {

        if (!message.member.isModerator) return;

        if(args.length < 1) return sendEmbed("An error occured", "Please supply a user who's banner you want to remove!")

        sql.query(
            "Select * from Titles where DiscordID = ?",
            [args[0]],
            (err, rows) => {
              const user = rows[0];
      
              if (!user)
                return sendEmbed(
                  message.channel,
                  "An error occured",
                  "This user has not signed up for our title service!"
                );
      
              if (user.Banner === NULL) {
                return sendEmbed(
                  message.channel,
                  "An error occured",
                  "This user does not have a banner to disable!"
                );
              }
              else {
                config.sql.query("UPDATE Titles set Banner = NULL WHERE DiscordID = ?", [
                    user.id
                ]);
                config.sql.query("UPDATE Titles set BannerAccepted = 0 WHERE DiscordID = ?", [
                    user.id
                ]);
                return sendEmbed(
                    message.channel,
                    "Success",
                    "This user's banner has successfully been reset!"
                )
              }
            }
          );
    }
};
