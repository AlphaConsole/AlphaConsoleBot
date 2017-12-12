const Discord = require('discord.js');

module.exports.run = async(client, serverInfo, sql, message, args, AutoResponds) => {
    if (hasRole(message.member, "Moderator") || hasRole(message.member, "Admin") || hasRole(message.member, "Developer")) {

        if (args.length == 1) {
            sql.all("Select * from AutoResponds").then(rows => {
                
                if(rows.length != 0) {
                    StatusMSG = ""
                    rows.forEach(row => {
                        StatusMSG += row.ID + ": " + row.Word + " -> " + row.Response + "\n";
                    });
                } else {
                    StatusMSG = "No statuses found.";
                }

                const embed = new Discord.MessageEmbed()
                .setColor([255,255,0])
                .setTitle("=== Bot AutoResponds ===")
                .setDescription(StatusMSG)
                message.channel.send(embed);
                
            })
        } else if (args[1] == "add") {
            if (message.content.includes(':')) {
                messageSplit = TrimColon(message.content.substring(10)).split(":");
                words = messageSplit[0].trim()
                response = messageSplit[1].trim()
                
                sql.run(`insert into AutoResponds(Word, Response) VALUES ('${words}', '${response}')`)

                const embed = new Discord.MessageEmbed()
                .setColor([255,255,0])
                .setTitle('Auto Response message added.')
                message.channel.send(embed) 

                AutoResponds.clear();
                sql.all("Select * from AutoResponds").then(rows => {
                    rows.forEach(row => {
                        AutoResponds.set(row.Word, row.Response);
                    });
                })

            } else {
                const embed = new Discord.MessageEmbed()
                .setColor([255,255,0])
                .setTitle('Auto Response message was not added.')
                .setDescription("I can't find the `:` to seperate the words to mention and what to respond")
                message.channel.send(embed)
            }         
        } else if (args[1] == "remove") {
 
            if (args.length == 3) {
                sql.run(`delete from AutoResponds where ID = '${args[2]}'`)
                
                const embed = new Discord.MessageEmbed()
                .setColor([255,255,0])
                .setTitle('Auto Response message removed.')
                message.channel.send(embed) 

                AutoResponds.clear();
                sql.all("Select * from AutoResponds").then(rows => {
                    rows.forEach(row => {
                        AutoResponds.set(row.Word, row.Response);
                    });
                })
            } else {
                const embed = new Discord.MessageEmbed()
                .setColor([255,255,0])
                .setTitle('Please provide the ID of the auto respond message.')
                message.channel.send(embed) 
            }
                   
        }

    }
    
};

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

function TrimColon(text) {
    return text.toString().replace(/^(.*?):*$/, '$1');
}