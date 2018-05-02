const Discord = require("discord.js");

module.exports = {
  title: "add partner",
  perms: "Admin",
  commands: ["!addPartner <Partner Type> <Partner Name>"],
  description: [
    "Adds a partner, note this can only be used in the #add-partner channel. To view Partner Types run !viewPartnerTypes"
  ],

  run: async (client, serverInfo, sql, message, args) => {
    if (message.channel.id != serverInfo.addPartnerChannel) return; //Ignore it if it's not in the add partner channel

    if (hasRole(message.member, "Admin")) {
      // Ensure this user is permitted to do this,
      // Check arguments
      if (args.length < 3) {
        const embed = new Discord.MessageEmbed()
          .setColor([255, 255, 0])
          .setTitle("You must specify both a Partner Type and a Partner Name!");
        return message.channel.send(embed);
      }

      var type = args[1].toLowerCase();
      var name = args.slice(2).join(" ");
      console.log(name);

      var amount = 50; // Max amount of messages to check for (can be up to 100)

      //Delete users message
      message
        .delete()
        .then(dmes => {
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

                // Check if this message has a file
                if (
                  cmessage.attachments !== undefined &&
                  Array.from(cmessage.attachments).length > 0 &&
                  !cmessage.author.bot
                ) {
                  var messageImage = {};
                  var att = Array.from(cmessage.attachments);
                  messageImage.type = "file";
                  messageImage.content = att[0][1].url;
                  messages.push(messageImage);
                }

                // Check if this message has text, will split up file & text into separate message entries if both exist (not !addpartner is incase delete doesn't delete it quick enough)
                if (
                  cmessage.content !== undefined &&
                  cmessage.content.length > 0 &&
                  !cmessage.author.bot &&
                  !cmessage.toLowerCase.content.contains("!addpartner")
                ) {
                  var messageText = {};
                  messageText.type = "text";
                  messageText.content = cmessage.content;
                  messages.push(messageText);
                }

                // Delete this message because it's done
                cmessage.delete();
              }
              data.messages = messages;

              //Check if there is at least one message, or there's no point having the partner in the more info channel
              if (messages.length == 0) {
                const embed = new Discord.MessageEmbed()
                  .setColor([255, 255, 0])
                  .setTitle(
                    "Partners must have at least one message or image!"
                  );
                return message.channel.send(embed);
              }

              console.log(data);

              // TODO db call here
              // Check if partner name exists, if it does  then REEE at user

              const embed = new Discord.MessageEmbed()
                .setColor([255, 255, 0])
                .setTitle("Partner Added, Updating the Partners Channel!");
              return message.channel.send(embed);
            })
            .catch(console.error);
        })
        .catch(console.error);
    }
  }
};

function updatePartnersChannel(client, sql, serverInfo) {
  // Get all types
  // Get all partners
  // For each type
  // Send type's subheading message, whether it be a file or whatnot
  // For each partner in each type:
  // send message with whatever content needed
  // add tracked reaction to message
  // update message id where oldid = row.id
  // should be done here
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
