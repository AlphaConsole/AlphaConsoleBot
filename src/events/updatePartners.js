const Discord = require("discord.js");

module.exports = {
  title: "update partners",
  description:
    "Resend messages into the partners channel, otherwise reactions aren't checked against noncached messages.",

  run: async (client, serverInfo, sql) => {
    var partnerChannel = client.guilds
      .get(serverInfo.guildId)
      .channels.get(serverInfo.partnerChannel);
    return new Promise(function(resolve, reject) {
      // DELETE ALL MESSAGES
      partnerChannel.messages
        .fetch({ limit: 100 })
        .then(fetched => {
          partnerChannel
            .bulkDelete(fetched, true)
            .then(deletedMessages => {
              var update_messages_holder = {};
              update_messages_holder.messages = [];

              // All messages deleted, send channel headers
              sql
                .get("SELECT * FROM partners WHERE id=?", [0])
                .then(async row => {
                  //Should protect against initial run with no data
                  if (row == undefined) row = { header_data: "" };
                  //Make sure channel headers is showing something
                  var channelData;
                  if (
                    row.header_data == null ||
                    row.header_data == "{}" ||
                    row.header_data == ""
                  )
                    channelData = {
                      messages: [
                        {
                          type: "text",
                          content: "No header has been set yet. Please set one."
                        }
                      ]
                    };
                  else channelData = JSON.parse(row.header_data);

                  // Add channel headers to holder
                  for (var i = 0; i < channelData.messages.length; i++) {
                    var mm = channelData.messages[i];
                    update_messages_holder.messages.push({
                      type: mm.type,
                      content: mm.content,
                      url: mm.url,
                      react: false
                    });
                  }

                  // For each partner type
                  sql
                    .all(`SELECT * FROM partner_types`)
                    .then(rowsType => {
                      var doneTypes = 0;

                      if (rowsType.length == 0) {
                        // There are no partner types to show :/
                        update_messages_holder.messages.push({
                          type: "text",
                          content:
                            "_**We don't have any partners right now!**_",
                          url: undefined,
                          react: false
                        });
                        sendMessages(
                          partnerChannel,
                          update_messages_holder,
                          serverInfo,
                          sql
                        )
                          .then(() => {
                            resolve("Success!");
                          })
                          .catch(err => {
                            reject(err);
                          });
                      }

                      rowsType.forEach(rowType => {
                        var typeData = JSON.parse(rowType.json_data);
                        // Get all partners in this type
                        sql
                          .all(
                            `SELECT * FROM partners WHERE type=? AND enabled=1`,
                            [rowType.type]
                          )
                          .then(rows => {
                            // For each partner
                            var doneRows = 0;

                            // Check if there are any partners, if there are add header for this type
                            if (rows.length > 0) {
                              for (
                                var i = 0;
                                i < typeData.messages.length;
                                i++
                              ) {
                                var mm = typeData.messages[i];
                                update_messages_holder.messages.push({
                                  type: mm.type,
                                  content: mm.content,
                                  url: mm.url,
                                  react: false
                                });
                              }
                            } else
                              // No partners so type is done
                              doneTypes++;
                            if (doneTypes == rowsType.length) {
                              // All of the types have been looped through
                              sendMessages(
                                partnerChannel,
                                update_messages_holder,
                                serverInfo,
                                sql
                              )
                                .then(() => {
                                  resolve("Success!");
                                })
                                .catch(err => {
                                  reject(err);
                                });
                            }

                            rows.forEach(rowPartner => {
                              // add the message, and add reaction.

                              var partnerData = JSON.parse(
                                rowPartner.header_data
                              );

                              for (
                                var i = 0;
                                i < partnerData.messages.length;
                                i++
                              ) {
                                var mm = partnerData.messages[i];
                                update_messages_holder.messages.push({
                                  type: mm.type,
                                  content: mm.content,
                                  url: mm.url,
                                  react: true,
                                  id: "" + rowPartner.id
                                });
                              }

                              doneRows++; // Partner done

                              if (doneRows == rows.length) {
                                // All of the partners for this type have been looped through
                                doneTypes++; // Type done

                                update_messages_holder.messages.push({
                                  type: "file",
                                  url:
                                    "https://cdn.discordapp.com/attachments/413018013281943554/413351571812777984/ACBorderUpdated.png",
                                  react: false
                                });

                                if (doneTypes == rowsType.length) {
                                  // All of the types have been looped through
                                  sendMessages(
                                    partnerChannel,
                                    update_messages_holder,
                                    serverInfo,
                                    sql
                                  )
                                    .then(() => {
                                      resolve("Success!");
                                    })
                                    .catch(err => {
                                      reject(err);
                                    });
                                }
                              }
                            });
                          })
                          .catch(err => reject(err));
                      });
                    })
                    .catch(err => reject(err));
                });
            })
            .catch(err => reject(err));
        })
        .catch(err => reject(err));
    });
  }
};

