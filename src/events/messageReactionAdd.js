const Discord = require("discord.js");

module.exports = {
  title: "messageReactionAdd",
  description:
    "Event when a new reaction has been added for like `#Showcase` & `#Suggestions`",

  run: async (client, serverInfo, reaction, user, sql) => {
    if (reaction._emoji.name == "❌") {
      if (
        hasRole(
          client.guilds.get(serverInfo.guildId).members.get(user.id),
          "Developer"
        ) ||
        hasRole(
          client.guilds.get(serverInfo.guildId).members.get(user.id),
          "Admin"
        )
      ) {
        if (
          reaction.message.channel.id != serverInfo.suggestionsChannel &&
          reaction.message.channel.id != serverInfo.showcaseChannel
        ) {
          return;
        }

        user
          .send(
            `Please respond with the reason why you deleted the message. \n**This reason will be logged & sent to the user** \nYou have 30 seconds to respond.`
          )
          .then(msg => {
            msg.channel
              .awaitMessages(response => response.content, {
                max: 1,
                time: 30000,
                errors: ["time"]
              })
              .then(collected => {
                let reason = collected.first().content;

                if (
                  reaction.message.channel.id == serverInfo.suggestionsChannel
                ) {
                  reaction.message.delete();
                  const embed = new Discord.MessageEmbed()
                    .setColor([255, 255, 0])
                    .setAuthor(
                      `Your suggestion was deleted by ${user.username}`,
                      serverInfo.logo
                    )
                    .setDescription("Reason: " + reason);
                  reaction.message.author
                    .send(embed)
                    .catch(e =>
                      reaction.message.guild.channels
                        .get(serverInfo.BotSpam)
                        .send(
                          `${
                            reaction.message.member
                          }, your DM's are disabled and we were not able to send you information through DM.`
                        )
                    );

                  const embedLog = new Discord.MessageEmbed()
                    .setColor([255, 255, 0])
                    .setAuthor(`SUGGESTION DELETED`, serverInfo.logo)
                    .addField(
                      `Suggested by `,
                      `${reaction.message.member} (${
                        reaction.message.author.id
                      })`
                    );

                  if (reaction.message.content.length != 0) {
                    embedLog.addField(`Content`, `${reaction.message.content}`);
                  }
                  embedLog.addField(`Channel`, `${reaction.message.channel}`);
                  embedLog.addField(`Deleted by`, `${user.username}`);
                  embedLog.addField("Reason:", reason);
                  reaction.message.guild.channels
                    .get(serverInfo.aclogChannel)
                    .send(embedLog);
                }

                if (reaction.message.channel.id == serverInfo.showcaseChannel) {
                  reaction.message.delete();
                  const embed = new Discord.MessageEmbed()
                    .setColor([255, 255, 0])
                    .setAuthor(
                      `Your showcase was deleted by ${user.username}`,
                      serverInfo.logo
                    )
                    .setDescription("Reason: " + reason);
                  reaction.message.author
                    .send(embed)
                    .catch(e =>
                      reaction.message.guild.channels
                        .get(serverInfo.BotSpam)
                        .send(
                          `${
                            reaction.message.member
                          }, your DM's are disabled and we were not able to send you information through DM.`
                        )
                    );

                  const embedLog = new Discord.MessageEmbed()
                    .setColor([255, 255, 0])
                    .setAuthor(`SHOWCASE DELETED`, serverInfo.logo)
                    .addField(
                      `Showcased by `,
                      `${reaction.message.member} (${
                        reaction.message.author.id
                      })`
                    );

                  if (reaction.message.content.length != 0) {
                    embedLog.addField(`Content`, `${reaction.message.content}`);
                  }
                  embedLog.addField(`Channel`, `${reaction.message.channel}`);
                  embedLog.addField(`Deleted by`, `${user.username}`);
                  embedLog.addField("Reason: ", reason);
                  reaction.message.guild.channels
                    .get(serverInfo.aclogChannel)
                    .send(embedLog);
                }
              })
			.catch(collected => {
				//DRY overrated	tbh		
				let reason;
                if (reaction.message.channel.id == serverInfo.suggestionsChannel) {
				  reason = "Not a valid suggestion, already been suggested, or in violation of the information listed at the top of our suggestions channel."
                  reaction.message.delete();
                  const embed = new Discord.MessageEmbed()
                    .setColor([255, 255, 0])
                    .setAuthor(
                      `Your suggestion was deleted by ${user.username}`,
                      serverInfo.logo
                    )
                    .setDescription("Reason: " + reason);
                  reaction.message.author
                    .send(embed)
                    .catch(e =>
                      reaction.message.guild.channels
                        .get(serverInfo.BotSpam)
                        .send(
                          `${
                            reaction.message.member
                          }, your DM's are disabled and we were not able to send you information through DM.`
                        )
                    );

                  const embedLog = new Discord.MessageEmbed()
                    .setColor([255, 255, 0])
                    .setAuthor(`SUGGESTION DELETED`, serverInfo.logo)
                    .addField(
                      `Suggested by `,
                      `${reaction.message.member} (${
                        reaction.message.author.id
                      })`
                    );

                  if (reaction.message.content.length != 0) {
                    embedLog.addField(`Content`, `${reaction.message.content}`);
                  }
                  embedLog.addField(`Channel`, `${reaction.message.channel}`);
                  embedLog.addField(`Deleted by`, `${user.username}`);
                  embedLog.addField("Reason:", reason);
                  reaction.message.guild.channels
                    .get(serverInfo.aclogChannel)
                    .send(embedLog);
                }

                if (reaction.message.channel.id == serverInfo.showcaseChannel) {
                  reason = "Unrelated to the channel's purpose."
				  reaction.message.delete();
                  const embed = new Discord.MessageEmbed()
                    .setColor([255, 255, 0])
                    .setAuthor(
                      `Your showcase was deleted by ${user.username}`,
                      serverInfo.logo
                    )
                    .setDescription("Reason: " + reason);
                  reaction.message.author
                    .send(embed)
                    .catch(e =>
                      reaction.message.guild.channels
                        .get(serverInfo.BotSpam)
                        .send(
                          `${
                            reaction.message.member
                          }, your DM's are disabled and we were not able to send you information through DM.`
                        )
                    );

                  const embedLog = new Discord.MessageEmbed()
                    .setColor([255, 255, 0])
                    .setAuthor(`SHOWCASE DELETED`, serverInfo.logo)
                    .addField(
                      `Showcased by `,
                      `${reaction.message.member} (${
                        reaction.message.author.id
                      })`
                    );

                  if (reaction.message.content.length != 0) {
                    embedLog.addField(`Content`, `${reaction.message.content}`);
                  }
                  embedLog.addField(`Channel`, `${reaction.message.channel}`);
                  embedLog.addField(`Deleted by`, `${user.username}`);
                  embedLog.addField("Reason: ", reason);
                  reaction.message.guild.channels
                    .get(serverInfo.aclogChannel)
                    .send(embedLog);
                }
            });			  
          });
      }
    } else if (reaction._emoji.name == serverInfo.partnerEmoji) {
      // ADDED FOR MESSAGING USER THE PARTNER INFORMATIONS
      if (
        reaction.message.channel.id == serverInfo.partnerChannel &&
        !user.bot
      ) {
        // Reacted to message, remove reaction, send messages
        reaction.users.remove(user);

        var canMessage = await partnerCanMessage(
          client,
          user,
          reaction.message
        );
        var errChannel = reaction.message.guild.channels.get(
          serverInfo.modlogChannel
        );

        if (canMessage) {
          sql
            .get(`SELECT * FROM partners WHERE id=?`, [reaction.message.id])
            .then(row => {
              var data = JSON.parse(row.message_data);
              sendMessages(user, data, serverInfo, sql, errChannel);
            })
            .catch(err => {
              const embed = new Discord.MessageEmbed()
                .setColor([255, 0, 0])
                .setAuthor("Partner Database Error", serverInfo.logo)
                .setDescription(
                  "Something has gone wrong getting the 'message_data' from the 'partners' table. That's all I know."
                )
                .addField("Error:", `${err}`);
              return errChannel.send(embed);
            });
        } else {
          // Send to bot spam message about user being unable to receive PMs
          reaction.message.guild.channels
            .get(serverInfo.BotSpam)
            .send(
              `${
                reaction.message.member
              }, your DM's are disabled, so we can't send you the information you requested about one of our Partners!`
            );
        }
      }
    } else if (reaction._emoji.name == "🎉") {
      var theRole = reaction.message.guild.roles.get(serverInfo.legacyrole);
      let member = client.guilds.get(serverInfo.guildId).members.get(user.id);

      if (member.roles.has(theRole.id)) {
        reaction.users.remove(user);
      }
    }
  }
};

