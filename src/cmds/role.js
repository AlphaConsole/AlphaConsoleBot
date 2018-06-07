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
                        message.member.removeRole(serverInfo.roles.events);
                        sendEmbed(message.channel, "Role removed from your profile.")
                    } else {
                        message.member.addRole(serverInfo.roles.events);
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
                    if (!role) return sendEmbed(message.channel, "Role not found..")

                    if (m.roles.has(role.id)) {
                        m.removeRole(role.id);
                        sendEmbed(message.channel, `${role.name} removed from ${m.user.tag}`)

                    } else {
                        m.addRole(role.id);
                        sendEmbed(message.channel, `${role.name} given to ${m.user.tag}`)
                    }

                }).catch(e => {
                    sendEmbed(message.channel, "User not found..")
                })
            }

        }

    }
}