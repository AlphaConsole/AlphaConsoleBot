/**
 * ! Nickname command
 * 
 * ? This is mainly for phone moderators to easily change someone's username
 */
const Discord = require('discord.js');

module.exports = {
    title: "Nick",
    details: [
        {
            perms      : "Moderator",
            command    : "!nick <@tag or id> <Nickname>",
            description: "Changes the nickname of the user"
        }
    ],

    run: ({ client, serverInfo, message, args, sql, config, sendEmbed }) => {

        if (!message.member.isModerator) return;

        if (args.length < 3) 
            return sendEmbed(message.channel, "Please include the user and his new nickname");
        
        let userID = message.mentions.users.first()
            ? message.mentions.users.first().id
            : args[1];

        message.guild.members.fetch(userID).then(member => {
            var newName = "";
            for (let i = 2; i < args.length; i++) {
                newName += args[i] + " ";
            }

            member.setNickname(newName.trim())
            .then(() => {
                sendEmbed(message.channel, "Nickname updated.")
            })
            .catch(e => {
                sendEmbed(message.channel, `Error occured`, `${e}`)
            })
        })
        .catch(e => {
            if (e.message == "Unknown Member")
                sendEmbed(message.channel, "Provided user not found.")
            else
                console.log(e);
            sendEmbed(message.channel, )
        });
    }
};