async function partnerCanMessage(client, user, message) {
  // Little bit of a weird way to check if it can message, but if it's not done this way, then sending messages in order would cause 'n' amount of bot-spam messages
  // to the user :/

  return new Promise((resolve, reject) => {
    user
      .send(
        "**Hello! Here is the information you requested about one of our partners!**"
      )
      .then(() => {
        resolve(true);
      })
      .catch(err => {
        resolve(false);
      });
  });
}

function sendMessages(user, data, serverInfo, sql, errChannel) {
  // format fo messages {type: "", content: "", url: "", react: bool, id: ""}
  // if react then is partner message, and update db to new message id where message.id

  return new Promise((resolve, reject) => {
    var chain = Promise.resolve();
    for (let message of data.messages) {
      chain = chain.then(() => {
        switch (message.type) {
          case "hybrid":
            return user
              .send(message.content, { files: [message.url] })
              .catch(err => {
                return errChannel.send(getErrorEmbed(serverInfo, err));
              });
          case "file":
            return user.send("", { files: [message.url] }).catch(err => {
              return errChannel.send(getErrorEmbed(serverInfo, err));
            });
          case "text":
            return user.send(message.content).catch(err => {
              return errChannel.send(getErrorEmbed(serverInfo, err));
            });
          default:
            reject(
              "A Message Type error has occurred. Please contact an AlphaConsole Admin!"
            );
        }
      });
    }
    chain = chain.then(resolve()).catch(err => reject(err));
  });
}

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
