/**
 * ! Role command
 * 
 * ? This way you can easily add roles to users.
 * ? This is mainly used once on phone since adding roles on phone is kinda shite
 */
const Discord = require("discord.js");

module.exports = {
    title: "Role",
    details: [
        {
            perms      : "Everyone",
            command    : "!role <Giveaways or ga>",
            description: "Assign or unassign the giveaway role to yourself [Only works in #bot-spam]"
        },
        {
            perms      : "Moderator",
            command    : "!role <@user || user Id> <role name>",
            description: "Assign or unassign a role to a user based on role name"
        }
    ],

    run: ({ client, serverInfo, message, args, sql, config, sendEmbed }) => {

        if (message.channel.id == serverInfo.channels.botSpam) {
            if (args.length === 2) {

                if (args[1].toLowerCase() === "giveaways" || args[1].toLowerCase() === "ga") {
                    if (message.member.roles.has(serverInfo.roles.events)) {
                        message.member.roles.remove(serverInfo.roles.events);
                        sendEmbed(message.channel, "Role removed from your profile.")
                    } else {
                        message.member.roles.add(serverInfo.roles.events);
                        sendEmbed(message.channel, "Role added to your profile.")
                    }
                }

                if (args[1].toLowerCase() === "minecraft" || args[1].toLowerCase() === "mc") {
                    if (message.member.roles.has(serverInfo.roles.mc)) {
                        message.member.roles.remove(serverInfo.roles.mc);
                        sendEmbed(message.channel, "Role removed from your profile.")
                    } else {
                        message.member.roles.add(serverInfo.roles.mc);
                        sendEmbed(message.channel, "Role added to your profile.")
                    }
                }

            } 
        } else {
            if (message.member.isModerator && args.length > 2) {

                let user = message.mentions.users.first() ? message.mentions.users.first().id : args[1];
                message.guild.members.fetch(user).then(m => {
                    
                    let rolename = "";
                    for (let i = 2; i < args.length; i++) rolename += args[i] + " ";

                    let role = message.guild.roles.find(r => r.name.toLowerCase() == rolename.trim().toLowerCase());
                    if (!role) return sendEmbed(message.channel, "Role not found..");

                    if (roleDisallowed(role.id, serverInfo)) return sendEmbed(message.channel, "This role cannot be given by command.");

                    let addOrRemove;

                    if (m.roles.has(role.id)) {
                        m.roles.remove(role.id);
                        sendEmbed(message.channel, `${role.name} removed from ${m.user.tag}`)
                        addOrRemove = "removed from"
                    } else {
                        m.roles.add(role.id);
                        sendEmbed(message.channel, `${role.name} given to ${m.user.tag}`)
                        addOrRemove = "added to";
                    }

                    const embedlog = new Discord.MessageEmbed()
						.setColor([255, 255, 0])
						.setAuthor("Role update by command", client.user.displayAvatarURL())
						.addField("Info", `${role.name} ${addOrRemove} <@${m.id}> (${m.id})`)
						.addField("Executed by", message.author.tag)
						.setTimestamp();
					message.guild.channels.get(serverInfo.channels.aclog).send(embedlog);

                }).catch(e => {
                    if (e.message == "Unknown Member")
                        sendEmbed(message.channel, "User not found..")
                    else
                        console.log(e);
                })
            }

        }

    }
}

function roleDisallowed(id, serverInfo) {
    if (id === serverInfo.roles.developer) return true;
    if (id === serverInfo.roles.admin) return true;
    if (id === serverInfo.roles.moderator) return true;
    if (id === serverInfo.roles.seniorS) return true;
    if (id === serverInfo.roles.support) return true;
    if (id === serverInfo.roles.staff) return true;
    if (id === serverInfo.roles.ch) return true;
    if (id === serverInfo.roles.streamTeam) return true;
    if (id === serverInfo.roles.designer) return true;
    if (id === serverInfo.roles.botDev) return true;
    return false
}