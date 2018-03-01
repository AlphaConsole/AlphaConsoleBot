const Discord = require("discord.js");

module.exports = {
  title: "help",
  perms: "everyone",
  commands: ["!help"],
  description: ["Provides the help info"],

  run: async (client, serverInfo, message, args, Commands) => {
    if (args.length == 1) {
      member = client.guilds
        .get(serverInfo.guildId)
        .members.get(message.author.id);

      var everyone = "";
      var staff = "";
      var support = "";
      var moderator = "";
      var admin = "";

      for (var key in Commands) {
        if (Commands[key].perms.toLowerCase() == "everyone")
          everyone += Commands[key].title + "\n";
        if (Commands[key].perms.toLowerCase() == "staff")
          staff += Commands[key].title + "\n";
        if (Commands[key].perms.toLowerCase() == "support")
          support += Commands[key].title + "\n";
        if (Commands[key].perms.toLowerCase() == "moderator")
          moderator += Commands[key].title + "\n";
        if (Commands[key].perms.toLowerCase() == "admin")
          admin += Commands[key].title + "\n";
      }

      const embed = new Discord.MessageEmbed()
        .setColor([255, 255, 0])
        .setAuthor("Help command", serverInfo.logo)
        .addField("Everyone commands", everyone)
        .setFooter("Do: !help <command> for more info");
      if (
        hasRole(member, "Admin") ||
        hasRole(member, "Developer") ||
        hasRole(member, "Moderator") ||
        hasRole(member, "Support") ||
        hasRole(member, "Staff")
      )
        embed.addField("Staff commands", staff);
      if (
        hasRole(member, "Admin") ||
        hasRole(member, "Developer") ||
        hasRole(member, "Moderator") ||
        hasRole(member, "Support")
      )
        embed.addField("Support commands", support);
      if (
        hasRole(member, "Admin") ||
        hasRole(member, "Developer") ||
        hasRole(member, "Moderator")
      )
        embed.addField("Moderator commands", moderator);
      if (hasRole(member, "Admin") || hasRole(member, "Developer"))
        embed.addField("Admin commands", admin);
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
