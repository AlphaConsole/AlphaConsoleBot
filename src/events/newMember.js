const Discord = require("discord.js");

module.exports = {
  title: "newMember",
  description: "Logs whenever a new members joins",

  run: async (client, serverInfo, member, sql) => {
    client.guilds
      .get(serverInfo.guildId)
      .channels.get(serverInfo.serverlogChannel)
      .send(
        ":white_check_mark: `[" +
          new Date().toTimeString().split(" ")[0] +
          "]` **" +
          member.user.tag +
          "** joined the guild. Total members: **" +
          numberWithSpaces(client.guilds.get(serverInfo.guildId).memberCount) +
          "**"
      );

    member.send(
      "Welcome to the AlphaConsole Discord server! We are the largest Rocket League related server in the world!\n**Before you start, please make sure to:**\n\n- Download the latest version of AlphaConsole in #download.\n\n- Read all information in #faq.\n\n- Read #troubleshooting if you are having issues.\n\nIf you still have questions, feel free to contact one of our Staff members in #help."
    );

    //Let's check if the user exists in the db. If so add his roles to him
    sql
      .get(`select * from Members where DiscordID = '${member.user.id}'`)
      .then(row => {
        if (!row) {
          var today = new Date().getTime();
          sql
            .run(
              `Insert into Members(DiscordID, Username, JoinedDate)VALUES('${
                member.user.id
              }', '${mysql_real_escape_string(
                member.user.username
              )}', '${today}')`
            )
            .catch(err => console.log(err));
        } else {
          if (row.Roles) {
            var RoleIDs = row.Roles.split(/[ ]+/);

            for (let i = 0; i < RoleIDs.length; i++) {
              member.addRole(RoleIDs[i]).catch(err => console.log(err));
            }
          }
        }
      })
      .catch(err => console.log(err));

    sql
      .get(`select Value from CurrentStats where Type = 'joined'`)
      .then(row => {
        var oldVal = row.Value;
        var newVal = row.Value + 1;

        if (oldVal == undefined || oldVal == null || oldVal < 0) {
          newVal = 1;
        }

        sql
          .run(
            `Update CurrentStats set Value = '${newVal}' where Type = 'joined'`
          )
          .catch(e => console.log(e));
      });
  }
};

function numberWithSpaces(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function mysql_real_escape_string(str) {
  return str.replace(/'/g, function(char) {
    switch (char) {
      case "\0":
        return "\\0";
      case "\x08":
        return "\\b";
      case "\x09":
        return "\\t";
      case "\x1a":
        return "\\z";
      case "\n":
        return "\\n";
      case "\r":
        return "\\r";
      case "'":
        return char + char; // prepends a backslash to backslash, percent,
      // and double/single quotes
      default:
        return char
    }
  });
}
