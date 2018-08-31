/**
 * ! Reset beta command
 */

module.exports = {
  title: "GetTitle",
  details: [
      {
          perms      : "Moderator",
          command    : "!resetbeta <@tag | id>",
          description: "Resets the beta entry of the user"
      }
  ],

  run: ({ client, serverInfo, message, args, sql, config, sendEmbed }) => {

    if (!message.member.isModerator) return;
    let id = message.mentions.users.first() ? message.mentions.users.first().id : args[1];

    sql.query("Update Players set BetaUntil = null where DiscordID = ?", [ id ]);
    sendEmbed(message.channel, "Beta entry reset", `<@${id}> can sign up for the beta again.`)

  }
};

function returnColour(colourID) {
  switch (colourID) {
      case "0":
          return "No title";
          break;
      case "1":
          return "Gray";
          break;
      case "2":
          return "Glowing Green (Twitch Subs & Legacy)";
          break;
      case "3":
          return "Non-glowing Green";
          break;
      case "4":
          return "Non-glowing Yellow";
          break;
      case "5":
          return "Glowing Yellow";
          break;
      case "6":
          return "Purple (Twitch Subs & Legacy)";
          break;
      case "7":
          return "RLCS Blue";
          break;
      case "X":
          return "Disabled (X)";
          break;
      default:
          return "Cycling Colours";
  }
}