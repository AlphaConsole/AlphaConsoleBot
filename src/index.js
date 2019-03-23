async function start() {
  const Discord = await require("./Classes");
  const { promisify } = require("util");
  const readdir = promisify(require("fs").readdir);
  const chalk = require("chalk");
  const log = console.log;

  class DiscordBot extends Discord.Client {
    constructor() {
      super();

      this.config = require("../config");
      this.loadLogs();
      this.loadEvents();
      this.loadCommands();
      this.loadModels();
      this.login(this.config.botToken);
    }

    async loadEvents() {
      const events = await readdir("./src/Events/");
      events.forEach(f => {
        if (!f.endsWith(".js")) return;

        try {
          const eventName = f.split(".")[0];
          const event = require(`./Events/${eventName}`);
          this.on(eventName, event.bind(null, this));
        } catch (e) {
          this.logError(`Unable to load event ${f}: ${e}`);
        }
      });
    }

    async loadCommands() {
      this.commands = [];

      const commands = await readdir("./src/Commands/");
      commands.forEach(f => {
        if (!f.endsWith(".js")) return;

        try {
          const file = require(`./Commands/${f}`);
          file.commands.forEach(cmd => (this.commands[cmd.command] = file));
        } catch (e) {
          this.logError(`Unable to load command ${f}: ${e}`);
        }
      });
    }

    async loadModels() {
      this.models = await require("./Models");
    }

    loadLogs() {
      this.log = (msg, ignoreLogChannel = false) => {
        log(chalk.bgBlue.whiteBright(`ℹ ${msg}`));

        if (client.logChannel && !ignoreLogChannel)
          client.logChannel.send(
            "Log from " +
              client.config.name +
              "```" +
              msg.substring(0, 1950) +
              "```"
          );
      };

      this.logSuccess = (msg, ignoreLogChannel = false) => {
        log(chalk.bgGreen.whiteBright(`✅ ${msg}`));

        if (client.logChannel && !ignoreLogChannel)
          client.logChannel.send(
            "Success log from " +
              client.config.name +
              "```css\n" +
              msg.substring(0, 1950) +
              "```"
          );
      };

      this.logWarning = (msg, ignoreLogChannel = false) => {
        log(chalk.bgYellow.whiteBright(`⚠ ${msg}`));

        if (client.logChannel && !ignoreLogChannel)
          client.logChannel.send(
            "Warning log from " +
              client.config.name +
              "```fix\n" +
              msg.substring(0, 1950) +
              "```"
          );
      };

      this.logError = (msg, ignoreLogChannel = false) => {
        log(chalk.bgRed.whiteBright(`❌ ${msg}`));

        if (client.logChannel && !ignoreLogChannel && !msg.stack)
          client.logChannel.send(
            "Error log from " +
              client.config.name +
              "```cs\n" +
              "# " +
              msg.substring(0, 1950) +
              "```"
          );
      };
    }
  }

  const client = new DiscordBot();
  module.exports = client;
  require("./validation");

  // Error catching
  process.on("uncaughtException", errorHandling);
  process.on("unhandledRejection", errorHandling);

  function errorHandling(err) {
    client.logError(err);
    console.log(err);

    if (client.logChannel)
      client.logChannel.send(
        "Error occurred on " +
          client.config.name +
          "```" +
          err.stack.substring(0, 1950) +
          "```"
      );
  }
}

start();
