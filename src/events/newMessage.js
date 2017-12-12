const Discord = require('discord.js');

module.exports.run = async(client, serverInfo, sql, message, args, DisabledLinksSet) => {
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

    message.mentions.users.forEach(user => {
        if (user.id == "174300512441729024") {
            message.react(":pingcole:389583285656748033")
        } else if (user.id == "236911139529687040") {
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