const Discord = require("discord.js");
const amount = 50;
const ACBorder = "https://cdn.discordapp.com/attachments/278333760666075136/363379782852804608/ACBorder.png"

module.exports = {
    title: "Partner",
    details: [
        {
            perms      : "Admin",
            command    : "!partner help",
            description: "Manipulates the partners and partner types for AlphaConsole. Use `!partner help` for more information."
        }
    ],

  run: async ({ client, serverInfo, message, args, sql, config }) => {
    if (message.channel.id !== serverInfo.channels.editPartners || !message.member.isModerator) return; // Ignore it if it's not in the edit partner channel

    message.delete(500); // Delete the message, we don't need it

    // Check arguments
    if (args.length < 2)
        return sendEmbed(message.channel, "You must specify options! Use `!partner help` for more information!")

    switch (args[1].toLowerCase()) {
        case "add":
            return addPartner(client, serverInfo, sql, message, args);

        case "addtype":
            return addType(client, serverInfo, sql, message, args);

        case "enable":
            return enablePartner(client, serverInfo, sql, message, args);

        case "disable":
            return disablePartner(client, serverInfo, sql, message, args);

        case "list":
            return listPartners(client, serverInfo, sql, message, args);

        case "listtypes":
            return listTypes(client, serverInfo, sql, message, args);

        case "setheader":
            return setHeader(client, serverInfo, sql, message, args);

        case "setchannelheader":
            return setChannelHeader(client, serverInfo, sql, message, args);

        case "settypeheader":
            return setTypeHeader(client, serverInfo, sql, message, args);

        case "update":
            return forceUpdatePartners(client, serverInfo, sql, message, args);

        default:
            const embed = new Discord.MessageEmbed()
            .setColor([255, 255, 0])
            .setAuthor("Partner Command Help:", client.user.displayAvatarURL({ format: "png" }))
                .addField("Add Partner", "`!partner add <partner_type> <partner_name>` - Add a Partner, the information to be messaged will be gathered from the Channel up to " + amount +" messages.")
                .addField("Add Partner Type", "`!partner addType <partner_type> <subheading_message>` - Add a Partner Category/Type to be shown in the Partner's Channel")
                .addField("Enable a Partner", "`!partner enable <partner_name>` (Note: Partners are enabled by default when added!)")
                .addField("Disable a Partner", "`!partner disable <partner_name>` - Prevent a Partner from being shown in the Partner's Channel)")
                .addField("Show Partners", "`!partner list [enabled|disabled]` - List Partners, optionally you can specify enabled or disabled to filter")
                .addField("Show Types", "`!partner listTypes` - Show a list of all the Partner Types")
                .addField("Set Channel Header", "`!partner setChannelHeader` - This sets the Partner Channel Header that preceeds all Partners.")
                .addField("Set Partner Header", "`!partner setHeader <partner_name>` - Sets the Partner Channel Message for this Partner (The message reacted to)")
                .addField("Set Type Header", "`!partner setTypeHeader <type>` - This sets the Partner Type Header that preceeds Partners of this type.")
                .addField("Update Partner Channel", "`!partner update` - Force update the Partner Channel");
            return message.channel.send(embed);
    }
}
};

