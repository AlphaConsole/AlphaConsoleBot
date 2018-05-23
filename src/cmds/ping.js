const Discord = require("discord.js");
var cd = 0;

module.exports = {
    title: "ping",
    perms: "everyone",
    commands: ["!ping"],
    description: ["Check latency of the bot"],

    run: async (client, serverInfo, message) => {

        if (cd > new Date().getTime()) return;

        message.channel.send("Pinging...").then(m => {
            m.edit(`🏓 Pong! Latency is \`${ m.createdTimestamp - message.createdTimestamp }ms\`.`);
            cd = new Date().getTime() + 5000;
        })
    }
};