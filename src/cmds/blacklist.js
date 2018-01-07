const Discord = require('discord.js');
const keys = require("../tokens.js");

module.exports = {
    title: "blacklist",
    perms: "Admin",
    commands: [
        "!blacklist check <word>",
        "!blacklist Add <Words to add>",
        "!blacklist Remove <word>"
    ],
    description: [
        "Checks if word provided is in blacklist",
        "Adds a word to the blacklist",
        "Remove a word from the blacklist"
    ],
    
    run: async(client, serverInfo, message, args, sql, blackListedWords) => {
        if (hasRole(message.member, "Admin") || hasRole(message.member, "Developer")) {
            
            if (args[1].toLowerCase() == 'check') {
                sql.get(`select * from Blacklist where Word = '${args[2]}'`).then(row => {
                    if (row) {
                        const embedChannel = new Discord.MessageEmbed()
                            .setColor([255,255,0])
                            .setAuthor(`${args[2]} -> was found in the blacklist`, serverInfo.logo) 
                        return message.channel.send(embedChannel)
                    } else {
                        const embedChannel = new Discord.MessageEmbed()
                            .setColor([255,255,0])
                            .setAuthor(`${args[2]} -> was not found in the blacklist`, serverInfo.logo) 
                        return message.channel.send(embedChannel)
                    }
                })
            }
            else if (args[1].toLowerCase() == 'add') {
                var badWord = '';
                for (let index = 2; index < args.length; index++) {
                    badWord += ' ' + args[index];
                }
                sql.run(`Insert into Blacklist(Word) VALUES ('${badWord.trim()}')`);
                const embedChannel = new Discord.MessageEmbed()
                        .setColor([255,255,0])
                        .setAuthor(`${badWord.trim()} -> was added to the blacklist`, serverInfo.logo) 
                return message.channel.send(embedChannel)
            }
            else if (args[1].toLowerCase() == 'remove') {
                sql.run(`Delete from Blacklist where Word = '${args[2]}'`);
                const embedChannel = new Discord.MessageEmbed()
                        .setColor([255,255,0])
                        .setAuthor(`${args[2]} -> was removed from the blacklist`, serverInfo.logo) 
                return message.channel.send(embedChannel)
            }

        }
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

function returnColour(colourID) {
    switch (colourID) {
        case '0':
            return 'No title';
            break;
        case '1':
            return 'Gray';
            break;
        case '2':
            return 'Glowing Green (Twitch Subs & Legacy)' 
            break;
        case '3':
            return 'Non-glowing Green';
            break;
        case '4':
            return 'Non-glowing Yellow';
            break;
        case '5':
            return 'Glowing Yellow';
            break;
        case '6':
            return 'Purple (Twitch Subs & Legacy)';
            break;
        case '7':
            return 'RLCS Blue';
            break;
        case 'X':
            return 'Disabled (X)';
            break;
        default:
            return 'Cycling Colours';
    }
}