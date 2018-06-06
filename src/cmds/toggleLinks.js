/**
 * ! Toggle Links command
 * 
 * ? To enable or disable the filter in the current channel.
 * ? If enabled, users can not post links in the channel
 */

const Discord = require("discord.js");

module.exports = {
    title: "ToggleLinks",
    details: [
        {
            perms      : "Moderator",
            commands   : "!togglelinks",
            description: "Toggle links filter in the current channel"
        }
    ],

    run: ({ client, serverInfo, message, sql, config, sendEmbed }) => {
        if (!message.member.isModerator) return;

        if (config.whitelistedLinksChannel.includes(message.channel.id)) {
            config.whitelistedLinksChannel.splice(config.whitelistedLinksChannel.indexOf(message.channel.id), 1);
            sql.query("Delete from Config where Config = 'whitelistedLinksChannel' and Value1 = ?", [ message.channel.id ]);

            sendEmbed(message.channel, "Links are no longer allowed in this channel");

            const embedlog = new Discord.MessageEmbed()
              .setColor([255, 255, 0])
              .setAuthor("Togglelinks", client.user.displayAvatarURL())
              .addField("Link protection disabled at",`**${message.channel.name}** (${message.channel})`)
              .addField("by",`**${message.member.user.tag}** (${message.member})`)
              .setThumbnail(message.author.displayAvatarURL())
              .setTimestamp();
            message.guild.channels.get(serverInfo.channels.aclog).send(embedlog);
        } else {
            config.whitelistedLinksChannel.push(message.channel.id);
            sql.query("Insert into Config (Config, Value1) Values ('whitelistedLinksChannel', ?)", [ message.channel.id ]);

            sendEmbed(message.channel, "Links are now allowed in this channel");

            const embedlog = new Discord.MessageEmbed()
              .setColor([255, 255, 0])
              .setAuthor("Togglelinks", client.user.displayAvatarURL())
              .addField("Link protection enabled at",`**${message.channel.name}** (${message.channel})`)
              .addField("by",`**${message.member.user.tag}** (${message.member})`)
              .setThumbnail(message.author.displayAvatarURL())
              .setTimestamp();
            message.guild.channels.get(serverInfo.channels.aclog).send(embedlog);
        }
    }
}