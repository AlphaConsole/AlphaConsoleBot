/**
 * ! Help command
 * 
 * ? Well... Show the information of the commands? Hehe
 */
const Discord = require('discord.js');

module.exports = {
     title: "Help",
     details: [
        {
            perms      : "Everyone",
            command    : "!Help",
            description: "Shows the help command"
        }
    ],

    run: ({ client, serverInfo, message, args, sql, config, sendEmbed, member }, isDM) => {

        if (args.length === 1) {
            let a = config.commands;
            let help = {
                everyone : [],
                staff    : [],
                support  : [],
                moderator: [],
                admin    : [],
                developer: []
            }

            for (let i = 0; i < a.length; i++) {
                if (!help[a[i].perms.toLowerCase()].includes(a[i].title))
                    help[a[i].perms.toLowerCase()].push(a[i].title);
            }

            if (isDM) {

                const emb = new Discord.MessageEmbed()
                .setColor([255, 255, 0])
                .setAuthor("Help command", client.user.displayAvatarURL())
                .setFooter('Execute "!help <Command>" for details')
                if (help.everyone.length !== 0) emb.addField("Everyone commands", help.everyone.join("\n"))
                if (member.isStaff && help.staff.length !== 0) emb.addField("Staff commands", help.staff.join("\n"))
                if (member.isSupport && help.support.length !== 0) emb.addField("Support commands", help.support.join("\n"))
                if (member.isModerator && help.moderator.length !== 0) emb.addField("Moderator commands", help.moderator.join("\n"))
                if (member.isAdmin && help.admin.length !== 0) emb.addField("Admin commands", help.admin.join("\n"))
                if (member.isDeveloper && help.developer.length !== 0) emb.addField("Developer commands", help.developer.join("\n"))
                message.channel.send(emb);


            } else if (message.channel.id === serverInfo.channels.botSpam) {

                const emb = new Discord.MessageEmbed()
                .setColor([255, 255, 0])
                .setAuthor("Help command", client.user.displayAvatarURL())
                .setFooter('Private message "!help <Command>" for details')
                if (help.everyone.length !== 0) emb.addField("Everyone commands", help.everyone.join("\n"))
                message.channel.send(emb);

            }
        } else if (args.length === 2 && isDM) {

            let filtered = config.commands.filter(c => c.title.toLowerCase().includes(args[1].toLowerCase()));
            const emb = new Discord.MessageEmbed()
            .setColor([255, 255, 0])
            .setAuthor("Help command: " + args[1], client.user.displayAvatarURL())
            for (let i = 0; i < filtered.length; i++) {
                emb.addField(filtered[i].command, `${filtered[i].description}\n\`[${filtered[i].perms}]\``);
            }
            message.channel.send(emb);

        }

    }
}