const Discord = require("discord.js");

module.exports = {
  title: "events",
  perms: "Admin",
  commands: ["!events"],
  description: ["Provides all the events"],

  run: async (client, serverInfo, message, args, Events) => {
    if (
      hasRole(message.member, "Admin") ||
      hasRole(message.member, "Developer")
    ) {
      // <---   If you would like to change role perms. Change [BontControl] to your role name

      if (args.length == 1) {
        const embed = new Discord.MessageEmbed()
          .setColor([255, 255, 0])
          .setAuthor("Events command", serverInfo.logo);

        for (var key in Events) {
          embed.addField(Events[key].title, Events[key].desc);
        }

        message.channel.send(embed);
      } else if (args.length == 2) {
        if (Commands[args[1].toLowerCase()] != undefined) {
          const embed = new Discord.MessageEmbed()
            .setColor([255, 255, 0])
            .setAuthor("Help command - " + args[1], serverInfo.logo)
            .setFooter(
              "Permission Level: " + Commands[args[1].toLowerCase()].perms
            );

          for (var key in Commands[args[1].toLowerCase()].commands) {
            embed.addField(
              Commands[args[1].toLowerCase()].commands[key],
              Commands[args[1].toLowerCase()].desc[key]
            );
          }
          message.channel.send(embed);
        } else {
          const embed = new Discord.MessageEmbed()
            .setColor([255, 255, 0])
            .setAuthor("Command not found", serverInfo.logo);
          message.channel.send(embed);
        }
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
      case '"':
      case "'":
      case "\\":
      case "%":
        return char + char; // prepends a backslash to backslash, percent,
      // and double/single quotes
    }
  });
}
