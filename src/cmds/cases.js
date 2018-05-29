const Discord = require("discord.js");

module.exports = {
  title: "cases",
  perms: "Support",
  commands: ["!Cases <@tag or ID>"],
  description: [
    "Shows total amount of cases per Action and shows the last 5 cases"
  ],

  run: async (client, serverInfo, sql, message, args) => {
    if (
      hasRole(message.member, "Support") ||
      hasRole(message.member, "Moderator") ||
      hasRole(message.member, "Admin") ||
      hasRole(message.member, "Developer")
    ) {
      if (message.mentions.users.first() == undefined) {
        var user = args[1];
      } else {
        var user = message.mentions.users.first().id;
      }

      client.guild.members.fetch(user).then(TheUser => {
        await sql
          .get(`select * from Members where DiscordID = '${TheUser}'`)
          .then(row => {
            if (!row) {
              const embed = new Discord.MessageEmbed()
                .setColor([255, 255, 0])
                .setAuthor(`User not found`, serverInfo.logo);
              return message.channel.send(embed);
            } else {
              const embed = new Discord.MessageEmbed().setColor([255, 255, 0]);

              if (client.users.get(TheUser)) {
                embed.setAuthor(
                  `All cases of ${client.users.get(TheUser).tag}`,
                  serverInfo.logo
                );
              } else {
                embed.setAuthor(
                  `All cases of ${row.Username} (Last name found in db)`,
                  serverInfo.logo
                );
              }

              sql
                .all(
                  `select * from logs where Member = '${TheUser}' AND Action = 'mute'`
                )
                .then(mutes => {
                  embed.addField("Mutes", mutes.length, true);

                  sql
                    .all(
                      `select * from logs where Member = '${TheUser}' AND Action = 'warn'`
                    )
                    .then(warns => {
                      embed.addField("Warnings", warns.length, true);
                      embed.setThumbnail(
                        "http://www.cityrider.com/fixed/43aspect.png"
                      );

                      sql
                        .all(
                          `select * from logs where Member = '${TheUser}' AND Action = 'kick'`
                        )
                        .then(kicks => {
                          embed.addField("Kicks", kicks.length, true);

                          sql
                            .all(
                              `select * from logs where Member = '${TheUser}' AND Action = 'ban'`
                            )
                            .then(bans => {
                              embed.addField("Bans", bans.length, true);

                              sql
                                .all(
                                  `select * from logs where Member = '${TheUser}' LIMIT 5`
                                )
                                .then(cases => {
                                  var output = "";
                                  cases.forEach(element => {
                                    output +=
                                      "**" +
                                      element.ID +
                                      "**: " +
                                      capitalizeFirstLetter(element.Action) +
                                      " - " +
                                      element.Reason +
                                      "\n";
                                  });

                                  if (output.length < 2) {
                                    output = "/";
                                  }
                                  embed.addField("Last 5 cases", output);
                                  message.channel.send(embed);
                                });
                            });
                        });
                    });
                });
            }
          });
      })
    }
  }
};

//Functions used to check if a player has the desired role
function pluck(array) {
  return array.map(function(item) {
    return item["name"];
  });
}
function hasRole(mem, role) {
  if (pluck(mem.roles).includes(role)) {
    return true;
  } else {
    return false;
  }
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
