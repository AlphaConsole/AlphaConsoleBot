const Discord = require("discord.js");

module.exports = {
  title: "send message",
  perms: "Root",
  commands: ["!betaids"],
  description: ["Sends a message"],

  run: async (client, serverInfo, message, args, sql) => {
    if (isStaff(message.member)) {
      let output = "";
      let count = 0;
      sql.all("Select SteamID64 from BetaSteamIDS").then(rows => {
        rows.forEach(row => {
          if (!isNaN(row.SteamID64)) {
            output += `\`Whitelist.insert(std::pair<__int64, int>(${
              row.SteamID64
            }, 0));\` \n`;
            count++;
            if (count % 20 == 0) {
              message.author.send(output);
              output = "";
            }
          }
        });
        message.author.send(output);
      });
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
