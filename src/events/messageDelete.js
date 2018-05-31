const Discord = require("discord.js");

module.exports = {
  title: "messageDelete",
  description: "Logs the message that got removed",

  run: async (client, serverInfo, message) => {
    var args = message.content.split(/[ ]+/);

    var ResponseText = "";
    for (i = 0; i < args.length; i++) {
      if (args[i] == "@everyone") {
        ResponseText += "`@everyone` ";
      } else if (args[i] == "@here") {
        ResponseText += "`@here` ";
      } else if (message.mentions.roles.has(args[i].replace(/[^0-9]/g, ""))) {
        ResponseText +=
          "**" +
          message.mentions.roles.get(args[i].replace(/[^0-9]/g, "")).name +
          "** ";
      } else if (message.mentions.users.has(args[i].replace(/[^0-9]/g, ""))) {
        ResponseText +=
          "**" +
          message.mentions.users.get(args[i].replace(/[^0-9]/g, "")).tag +
          "** ";
      } else {
        ResponseText += args[i] + " ";
      }
    }

    let channel = message.channel.type == "text" ? `<#${message.channel.id}>` : '**DM**'

    client.guilds
      .get(serverInfo.guildId)
      .channels.get(serverInfo.serverlogChannel)
      .send(
        ":pencil: `[" +
          new Date().toTimeString().split(" ")[0] +
          "]` **Channel: " + channel + " " +
          message.author.tag +
          "**'s message was deleted. Content: " +
          ResponseText
      );
  }
};
