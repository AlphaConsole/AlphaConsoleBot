/**
 * ! Ping command
 * 
 * ? Any further questions?
 */
let cd = 0;

module.exports = {
    title: "Ping",
    details: [
        {
            perms      : "Everyone",
            command    : "!ping",
            description: "Shows the delay of the bot"
        }
    ],

    run: ({ client, serverInfo, message, args, sql, config, sendEmbed }) => {

        if (cd > new Date().getTime()) return;

        message.channel.send("Pinging...").then(m => {
            m.edit(`🏓 Pong! Latency is \`${ m.createdTimestamp - message.createdTimestamp }ms\`.`);
            cd = new Date().getTime() + 5000;
        })

    }
}