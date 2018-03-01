const Discord = require("discord.js");

module.exports = {
  title: "purge",
  perms: "Moderator",
  commands: ["!Purge <Amount of messages>"],
  description: ["Removes the amount of messages from the channel"],

  run: async (client, serverInfo, message, args) => {
    if (
      hasRole(message.member, "Moderator") ||
      hasRole(message.member, "Admin") ||
      hasRole(message.member, "Developer")
    ) {
      var amount;
      if (args.length == 1) {
        amount = 2;
        message.channel.messages
          .fetch({ limit: amount })
          .then(messages => message.channel.bulkDelete(messages))
          .catch(console.error);
        const embedlog = new Discord.MessageEmbed()
          .setColor([255, 255, 0])
          .setAuthor(`No case created | Purge`, serverInfo.logo)
          .setDescription(
            `${message.member} (${message.author.id}) has purged a message in ${
              message.channel
            }`
          )
          .setTimestamp();
        message.guild.channels.get(serverInfo.modlogChannel).send(embedlog);

        const embed = new Discord.MessageEmbed()
          .setColor([255, 255, 0])
          .setAuthor(
            `${message.author.tag} has purged 1 message`,
            serverInfo.logo
          );
        message.channel.send(embed);
      } else if (args.length == 2) {
        if (!isNumber(args[1]) || args[1].startsWith(".")) {
          const embed = new Discord.MessageEmbed()
            .setColor([255, 255, 0])
            .setAuthor(
              "The command has not correctly been used. Please use `!clear [amount]`",
              serverInfo.logo
            );
          return message.channel.send(embed);
        }

        amount = parseInt(args[1]) + 1;
        if (amount > 99) {
          amount = 99;
        }
        message.channel.messages
          .fetch({ limit: amount })
          .then(messages => message.channel.bulkDelete(messages))
          .catch(console.error);
        const embedlog = new Discord.MessageEmbed()
          .setColor([255, 255, 0])
          .setAuthor(`No case created | Purge`, serverInfo.logo)
          .setDescription(
            `${message.member} (${
              message.author.id
            }) has purged ${amount} messages in ${message.channel}`
          )
          .setTimestamp();
        message.guild.channels.get(serverInfo.modlogChannel).send(embedlog);

        const embed = new Discord.MessageEmbed()
          .setColor([255, 255, 0])
          .setAuthor(
            `${message.author.tag} has purged ${amount - 1} messages`,
            serverInfo.logo
          );
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

//Simple function to check if they are numbers
function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
