const request = require('request');

module.exports.run = (client, serverInfo, { sql, keys }, checkStatus) => {
    const schedule = require("node-schedule");

    //* Check every minute (For automated unmutes etc...)
    let a = schedule.scheduleJob({ second: 1 }, function() {
        sql.query("Select * from Members where MutedUntil IS NOT NULL or tempBeta IS NOT NULL", [], (err, res) => {
            if (err) return console.error(err);

            let mutes = res.filter(r => r.MutedUntil);
            let betas = res.filter(r => r.tempBeta);

            mutes.forEach(r => {
                if (r.MutedUntil < new Date().getTime()) {
                    client.guilds.resolve(serverInfo.guildId).members.fetch(r.DiscordID).then(m => {
                        m.roles.remove(serverInfo.roles.muted);
                        sql.query('Update Members set MutedUntil = null where ID = ?', [ r.ID ]);
                    }).catch(e => { })
                }
            });

            betas.forEach(r => {
                if (r.tempBeta < new Date().getTime()) {
                    client.guilds.resolve(serverInfo.guildId).members.fetch(r.DiscordID).then(m => {
                        m.roles.remove(serverInfo.roles.beta);
                        m.roles.remove(serverInfo.roles.tempRole);
                        sql.query('Update Members set tempBeta = null where ID = ?', [ r.ID ]);
                    }).catch(e => { })
                }
            });
        })
    });

    //* Check every half an hour. First job is at min 1 of every hour. Second check at every min 31 of every hour
    //* For Status rotation & channel cleanup
    let b = schedule.scheduleJob({ minute: 1 }, function() {
        statusRotation();
        titleCleanUp();
    });

    let c = schedule.scheduleJob({ minute: 31 }, function() {
        statusRotation();
        titleCleanUp();
    });






    async function statusRotation() {
        let clientID = keys.TwitchClientID
        const twitchUserName = "alphaconsole";
        const url = `https://api.twitch.tv/kraken/streams/${twitchUserName}?client_id=${clientID}`;

        request({ method: "GET", url: url }, function(err, response, body) {
            if (err) return console.error(err);

            if (body) {
                const twitchData = JSON.parse(body);

                if (twitchData["stream"] != null) {
                    //Update status
                    client.user.setActivity(
                        twitchData["stream"]["channel"]["status"],
                        {
                            type: "STREAMING",
                            url: "https://www.twitch.tv/alphaconsole"
                        }
                    );
                } else {
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
        })
    }

    function titleCleanUp() {
        client.guilds.resolve(serverInfo.guildId).channels.resolve(serverInfo.channels.setTitle).messages.fetch()
        .then(messages => {
            for (var message of messages.values()) {
                if (
                    message.author.id !== client.user.id &&
                    message.author.id !== "345769053538746368" &&
                    message.author.id !== "181076473757696000" &&
                    !message.member.roles.cache.has(serverInfo.roles.admin)
                ) {
                    message.delete();
                }
            }
        });
    }
}