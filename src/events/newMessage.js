const Discord = require('discord.js');

module.exports.run = async(client, serverInfo, sql, message, args, DisabledLinksSet, AutoResponds) => {

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

    // !ToggleLinks Functionality
    var messageAllowed = true;

    if(!hasRole(message.member, 'staff') && !hasRole(message.member, "Moderator") && !hasRole(message.member, "Admin") && !hasRole(message.member, "Developer") && !hasRole(message.member, "Community Helper")) {      
        if (DisabledLinksSet.has(message.channel.id)) {
            args.forEach(word => {
                if(new RegExp("([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?").test(word)) {
                    if (!word.includes("imgur.com") && !word.includes("reddit.com") && !word.includes("gyazo.com") && !word.includes("prntscr.com")) {
                        messageAllowed = false;
                    }
                }
            });

            if (messageAllowed == false) {
                message.delete();
            }
        }
    }

    // #Showcase & #Suggestion channels
    if (message.channel.id == serverInfo.suggestionsChannel || message.channel.id == serverInfo.showcaseChannel) {
        //Let's first check if the user even exists in the db
        sql.get(`select * from Members where DiscordID = '${message.author.id}'`).then(row => {
            if (!row) {
                var today = new Date().getTime();
                sql.run(`Insert into Members(DiscordID, Username, JoinedDate)VALUES('${message.author.id}', '${mysql_real_escape_string(message.author.username)}', '${today}')`)
                    .catch(err => console.log(err));
            }
        }).catch(err => console.log(err))

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
                    .setAuthor("Your suggestion has been removed since you can only send in clips once every 5 minutes!", serverInfo.logo) 
                    message.author.send(embed);
                }
            } else if(message.channel.id == serverInfo.showcaseChannel) {
                if (row.Showcase < new Date().getTime()) {
                    if (message.content.length == 0) {
                        message.react('👍').then(() => {
                            message.react('👎').then(() => {
                                message.react('❌')
                            })
                        })
                        sql.run(`update Members set Showcase = '${new Date().getTime() + 300000}' where DiscordID = '${message.author.id}'`)                        
                    } else {
                        message.delete();
                        const embed = new Discord.MessageEmbed()
                        .setColor([255,255,0])
                        .setAuthor('Only images allowed in Showcase channel. No extra text!', serverInfo.logo) 
                        message.author.send(embed);
                    }

                } else {
                    message.delete()
                    const embed = new Discord.MessageEmbed()
                    .setColor([255,255,0])
                    .setAuthor("Your Showcase has been removed since you can only send in clips once every 5 minutes!", serverInfo.logo) 
                    message.author.send(embed);
                }
            }
        });
    }

    // Auto Responder checker
    if (!hasRole(message.member, "Moderator") && !hasRole(message.member, "Admin") && !hasRole(message.member, "Developer")) {        
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

    // Add reaction when bot is mentioned
    message.mentions.users.forEach(user => {
        if (user.id == "236911139529687040") {
            message.react(":pingsock:389550360924127233")
        }
    });
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