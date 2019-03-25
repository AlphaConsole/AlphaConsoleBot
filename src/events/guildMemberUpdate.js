module.exports = (client, oldMember, newMember) => {
  if (!newMember.guild.mainServer) return;
  newMember.checkRoles();

  if (oldMember.nickname != newMember.nickname) {
    if (newMember.nickname == null)
      client.serverLog.send(
        `:spy: \`[${new Date().toTimeString().split(" ")[0]}]\` **\`${
          newMember.user.tag
        }\`** (${newMember.user.id}) has reset their nickname to **\`${
          newMember.user.username
        }\`**`
      );
    else
      client.serverLog.send(
        `:spy: \`[${new Date().toTimeString().split(" ")[0]}]\` **\`${
          newMember.user.tag
        }\`** (${newMember.user.id}) has changed their nickname to **\`${
          newMember.nickname
        }\`**`
      );
  }

  if (oldMember.roles.size !== newMember.roles.size) {
    if (!oldMember.is.legacy && newMember.is.legacy) {
      newMember.send(
        "Congratulations on becoming a Legacy member! :smile: You now have access to several benefits including:\n\n" +
          "Green & Purple title colors\n" +
          "Our beta program (Please read `#beta-info` and the pin in `#beta-signup` carefully!)\n" +
          "The `#subs-and-legacy` text channel and priority support\n" +
          "Various Discord server enhancements such as nickname perms\n\n" +
          "You will keep these benefits forever! Thank you for your support of AlphaConsole!"
      );
    }
    if (!oldMember.is.twitchSub && newMember.is.twitchSub) {
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

      client.acLog.send(
        client.embed(
          "New Twitch Subscriber!",
          "<@" + newMember.id + "> subscribed to AlphaConsole!"
        )
      );
    }
    if (oldMember.is.twitchSub && !newMember.is.twitchSub) {
      oldMember.send(
        "Hi, your Twitch Subscription to AlphaConsole has ended therefore your access to the" +
          " subscriber features has been removed and your title colour has been reset. If you subscribe again you will have access to those " +
          " features again. \n<https://www.twitch.tv/alphaconsole> \nHave a great day!"
      );
    }
  }
  client.serverLog.send(
    `:man_with_gua_pi_mao: \`[${new Date().toTimeString().split(" ")[0]}]\` **${
      newMember.user.tag
    }**'s roles have changed. Old: ${
      oldMember.roles.size === 1 ? "''" : `\`${formatRoles(oldMember)}\``
    } | New: ${
      newMember.roles.size === 1 ? "''" : `\`${formatRoles(newMember)}\``
    }`
  );
  newMember.saveRoles();
};

function formatRoles(member) {
  return member.roles
    .array()
    .filter(r => r.name !== "@everyone")
    .map(r => r.name)
    .join(", ");
}
