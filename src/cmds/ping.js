const Discord = require("discord.js");

module.exports = {
    title: "ping",
    perms: "everyone",
    commands: ["!ping"],
    description: ["Check latency of the bot"],

    run: async (client, serverInfo, message) => {
        message.channel.send("Pinging...").then(m => {
            m.edit(`🏓 Pong! Latency is \`${ m.createdTimestamp - message.createdTimestamp }ms\`.`);
        })
    }
};