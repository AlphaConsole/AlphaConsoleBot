module.exports.run = (client, serverInfo, { sql }, checkStatus) => {
    const schedule = require("node-schedule");

    //* Check every minute (For automated unmutes etc...)
    let a = schedule.scheduleJob({ second: 1 }, function() {
        sql.query("Select * from Members where MutedUntil IS NOT NULL", [], (err, res) => {
            if (err) return console.error(err);

            res.forEach(r => {
                if (r.MutedUntil < new Date().getTime()) {
                    client.guilds.get(serverInfo.guildId).members.fetch(r.DiscordID).then(m => {
                        m.removeRole(serverInfo.roles.muted);
                        sql.query('Update Members set MutedUntil = null where ID = ?', [ r.ID ]);
                    })
                }
            });
        })
    });

    //* Check every half an hour. First job is at min 1 of every hour. Second check at every min 31 of every hour
    //* For Status rotation & channel cleanup
    let b = schedule.scheduleJob({ minute: 1 }, function() {
        statusRotation();
    });

    let c = schedule.scheduleJob({ minute: 31 }, function() {
        statusRotation();
    });





    async function statusRotation() {
        sql.query("Select * from Statuses", [], (err, res) => {
            if (err) return console.error(err);

            let active = res.filter(r => r.Active == 1)[0];
            if (active) {
                let index = res.indexOf(active);
                let newID = res[index + 1] ? res[index + 1].ID : res[0].ID;
                sql.query("Update Statuses set Active = 0 where ID = ?", [ active.ID ], () => {
                    sql.query("Update Statuses set Active = 1 where ID = ?", [ newID ], () => {
                        checkStatus();
                    });
                })
            } else {
                checkStatus();
            }
        })
    }
}