const Discord = require('discord.js');

module.exports = {
    title: "newMessage",
    description: "Checks for custom commands, auto responds and links on a new message",
    
    run: async(client, serverInfo, sql, message, args, AllowedLinksSet, AutoResponds, SwearWordsSet) => {

        // Custom Commands
        if (message.content.startsWith("!")) {
            sql.get(`Select * from Commands where Command = '${mysql_real_escape_string(message.content.substring(1).toLowerCase())}'`).then(command => {
                if (command) {
                    //Let's first check if the user even exists in the db
                    sql.get(`select * from Members where DiscordID = '${message.author.id}'`).then(row => {
                        if (!row) {
                            sql.run(`Insert into Members(DiscordID, Username, JoinedDate)VALUES('${message.author.id}', '${mysql_real_escape_string(message.author.username)}', '${new Date().getTime()}')`)
                                .catch(err => console.log(err));
                                sql.get(`select * from Members where DiscordID = '${message.author.id}'`).then(row => {
                                    if (row.ccCooldown < new Date().getTime()) {
                                        message.channel.send(command.Response)
                                        sql.run(`update Members set ccCooldown = '${new Date().getTime() + 5000}' where DiscordID = '${message.author.id}'`);
                                    }
                                });
                        } else {
                            if (row.ccCooldown < new Date().getTime()) {
                                message.channel.send(command.Response)
                                sql.run(`update Members set ccCooldown = '${new Date().getTime() + 5000}' where DiscordID = '${message.author.id}'`);
                            }
                        }
                    }).catch(err => console.log(err))

                    
                }
            })
        }

        // !ToggleLinks Functionality && check for swear words
        var messageAllowed = true;

        if(!hasRole(message.member, 'Staff') && !hasRole(message.member, "Moderator") && !hasRole(message.member, "Admin") && !hasRole(message.member, "Developer") && !hasRole(message.member, "Community Helper")) {      
            if (!AllowedLinksSet.has(message.channel.id)) {
                args.forEach(word => {
                    if(new RegExp("(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})").test(word)) {
                        if (!word.includes("imgur.com") && !word.includes("reddit.com") && !word.includes("gyazo.com") && !word.includes("prntscr.com")) {
                            messageAllowed = false;
                        }
                    }
                });

                if (messageAllowed == false) {
                    message.delete();
                }
            }

            for (let word of SwearWordsSet) {   
                if (message.content.toLowerCase().includes(word.toLowerCase())) {
                    return message.delete();
                }
            }
        }

        // #Showcase & #Suggestion channels
        if (message.channel.id == serverInfo.suggestionsChannel || message.channel.id == serverInfo.showcaseChannel) {

            if (message.channel.id == serverInfo.showcaseChannel && message.attachments.size != 1) {
                message.delete();
                const embed = new Discord.MessageEmbed()
                .setColor([255,255,0])
                .setAuthor("Only images allowed in Showcase channel.", serverInfo.logo) 
                return message.author.send(embed).catch(e => message.guild.channels.get(serverInfo.BotSpam).send(`${message.member}, your DM's are disabled and we were not able to send you information through DM.`))
            }

            //Let's first check if the user even exists in the db
            sql.get(`select * from Members where DiscordID = '${message.author.id}'`).then(row => {
                if (!row) {

                    var today = new Date().getTime();
                    sql.run(`Insert into Members(DiscordID, Username, JoinedDate)VALUES('${message.author.id}', '${mysql_real_escape_string(message.author.username)}', '${today}')`)
                        .then(() => {
                            sql.get(`select * from Members where DiscordID = '${message.author.id}'`).then(row => {
                                if(message.channel.id == serverInfo.suggestionsChannel) {
                                    if (row.Suggestion < new Date().getTime()) {
                                        message.react('👍').then(() => {
                                            message.react('👎').then(() => {
                                                message.react('❌')
                                            })
                                        })
                
                                        sql.run(`update Members set Suggestion = '${new Date().getTime() + 300000}' where DiscordID = '${message.author.id}'`)
                                    } else {
                                        message.delete()
                                        const embed = new Discord.MessageEmbed()
                                        .setColor([255,255,0])
                                        .setAuthor("Your suggestion has been removed since you can only send in once every 5 minutes!", serverInfo.logo) 
                                        message.author.send(embed).catch(e => message.guild.channels.get(serverInfo.BotSpam).send(`${message.member}, your DM's are disabled and we were not able to send you information through DM.`))
                                    }
                                } else if(message.channel.id == serverInfo.showcaseChannel) {
                                    if (row.Showcase < new Date().getTime()) {
                                        message.react('👍').then(() => {
                                            message.react('👎').then(() => {
                                                message.react('❌')
                                            })
                                        })
                                        sql.run(`update Members set Showcase = '${new Date().getTime() + 300000}' where DiscordID = '${message.author.id}'`)                        

                
                                    } else {
                                        message.delete()
                                        const embed = new Discord.MessageEmbed()
                                        .setColor([255,255,0])
                                        .setAuthor("Your Showcase has been removed since you can only send in once every 5 minutes!", serverInfo.logo) 
                                        message.author.send(embed).catch(e => message.guild.channels.get(serverInfo.BotSpam).send(`${message.member}, your DM's are disabled and we were not able to send you information through DM.`))
                                    }
                                }
                            });
                        })
                        .catch(err => console.log(err));
                } else {
                    sql.get(`select * from Members where DiscordID = '${message.author.id}'`).then(row => {
                        if(message.channel.id == serverInfo.suggestionsChannel) {
                            if (row.Suggestion < new Date().getTime()) {
                                message.react('👍').then(() => {
                                    message.react('👎').then(() => {
                                        message.react('❌')
                                    })
                                })
        
                                sql.run(`update Members set Suggestion = '${new Date().getTime() + 300000}' where DiscordID = '${message.author.id}'`)
                            } else {
                                message.delete()
                                const embed = new Discord.MessageEmbed()
                                .setColor([255,255,0])
                                .setAuthor("Your suggestion has been removed since you can only send in suggestions once every 5 minutes!", serverInfo.logo) 
                                message.author.send(embed).catch(e => message.guild.channels.get(serverInfo.BotSpam).send(`${message.member}, your DM's are disabled and we were not able to send you information through DM.`))
                            }
                        } else if(message.channel.id == serverInfo.showcaseChannel) {
                            if (row.Showcase < new Date().getTime()) {
                                message.react('👍').then(() => {
                                    message.react('👎').then(() => {
                                        message.react('❌')
                                    })
                                })
                                sql.run(`update Members set Showcase = '${new Date().getTime() + 300000}' where DiscordID = '${message.author.id}'`)                        

                            } else {
                                message.delete()
                                const embed = new Discord.MessageEmbed()
                                .setColor([255,255,0])
                                .setAuthor("Your Showcase has been removed since you can only send in suggestions once every 5 minutes!", serverInfo.logo) 
                                message.author.send(embed).catch(e => message.guild.channels.get(serverInfo.BotSpam).send(`${message.member}, your DM's are disabled and we were not able to send you information through DM.`))
                            }
                        }
                    });
                }
            }).catch(err => console.log(err))
        }

        // Auto Responder checker && Invite Guard
        if (!hasRole(message.member, "Admin") && !hasRole(message.member, "Developer")) {
            
            if (!noAutoResponceChannel(message.channel.id, serverInfo)) {
            
                for (var [key, value] of AutoResponds) {

                    var argsKey = key.toLowerCase().split(/[ ]+/);
                    counter = 0;

                    for (let i = 0; i < argsKey.length; i++) {
                        if (message.content.toLowerCase().includes(argsKey[i].toLowerCase().trim())) {
                            counter++;
                        }
                    }

                    if (counter == argsKey.length) {
                        message.channel.send(`${message.author}, ${value}`);
                    }
                }
            }
            if (message.content.includes('discord.gg/') || message.content.includes('discordapp.com/invite/')) {
                return message.delete();
            }
        }

        if (message.channel.id == serverInfo.betaSteamIDS) {
            message.delete();

            if (args.length == 5 && message.mentions.users.first()) {
                if (message.mentions.users.first().id == message.author.id || hasRole(message.member, "Admin") || hasRole(message.member, "Developer")) {
                   
                    sql.get(`select * from BetaSteamIDS where DiscordID = '${message.mentions.users.first().id}'`).then(row => {
                        if (row) {
                            message.author.send("Your account is already signed up for the beta.").catch(e => message.guild.channels.get(serverInfo.BotSpam).send(`${message.member}, your DM's are disabled and we were not able to send you information through DM.`))
                        } else {
                            message.author.send(`__Is this information correct?__\n\nDiscord user: **${message.mentions.users.first().tag}**\nSteamID64: **${args[2]}**\nSteam Link: **<${args[4]}>**\n\nIf this is correct, please respond with **yes**.\nOtherwise respond with **no**.`).then(msg => {
                                msg.channel.awaitMessages(response => response.content.toLowerCase() === 'yes' || response.content.toLowerCase() === 'no', {max: 1, time: 30000, errors: ['time']}).then(collected => {
                                    if (collected.first().content.toLowerCase() == "yes") {
                                        message.channel.send(`**${message.mentions.users.first().tag}** | ${args[2]} | <${args[4]}>`)
                                        message.author.send("You have succesfully been added to the Beta Testers!")   
                                        sql.run(`Insert into BetaSteamIDS (DiscordID, SteamID64, SteamLink) VALUES ('${message.mentions.users.first().id}','${args[2]}','${args[4]}')`) 

                                        sql.get(`select * from misc where message = 'steamid'`).then(row => {
                                            if (row) {
                                                message.channel.messages.fetch(row.value).then(msg => {
                                                    if (msg) {
                                                        msg.delete();
                                                    }

                                                    message.channel.send("**__Read the Pins of this channel for all info__**\n\n__Format:__\n```\n@tag | SteamID64 | SteamURL\n```").then(m => {
                                                        sql.run(`update misc set value = '${m.id}' where message = 'steamid'`);
                                                    })
                                                })
                                            }
                                        })
                                    } else {
                                        message.author.send("You have not been added to the Beta list.")
                                    }
                                })
                                .catch(() => {
                                    message.author.send("You have not confirmed with **yes** within 30 seconds and you have not been added to the list.")
                                })
                            }).catch(e => message.guild.channels.get(serverInfo.BotSpam).send(`${message.member}, your DM's are disabled and we were not able to send you information through DM.`))   
        
                        }
                    })
                } else {
                    message.author.send("The person you mentioned is not yourself!").catch(e => message.guild.channels.get(serverInfo.BotSpam).send(`${message.member}, your DM's are disabled and we were not able to send you information through DM.`))
                }
            } else {
                message.author.send("Your input was incorrect. Please use the following format:\n`@User | SteamID64 | SteamURL`").catch(e => message.guild.channels.get(serverInfo.BotSpam).send(`${message.member}, your DM's are disabled and we were not able to send you information through DM.`))
            }

        }

        if (message.channel.id == serverInfo.setTitleChannel || message.channel.id == serverInfo.setSpecialTitleChannel) {
            sql.get(`select Value from CurrentStats where Type = 'messagestitles'`).then(row => {
                var oldVal = row.Value;
                var newVal = row.Value + 1;
    
                if (oldVal == undefined || oldVal == null || oldVal < 0) {
                    newVal = 1;
                }
                
                sql.run(`Update CurrentStats set Value = '${newVal}' where Type = 'messagestitles'`).catch(e => console.log(e))
            })  
        } else if (message.channel.id != serverInfo.aclogChannel && message.channel.id != serverInfo.serverlogChannel && message.channel.id != serverInfo.modlogChannel) {
            sql.get(`select Value from CurrentStats where Type = 'messagesgeneral'`).then(row => {
                var oldVal = row.Value;
                var newVal = row.Value + 1;
    
                if (oldVal == undefined || oldVal == null || oldVal < 0) {
                    newVal = 1;
                }
                
                sql.run(`Update CurrentStats set Value = '${newVal}' where Type = 'messagesgeneral'`).catch(e => console.log(e))
            })    
        }

        // Add reaction when bot is mentioned
        message.mentions.users.forEach(user => {
            if (user.id == "236911139529687040" || user.id == 328632005627478019)  {
                //message.react(":pingsock:389550360924127233")
                sentiment(message);
            }
        });

        if (args.indexOf("bot") > -1 && message.mentions.users.first() == undefined) {
            sentiment(message);
        }

    }
}

