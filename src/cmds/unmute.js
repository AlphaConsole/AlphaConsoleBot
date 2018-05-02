const Discord = require("discord.js");

module.exports = {
  title: "unmute",
  perms: "Support",
  commands: ["!Unmute <@tag>"],
  description: ["Unmutes the person"],

  run: async (client, serverInfo, sql, message, args) => {
    if (
      hasRole(message.member, "Support") ||
      hasRole(message.member, "Moderator") ||
      hasRole(message.member, "Admin") ||
      hasRole(message.member, "Developer")
    ) {
      //Check if someone is tagged
      if (message.mentions.users.first() == undefined) {
        const embed = new Discord.MessageEmbed()
          .setColor([255, 255, 0])
          .setAuthor("Please tag the user to be unmuted", serverInfo.logo);
        return message.channel.send(embed);
      }

      if (args.length == 2) {
        if (
          !hasRole(
            message.guild.member(message.mentions.users.first().id),
            "Muted"
          )
        ) {
          const embed = new Discord.MessageEmbed()
            .setColor([255, 255, 0])
            .setAuthor(
              "Cannot unmute a user that isn't muted.",
              serverInfo.logo
            );
          return message.channel.send(embed);
        }

        //Simply just add the mute role
        let MutedRole = message.guild.roles.find("name", "Muted");
        let MutedUser = message.guild.member(message.mentions.users.first().id);
        MutedUser.removeRole(MutedRole);

        //Make a notice & Log it to the log-channel
        const embed = new Discord.MessageEmbed()
          .setColor([255, 255, 0])
          .setAuthor(
            `${message.mentions.users.first().tag} has been unmuted.`,
            serverInfo.logo
          );
        message.channel.send(embed); //Remove this line if you don't want it to be public.

        const embedlog = new Discord.MessageEmbed()
          .setColor([255, 255, 0])
          .setAuthor("=== USER UNMUTE ===", serverInfo.logo)
          .setDescription(
            `${message.guild.members.get(message.mentions.users.first().id)} (${
              message.mentions.users.first().id
            }) has been unmuted by ${message.member}`
          )
          .setTimestamp();
        message.guild.channels.get(serverInfo.modlogChannel).send(embedlog);

        //Let's first check if the user even exists in the db
        sql
          .get(
            `select * from Members where DiscordID = '${
              message.mentions.users.first().id
            }'`
          )
          .then(row => {
            if (!row) {
              var today = new Date().getTime();
              sql
                .run(
                  `Insert into Members(DiscordID, Username, JoinedDate)VALUES('${
                    message.mentions.users.first().id
                  }', '${mysql_real_escape_string(
                    message.mentions.users.first().username
                  )}', '${today}')`
                )
                .then(() => {
                  //Update Database and set his MutedUntill back to null in case he's unmuted from a temp mute
                  sql
                    .run(
                      `Update Members set MutedUntil = null where DiscordID = '${
                        message.mentions.users.first().id
                      }'`
                    )
                    .catch(err => console.log(err));
                })
                .catch(err => console.log(err));
            } else {
              //Update Database and set his MutedUntill back to null in case he's unmuted from a temp mute
              sql
                .run(
                  `Update Members set MutedUntil = null where DiscordID = '${
                    message.mentions.users.first().id
                  }'`
                )
                .catch(err => console.log(err));
            }
          })
          .catch(err => console.log(err));
      } else {
        const embed = new Discord.MessageEmbed()
          .setColor([255, 255, 0])
          .setAuthor(
            "__Command wrongly build:__ \n\n`!Unmute @user`",
            serverInfo.logo
          );
        return message.channel.send(embed);
      }
    }
  }
};

//Functions used to check if a player has the desired role
function pluck(array) {
  return array.map(function(item) {
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
