/**
 * ! Purge command
 * 
 * ? To purge an amount of message in a channel.
 */
const Discord = require("discord.js");

module.exports = {
    title: "Purge",
    details: [
        {
            perms      : "Moderator",
            command    : "!Purge <Amount of messages>",
            description: "Removes the amount of messages from the channel"
        },
        {
            perms      : "Moderator",
            command    : "!Purge <@user>",
            description: "Removes the the user its messages from the channel"
        }
    ],

    run: ({ client, serverInfo, message, args, sql, config, sendEmbed }) => {

        if (!message.member.isModerator) return;

        let user = message.mentions.users.first();
        if (user) {
            message.channel.messages.fetch({ limit: 99 }).then(messages => {
                let msgs = messages.filter(m => m.author.id === user.id);
                message.channel.bulkDelete(msgs)
                .then(() => {
                    sendEmbed(message.channel, `${message.author.tag} has purged ${user.tag}'s messages`, null, 5000);
                })
                .catch(e => {
                    if (e.message === "You can only bulk delete messages that are under 14 days old.") 
                        return sendEmbed(message.author, "There are messages older than 14 days that I could not remove.");
                })
            }).catch(console.error);

            return;
        }

        if (!isNumber(args[1]) || args[1].startsWith(".")) 
            return sendEmbed(message.channel, "The command has not correctly been used. Please use `!purge [amount]`")

        let amount = parseInt(args[1]) + 1;
        if (amount > 99) amount = 99;

        message.channel.messages.fetch({ limit: amount }).then(messages => {
            message.channel.bulkDelete(messages)
            .then(() => {
                sendEmbed(message.channel, `${message.author.tag} has purged ${amount - 1} messages`, null, 5000);
            })
            .catch(e => {
                if (e.message === "You can only bulk delete messages that are under 14 days old.") 
                    return sendEmbed(message.author, "There are messages older than 14 days that I could not remove.");
            })
        }).catch(console.error);

        
        const embedlog = new Discord.MessageEmbed()
        .setColor([255, 255, 0])
        .setAuthor(`No case created | Purge`, client.user.displayAvatarURL({ format: "png" }))
        .setDescription(`${message.member} (${message.author.id}) has purged ${amount} messages in ${message.channel}`)
        .setTimestamp();
        message.guild.channels.resolve(serverInfo.channels.modlog).send(embedlog);
    }
}






//Simple function to check if they are numbers
function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}