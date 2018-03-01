const Discord = require("discord.js");

module.exports = {
  title: "togglelinks",
  perms: "Moderator",
  commands: ["!ToggleLinks"],
  description: [
    "Enables / Disables links in the current channel (Channel bounded)"
  ],

  run: async (client, serverInfo, sql, message, args, AllowedLinksSet) => {
    if (
      hasRole(message.member, "Moderator") ||
      hasRole(message.member, "Admin") ||
      hasRole(message.member, "Developer")
    ) {
      sql
        .get(
          `Select * from DisabledLinks where ChannelID = ${message.channel.id}`
        )
        .then(row => {
          if (row) {
            sql.run(
              `Delete from DisabledLinks where ChannelID = ${
                message.channel.id
              }`
            );

            AllowedLinksSet.delete(message.channel.id);

            const embed = new Discord.MessageEmbed()
              .setColor([255, 255, 0])
              .setAuthor(
                "Links are no longer allowed in this channel",
                serverInfo.logo
              );
            message.channel.send(embed);

            const embedlog = new Discord.MessageEmbed()
              .setColor([255, 255, 0])
              .setAuthor("Togglelinks", serverInfo.logo)
              .addField(
                "Link protection enabled at",
                `**${message.channel.name}** (${message.channel})`
              )
              .addField(
                "by",
                `**${message.member.user.tag}** (${message.member})`
              )
              .setTimestamp();
            client.guilds
              .get(serverInfo.guildId)
              .channels.get(serverInfo.aclogChannel)
              .send(embedlog);
          } else {
            sql.run(
              `Insert into DisabledLinks(ChannelID) VALUES ('${
                message.channel.id
              }')`
            );

            AllowedLinksSet.add(message.channel.id);

            const embed = new Discord.MessageEmbed()
              .setColor([255, 255, 0])
              .setAuthor(
                "Links are now allowed in this channel",
                serverInfo.logo
              );
            message.channel.send(embed);

            const embedlog = new Discord.MessageEmbed()
              .setColor([255, 255, 0])
              .setAuthor("Togglelinks", serverInfo.logo)
              .addField(
                "Link protection disabled at",
                `**${message.channel.name}** (${message.channel})`
              )
              .addField(
                "by",
                `**${message.member.user.tag}** (${message.member})`
              )
              .setTimestamp();
            client.guilds
              .get(serverInfo.guildId)
              .channels.get(serverInfo.aclogChannel)
              .send(embedlog);
          }
        });
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
