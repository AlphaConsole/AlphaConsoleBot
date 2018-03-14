const Discord = require("discord.js");

var fs = require("fs");

module.exports = {
  title: "send message",
  perms: "Developers",
  commands: ["!betaids"],
  description: ["Sends ids for whitelist"],

  run: async (client, serverInfo, message, args, sql, keys) => {
    if (
      hasRole(message.member, "Developer") ||
      hasRole(message.member, "Admin")
    ) {
      let output = [];
      let memberCount = 10;
      message.guild.members.fetch().then(members => {
        memberCount = members.length;
        members.forEach(function(value, key, members) {
          if (hasAccessToBeta(value)) {
            var request = require("request");
            var url = keys.GetSteamIDURL;
            url += "?DiscordID=" + key;
            request(
              {
                method: "GET",
                url: url
              },
              function(err, response, body) {
                if (body) {
                  if (body != "not linked") {
                    output.push(body);
                  }
                }
              }
            );
          }
        });
      });

      while (output.length < memberCount) {
        await sleep(1000);
      }
      var fs = require("fs");
      try {
        fs.writeFileSync("./id.csv", output.join(), "utf-8");
      } catch (e) {
        console.log(e);
      }
      message.reply({ files: [new Discord.MessageAttachment("./id.csv")] });
    }
  }
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function hasAccessToBeta(user) {
  return (
    hasRole(user, "Twitch Sub") ||
    hasRole(user, "Legacy") ||
    hasRole(user, "Beta") ||
    hasRole(user, "Twitch Sub") ||
    hasRole(user, "Partner") ||
    hasRole(user, "Partner+") ||
    hasRole(user, "YouTube Partner") ||
    hasRole(user, "Twitch Partner") ||
    hasRole(user, "Developer")
  );
}

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
