const Discord = require("discord.js");

module.exports = {
  title: "send message",
  perms: "Developers",
  commands: ["!betaids"],
  description: ["Sends ids for whitelist"],

  run: async (client, serverInfo, message, args, sql, keys) => {
    if (hasRole(message.member, "Developer")) {
      let output = "";
      message.guild.members.fetch()
      .then(members => {
        members.forEach(function(value, key) {
            if (hasRole(value, "Twitch Sub") || hasRole(value, "Legacy") || hasRole(value, "Beta")) {
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
                        //output += `${body},`;
                        console.log(body);
                      }
                    }
                });
            }
        });
        output = output.slice(0, -1);
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
