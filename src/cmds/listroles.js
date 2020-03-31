/**
 * ! List roles command
 * 
 * ? Lists up all the roles in the server
 */
const Discord = require('discord.js');

module.exports = {
     title: "Listroles",
     details: [
        {
            perms      : "Moderator",
            command    : "!listroles",
            description: "List all the roles from the server"
        }
    ],

    run: ({ client, serverInfo, message, args, sql, config, sendEmbed }) => {

        if (!message.member.isModerator) return;

        let rolesmsg = [];
        let index = 0;
        rolesmsg[index] = "";

        message.guild.roles.cache.forEach(role => {
            rolesmsg[index] += role.name;
            for (let i = role.name.length; i < 25; i++) {
            rolesmsg[index] += " ";
            }
            rolesmsg[index] += "::  " + role.id + "\n";

            if (rolesmsg[index].length > 1500) {
                index++;
                rolesmsg[index] = "";
            }
        });

        for (let i = 0; i < rolesmsg.length; i++) {
            message.channel.send(rolesmsg[i], { code: "asciidoc" });    
        }

    }
};