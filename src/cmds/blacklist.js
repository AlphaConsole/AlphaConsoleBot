/**
 * ! Blacklist command
 * 
 * ? Kinda obvious, too lazy to write anything smart anyway
 * ? We also have command description for a reason. So I actually don't know why I added this here. Welp...
 */
const Discord = require('discord.js');

module.exports = {
     title: "Blacklist",
     details: [
        {
            perms      : "Admin",
            command    : "!blacklist check <word>",
            description: "Checks if word provided is in blacklist"
        },
        {
            perms      : "Admin",
            command    : "!blacklist add <Words to add>",
            description: "Adds a word to the blacklist"
        },
        {
            perms      : "Admin",
            command    : "!blacklist remove <word>",
            description: "Remove a word from the blacklist"
        }
    ],

    run: async ({ client, serverInfo, message, args, sql, config, sendEmbed, checkStatus }) => {

        if (!message.member.isSupport) return;
        if (args.length < 2) return sendEmbed(message.channel, "Incorrect Usage: !blacklist <check|add|remove> <word>")
        let blackListedWords = config.blacklistedWords;

        if (args[1].toLowerCase() == "check") {
            var badWord = makeWord(args);

            if (blackListedWords.indexOf(badWord) > -1) 
                sendEmbed(message.channel, `${badWord} -> was found in the blacklist`)
            else 
                sendEmbed(message.channel, `${badWord} -> was not found in the blacklist`)
            
        } else if (args[1].toLowerCase() == "add") {
            if (!message.member.isAdmin) return;

            var badWord = makeWord(args);
            var index = blackListedWords.indexOf(badWord);

            if (index == -1) {
                blackListedWords.push(badWord);
                sql.query(`Insert into Config(Config, Value1) VALUES (?, ?)`, [ "blacklistedWords", badWord ]);
                sendEmbed(message.channel, `${badWord} -> was added to the blacklist`)
            } else 
                sendEmbed(message.channel, `${badWord} -> is already in the blacklist`)

        } else if (args[1].toLowerCase() == "remove") {
            if (!message.member.isAdmin) return;
            
            var badWord = makeWord(args);

            var index = blackListedWords.indexOf(badWord);
            if (index > -1) {
                blackListedWords.splice(index, 1);
                sql.query(`Delete from Config where Config = ? and Value1 = ?`, [ "blacklistedWords", badWord ]);
                sendEmbed(message.channel, `${badWord} -> was removed from the blacklist`)
            } else 
                sendEmbed(message.channel, `Error. Word not found in cached list.`)

        }
    }
};



function makeWord(args) {
    var badWord = "";
    for (let index = 2; index < args.length; index++) {
        badWord += " " + args[index].toLowerCase();
    }
    return badWord.trim();
}