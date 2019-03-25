module.exports = (client, message) => {
  if (!message.guild.mainServer) return;

  let args = message.content.split(/[ ]+/);

  let ResponseText = "";
  for (i = 0; i < args.length; i++) {
    const stripped = args[i].replace(/[^0-9]/g, "");

    if (args[i] == "@everyone") 
      ResponseText += "`@everyone` ";
    else if (args[i] == "@here") 
      ResponseText += "`@here` ";
    else if (message.mentions.roles.has(stripped))
      ResponseText += `**${message.mentions.roles.get(stripped).name}** `;
    else if (message.mentions.users.has(stripped))
      ResponseText += `**${message.mentions.users.get(stripped).tag}** `;
    else 
      ResponseText += args[i] + " ";
  }

  const channel =
    message.channel.type === "text"
      ? `<#${message.channel.id}>`
      : "**DM**";

  client.serverLog.send(
    `:pencil: \`[${new Date().toTimeString().split(" ")[0]}]\` ` +
    `**Channel: ${channel} ${message.author.tag}**'s (${message.author.id}) message was deleted. Content: ${ResponseText}`
  )
};
