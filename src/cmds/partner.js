const Discord = require("discord.js");
const amount = 50; // Amount of previous messages to check for when parsing, can be maximum 100. This will be affected by bot responses. So it's best to add more than needed, just incase.

/**
 *  Note: The bot must send any responses in Embedded Messages, the bot will ignore embeds when parsing messages to be sent to a user or such.
 *        PS. Make sure to set the emoji in serverInfo.partnerEmoji with an id ^^ ~Nameless
 *
 *        Discord Message IDs are currently 18 digits, which javascript seems to auto round past 15, so the last 2 digits would always round and mess up the id itself.
 *        This was most evident trying to update, since the id was being stored in an object to pass to the update function. For now I have converted them to strings
 *        and am passing those which don't seem to round at all. id in partners table thus is stored as text type. ¯\_(ツ)_/¯
 */

module.exports = {
  title: "partner",
  perms: "Admin",
  commands: ["!partner help"],
  description: [
    "Manipulates the partners and partner types for AlphaConsole. Use `!partner help` for more information."
  ],

  run: async (client, serverInfo, sql, message, args) => {
    if (message.channel.id != serverInfo.editPartnerChannel) return; // Ignore it if it's not in the edit partner channel

    message.delete(500); // Delete the message, we don't need it

    if (
      hasRole(message.member, "Admin") ||
      hasRole(message.member, "Developer")
    ) {
      // Ensure this user is permitted to do this, keep it deleted either way just incase the channel permissions
      // get messed up and people somehow figure out the command, makes sure chat doesn't get spammed

      // Check arguments
      if (args.length < 2)
        return message.channel.send(
          getErrorEmbed(
            serverInfo,
            "You must specify options! Use `!partner help` for more information!"
          )
        );

      switch (args[1].toLowerCase()) {
        // All the below functions will return an embed send, which will in turn be returned from here.
        case "add":
          // return Function addPartner
          return addPartner(client, serverInfo, sql, message, args);

        case "addtype":
          // return Function addType
          return addType(client, serverInfo, sql, message, args);

        case "enable":
          // return Function enablePartner
          return enablePartner(client, serverInfo, sql, message, args);

        case "disable":
          // return Function disablePartner
          return disablePartner(client, serverInfo, sql, message, args);

        case "list":
          // return Function listPartners
          return listPartners(client, serverInfo, sql, message, args);

        case "listtypes":
          // return Function listTypes
          return listTypes(client, serverInfo, sql, message, args);

        case "setheader":
          // return Function setHeader
          return setHeader(client, serverInfo, sql, message, args);

        case "setchannelheader":
          // return Function setChannelHeader
          return setChannelHeader(client, serverInfo, sql, message, args);

        case "settypeheader":
          // return Function setTypeHeader
          return setTypeHeader(client, serverInfo, sql, message, args);

        case "update":
          // return Function forceUpdatePartners
          return forceUpdatePartners(client, serverInfo, sql, message, args);

        default:
          // Also covers help keyword
          const embed = new Discord.MessageEmbed()
            .setColor([255, 255, 0])
            .setAuthor("Partner Command Help:", serverInfo.logo)
            .addField(
              "Add Partner",
              "`!partner add <partner_type> <partner_name>` - Add a Partner, the information to be messaged will be gathered from the Channel up to " +
                amount +
                " messages."
            )
            .addField(
              "Add Partner Type",
              "`!partner addType <partner_type> <subheading_message>` - Add a Partner Category/Type to be shown in the Partner's Channel"
            )
            .addField(
              "Enable a Partner",
              "`!partner enable <partner_name>` (Note: Partners are enabled by default when added!)"
            )
            .addField(
              "Disable a Partner",
              "`!partner disable <partner_name>` - Prevent a Partner from being shown in the Partner's Channel)"
            )
            .addField(
              "Show Partners",
              "`!partner list [enabled|disabled]` - List Partners, optionally you can specify enabled or disabled to filter"
            )
            .addField(
              "Show Types",
              "`!partner listTypes` - Show a list of all the Partner Types"
            )
            .addField(
              "Set Channel Header",
              "`!partner setChannelHeader` - This sets the Partner Channel Header that preceeds all Partners."
            )
            .addField(
              "Set Partner Header",
              "`!partner setHeader <partner_name>` - Sets the Partner Channel Message for this Partner (The message reacted to)"
            )
            .addField(
              "Set Type Header",
              "`!partner setTypeHeader <type>` - This sets the Partner Type Header that preceeds Partners of this type."
            )
            .addField(
              "Update Partner Channel",
              "`!partner update` - Force update the Partner Channel"
            );
          return message.channel.send(embed);
      }
    }
  }
};