async function addPartner(client, serverInfo, sql, message, args) {
  // Check args length
  // Usage: !partner add <partner_type> <partner_name>
  // Min Args == 4

  if (args.length < 4)
    return sendEmbed(message.channel, "Something went wrong!", "Incorrect Usage: \"!partner add <partner_type> <partner_name>\"")

  var type = args[2].toLowerCase();
  var name = args.slice(3).join(" ");

  var sqlReplace = 'replace(replace(partner_name, "_", ""), "*", "")'; //Remove any discord markdown used, without actually removing it.
  var sqlReplaceType = 'replace(replace(type, "_", ""), "*", "")'; //Remove any discord markdown used, without actually removing it.

    sql.query(`SELECT * FROM partners WHERE ${sqlReplace} LIKE ?`, [ name.toLowerCase() ], (err, res) => {
        if (err) {
            console.error(err);
            return sendEmbed(message.channel, "Something went wrong!", `${err}`);
        }
        // Already a partner called that, let the user know
        if (res.length > 0)
            return sendEmbed(message.channel, "Something went wrong!", `There is already a Partner called ${name}!`);

        sql.query(`SELECT * FROM partner_types WHERE ${sqlReplaceType} LIKE ?`, [ type.toLowerCase() ], (error, result) => {
            if (error) return sendEmbed(message.channel, "Something went wrong!", `${error}`);

            if (result.length == 0) {
                // Need to add the type
                var subheading = { messages: [{ type: "text", content: type }] };
                sql.query(`INSERT INTO partner_types(id,type,json_data) VALUES (null, ?, ?)`,[type, JSON.stringify(subheading)], (errr, ress) => {
                    if (errr) return sendEmbed(message.channel, "Something went wrong!", `${errr}`);

                    addPartnerInsert(client,serverInfo,sql,message,args,type,name)
                    .then(() => {
                        resolve("Success");
                    })
                    .catch(err => {
                        console.error(err);
                        return sendEmbed(message.channel, "Something went wrong!", `${err}`);
                    });
                })
            } else {
                // Type exists
                addPartnerInsert(client, serverInfo, sql, message, args, type, name)
                .then(() => {
                    resolve("Success");
                })
                .catch(err => {
                    console.error(err);
                    return sendEmbed(message.channel, "Something went wrong!", `${err}`);
                });
            }
            })
        })
}

function addPartnerInsert(client, serverInfo, sql, message, args, type, name) {
    return new Promise((resolve, reject) => {
        // Partner doesn't exist, parse the channel data, and delete messages
        parseChannelToObject(client, message).then(data => {
            var message_data = data;
            var header_data = { messages: [{ type: "text", content: name }] };

            sql.query(`INSERT INTO partners(id,message_data,type,partner_name,header_data,enabled) VALUES (1,?,?,?,?,1)`, [ JSON.stringify(message_data), type , name , JSON.stringify(header_data) ], (err, res) => {
                if (err) {
                    console.error(err);
                    return sendEmbed(message.channel, "Something went wrong!", `${err}`);
                }

                sendEmbed(message.channel, "Attempting to Update Partners Channel!");

                // New partner has been added, so now call update partners and let the user know all is good.
                updatePartnersChannel(client, sql, serverInfo, message)
                .then(result => {
                    allowMessages(message, serverInfo, true);
                    return sendEmbed(message.channel, "Success!", "Added new Partner and Updated Partners Channel!")
                })
                .catch(err => {
                    allowMessages(message, serverInfo, true);
                    console.error(err);
                    return sendEmbed(message.channel, "Something went wrong!", `${err}`);
                });
            })
        })
    });
}

function addType(client, serverInfo, sql, message, args) {

    if (args.length < 4)
        return sendEmbed(message.channel, "Something went wrong!", "Incorrect Usage: `!partner addType <partner_type> <subheadding_text>")

    var type = args[2].toLowerCase();
    var subheading = { messages: [{ type: "text", content: args.slice(3).join(" ") }] };
    var sqlReplace = 'replace(replace(type, "_", ""), "*", "")'; //Remove any discord markdown used, without actually removing it.

    sql.query(`SELECT * FROM partner_types WHERE ${sqlReplace} LIKE ?`, [ type.toLowerCase() ], (err, rows) => {
        if (err) {
            console.error(err);
            return sendEmbed(message.channel, "Something went wrong!", `${err}`);
        }

        if (rows.length > 0)
            return sendEmbed(message.channel, "Something went wrong!", `There is already a type called ${type}`);

        sql.query(`INSERT INTO partner_types(id,type,json_data) VALUES (null, ?, ?)`, [type, JSON.stringify(subheading)], (error, res) => {
            if (error) return sendEmbed(message.channel, "Something went wrong!", `${error}`);

            sendEmbed(message.channel, "Success!", "Type added, attempting to Update Partners Channel!")

            // New partner has been added, so now call update partners and let the user know all is good.
            updatePartnersChannel(client, sql, serverInfo, message).then(result => {
                allowMessages(message, serverInfo, true);
                return sendEmbed(message.channel, "Success!", "Updated Partners Channel!")
            })
            .catch(err => {
                allowMessages(message, serverInfo, true);
                console.error(err);
                return sendEmbed(message.channel, "Something went wrong!", `${err}`);
            });
        })
    })
}

