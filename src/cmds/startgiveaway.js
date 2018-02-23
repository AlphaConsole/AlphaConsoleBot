const Discord = require('discord.js');

module.exports = {
    title: "startgiveaway",
    perms: "Admin",
    commands: ["!startgiveaway"],
    description: ["To start the bi-monthly Legacy giveaway"],

    run: async (client, serverInfo, message, args, sql) => {
        if (isStaff(message.member)) {

            var giveawayChannel = client.guilds.get(serverInfo.guildId).channels.get(serverInfo.giveawaychannel);

            await sql.get(`select * from misc where function = 'giveawaymsg'`).then(row => {
                if (row) {
                    var msgId = row.value;

                    giveawayChannel.messages.fetch(msgId).then(msg => {
                        msg.reactions.get("🎉").users.fetch().then(usersRaw => {
                            var users = usersRaw.array().filter(function (item) {
                                if (item.id !== client.user.id) {
                                    return true;
                                } else {
                                    return false;
                                }
                            });
                            var winnerIds = getWinners(users)

                            sql.run(`update misc set value = ? where function = 'giveawaywinners'`, [JSON.stringify(winnerIds)])

                            for (let i = 0; i < winnerIds.length; i++) {
                                client.guilds.get(serverInfo.guildId).members.fetch(winnerIds[i]).then(member => member.addRole(serverInfo.legacyrole))
                            }
                        });
                    })
                }
            })

            var month = new Date().getMonth() + 1;
            if (month < 9) {
                monthStr = `0${month}`
            } else {
                monthStr = month;
            }

            var giveawayChannel = client.guilds.get(serverInfo.guildId).channels.get(serverInfo.giveawaychannel);

            await giveawayChannel.messages.fetch().then(messages => {
                messages.forEach(message => {
                    message.delete();
                });
            })

            await client.guilds.get(serverInfo.guildId).roles.get(serverInfo.giveawayrole).setMentionable(true).then(async r => {

                giveawayChannel.send(`${r}`).then(m => m.delete());

                await giveawayChannel.send("", {
                    files: ['https://cdn.discordapp.com/attachments/389241234100715520/415325374369759252/ACGiveaways.png']
                })
                await giveawayChannel.send("", {
                    files: ['https://cdn.discordapp.com/attachments/381877174610821130/395685201562435584/ACBorder.png']
                });

                sql.get(`select * from misc where function = 'giveawaywinners'`).then(async row => {
                    var users = JSON.parse(row.value);

                    var msg = '';
                    for (let i = 0; i < users.length; i++) {
                        msg += `- <@${users[i]}>\n`
                    }

                    await giveawayChannel.send(`**Previous winners:**\n${msg}`)

                    sql.get(`select * from misc where function = 'giveawayon'`).then(async legacyon => {
                        if (legacyon.value == 0) {
                            await giveawayChannel.send("‌\n\n**There is currently no giveaway**");
                            await giveawayChannel.send("‌\n\nDo `!role ga` in <#" + serverInfo.BotSpam + "> to stay notified on new giveaways.")
                            await giveawayChannel.send("", {
                                files: ['https://cdn.discordapp.com/attachments/381877174610821130/395685201562435584/ACBorder.png']
                            });
                        } else {
                            await giveawayChannel.send("‌\n\n**Current giveaway:**")


                            const embed = new Discord.MessageEmbed()
                                .setColor([255, 255, 0])
                                .setAuthor('Legacy Role Giveaway', serverInfo.logo)
                                .setDescription("React with 🎉 to enter!\nThe giveaway will end at the 16th at 12AM UTC.")
                                .setFooter(`5 Winners | Ends at 01/${monthStr}/2018`)
                            await giveawayChannel.send(embed).then(m => {
                                m.react("🎉");
                                client.guilds.get(serverInfo.guildId).roles.get(serverInfo.giveawayrole).setMentionable(false)

                                sql.get(`select * from misc where function = 'giveawaymsg'`).then(async row => {
                                    if (!row) {
                                        await sql.run(`insert into misc(function) VALUES('giveawaymsg')`)
                                    }
                                    await sql.run(`update misc set value = '${m.id}' where function = 'giveawaymsg'`);
                                })
                            })

                            await giveawayChannel.send("‌\n\n\nDo `!role ga` in <#" + serverInfo.BotSpam + "> to stay notified on new giveaways.")
                            await giveawayChannel.send("", {
                                files: ['https://cdn.discordapp.com/attachments/381877174610821130/395685201562435584/ACBorder.png']
                            });
                        }
                    })
                })
            })
        }
    }
}


function getWinners(users) {
    var array = [];
    if (users.length > 5) {
        while (array.length < 5) {
            var nr = getRandomIntInclusive(0, users.length - 1);
            var user = users[nr];
            if (!array.includes(user.id)) {
                array.push(user.id);
            }
        }

        return array;
    } else {
        for (let i = 0; i < users.length; i++) {
            array.push(users[i].id);
        }

        return array;
    }
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function isStaff(user) {
    if (hasRole(user, "Developer") || hasRole(user, "Admin")) {
        return true;
    } else {
        return false;
    }
}

function pluck(array) {
    return array.map(function (item) {
        return item["name"];
    });
}

function hasRole(mem, role) {
    if (pluck(mem.roles).includes(role)) {
        return true;
    } else {
        return false;
    }
}