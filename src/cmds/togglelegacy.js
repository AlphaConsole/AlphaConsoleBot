const Discord = require("discord.js");

module.exports = {
  title: "endgiveaway",
  perms: "Admin",
  commands: ["!endgiveaway"],
  description: ["To end the bi-monthly Legacy giveaway"],

  run: async (client, serverInfo, message, args, sql) => {
    if (isStaff(message.member)) {
      sql.get(`select * from misc where function = 'giveawayon'`).then(row => {
        if (row.value == 0) {
          sql.run(`update misc set value = 1 where function = 'giveawayon'`);
          const embed = new Discord.MessageEmbed()
            .setColor([255, 255, 0])
            .setAuthor(`Legacy Giveaways are now enabled.`, serverInfo.logo);
          message.channel.send(embed);
        } else {
          sql.run(`update misc set value = 0 where function = 'giveawayon'`);
          const embed = new Discord.MessageEmbed()
            .setColor([255, 255, 0])
            .setAuthor(`Legacy Giveaways are now disabled.`, serverInfo.logo);
          message.channel.send(embed);
        }
      });
    }
  }
};

function isStaff(user) {
  if (hasRole(user, "Developer") || hasRole(user, "Admin")) {
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