async function addPartner(client, serverInfo, sql, message, args) {
  // Check args length
  // Usage: !partner add <partner_type> <partner_name>
  // Min Args == 4

  if (args.length < 4)
    return message.channel.send(
      getErrorEmbed(
        serverInfo,
        "Incorrect Usage: `!partner add <partner_type> <partner_name>`"
      )
    );

  var type = args[2].toLowerCase();
  var name = args.slice(3).join(" "); // Join up every other argument past here to allow names with spaces.

  // Check if partner name exists, if it does then don't add anything.
  // This does not delete messages in the channel outside of the command because of the User Experience,
  // For instance, a misspelt word of a common partner name would require resending every single message, which would be troublesome.

  var sqlReplace = 'replace(replace(partner_name, "_", ""), "*", "")'; //Remove any discord markdown used, without actually removing it.
  var sqlReplaceType = 'replace(replace(type, "_", ""), "*", "")'; //Remove any discord markdown used, without actually removing it.

  sql
    .all(`SELECT * FROM partners WHERE ${sqlReplace} LIKE ?`, [
      name.toLowerCase()
    ])
    .then(rows => {
      // Already a partner called that, let the user know
      if (rows.length > 0)
        return message.channel.send(
          getErrorEmbed(
            serverInfo,
            `There is already a Partner called ${name}!`
          )
        );

      sql
        .all(`SELECT * FROM partner_types WHERE ${sqlReplaceType} LIKE ?`, [
          type.toLowerCase()
        ])
        .then(rowsType => {
          if (rowsType.length == 0) {
            // Need to add the type
            var subheading = { messages: [{ type: "text", content: type }] };
            sql
              .run(
                `INSERT INTO partner_types(id,type,json_data) VALUES (null, ?, ?)`,
                [type, JSON.stringify(subheading)]
              )
              .then(res => {
                addPartnerInsert(
                  client,
                  serverInfo,
                  sql,
                  message,
                  args,
                  type,
                  name
                )
                  .then(() => {
                    resolve("Success");
                  })
                  .catch(err => {
                    return message.channel.send(getErrorEmbed(serverInfo, err));
                  });
              })
              .catch(err => {
                return message.channel.send(getErrorEmbed(serverInfo, err));
              });
          } else {
            // Type exists
            addPartnerInsert(client, serverInfo, sql, message, args, type, name)
              .then(() => {
                resolve("Success");
              })
              .catch(err => {
                return message.channel.send(getErrorEmbed(serverInfo, err));
              });
          }
        })
        .catch(err => {
          return message.channel.send(getErrorEmbed(serverInfo, err));
        });
    })
    .catch(err => {
      return message.channel.send(getErrorEmbed(serverInfo, err));
    });
}

