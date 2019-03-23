/**
 * ! Reset beta command
 */

module.exports = {
  title: "resetbeta",
  details: [
    {
      perms: "Moderator",
      command: "!resetbeta <@tag | id>",
      description: "Resets the beta entry of the user"
    }
  ],

  run: ({ client, serverInfo, message, args, sql, config, sendEmbed }) => {
    if (!message.member.isModerator) return;
    let id = message.mentions.users.first()
      ? message.mentions.users.first().id
      : args[1];

    sql.query("Update Players set BetaUntil = null where DiscordID = ?", [id]);
    sendEmbed(
      message.channel,
      "Beta entry reset",
      `<@${id}> can sign up for the beta again.`
    );
  }
};
