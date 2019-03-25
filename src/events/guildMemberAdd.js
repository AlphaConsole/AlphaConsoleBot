module.exports = (client, member) => {
  if (!member.guild.mainServer) return;

  member.send(
    "Welcome to the AlphaConsole Discord server! We are the largest Rocket League related server in the world!\n" +
      "**Before you start, please make sure to:**\n\n" +
      "- Download the latest version of AlphaConsole in #download.\n\n" +
      "- Read all information in #faq.\n\n" +
      "- Read #troubleshooting if you are having issues.\n\n" +
      "If you still have questions, feel free to contact one of our Staff members in #help."
  );

  member.checkUserExistence().then(user => {
    if (user.Banned === 1) return member.ban();

    if (user.Roles && user.Roles !== "") {
      let roleIDs = user.Roles.split(/[ ]+/);

      for (let i = 0; i < roleIDs.length; i++)
        member.roles.add(roleIDs[i]).catch(err => console.log(err));
    }
  });
};