function sendMessages(partnerChannel, data, serverInfo, sql) {
  // format fo messages {type: "", content: "", url: "", react: bool, id: ""}
  // if react then is partner message, and update db to new message id where message.id
  let emoji = serverInfo.partnerEmoji;
  return new Promise((resolve, reject) => {
    var chain = Promise.resolve();

    for (let message of data.messages) {
      chain = chain.then(() => {
        switch (message.type) {
          case "hybrid":
            return partnerChannel
              .send(message.content, { files: [message.url] })
              .then(newMessage => {
                if (message.react) {
                  sql
                    .run(`UPDATE partners SET id=? WHERE id=?`, [
                      "" + newMessage.id,
                      "" + message.id
                    ])
                    .then(() => {
                      newMessage.react(emoji);
                    })
                    .catch(err => {
                      partnerChannel.guild.channels
                        .get(serverInfo.editPartnerChannel)
                        .send(getErrorEmbed(serverInfo, err));
                    });
                }
              })
              .catch(err => {
                return partnerChannel.guild.channels
                  .get(serverInfo.editPartnerChannel)
                  .send(getErrorEmbed(serverInfo, err));
              });
          case "file":
            return partnerChannel
              .send("", { files: [message.url] })
              .then(newMessage => {
                if (message.react) {
                  sql
                    .run(`UPDATE partners SET id=? WHERE id=?`, [
                      "" + newMessage.id,
                      "" + message.id
                    ])
                    .then(() => {
                      newMessage.react(emoji);
                    })
                    .catch(err => {
                      partnerChannel.guild.channels
                        .get(serverInfo.editPartnerChannel)
                        .send(getErrorEmbed(serverInfo, err));
                    });
                }
              })
              .catch(err => {
                return partnerChannel.guild.channels
                  .get(serverInfo.editPartnerChannel)
                  .send(getErrorEmbed(serverInfo, err));
              });
          case "text":
            return partnerChannel
              .send(message.content)
              .then(newMessage => {
                if (message.react) {
                  sql
                    .run(`UPDATE partners SET id=? WHERE id=?`, [
                      "" + newMessage.id,
                      "" + message.id
                    ])
                    .then(() => {
                      newMessage.react(emoji);
                    })
                    .catch(err => {
                      partnerChannel.guild.channels
                        .get(serverInfo.editPartnerChannel)
                        .send(getErrorEmbed(serverInfo, err));
                    });
                }
              })
              .catch(err => {
                return partnerChannel.guild.channels
                  .get(serverInfo.editPartnerChannel)
                  .send(getErrorEmbed(serverInfo, err));
              });
          default:
            return partnerChannel.guild.channels
              .get(serverInfo.editPartnerChannel)
              .send(
                getErrorEmbed(
                  serverInfo,
                  `The message type ${message.type} is invalid!`
                )
              );
        }
      });
    }
    chain = chain.then(resolve()).catch(err => reject(err));
  });
}

function getErrorEmbed(serverInfo, err) {
  const embed = new Discord.MessageEmbed()
    .setColor([255, 0, 0])
    .setAuthor("Failed!", serverInfo.logo)
    .addField("Error:", `${err}`);
  //.addField("Caller:", `${getErrorEmbed.caller}`)
  return embed;
}
