const Discord = require("discord.js");

module.exports = {
  title: "guildMemberUpdate",
  description: [
    "Logs a message if someone changed his name on the Discord or when roles are changed"
  ],

  run: async (client, serverInfo, oldMember, newMember, sql, keys) => {
    if (oldMember.nickname != newMember.nickname) {
      if (newMember.nickname == null) {
        client.guilds
          .get(serverInfo.guildId)
          .channels.get(serverInfo.serverlogChannel)
          .send(
            ":man_with_gua_pi_mao: `[" +
              new Date().toTimeString().split(" ")[0] +
              "]` **" +
              newMember.user.tag +
              "** has reset their nickname to **" +
              newMember.user.username +
              "**"
          );
      } else {
        newMember.nickname = newMember.nickname.replace(/<@/g, '<(at)');

        client.guilds
          .get(serverInfo.guildId)
          .channels.get(serverInfo.serverlogChannel)
          .send(
            ":man_with_gua_pi_mao: `[" +
              new Date().toTimeString().split(" ")[0] +
              "]` **" +
              newMember.user.tag +
              "** has changed their nickname to **" +
              newMember.nickname +
              "**"
          );
      }
    }
    //Not the best way to check difference but becase every time a role is added/removed
    //it has its own event, this will work.
    if (oldMember.roles.array().length != newMember.roles.array().length) {
      var oldRoles = "";
      oldMember.roles.array().forEach(role => {
        if (role.name != "@everyone") oldRoles += ", " + role.name;
      });

      var newRoles = "";
      newMember.roles.array().forEach(role => {
        if (role.name != "@everyone") newRoles += ", " + role.name;
      });

      var newRolesID = "";
      newMember.roles.array().forEach(role => {
        if (role.name != "@everyone") newRolesID += " " + role.id;
      });

      if (oldRoles.includes("Twitch Sub") && !newRoles.includes("Twitch Sub") && !isStaff(newMember)) {
        var request = require("request");
        var url = keys.SetTitleURL;
        user = newMember;
        url += "?DiscordID=" + user.id + "&key=" + keys.Password + "&color=1";
        request(
          {
            method: "GET",
            url: url
          },
          function(err, response, body) {}
        );
        oldMember.send(
          "Hi, your Twitch Subscription to AlphaConsole has ended therefor your access to the" +
            " subscriber features has been removed and your title colour has been reset. If you subscribe again you will have access to those " +
            " features again. \n<https://www.twitch.tv/alphaconsole> \nHave a great day!"
        );

        sql.run(`delete from BetaSteamIDS where DiscordID = '${oldMember.id}'`);

        const embedlog = new Discord.MessageEmbed()
          .setColor([255, 255, 0])
          .setAuthor("Title Colour Auto Reset", serverInfo.logo)
          .setDescription("<@" + user.id + ">'s colour has been reset because Twitch Subscription ended.")
          .setTimestamp();
        client.guilds
          .get(serverInfo.guildId)
          .channels.get(serverInfo.aclogChannel)
          .send(embedlog);
      }

      if (newRoles.includes("Twitch Sub") && !oldRoles.includes("Twitch Sub")) {
        newMember.send(
          "Thank you for subscribing to our twitch! :smile: You now have access to several benefits including:\n\n" +
            "Green & Purple title colors\n" +
            "The `AlphaConsole Twitch Sub` special title (found in `#set-special-title`)\n" +
            "Our beta program (Please read `#beta-info` and the pin in `#beta-steam-ids` carefully!)\n" +
            "The `#subs-and-legacy` text channel and priority support\n" +
            "Various Discord server enhancements such as nickname perms\n\n" +
            "You will keep these benefits for as long as you are subscribed, and you will have a 3 day window to resubscribe if your subscription runs out. Thank you again for your subscription and your extra level of support for AlphaConsole!"
        );

        const embedlog = new Discord.MessageEmbed()
          .setColor([255, 255, 0])
          .setAuthor("New Twitch Subscriber!", serverInfo.logo)
          .setDescription("<@" + newMember.id + "> subscribed to AlphaConsole!")
          .setTimestamp();
        client.guilds
          .get(serverInfo.guildId)
          .channels.get(serverInfo.aclogChannel)
          .send(embedlog);
      }

      // Legacy role added, and not in old roles.
      if (newRoles.includes("Legacy") && !oldRoles.includes("Legacy")) {
        newMember.send(
          "Congratulations on becoming a Legacy member! :smile: You now have access to several benefits including:\n\n" +
            "Green & Purple title colors\n" +
            "Our beta program (Please read `#beta-info` and the pin in `#beta-steam-ids` carefully!)\n" +
            "The `#subs-and-legacy` text channel and priority support\n" +
            "Various Discord server enhancements such as nickname perms\n\n" +
            "You will keep these benefits forever! Thank you for your support of AlphaConsole!"
        );
      }

      //Let's first check if the user even exists in the db
      sql
        .get(`select * from Members where DiscordID = '${newMember.user.id}'`)
        .then(row => {
          if (!row) {
            var today = new Date().getTime();
            sql
              .run(
                `Insert into Members(DiscordID, Username, JoinedDate)VALUES('${
                  newMember.user.id
                }', '${mysql_real_escape_string(
                  newMember.user.username
                )}', '${today}')`
              )
              .then(() => {
                sql.run(
                  `update Members set Roles = '${newRolesID.substring(
                    1
                  )}' where DiscordID = '${newMember.user.id}'`
                );
              })
              .catch(err => console.log(err));
          } else {
            sql.run(
              `update Members set Roles = '${newRolesID.substring(
                1
              )}' where DiscordID = '${newMember.user.id}'`
            );
          }
        })
        .catch(err => console.log(err));

      if (oldMember.roles.size == 1) {
        client.guilds
          .get(serverInfo.guildId)
          .channels.get(serverInfo.serverlogChannel)
          .send(
            ":man_with_gua_pi_mao: `[" +
              new Date().toTimeString().split(" ")[0] +
              "]` **" +
              newMember.user.tag +
              "**'s roles have changed. Old: '' | New: `" +
              newRoles.substring(2) +
              "`"
          );
      } else {
        client.guilds
          .get(serverInfo.guildId)
          .channels.get(serverInfo.serverlogChannel)
          .send(
            ":man_with_gua_pi_mao: `[" +
              new Date().toTimeString().split(" ")[0] +
              "]` **" +
              newMember.user.tag +
              "**'s roles have changed. Old: `" +
              oldRoles.substring(2) +
              "` | New: `" +
              newRoles.substring(2) +
              "`"
          );
      }
    }
  }
};

function isStaff(user) {
  if (
    hasRole(user, "Developer") ||
    hasRole(user, "Admin") ||
    hasRole(user, "Moderator") ||
    hasRole(user, "Support")
  ) {
    return true;
  } else {
    return false;
  }
}

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
  return str.replace(/'/g, function(char) {
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
