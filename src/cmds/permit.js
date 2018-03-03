const Discord = require("discord.js");

module.exports = {
  title: "permit",
  perms: "Moderator",
  commands: ["!permit <@tag | id>"],
  description: ["Permits the user to post links for 5 minutes"],

  run: async (client, serverInfo, sql, message, args, permits) => {
    if (
      hasRole(message.member, "Moderator") ||
      hasRole(message.member, "Admin") ||
      hasRole(message.member, "Developer")
    ) {
      if (message.mentions.users.first() == undefined) {
        var TheUser = args[1];
      } else {
        var TheUser = message.mentions.users.first().id;
      }

      permits[TheUser] = {
        until: new Date().getTime() + 300000,
        channel: message.channel.id
      };

      const embed = new Discord.MessageEmbed()
        .setColor([255, 255, 0])
        .setAuthor(
          `${
            client.users.get(TheUser).tag
          } is now permitted to post links for 5 minutes.`,
          serverInfo.logo
        );
      message.channel.send(embed);

      const embedlog = new Discord.MessageEmbed()
        .setColor([255, 255, 0])
        .setAuthor("Link Permit", serverInfo.logo)
        .addField(
          "The user",
          `**${client.users.get(TheUser).tag}** (<@${TheUser}>)`
        )
        .addField(
          `has been permitted at`,
          `**${message.channel.name}** (${message.channel})`
        )
        .addField("by", `**${message.member.user.tag}** (${message.member})`)
        .setTimestamp();
      client.guilds
        .get(serverInfo.guildId)
        .channels.get(serverInfo.aclogChannel)
        .send(embedlog);
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
