const Discord = require("discord.js");
const request = require("request");

module.exports.run = (client, serverInfo, config, oldMember, newMember) => {
  if (oldMember.guild.id !== serverInfo.guildId) return;

  try {
    //* If nickname has been changed, then log it.
    if (oldMember.nickname != newMember.nickname) {
      if (newMember.nickname == null)
        client.guilds
          .get(serverInfo.guildId)
          .channels.get(serverInfo.channels.serverlog)
          .send(
            `:spy: \`[${new Date().toTimeString().split(" ")[0]}]\` **\`${
              newMember.user.tag
            }\`** (${newMember.user.id}) has reset their nickname to **\`${
              newMember.user.username
            }\`**`
          );
      else
        client.guilds
          .get(serverInfo.guildId)
          .channels.get(serverInfo.channels.serverlog)
          .send(
            `:spy: \`[${new Date().toTimeString().split(" ")[0]}]\` **\`${
              newMember.user.tag
            }\`** (${newMember.user.id}) has changed their nickname to **\`${
              newMember.nickname
            }\`**`
          );
    }

    //* If roles are different, we'll save the new roles but also check if the user still has access to certain things
    if (oldMember.roles.size !== newMember.roles.size) {
      let oldRoles = "";
      oldMember.roles.array().forEach(role => {
        if (role.name != "@everyone") oldRoles += ", " + role.name;
      });

      let newRoles = "";
      newMember.roles.array().forEach(role => {
        if (role.name != "@everyone") newRoles += ", " + role.name;
      });

      let newRolesID = "";
      newMember.roles.array().forEach(role => {
        if (role.name != "@everyone") newRolesID += " " + role.id;
      });

      //* User just received Legacy role
      if (newRoles.includes("Legacy") && !oldRoles.includes("Legacy")) {
        newMember.send(
          "Congratulations on becoming a Legacy member! :smile: You now have access to several benefits including:\n\n" +
            "Green & Purple title colors\n" +
            "Our beta program (Please read `#beta-info` and the pin in `#beta-signup` carefully!)\n" +
            "The `#subs-and-legacy` text channel and priority support\n" +
            "Various Discord server enhancements such as nickname perms\n\n" +
            "You will keep these benefits forever! Thank you for your support of AlphaConsole!"
        );
      }

      //* User just received Twitch Sub role
      if (newRoles.includes("Twitch Sub") && !oldRoles.includes("Twitch Sub")) {
        newMember.send(
          "Thank you for subscribing to our twitch! :smile: You now have access to several benefits including:\n\n" +
            "Green & Purple title colors\n" +
            "The `AlphaConsole Twitch Sub` special title (found in `#set-special-title`)\n" +
            "Our beta program (Please read `#beta-info` and the pin in `#beta-signup` carefully!)\n" +
            "The `#subs-and-legacy` text channel and priority support\n" +
            "Various Discord server enhancements such as nickname perms\n\n" +
            "You will keep these benefits for as long as you are subscribed, and you will have a 3 day window to resubscribe if your subscription runs out. Thank you again for your subscription and your extra level of support for AlphaConsole!" +
            "\n\n**Be sure to check out `#giveaways` whilst you can, exclusive for __subs__!**"
        );

        const embedlog = new Discord.MessageEmbed()
          .setColor([255, 255, 0])
          .setAuthor("New Twitch Subscriber!", serverInfo.logo)
          .setDescription("<@" + newMember.id + "> subscribed to AlphaConsole!")
          .setTimestamp();
        client.guilds
          .get(serverInfo.guildId)
          .channels.get(serverInfo.channels.aclog)
          .send(embedlog);

        newMember.roles.remove(serverInfo.roles.tempRole);
      }

      //* User just lost Twitch Sub role
      if (
        oldRoles.includes("Twitch Sub") &&
        !newRoles.includes("Twitch Sub") &&
        !canKeepTitle(newMember, serverInfo)
      ) {
        let user = newMember;
        config.sql.query("UPDATE Titles set Color = 1 WHERE DiscordID = ?", [
          user.id
        ]);
        config.sql.query("UPDATE Titles set Banner = NULL WHERE DiscordID = ?", [
          user.id
        ]);
        config.sql.query("UPDATE Titles set BannerAccepted = 0 WHERE DiscordID = ?", [
          user.id
        ]);
        oldMember.send(
          "Hi, your Twitch Subscription to AlphaConsole has ended therefore your access to the" +
            " subscriber features has been removed and your title colour along with your banner have been reset. If you subscribe again you will have access to those " +
            " features again. \n<https://www.twitch.tv/alphaconsole> \nHave a great day!"
        );

        const embedlog = new Discord.MessageEmbed()
          .setColor([255, 255, 0])
          .setAuthor("Title Colour And Banner Auto Reset", serverInfo.logo)
          .setDescription(
            "<@" +
              user.id +
              ">'s colour and banner have been reset because Twitch Subscription ended."
          )
          .setTimestamp();
        client.guilds
          .get(serverInfo.guildId)
          .channels.get(serverInfo.channels.aclog)
          .send(embedlog);

        require("../helpers/checkUser").run(config.sql, user.user, (err, u) => {
          if (err) return console.error(err);

          config.sql.query("Update Members set Roles = ? where DiscordID = ?", [
            newRolesID,
            user.id
          ]);
        });
      }

      client.guilds
        .get(serverInfo.guildId)
        .channels.get(serverInfo.channels.serverlog)
        .send(
          `:man_with_gua_pi_mao: \`[${
            new Date().toTimeString().split(" ")[0]
          }]\` **${newMember.user.tag}**'s roles have changed. Old: ${
            oldRoles === ""
              ? "''"
              : `\`${oldRoles.substring(2, oldRoles.length)}\``
          } | New: ${
            newRoles === ""
              ? "''"
              : `\`${newRoles.substring(2, newRoles.length)}\``
          }`
        );
    }
  } catch (error) {
    console.log(error);
  }
};

function canKeepTitle(m, serverInfo) {
  if (m.roles.has(serverInfo.roles.partnerP)) return true;
  if (m.roles.has(serverInfo.roles.orgPartner)) return true;
  if (m.roles.has(serverInfo.roles.legacy)) return true;
  if (m.roles.has(serverInfo.roles.support)) return true;
  if (m.roles.has(serverInfo.roles.moderator)) return true;
  if (m.roles.has(serverInfo.roles.admin)) return true;
  return false;
}
