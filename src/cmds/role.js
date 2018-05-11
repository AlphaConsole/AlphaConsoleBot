const Discord = require("discord.js");

module.exports = {
  title: "role",
  perms: "everyone",
  commands: ["!role <Giveaways or ga>"],
  description: [
    "It will add or remove the role depending if you have the role or not [Only works in #bot-spam]"
  ],

  run: async (client, serverInfo, sql, message, args) => {
    if (message.channel.id == serverInfo.BotSpam) {
      if (args.length > 1) {
        if (
          args[1].toLowerCase() == "giveaways" ||
          args[1].toLowerCase() == "ga"
        ) {
          if (message.member.roles.has(serverInfo.EventsRole)) {
            message.member.removeRole(serverInfo.EventsRole);
            const embed = new Discord.MessageEmbed()
              .setColor([255, 255, 0])
              .setAuthor("Role removed from your profile.", serverInfo.logo);
            message.channel.send(embed);
          } else {
            message.member.addRole(serverInfo.EventsRole);
            const embed = new Discord.MessageEmbed()
              .setColor([255, 255, 0])
              .setAuthor("Role added to your profile.", serverInfo.logo);
            message.channel.send(embed);
          }
        }
      }
    } else {
      if (
        hasRole(message.member, "Admin") ||
        hasRole(message.member, "Developer") || 
        hasRole(message.member, "Moderator")
      ) 
      {
        if (args.length > 2) {
          var theMember;
          if (message.mentions.members.first()) {
            theMember = message.mentions.members.first();
          } else {
            await message.guild.members.fetch(args[1]).then(m => {
              theMember = m;
            });
          }

          if (theMember) {
            var rolename = "";
            for (let i = 2; i < args.length; i++) {
              rolename += args[i] + " ";
            }

            console.log(rolename);

            theRole = message.guild.roles.find(
              r => r.name.toLowerCase() == rolename.trim().toLowerCase()
            );
            if (theRole) {
              const embed = new Discord.MessageEmbed().setColor([255, 255, 0]);

              if (theMember.roles.has(theRole.id)) {
                await theMember.removeRole(theRole);
                embed.setAuthor(
                  `${theRole.name} has been removed from ${theMember.user.tag}`,
                  serverInfo.logo
                );
              } else {
                await theMember.addRole(theRole);
                embed.setAuthor(
                  `${theRole.name} has been added to ${theMember.user.tag}`,
                  serverInfo.logo
                );
              }

              message.channel.send(embed);
            } else {
              const embed = new Discord.MessageEmbed()
                .setColor([255, 255, 0])
                .setAuthor("The role was not found", serverInfo.logo);
              message.channel.send(embed);
            }
          } else {
            const embed = new Discord.MessageEmbed()
              .setColor([255, 255, 0])
              .setAuthor("The member was not found", serverInfo.logo);
            message.channel.send(embed);
          }
        } else {
          const embed = new Discord.MessageEmbed()
            .setColor([255, 255, 0])
            .setAuthor(
              "You did not include the users or the role",
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
