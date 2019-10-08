/**
 * ! getinfo command
 * 
 * ? Pulls a users info from the main server
 */
const Discord = require('discord.js');
const moment = require('moment');

module.exports = {
    title: "Getinfo",
    details: [{
        perms: "Support",
        command: "!getinfo",
        description: "Pulls a user's info from the main server"
    }],

    run: async ({
        client,
        message,
        args,
        sql,
        config,
        sendEmbed
    }) => {
        var sinfo = require("../serverInfo.js")
        if(!args[1]) return sendEmbed(message.channel, "An error occured", "Missing a user to pull from.\nComamnd format: !getinfo <userID>")
        try {
            client.users.fetch(args[1]).then(u => {
                if(u === undefined) return;
            })
        } catch(err) {
            return;
        }
        client.guilds.get(sinfo.guildId).members.fetch(args[1]).then(tU => {
            sql.query("Select * from members where DiscordID = ?", [args[1]], (err, res) => {
                if (err) return message.channel(err);
                let jDate = moment.unix(res[0].JoinedDate / 1000)
                let r = tU.roles.array()
                let sr = [];
                for (let i = 0; i < r.length; i++) {
                    let n = r[i].name;
                    n = n.charAt(0).toUpperCase() + r[i].name.slice(1)
                    sr.push(" " + n);
                }
                sr = sr.reverse()
                sr = sr.slice(1)
                sr = sr.reverse()
                if (sr.length === 0) {
                    sr = "No Roles"
                }
                sql.query("Select * from Logs where Member = ?", [tU.id], (err, res) => {
                    if (err) return message.channel(err);
                    let mutes = res.filter(c => c.Action === "mute");
                    let warns = res.filter(c => c.Action === "warn");
                    let kicks = res.filter(c => c.Action === "kick");
                    let bans = res.filter(c => c.Action === "ban");
                    sql.query("Select * from Titles where DiscordID = ?", [tU.id], (err, re) => {
                        if (err) return message.channel(err);
                        sql.query("Select * from Players where DiscordID = ?", [tU.id], (err, players) => {
                            if (err) return message.channel(err);
                            return sendEmbed(message.channel, tU.user.username, "**> Roles:** " + sr + "\n**> Join Date:** " + jDate.toString() + "\n**> Warns:** ``" + warns.length + "``" + "\n**> Mutes:** ``" + mutes.length + "``\n**> Kicks:** ``" + kicks.length + "``\n**> Bans:** ``" + bans.length + "``\n**> Title: **" + re[0].Title + "\n**> Color: **" + re[0].Color + `\n**> Steam Account:** [${players[0].SteamID}](https://steamcommunity.com/profiles/${players[0].SteamID})\n**> Last Seen: ** ${moment.unix(players[0].LastSeen).toString()}`)
                        })
                    })
                })
            });
        }).catch(err => {
            sql.query("Select * from members where DiscordID = ?", [args[1]], (err, res) => {
                if(res.length === 0) {return sendEmbed(message.channel, args[1], "ERROR. That user does not exist in our system.")}
                //TODO: Repeat above steps if they were in there but no longer in the server.
                    sql.query("Select * from Logs where Member = ?", [args[1]], (err, res) => {
                        if (err) return message.channel(err);
                        let mutes = res.filter(c => c.Action === "mute");
                        let warns = res.filter(c => c.Action === "warn");
                        let kicks = res.filter(c => c.Action === "kick");
                        let bans = res.filter(c => c.Action === "ban");
                        sql.query("Select * from Titles where DiscordID = ?", [args[1]], (err, re) => {
                            if (err) return message.channel(err);
                            let t;
                            let c;
                            if(re[0] === undefined) {t = "No title set."; c = "No color set."} else {t = re[0].Title;c=re[0].Color}
                            sql.query("Select * from Players where DiscordID = ?", [args[1]], (err, players) => {
                                if (err) return message.channel(err);
                                let s;
                                let ls;
                                if(re[0] === undefined) {s = "No steam account linked";ls="Never"} else {s=`[${players[0].SteamID}](https://steamcommunity.com/profiles/${players[0].SteamID}})`;ls=`${moment.unix(players[0].LastSeen).toString()}`}
                                return sendEmbed(message.channel, args[1], "User is not currently in the server\n**> Warns:** ``" + warns.length + "``" + "\n**> Mutes:** ``" + mutes.length + "``\n**> Kicks:** ``" + kicks.length + "``\n**> Bans:** ``" + bans.length + "``\n**> Title: **" + t + "\n**> Color: **" + c + `\n**> Steam Account:** ${s}\n**> Last Seen: ** ${ls}`)
                            })
                        })
                    })
            });
        })
        //
    }
};
