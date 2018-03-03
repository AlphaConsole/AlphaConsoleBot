const Discord = require("discord.js");

module.exports = {
  title: "kick",
  perms: "Moderator",
  commands: ["!Kick <@tag> <?Reason>"],
  description: ["Kicks the person with the given reason"],

  run: async (client, serverInfo, sql, message, args) => {
    if (
      hasRole(message.member, "Moderator") ||
      hasRole(message.member, "Admin") ||
      hasRole(message.member, "Developer")
    ) {
      //Check if someone is tagged
      if (message.mentions.users.first() == undefined) {
        const embed = new Discord.MessageEmbed()
          .setColor([255, 255, 0])
          .setTitle("Please tag the user to be kicked");
        return message.channel.send(embed);
      }

      //Check if there is a reason
      if (args.length == 2) {
        var TheReason = "No reason provided";
      } else {
        var TheReason = "";
        for (i = 2; i < args.length; i++) {
          TheReason += args[i] + " ";
        }
      }

      //Let's start kicking the user
      let KickedUser = message.guild.member(message.mentions.users.first().id);
      KickedUser.kick(TheReason);

      //Insert the log into the database
      sql
        .run(
          `Insert into logs(Action, Member, Moderator, Reason, Time, ChannelID) VALUES('kick', '${
            KickedUser.id
          }', '${message.author.id}', '${mysql_real_escape_string(
            TheReason
          )}', '${new Date().getTime()}', '${message.channel.id}')`
        )
        .then(() => {
          var CaseID = "Error";
          sql
            .get(
              `select * from logs where Member = '${
                KickedUser.id
              }' order by ID desc`
            )
            .then(roww => {
              if (!roww) return message.channel.send("An error occured");

              CaseID = roww.ID;

              //Make a notice & Log it to the log-channel
              const embed = new Discord.MessageEmbed()
                .setColor([255, 255, 0])
                .setAuthor(
                  `${
                    message.mentions.users.first().tag
                  } has been kicked from the server. Case number: ${CaseID}`,
                  serverInfo.logo
                );
              message.channel.send(embed); //Remove this line if you don't want it to be public.

              const embedlog = new Discord.MessageEmbed()
                .setColor([255, 255, 0])
                .setAuthor(`Case ${CaseID} | User Kick`, serverInfo.logo)
                .setDescription(
                  `**${message.mentions.users.first().tag}** (${
                    message.mentions.users.first().id
                  }) has been kicked by ${message.member}`
                )
                .setTimestamp()
                .addField("Reason", TheReason);
              message.guild.channels
                .get(serverInfo.modlogChannel)
                .send(embedlog)
                .then(msg => {
                  sql.run(
                    `update logs set MessageID = '${
                      msg.id
                    }' where ID = '${CaseID}'`
                  );
                });
            });
        })
        .catch(err => console.log(err));
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
      case '"':
      case "'":
      case "\\":
      case "%":
        return char + char; // prepends a backslash to backslash, percent,
      // and double/single quotes
    }
  });
}