function enablePartner(client, serverInfo, sql, message, args) {
    // Needs to update partners channel
    // Usage: !partner enable <partner_name>
    // Min Args = 3;

    if (args.length < 3)
        return sendEmbed(message.channel, "Something went wrong!", "Incorrect Usage: `!partner enable <partner_name>`");

    var name = args.slice(2).join(" ");
    var sqlReplace = 'replace(replace(partner_name, "_", ""), "*", "")';

    sql.query(`SELECT * FROM partners WHERE ${sqlReplace} LIKE ?`, [ name.toLowerCase() ], (err, rows) => {
        if (err) {
            console.error(err);
            return sendEmbed(message.channel, "Something went wrong!", `${err}`);
        }

        if (rows.length < 1)
            return sendEmbed(message.channel, "Something went wrong!", `${name} is not a Partner!`);

        sql.query(`UPDATE partners SET enabled=1 WHERE ${sqlReplace} LIKE ?`, [ name.toLowerCase() ], (error, res) => {
            if (error) return sendEmbed(message.channel, "Something went wrong!", `${error}`);
            sendEmbed(message.channel, "Success!", `Enabled ${name}! Attempting to update Partners Channel!`)  

            updatePartnersChannel(client, sql, serverInfo, message).then(result => {
                allowMessages(message, serverInfo, true);
                return sendEmbed(message.channel, "Success!", "Updated Partners Channel!")
            })
            .catch(err => {
                allowMessages(message, serverInfo, true);
                console.error(err);
                return sendEmbed(message.channel, "Something went wrong!", `${err}`);
            });
        });
    })
}

function disablePartner(client, serverInfo, sql, message, args) {

    if (args.length < 3)
        return sendEmbed(message.channel, "Something went wrong!", "Incorrect Usage: `!partner disable <partner_name>`")

    var name = args.slice(2).join(" ");
    var sqlReplace = 'replace(replace(partner_name, "_", ""), "*", "")';

    sql.query(`SELECT * FROM partners WHERE ${sqlReplace} LIKE ?`, [ name.toLowerCase() ], (err, rows) => {
        if (err) {
            console.error(err);
            return sendEmbed(message.channel, "Something went wrong!", `${err}`);
        }

        if (rows.length < 1)
            return sendEmbed(message.channel, "Something went wrong!", `${name} is not a Partner!`);

        sql.query(`UPDATE partners SET enabled=0 WHERE ${sqlReplace} LIKE ?`, [ name.toLowerCase() ], () => {
            sendEmbed(message.channel, "Success!", `Disabled ${name}! Attempting to update Partners Channel!`)  

            updatePartnersChannel(client, sql, serverInfo, message).then(result => {
                allowMessages(message, serverInfo, true);
                return sendEmbed(message.channel, "Success!", "Updated Partners Channel!")
            })
            .catch(err => {
                allowMessages(message, serverInfo, true);
                console.error(err);
                return sendEmbed(message.channel, "Something went wrong!", `${err}`);
            });
        });
    })

}

function listPartners(client, serverInfo, sql, message, args) {
  // List all partners, optionally if args 3 specified as valid enabled|disabled then filter
  var whereClause = "WHERE id > 0";
  if (args[3] !== undefined) {
    if (args[3].toLowerCase() == "enabled") whereClause = +" AND enabled = 1";
    else if (args[3].toLowerCase() == "disabled")
      whereClause = +" AND enabled = 0";
  }

    sql.query(`SELECT * FROM partners ${whereClause}`, [], (err, rows) => {
        if (err) {
            console.error(err);
            return sendEmbed(message.channel, "Something went wrong!", `${err}`);
        }

        var allPartners = "";
        rows.forEach(row => {
            if (row.enabled == 1) en = " [Enabled]";
            else en = " [Disabled]";
            allPartners += "- " + row.partner_name + en + ",\n";
        });
        sendEmbed(message.channel, "AlphaConsole Partners:", allPartners)
    })
}

function listTypes(client, serverInfo, sql, message, args) {
  // List all types
    sql.query(`SELECT * FROM partner_types`, [], (err, rows) => {
        if (err) {
            console.error(err);
            return sendEmbed(message.channel, "Something went wrong!", `${err}`);
        }

        var allTypes = "";
        rows.forEach(row => {
            allTypes += "- " + row.type + ",\n";
        });
        sendEmbed(message.channel, "Partner Types:", allTypes)
    })

}

