const Discord = require("discord.js");
var monthNames = [
  "Jan",
  "Feb",
  "March",
  "April",
  "May",
  "June",
  "July",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];

module.exports = {
  title: "serverinfo",
  perms: "staff",
  commands: ["!roleinfo <Role Name>"],
  description: ["For information of a role"],

  run: async (client, serverInfo, sql, message, args) => {
    if (
      0 == 0 ||
      message.channel.id == serverInfo.basementChannel ||
      message.channel.id == serverInfo.staffChannel ||
      message.channel.id == "378420714941972480"
    ) {
      var roleName = "";
      for (let i = 1; i < args.length; i++) {
        roleName += args[i] + " ";
      }

      var role = message.guild.roles.find(
        r => r.name.toLowerCase() == roleName.trim().toLowerCase()
      );

      if (!role) {
        const embed = new Discord.MessageEmbed()
          .setColor([255, 255, 0])
          .setAuthor(
            "The role was not found within the server.",
            serverInfo.logo
          );
        return message.channel.send(embed);
      }

      const embed = new Discord.MessageEmbed()
        .setColor(role.hexColor)
        .setThumbnail("http://www.cityrider.com/fixed/43aspect.png")
        .addField("ID", role.id, true)
        .addField("Name", role.name, true)
        .addField("color", role.hexColor, true)
        .addField("Mention", "`" + `<@&${role.id}>` + "`", true)
        .addField("Members", role.members.size, true)
        .addField("Hoisted", role.hoist ? "Yes" : "No", true)
        .addField("Position", role.position, true)
        .addField("Mentionable", role.hoist ? "Yes" : "No", true);
      message.channel.send(embed);
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
