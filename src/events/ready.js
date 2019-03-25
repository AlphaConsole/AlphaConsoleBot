module.exports = client => {
  if (client.config.logChannel)
    client.logChannel = client.channels.get(client.config.logChannel);

  client.logSuccess("Bot online!");
  client.serverLog = client.channels.get(client.config.channels.serverLog);
  client.acLog = client.channels.get(client.config.channels.acLog);
};
