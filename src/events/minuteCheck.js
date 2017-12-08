const Discord = require('discord.js');


module.exports.run = async(client, serverInfo, sql) => {
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
}
