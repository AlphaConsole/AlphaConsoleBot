const Discord = require('discord.js');


module.exports.run = async(client, serverInfo, sql, DisabledLinksSet, AutoResponds) => {
    console.log('AlphaConsole Bot logged in and ready.');
    sql.get(`select * from Statuses where Active = 1`).then(row => {
        if (row) {
            client.user.setActivity(row.StatusText, {type: row.StatusType, url: "https://www.twitch.tv/alphaconsole"});
        }
    })

    sql.all("Select * from DisabledLinks").then(rows => {
        rows.forEach(row => {
            DisabledLinksSet.add(row.ChannelID)
        });
    })

    sql.all("Select * from AutoResponds").then(rows => {
        rows.forEach(row => {
            AutoResponds.set(row.Word, row.Response);
        });
    })

    client.guilds.get(serverInfo.guildId).channels.get(serverInfo.suggestionsChannel).messages.fetch();
    client.guilds.get(serverInfo.guildId).channels.get(serverInfo.showcaseChannel).messages.fetch();
}