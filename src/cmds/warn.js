const Discord = require("discord.js");

module.exports = {
  title: "warn",
  perms: "Support",
  commands: ["!Warn <@tag> <?Reason>"],
  description: [
    "Adds a warning to the user and in case it’s the second warning or higher he gets muted"
  ],

  run: async (client, serverInfo, sql, message, args) => {
    if (
      hasRole(message.member, "Support") ||
      hasRole(message.member, "Moderator") ||
      hasRole(message.member, "Admin") ||
      hasRole(message.member, "Developer")
    ) {
      if (message.mentions.users.first() == undefined) {
        const embedChannel = new Discord.MessageEmbed()
          .setColor([255, 255, 0])
          .setAuthor("Please tag the user to be warned", serverInfo.logo);
        return message.channel.send(embedChannel);
      } else {
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
                  sql
                    .get(
                      `select * from Members where DiscordID = '${
                        message.mentions.users.first().id
                      }'`
                    )
                    .then(row => {
                      WarnUser(client, serverInfo, sql, message, row, args);
                    });
                })
                .catch(err => console.log(err));
            } else {
              sql
                .get(
                  `select * from Members where DiscordID = '${
                    message.mentions.users.first().id
                  }'`
                )
                .then(row => {
                  WarnUser(client, serverInfo, sql, message, row, args);
                });
            }
          })
          .catch(err => console.log(err));
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

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function WarnUser(client, serverInfo, sql, message, row, args) {
  var user = message.mentions.users.first();

  if (args.length == 2) var TheReason = "No reason provided";
  else {
    var TheReason = "";
    for (i = 2; i < args.length; i++) {
      TheReason += args[i] + " ";
    }
  }

  sql
    .run(
      `Insert Into logs(Action, Member, Moderator, Reason, Time, ChannelID) VALUES('warn', '${
        user.id
      }', '${message.author.id}', '${mysql_real_escape_string(
        TheReason
      )}', '${new Date().getTime()}', '${message.channel.id}')`
    )
    .then(() => {
      var CaseID = "Error";
      sql
        .get(`select * from logs where Member = '${user.id}' order by ID desc`)
        .then(roww => {
          if (!roww) return message.channel.send("An error occured");

          CaseID = roww.ID;
          const embedChannel = new Discord.MessageEmbed()
            .setColor([255, 255, 0])
            .setAuthor(
              `${user.tag} has been warned! Case number: ${CaseID}`,
              serverInfo.logo
            );
          message.channel.send(embedChannel);

          if (row.Warnings == 0) {
            const embed = new Discord.MessageEmbed()
              .setColor([255, 255, 0])
              .setAuthor(
                "You have received a warning. Next warning will result in a temporary mute!",
                serverInfo.logo
              );
            user.send(embed);

            const embedLog = new Discord.MessageEmbed()
              .setColor([255, 255, 0])
              .setAuthor(`Case ${CaseID} | Warn`, serverInfo.logo)
              .setTitle("==> WARNING 1")
              .setDescription(
                "New warning of <@" +
                  user.id +
                  "> (" +
                  user.id +
                  ") by <@" +
                  message.author.id +
                  ">"
              )
              .addField("Reason", TheReason);
            client.guilds
              .get(serverInfo.guildId)
              .channels.get(serverInfo.modlogChannel)
              .send(embedLog)
              .then(msg => {
                sql.run(
                  `update logs set MessageID = '${
                    msg.id
                  }' where ID = '${CaseID}'`
                );
              });

            sql.run(
              `update Members set Warnings = '1' where DiscordID = '${user.id}'`
            );
          } else if (row.Warnings == 1) {
            const embed = new Discord.MessageEmbed()
              .setColor([255, 255, 0])
              .setAuthor(
                "You have received a second warning! You'll now be muted for 15 minutes, you are warned!",
                serverInfo.logo
              );
            user.send(embed);

            const embedLog = new Discord.MessageEmbed()
              .setColor([255, 255, 0])
              .setAuthor(`Case ${CaseID} | Warn`, serverInfo.logo)
              .setTitle("==> WARNING 2")
              .setDescription(
                "New warning of <@" +
                  user.id +
                  "> (" +
                  user.id +
                  ") by <@" +
                  message.author.id +
                  ">"
              )
              .addField("Reason", TheReason);
            client.guilds
              .get(serverInfo.guildId)
              .channels.get(serverInfo.modlogChannel)
              .send(embedLog)
              .then(msg => {
                sql.run(
                  `update logs set MessageID = '${msg.id}' where ID = ${CaseID}`
                );
              });

            timeextra = new Date().getTime({ limit: 100 }) + 1000 * 60 * 15;
            sql.run(
              `update Members set Warnings = '2', MutedUntil = '${timeextra}' where DiscordID = '${
                user.id
              }'`
            );

            let TheRole = message.guild.roles.find("name", "Muted");
            let TheUser = message.guild.member(
              message.mentions.users.first().id
            );
            TheUser.addRole(TheRole);
          } else if (row.Warnings > 1) {
            const embed = new Discord.MessageEmbed()
              .setColor([255, 255, 0])
              .setAuthor(
                "You have received another warning! You'll now be muted, and the staff will look into your behaviour for further actions.",
                serverInfo.logo
              );
            user.send(embed);

            const embedLog = new Discord.MessageEmbed()
              .setColor([255, 255, 0])
              .setAuthor(`Case ${CaseID} | Warn`, serverInfo.logo)
              .setTitle("==> WARNING 3")
              .setDescription(
                "New warning of <@" +
                  user.id +
                  "> (" +
                  user.id +
                  ") by <@" +
                  message.author.id +
                  ">"
              )
              .addField("Reason", TheReason);
            client.guilds
              .get(serverInfo.guildId)
              .channels.get(serverInfo.modlogChannel)
              .send(embedLog)
              .then(msg => {
                sql.run(
                  `update logs set MessageID = '${msg.id}' where ID = ${CaseID}`
                );
              });

            sql.run(
              `update Members set Warnings = '3' where DiscordID = '${user.id}'`
            );

            let TheRole = message.guild.roles.find("name", "Muted");
            let TheUser = message.guild.member(
              message.mentions.users.first().id
            );
            TheUser.addRole(TheRole);
          }
        });
    });
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
