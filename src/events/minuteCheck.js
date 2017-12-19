const Discord = require('discord.js');


module.exports = {
    title: "minuteCheck",
    description: "Checking for unmutes every minute",
    
    run: async(client, serverInfo, sql) => {
        sql.all(`select * from Members where MutedUntil is not null`).then(rows => {
            rows.forEach(row => {
                if (row.MutedUntil < new Date().getTime()) {
                    let MutedRole = client.guilds.get(serverInfo.guildId).roles.find('name', 'Muted');
                    let MutedUser = client.guilds.get(serverInfo.guildId).members.get(row.DiscordID);

                    if (MutedUser != undefined) {
                        MutedUser.removeRole(MutedRole);
                        sql.run(`update Members set MutedUntil = null where DiscordID = ${row.DiscordID}`)
                            .catch(err => console.log(err))
                    }
                }
            });
        }).catch(err => console.log(err))
        
        sql.get(`select Value from CurrentStats where Type = 'toponline'`).then(row => {
            var oldVal = row.Value;
            var newVal = client.guilds.get(serverInfo.guildId).members.filter(m => m.presence.status != "offline").size;

            if (oldVal == undefined || oldVal == null || oldVal < newVal) {
                sql.run(`Update CurrentStats set Value = '${newVal}', Time = '${new Date().getTime()}' where Type = 'toponline'`).catch(e => console.log(e))                
            }            
        })
    }
}