function addPartnerInsert(client, serverInfo, sql, message, args, type, name) {
  return new Promise((resolve, reject) => {
    // Partner doesn't exist, parse the channel data, and delete messages
    parseChannelToObject(client, message)
      .then(data => {
        var message_data = data;
        var header_data = { messages: [{ type: "text", content: name }] };

        // Insert new partner, ids are set to 0 for now so we know this is the new partner (doesn't have a message id yet so need one we know wont be used ever)
        // We don't use 0 as the id, since in this table, the channel header message itself is id=0, so we can get it at channel update time.
        sql
          .run(
            `INSERT INTO partners(id,message_data,type,partner_name,header_data,enabled) VALUES (1,?,?,?,?,1)`,
            [
              JSON.stringify(message_data),
              type,
              name,
              JSON.stringify(header_data)
            ]
          )
          .then(res => {
            const embed = new Discord.MessageEmbed()
              .setColor([255, 140, 0])
              .setAuthor(
                "Attempting to Update Partners Channel!",
                serverInfo.logo
              );
            message.channel.send(embed);

            // New partner has been added, so now call update partners and let the user know all is good.
            updatePartnersChannel(client, sql, serverInfo, message)
              .then(result => {
                allowMessages(message, serverInfo, true);
                const embed = new Discord.MessageEmbed()
                  .setColor([255, 255, 0])
                  .setAuthor("Success!", serverInfo.logo)
                  .setDescription(
                    "Added new Partner and Updated Partners Channel!"
                  );
                return message.channel.send(embed);
              })
              .catch(err => {
                allowMessages(message, serverInfo, true);
                return message.channel.send(getErrorEmbed(serverInfo, err));
              });
          })
          .catch(err => {
            return message.channel.send(getErrorEmbed(serverInfo, err));
          });
      })
      .catch(err => {
        return message.channel.send(getErrorEmbed(serverInfo, err));
      });
  });
}

function addType(client, serverInfo, sql, message, args) {
  // Check args length
  // Usage: !partner addtype <partner_type> <subheading_text>
  // json_data Format: {messages: [type:"text", content: <subheading_text>]}
  // Can only have a singular message, so no need to worry, just join args 4+
  // Needs to update partners channel

  if (args.length < 4)
    return message.channel.send(
      getErrorEmbed(
        serverInfo,
        "Incorrect Usage: `!partner addType <partner_type> <subheadding_text>"
      )
    );

  var type = args[2].toLowerCase();
  var subheading = {
    messages: [{ type: "text", content: args.slice(3).join(" ") }]
  };
  var sqlReplace = 'replace(replace(type, "_", ""), "*", "")'; //Remove any discord markdown used, without actually removing it.

  sql
    .all(`SELECT * FROM partner_types WHERE ${sqlReplace} LIKE ?`, [
      type.toLowerCase()
    ])
    .then(rows => {
      if (rows.length > 0)
        return message.channel.send(
          getErrorEmbed(serverInfo, `There is already a type called ${type}`)
        );

      // No type called this yet

      sql
        .run(
          `INSERT INTO partner_types(id,type,json_data) VALUES (null, ?, ?)`,
          [type, JSON.stringify(subheading)]
        )
        .then(res => {
          // Type added, update partners channel
          const embed = new Discord.MessageEmbed()
            .setColor([255, 255, 0])
            .setAuthor("Success!", serverInfo.logo)
            .setDescription(
              "Type added, attempting to Update Partners Channel!"
            );
          message.channel.send(embed);

          // New partner has been added, so now call update partners and let the user know all is good.
          updatePartnersChannel(client, sql, serverInfo, message)
            .then(result => {
              allowMessages(message, serverInfo, true);
              const embed = new Discord.MessageEmbed()
                .setColor([255, 255, 0])
                .setAuthor("Success!", serverInfo.logo)
                .setDescription("Updated Partners Channel!");
              return message.channel.send(embed);
            })
            .catch(err => {
              allowMessages(message, serverInfo, true);
              return message.channel.send(getErrorEmbed(serverInfo, err));
            });
        })
        .catch(err => {
          return message.channel.send(getErrorEmbed(serverInfo, err));
        });
    })
    .catch(err => {
      return message.channel.send(getErrorEmbed(serverInfo, err));
    });
}

