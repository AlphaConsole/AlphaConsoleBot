const Discord = require("discord.js");

module.exports = {
  title: "listroles",
  perms: "Moderator",
  commands: ["!listroles"],
  description: ["Shows all roles of the Discord"],

  run: async (client, serverInfo, sql, message, args) => {
    if (
      hasRole(message.member, "Moderator") ||
      hasRole(message.member, "Admin") ||
      hasRole(message.member, "Developer")
    ) {
      var rolesmsg = "";

      message.guild.roles.array().forEach(role => {
        rolesmsg += role.name;
        for (let i = role.name.length; i < 25; i++) {
          rolesmsg += " ";
        }
        rolesmsg += "::  " + role.id + "\n";
      });

      message.channel.send(rolesmsg, { code: "asciidoc" });
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