function setHeader(client, serverInfo, sql, message, args) {

    if (args.length < 3) 
        return sendEmbed(message.channel, "Something went wrong!", "Incorrect Usage: `!partner setHeader <partner_name>`");

    var name = args.slice(2).join(" ");
    var sqlReplace = 'replace(replace(partner_name, "_", ""), "*", "")';

    sql.query(`SELECT * FROM partners WHERE ${sqlReplace} LIKE ?`, [ name.toLowerCase() ], async (error, rows) => {
        if (error) return sendEmbed(message.channel, "Something went wrong!", `${error}`);

        if (rows.length == 0) 
            return sendEmbed(message.channel, "Something went wrong!", `${name} is not a Partner`);

        var header_data = await parseChannelToObject(client, message);

        sql.query(`UPDATE partners SET header_data=? WHERE ${sqlReplace} LIKE ?`, [ JSON.stringify(header_data), name.toLowerCase()], (err) => {
            if (err) {
                console.error(err);
                return sendEmbed(message.channel, "Something went wrong!", `${err}`);
            }
            
            return forceUpdatePartners(client, serverInfo, sql, message, args);
        })
    })
}

function setTypeHeader(client, serverInfo, sql, message, args) {
  // Needs to update partners channel
  // search via LIKE args 3
  // Args min length 3

    if (args.length < 3) {
        return sendEmbed(message.channel, "Something went wrong!", "Incorrect Usage: `!partner setTypeHeader <type>`");
    }

    var type = args.slice(2).join(" ");
    var sqlReplace = 'replace(replace(type, "_", ""), "*", "")';

    sql.query(`SELECT * FROM partner_types WHERE ${sqlReplace} LIKE ?`, [ type.toLowerCase() ], async (err, rows) => {
        if (err) {
            console.error(err);
            return sendEmbed(message.channel, "Something went wrong!", `${err}`);
        }

        if (rows.length == 0) 
            return sendEmbed(message.channel, "Something went wrong!", `${type} is not a Partner Type`);
        

        var json_data = await parseChannelToObject(client, message);

        sql.query(`UPDATE partner_types SET json_data=? WHERE ${sqlReplace} LIKE ?`, [ JSON.stringify(json_data), type.toLowerCase()], (error) => {
            if (error) return sendEmbed(message.channel, "Something went wrong!", `${error}`);
            
            return forceUpdatePartners(client, serverInfo, sql, message, args);
        })
    });
}

async function setChannelHeader(client, serverInfo, sql, message, args) {
    var header_data = await parseChannelToObject(client, message);

    sql.query(`REPLACE INTO partners (id,type,partner_name,message_data,header_data,enabled) VALUES (0,null,null,null,?,null)`,[JSON.stringify(header_data)], (err) => {
        if (err) {
            console.error(err);
            return sendEmbed(message.channel, "Something went wrong!", `${err}`);
        }

        return forceUpdatePartners(client, serverInfo, sql, message, args); // Could use this instead of every other update tbh
    })

}

function forceUpdatePartners(client, serverInfo, sql, message, args) {
  // Type added, update partners channel
  if (message != null) sendEmbed(message.channel, "Attempting to Update Partners Channel!");
  allowMessages(message, serverInfo, false);

  // New partner has been added, so now call update partners and let the user know all is good.
  updatePartnersChannel(client, sql, serverInfo, message)
    .then(result => {
      //Check Promise result, since the function is running async.
      allowMessages(message, serverInfo, true);
      sendEmbed(message.channel, "Success!", "Updated Partners Channel!");
    })
    .catch(err => {
      allowMessages(message, serverInfo, true);
      console.error(err);
      return sendEmbed(message.channel, "Something went wrong!", `${err}`);
    });
}