function enablePartner(client, serverInfo, sql, message, args) {
  // Needs to update partners channel
  // Usage: !partner enable <partner_name>
  // Min Args = 3;

  if (args.length < 3)
    return message.channel.send(
      getErrorEmbed(
        serverInfo,
        "Incorrect Usage: `!partner enable <partner_name>`"
      )
    );

  var name = args.slice(2).join(" ");
  var sqlReplace = 'replace(replace(partner_name, "_", ""), "*", "")';

  sql
    .all(`SELECT * FROM partners WHERE ${sqlReplace} LIKE ?`, [
      name.toLowerCase()
    ])
    .then(rows => {
      if (rows.length < 1)
        return message.channel.send(
          getErrorEmbed(serverInfo, `${name} is not a Partner!`)
        );

      sql
        .run(`UPDATE partners SET enabled=1 WHERE ${sqlReplace} LIKE ?`, [
          name.toLowerCase()
        ])
        .then(res => {
          const embed = new Discord.MessageEmbed()
            .setColor([255, 255, 0])
            .setAuthor("Success!", serverInfo.logo)
            .setDescription(
              `Enabled ${name}! Attempting to update Partners Channel!`
            );
          message.channel.send(embed);

          updatePartnersChannel(client, sql, serverInfo, message)
            .then(result => {
              allowMessages(message, serverInfo, true);
              const embed = new Discord.MessageEmbed()
                .setColor([255, 255, 0])
                .setAuthor("Success!", serverInfo.logo)
                .setDescription("Updated Partners Channel!");
              return message.channel.send(embed);
            })
            .catch(err => {
              allowMessages(message, serverInfo, true);
              return message.channel.send(getErrorEmbed(serverInfo, err));
            });
        });
    })
    .catch(err => {
      return message.channel.send(getErrorEmbed(serverInfo, err));
    });
}

function disablePartner(client, serverInfo, sql, message, args) {
  // Needs to update partners channel
  // Usage: !partner disable <partner_name>
  // Min Args = 3;

  if (args.length < 3)
    return message.channel.send(
      getErrorEmbed(
        serverInfo,
        "Incorrect Usage: `!partner disable <partner_name>`"
      )
    );

  var name = args.slice(2).join(" ");
  var sqlReplace = 'replace(replace(partner_name, "_", ""), "*", "")';

  sql
    .all(`SELECT * FROM partners WHERE ${sqlReplace} LIKE ?`, [
      name.toLowerCase()
    ])
    .then(rows => {
      if (rows.length < 1)
        return message.channel.send(
          getErrorEmbed(serverInfo, `${name} is not a Partner!`)
        );

      sql
        .run(`UPDATE partners SET enabled=0 WHERE ${sqlReplace} LIKE ?`, [
          name.toLowerCase()
        ])
        .then(res => {
          const embed = new Discord.MessageEmbed()
            .setColor([255, 255, 0])
            .setAuthor("Success!", serverInfo.logo)
            .setDescription(
              `Disabled ${name}! Attempting to update Partners Channel!`
            );
          message.channel.send(embed);

          updatePartnersChannel(client, sql, serverInfo, message)
            .then(result => {
              allowMessages(message, serverInfo, true);
              const embed = new Discord.MessageEmbed()
                .setColor([255, 255, 0])
                .setAuthor("Success!", serverInfo.logo)
                .setDescription("Updated Partners Channel!");
              return message.channel.send(embed);
            })
            .catch(err => {
              allowMessages(message, serverInfo, true);
              return message.channel.send(getErrorEmbed(serverInfo, err));
            });
        });
    })
    .catch(err => {
      return message.channel.send(getErrorEmbed(serverInfo, err));
    });
}

function listPartners(client, serverInfo, sql, message, args) {
  // List all partners, optionally if args 3 specified as valid enabled|disabled then filter
  var whereClause = "WHERE id>1";
  if (args[3] !== undefined) {
    if (args[3].toLowerCase() == "enabled") whereClause = +" AND enabled=1";
    else if (args[3].toLowerCase() == "disabled")
      whereClause = +" AND enabled=0";
  }

  sql
    .all(`SELECT * FROM partners ${whereClause}`)
    .then(rows => {
      var allPartners = "";
      rows.forEach(row => {
        var en;
        if (row.enabled == 1) en = " [Enabled]";
        else en = " [Disabled]";
        allPartners += "- " + row.partner_name + en + ",\n";
      });
      const embed = new Discord.MessageEmbed()
        .setColor([255, 255, 0])
        .setAuthor("AlphaConsole Partners:", serverInfo.logo)
        .setDescription(allPartners);
      return message.channel.send(embed);
    })
    .catch(err => {
      return message.channel.send(getErrorEmbed(serverInfo, err));
    });
}

