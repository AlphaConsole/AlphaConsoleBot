const Discord = require("discord.js");

module.exports = {
  title: "nick",
  perms: "Moderator",
  commands: ["!nick <@tag or id> <Nickname>"],
  description: ["Changes the nickname of the user"],

  run: async (client, serverInfo, sql, message, args) => {
    if (
      hasRole(message.member, "Moderator") ||
      hasRole(message.member, "Admin") ||
      hasRole(message.member, "Developer")
    ) {
      if (args.length < 3) {
        const embed = new Discord.MessageEmbed()
          .setColor([255, 255, 0])
          .setAuthor(
            "Please include the user and his new nickname",
            serverInfo.logo
          );
        return message.channel.send(embed);
      }

      var userID = message.mentions.users.first()
        ? message.mentions.users.first().id
        : args[1];

      message.guild.members
        .fetch(userID)
        .then(member => {
          var newName = "";
          for (let i = 2; i < args.length; i++) {
            newName += args[i] + " ";
          }

          member.setNickname(newName);
          const embed = new Discord.MessageEmbed()
            .setColor([255, 255, 0])
            .setAuthor("Nickname updated.", serverInfo.logo);
          return message.channel.send(embed);
        })
        .catch(e => {
          const embed = new Discord.MessageEmbed()
            .setColor([255, 255, 0])
            .setAuthor("Provided user not found.", serverInfo.logo);
          return message.channel.send(embed);
        });
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

/**
 * Returns true if user is part of staff
 * @param {user} user
 */
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
