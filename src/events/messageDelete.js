module.exports.run = (client, serverInfo, config, message) => {
    if (message.guild.id !== serverInfo.guildId) return;

    let args = message.content.split(/[ ]+/);

    let ResponseText = "";
    for (i = 0; i < args.length; i++) {
      if (args[i] == "@everyone")                                           ResponseText += "`@everyone` "
      else if (args[i] == "@here")                                          ResponseText += "`@here` "
      else if (message.mentions.roles.has(args[i].replace(/[^0-9]/g, "")))  ResponseText += `**${message.mentions.roles.get(args[i].replace(/[^0-9]/g, "")).name}** `
      else if (message.mentions.users.has(args[i].replace(/[^0-9]/g, "")))  ResponseText += `**${message.mentions.users.get(args[i].replace(/[^0-9]/g, "")).tag}** `
      else                                                                  ResponseText += args[i] + " ";
    }

    let channel = message.channel.type === "text" ? `<#${message.channel.id}>` : '**DM**';
    client.guilds.resolve(serverInfo.guildId).channels.resolve(serverInfo.channels.serverlog).send(
        `:pencil: \`[${new Date().toTimeString().split(" ")[0]}]\` ` + 
        `**Channel: ${channel} ${message.author.tag}**'s (${message.author.id}) message was deleted. Content: ${ResponseText}`
    );
}