function allowMessages(message, serverInfo, allow) {
    if (message == null) return;
    message.guild.channels
        .get(serverInfo.channels.editPartners)
        .overwritePermissions(message.guild.id, {
            SEND_MESSAGES: allow
        });
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
  var partnerChannel = message.guild.channels.get(serverInfo.channels.partners);
  allowMessages(message, serverInfo, false);
  return new Promise(function(resolve, reject) {
    // DELETE ALL MESSAGES
    partnerChannel.messages
      .fetch({ limit: 100 })
      .then(fetched => {
        fetched.array().forEach(m => m.delete());
        
        var update_messages_holder = {};
        update_messages_holder.messages = [];

        // All messages deleted, send channel headers
        sql.query("SELECT * FROM partners WHERE id=?", [0], (err, res) => {
            if (err) {
                console.error(err);
                sendEmbed(message.channel, "Something went wrong!", `${err}`);
            }

            let row = res[0];
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
            sql.query(`SELECT * FROM partner_types`, [], (err, rowsType) => {
                if (err) {
                    console.error(err);
                    return sendEmbed(message.channel, "Something went wrong!", `${err}`);
                }

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
                    sql.query(`SELECT * FROM partners WHERE type=? AND enabled=1`, [rowType.type], (error, rows) => {
                        if (error) return sendEmbed(message.channel, "Something went wrong!", `${error}`);

                        // For each partner
                        var doneRows = 0;

                        // Check if there are any partners, if there are add header for this type
                        if (rows.length > 0) {
                            /* for (var i = 0; i < typeData.messages.length; i++) {
                                var mm = typeData.messages[i];
                                update_messages_holder.messages.push({
                                    type: mm.type,
                                    content: mm.content,
                                    url: mm.url,
                                    react: false
                                });
                            } */
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

                            var partnerData = JSON.parse(rowPartner.header_data);

                            for (let i = 0; i < partnerData.messages.length; i++) {
                                var mm = partnerData.messages[i];
                                update_messages_holder.messages.push({
                                    type: mm.type,
                                    content: mm.content,
                                    url: mm.url,
                                    react: i === partnerData.messages.length - 1 ? true : false,
                                    id: "" + rowPartner.id,
                                    identifier: rowPartner.identifier
                                });
                                
                            }

                            doneRows++; // Partner done

                            if (doneRows == rows.length) {
                                // All of the partners for this type have been looped through
                                doneTypes++; // Type done

                                update_messages_holder.messages.push({
                                type: "file",
                                url: ACBorder,
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
                });
                })
          })
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
                  sql.query(`UPDATE partners SET id=? WHERE id=?`, [ "" + newMessage.id, "" + message.id], (err) => {
                        if (err) {
                            console.error(err)
                            return sendEmbed(partnerChannel.guild.channels.get(serverInfo.channels.editPartners), "Something went wrong", `${err}`)
                        }

                        newMessage.react(emoji);
                    })
                }
              })
              .catch(err => {
                console.error(err);
                return sendEmbed(partnerChannel.guild.channels.get(serverInfo.channels.editPartners), "Something went wrong", `${err}`)
              });
          case "file":
            return partnerChannel
              .send("", { files: [message.url] })
              .then(newMessage => {
                if (message.react) {
                    sql.query(`UPDATE partners SET id=? WHERE identifier=?`, [ "" + newMessage.id, message.identifier || message.id], (err) => {
                        if (err) {
                            console.error(err)
                            return sendEmbed(partnerChannel.guild.channels.get(serverInfo.channels.editPartners), "Something went wrong", `${err}`)
                        }

                        newMessage.react(emoji);
                    })
                }
              })
              .catch(err => {
                console.error(err);
                return sendEmbed(partnerChannel.guild.channels.get(serverInfo.channels.editPartners), "Something went wrong", `${err}`)
              });
          case "text":
            return partnerChannel
              .send(message.content)
              .then(newMessage => {
                if (message.react) {
                    sql.query(`UPDATE partners SET id=? WHERE id=?`, [ "" + newMessage.id, "" + message.id ], (err) => {
                        if (err) {
                            console.error(err)
                            return sendEmbed(partnerChannel.guild.channels.get(serverInfo.channels.editPartners), "Something went wrong", `${err}`)
                        }

                        newMessage.react(emoji); 
                    })
                }
              })
              .catch(err => {
                console.error(err);
                return sendEmbed(partnerChannel.guild.channels.get(serverInfo.channels.editPartners), "Something went wrong", `${err}`)
              });
          default:
              return sendEmbed(partnerChannel.guild.channels.get(serverInfo.channels.editPartners), "Something went wrong", `The message type ${message.type} is invalid!`)
        }
      });
    }
    chain = chain.then(resolve()).catch(err => reject(err));
  });
}


function sendEmbed (channel, message, desc) {
    const embed = new Discord.MessageEmbed()
      .setColor([255, 255, 0])
      .setAuthor(message, channel.guild.iconURL());
      if (desc) embed.setDescription(desc)
    channel.send(embed)
}