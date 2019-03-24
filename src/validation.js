const config = require("../config");
const client = require("./index");
const chalk = require("chalk");
const log = console.log;

log(
  chalk.bgGreen.whiteBright.bold(
    "------------------------------\n" +
      "         Starting Bot         \n" +
      "------------------------------"
  )
);

if (!config.channels)
  client.logWarning(
    '"config.channels" is not defined. TextChannel.is won\'t work.'
  );

if (!config.roles)
  client.logWarning(
    '"config.roles" is not defined. GuildMember.is won\'t work.'
  );

if (!config.database) {
  client.logError(
    '"config.database" is not defined. Database connection is required for the bot to work.'
  );
  process.exit();
}