function listTypes(client, serverInfo, sql, message, args) {
  // List all types
  sql
    .all(`SELECT * FROM partner_types`)
    .then(rows => {
      var allTypes = "";
      rows.forEach(row => {
        allTypes += "- " + row.type + ",\n";
      });
      const embed = new Discord.MessageEmbed()
        .setColor([255, 255, 0])
        .setAuthor("Partner Types:", serverInfo.logo)
        .setDescription(allTypes);
      return message.channel.send(embed);
    })
    .catch(err => {
      return message.channel.send(getErrorEmbed(serverInfo, err));
    });
}

function setHeader(client, serverInfo, sql, message, args) {
  // Needs to update partners channel
  // search via LIKE args 3
  // Args min length 3

  if (args.length < 3) {
    return message.channel.send(
      getErrorEmbed(
        serverInfo,
        "Incorrect Usage: `!partner setHeader <partner_name>`"
      )
    );
  }

  var name = args.slice(2).join(" ");
  var sqlReplace = 'replace(replace(partner_name, "_", ""), "*", "")';

  sql
    .all(`SELECT * FROM partners WHERE ${sqlReplace} LIKE ?`, [
      name.toLowerCase()
    ])
    .then(async rows => {
      if (rows.length == 0) {
        return message.channel.send(
          getErrorEmbed(serverInfo, `${name} is not a Partner`)
        );
      }

      var header_data = await parseChannelToObject(client, message);

      sql
        .run(`UPDATE partners SET header_data=? WHERE ${sqlReplace} LIKE ?`, [
          JSON.stringify(header_data),
          name.toLowerCase()
        ])
        .then(() => {
          return forceUpdatePartners(client, serverInfo, sql, message, args);
        })
        .catch(err => {
          return message.channel.send(getErrorEmbed(serverInfo, err));
        });
    })
    .catch(err => {
      return message.channel.send(getErrorEmbed(serverInfo, err));
    });
}

function setTypeHeader(client, serverInfo, sql, message, args) {
  // Needs to update partners channel
  // search via LIKE args 3
  // Args min length 3

  if (args.length < 3) {
    return message.channel.send(
      getErrorEmbed(
        serverInfo,
        "Incorrect Usage: `!partner setTypeHeader <type>`"
      )
    );
  }

  var type = args.slice(2).join(" ");
  var sqlReplace = 'replace(replace(type, "_", ""), "*", "")';

  sql
    .all(`SELECT * FROM partner_types WHERE ${sqlReplace} LIKE ?`, [
      type.toLowerCase()
    ])
    .then(async rows => {
      if (rows.length == 0) {
        return message.channel.send(
          getErrorEmbed(serverInfo, `${type} is not a Partner Type`)
        );
      }

      var json_data = await parseChannelToObject(client, message);

      sql
        .run(
          `UPDATE partner_types SET json_data=? WHERE ${sqlReplace} LIKE ?`,
          [JSON.stringify(json_data), type.toLowerCase()]
        )
        .then(() => {
          return forceUpdatePartners(client, serverInfo, sql, message, args);
        })
        .catch(err => {
          return message.channel.send(getErrorEmbed(serverInfo, err));
        });
    })
    .catch(err => {
      return message.channel.send(getErrorEmbed(serverInfo, err));
    });
}

async function setChannelHeader(client, serverInfo, sql, message, args) {
  // Needs to update partners channel
  // partners table id of 0, follows same format but in header_data
  // if id 0 doesn't exist then insert instead
  var header_data = await parseChannelToObject(client, message);

  sql
    .run(
      `REPLACE INTO partners (id,type,partner_name,message_data,header_data,enabled) VALUES (0,null,null,null,?,null)`,
      [JSON.stringify(header_data)]
    )
    .then(res => {
      return forceUpdatePartners(client, serverInfo, sql, message, args); // Could use this instead of every other update tbh
    })
    .catch(err => {
      return message.channel.send(getErrorEmbed(serverInfo, err));
    });
}

