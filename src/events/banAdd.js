const Discord = require("discord.js");

module.exports = {
  title: "banAdd",
  description: "Logs whenever a ban has happened",

  run: async (client, serverInfo, user, sql) => {
    client.guilds
      .get(serverInfo.guildId)
      .channels.get(serverInfo.serverlogChannel)
      .send(
        "🔨 `[" +
          new Date().toTimeString().split(" ")[0] +
          "]` **" +
          user.tag +
          "** has been banned from the guild."
      );
  }
};

function numberWithSpaces(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
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
