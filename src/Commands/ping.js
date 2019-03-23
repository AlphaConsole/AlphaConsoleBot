module.exports = {
  commands: [
    {
      command: "ping",
      example: "!ping",
      description: "Displays the latency of the bot."
    }
  ],

  run: (client, message) => {
    message.channel.send("Pong!");
  }
};