function forceUpdatePartners(client, serverInfo, sql, message, args) {
  // Type added, update partners channel
  const embed = new Discord.MessageEmbed()
    .setColor([255, 140, 0])
    .setAuthor("Attempting to Update Partners Channel!", serverInfo.logo);
  if (message != null) message.channel.send(embed);
  allowMessages(message, serverInfo, false);

  // New partner has been added, so now call update partners and let the user know all is good.
  updatePartnersChannel(client, sql, serverInfo, message)
    .then(result => {
      //Check Promise result, since the function is running async.
      allowMessages(message, serverInfo, true);
      const embed = new Discord.MessageEmbed()
        .setColor([255, 255, 0])
        .setAuthor("Success!", serverInfo.logo)
        .setDescription("Updated Partners Channel!");
      return message.channel.send(embed);
    })
    .catch(err => {
      allowMessages(message, serverInfo, true);
      return message.channel.send(getErrorEmbed(serverInfo, err));
    });
}

function allowMessages(message, serverInfo, allow) {
  if (message == null) return;
  message.guild.channels
    .get(serverInfo.editPartnerChannel)
    .overwritePermissions(message.guild.id, {
      SEND_MESSAGES: allow
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

/**
 * Parse the previous messages into a the object format used.
 * @param {*} client
 * @param {*} message
 */
async function parseChannelToObject(client, message) {
  return new Promise((resolve, reject) => {
    message.channel.messages
      .fetch({ limit: amount })
      .then(collectedMessages => {
        // All good in the hood format this boi
        var data = {};
        var messages = [];
        var mesArray = Array.from(collectedMessages.values());
        // Run through in reverse order so that we can remove messages without running into issues looking for nonexistent messages
        for (var i = mesArray.length - 1; i >= 0; i--) {
          var cmessage = mesArray[i];

          // Check if this message has file and text together
          if (
            cmessage.attachments !== undefined &&
            Array.from(cmessage.attachments).length > 0 &&
            cmessage.content !== undefined &&
            cmessage.content.length > 0 &&
            !message.author.bot
          ) {
            var messageHybrid = {};
            var att = Array.from(cmessage.attachments);
            messageHybrid.type = "hybrid";
            messageHybrid.url = att[0][1].url;
            messageHybrid.content = cmessage.content;
            messages.push(messageHybrid);
            // Delete this message because it's done
            cmessage.delete(1000);
          } else if (
            cmessage.attachments !== undefined &&
            Array.from(cmessage.attachments).length > 0 &&
            !message.author.bot
          ) {
            // Check if this message has a file only
            var messageImage = {};
            var att = Array.from(cmessage.attachments);
            messageImage.type = "file";
            messageImage.url = att[0][1].url;
            messages.push(messageImage);
            // Delete this message because it's done
            cmessage.delete(1000);
          } else if (
            cmessage.content !== undefined &&
            cmessage.content.length > 0 &&
            !cmessage.author.bot &&
            cmessage.content.toLowerCase().indexOf("!partner") == -1
          ) {
            // Check if this message has text only
            var messageText = {};
            messageText.type = "text";
            messageText.content = cmessage.content;
            messages.push(messageText);
            // Delete this message because it's done
            cmessage.delete(1000);
          }

          // Cannot put delete message here, since if command message isn't deleted quick enough, it will cause the promise to fail
        }
        data.messages = messages;
        resolve(data);
      })
      .catch(err => reject(err));
  });
}

/**
 * Update the Partners List Channel.
 * @param {*} client
 * @param {*} sql
 * @param {*} serverInfo
 * @param {*} message
 */
async function updatePartnersChannel(client, sql, serverInfo, message) {
  var partnerChannel = message.guild.channels.get(serverInfo.partnerChannel);
  allowMessages(message, serverInfo, false);
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
                        content: "_**We don't have any partners right now!**_",
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
                            for (var i = 0; i < typeData.messages.length; i++) {
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

                            var mm = partnerData.messages[0];
                            update_messages_holder.messages.push({
                              type: mm.type,
                              content: mm.content,
                              url: mm.url,
                              react: true,
                              id: "" + rowPartner.id
                            });

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
