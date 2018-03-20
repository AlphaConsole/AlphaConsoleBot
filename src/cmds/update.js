const Discord = require("discord.js");
var shell = require("shelljs");

module.exports = {
  title: "update",
  perms: "Admin",
  commands: ["!update"],
  description: ["Updates the bot"],

  run: async (client, serverInfo, message, args) => {
    if (
      hasRole(message.member, "Admin") ||
      hasRole(message.member, "Developer")
    ) {
      // <---   If you would like to change role perms. Change [BontControl] to your role name
      message.reply("Begining update");
      // client.guilds.get(serverInfo.guildId).channels.get(serverInfo.setTitleChannel).overwritePermissions(message.guild.id, {
      //     SEND_MESSAGES: false
      // });
      // client.guilds.get(serverInfo.guildId).channels.get(serverInfo.showcaseChannel).overwritePermissions(message.guild.id, {
      //     SEND_MESSAGES: false
      // });
      // client.guilds.get(serverInfo.guildId).channels.get(serverInfo.suggestionsChannel).overwritePermissions(message.guild.id, {
      //     SEND_MESSAGES: false
      // });
      // client.guilds.get(serverInfo.guildId).channels.get(serverInfo.setSpecialTitleChannel).overwritePermissions(message.guild.id, {
      //     SEND_MESSAGES: false
      // });
      //message.channel.send('Channels locked. Executing shell commands...')

      //Shell commands
      shell.exec("git checkout .");
      shell.exec("git pull origin master");
      shell.exec("pm2 restart AlphaConsole");
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
    }
  });
}