function sentiment(message) {
    var sentiment = require('sentiment');
    var sent = sentiment(message.content);
    if (sent['comparative'].toString().replace('.', '').replace('-', '').length > 2 || sent['score'] == 0) {
        return;
    } else if (message.content.toLowerCase().includes('thanks')) {
        message.reply('No problem!');
    } else if (sent['score'] >= 2 ) {
        message.reply('Thanks!');
    } else  if (sent['score'] <= -2){
        message.channel.send(':worried:');
    }
}

//Functions used to check if a player has the desired role
function pluck(array) {
    return array.map(function(item) { return item["name"]; });
}
function hasRole(mem, role)
{
    if (pluck(mem.roles).includes(role))
    {
        return true;
    } else {
        return false;
    }

}

function noAutoResponceChannel(channelID, serverInfo) {
    if (channelID == serverInfo.aclogChannel) return true;
    if (channelID == serverInfo.basementChannel) return true;
    if (channelID == serverInfo.betaSteamIDS) return true;
    if (channelID == serverInfo.BotSpam) return true;
    if (channelID == serverInfo.modlogChannel) return true;
    if (channelID == serverInfo.serverlogChannel) return true;
    if (channelID == serverInfo.setSpecialTitleChannel) return true;
    if (channelID == serverInfo.setTitleChannel) return true;
    if (channelID == serverInfo.showcaseChannel) return true;
    if (channelID == serverInfo.staffChannel) return true;
    if (channelID == serverInfo.suggestionsChannel) return true;
    //Else return false
    return false;
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function mysql_real_escape_string (str) {
    return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
        switch (char) {
            case "\0":
                return "\\0";
            case "\x08":
                return "\\b";
            case "\x09":
                return "\\t";
            case "\x1a":
                return "\\z";
            case "\n":
                return "\\n";
            case "\r":
                return "\\r";
            case "\"":
            case "'":
            case "\\":
            case "%":
                return char+char; // prepends a backslash to backslash, percent,
                                  // and double/single quotes
        }
    });
}