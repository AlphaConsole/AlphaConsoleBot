const Discord = require("discord.js");

module.exports = {
  title: "swearwords",
  perms: "Moderator",
  commands: [
    "!SwearWords",
    "!SwearWords Add <Words to trigger the remove>",
    "!SwearWords Remove <ID>"
  ],
  description: [
    "Checks all Swear Words currently saved in the bot",
    "Adds a swear word to the bot",
    "Removes a swear word. ID findable in `!SwearWords` command"
  ],

  run: async (client, serverInfo, sql, message, args, SwearWordsSet) => {
    if (
      hasRole(message.member, "Moderator") ||
      hasRole(message.member, "Admin") ||
      hasRole(message.member, "Developer")
    ) {
      if (
        message.channel.id != serverInfo.staffChannel &&
        message.channel.id != serverInfo.basementChannel
      ) {
        const embed = new Discord.MessageEmbed()
          .setColor([255, 255, 0])
          .setAuthor(
            "Viewing swear words is not allowed in this channel.",
            serverInfo.logo
          );
        return message.channel.send(embed);
      }

      if (args.length == 1) {
        sql.all("Select * from SwearWords").then(rows => {
          if (rows.length != 0) {
            StatusMSG = "";
            rows.forEach(row => {
              StatusMSG += row.ID + ": " + row.Word + "\n";
            });
          } else {
            StatusMSG = "No words found.";
          }

          const embed = new Discord.MessageEmbed()
            .setColor([255, 255, 0])
            .setAuthor("Bot auto removal swear words", serverInfo.logo)
            .setDescription(StatusMSG);
          message.channel.send(embed);
        });
      } else if (args.length > 2 && args[1] == "add") {
        var words = "";

        for (let i = 2; i < args.length; i++) {
          words = args[i] + " ";
        }

        sql.run(`insert into SwearWords(Word) VALUES ('${words.trim()}')`);

        const embed = new Discord.MessageEmbed()
          .setColor([255, 255, 0])
          .setAuthor("Swear word added.", serverInfo.logo);
        message.channel.send(embed);

        SwearWordsSet.clear();
        sql.all("Select * from SwearWords").then(rows => {
          rows.forEach(row => {
            SwearWordsSet.add(row.Word);
          });
        });
      } else if (args[1] == "remove") {
        if (args.length == 3) {
          sql.run(`delete from SwearWords where ID = '${args[2]}'`);

          const embed = new Discord.MessageEmbed()
            .setColor([255, 255, 0])
            .setAuthor("Swear Word removed.", serverInfo.logo);
          message.channel.send(embed);

          SwearWordsSet.clear();
          sql.all("Select * from SwearWords").then(rows => {
            rows.forEach(row => {
              SwearWordsSet.add(row.Word);
            });
          });
        } else {
          const embed = new Discord.MessageEmbed()
            .setColor([255, 255, 0])
            .setAuthor(
              "Please provide the ID of the swear word.",
              serverInfo.logo
            );
          message.channel.send(embed);
        }
      }
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

function mysql_real_escape_string(str) {
  return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function(char) {
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

function TrimColon(text) {
  return text.toString().replace(/^(.*?):*$/, "$1");
}
