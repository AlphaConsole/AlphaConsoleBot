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
        }
    ],

    run: ({ client, serverInfo, message, args, sql, config, sendEmbed }) => {

        if (!message.member.isModerator) return;

        if (!isNumber(args[1]) || args[1].startsWith(".")) 
            return sendEmbed(message.channel, "The command has not correctly been used. Please use `!purge [amount]`")

        let amount = parseInt(args[1]) + 1;
        if (amount > 99) amount = 99;

        message.channel.messages.fetch({ limit: amount }).then(messages => {
            message.channel.bulkDelete(messages).catch(e => {
                //* This will most likely error because the messages are over 14 days old.
                //* You can still remove the messages if you do it 1 by 1.
                messages.array().forEach(m => m.delete());
            })
        }).catch(console.error);

        
        const embedlog = new Discord.MessageEmbed()
        .setColor([255, 255, 0])
        .setAuthor(`No case created | Purge`, client.user.displayAvatarURL({ format: "png" }))
        .setDescription(`${message.member} (${message.author.id}) has purged ${amount} messages in ${message.channel}`)
        .setTimestamp();
        message.guild.channels.get(serverInfo.channels.modlog).send(embedlog);
        
        sendEmbed(message.channel, `${message.author.tag} has purged ${amount - 1} messages`);
    }
}






//Simple function to check if they are numbers
function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}