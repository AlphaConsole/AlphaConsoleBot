const Discord = require('discord.js');


module.exports.run = async(client, channels, sql) => {
    console.log('AlphaConsole Bot logged in and ready.');
    //client.user.setActivity("@ alphaconsole.net", {type: "WATCHING"});

    sql.get(`select * from Statuses where Active = 1`).then(row => {
        if (row) {
            client.user.setActivity(row.StatusText, {type: row.StatusType, url: "https://www.twitch.tv/alphaconsole"});
        }
    })
}