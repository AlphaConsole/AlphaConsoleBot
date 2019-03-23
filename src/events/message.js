module.exports = (client, message) => {
  const args = message.content.split(" ");

  message.member.checkRoles();

  if (message.author.bot) return;

  let commandHandlerCheck = client.config.prefixSeperated
    ? args[0].toLowerCase() !== client.config.prefix.toLowerCase()
    : !message.content.startsWith(client.config.prefix.toLowerCase());
  if (commandHandlerCheck) return;

  let cmd = client.config.prefixSeperated
    ? args[1].toLowerCase()
    : args[0].toLowerCase().substring(client.config.prefix.length);
  if (!client.commands[cmd]) return;

  client.commands[cmd].run(client, message, args);
};
