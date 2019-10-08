/**
 * ! Permit
 * 
 * ? This command will allow the provided user to post links for x amount of time
 */

module.exports = {
    title: "Permit",
    details: [
        {
            perms      : "Moderator",
            command    : "!Permit <@user | user Id>",
            description: "Permits the user to post links"
        }
    ],

    run: ({ client, serverInfo, message, args, sql, config, sendEmbed }) => {
        if (!message.member.isModerator || message.member.id === "345769053538746368") return;

        let user = message.mentions.users.first() ? message.mentions.users.first().id : args[1];
        message.guild.members.fetch(user).then(m => {
            config.permits[m.id] = {
                id: m.id,
                channel: message.channel.id,
                until: new Date().getTime() + 300000
            }

            sendEmbed(message.channel, `${m.user.tag} may now post links for 5 minutes.`)
        }).catch(e => {
            if (e.message == "Unknown Member")
                sendEmbed(message.channel, "User not found..")
            else
                console.log(e);
        })
    }
}
