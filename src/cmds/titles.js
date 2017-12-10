const Discord = require('discord.js');
const keys = require("../keys.js");


module.exports.run = async (client, serverInfo, message, blackListedWords, args) => {
    switch (args[1]) {
        case "title":
            (args[0].toLowerCase() == "!set" ? setTitle(client, serverInfo, message, blackListedWords, args) : overrideTitle(client, serverInfo, message, blackListedWords, args));
            break;
        case "color":
        case "colour":
            (args[0].toLowerCase() == "!set" ? setColour(client, serverInfo, message, blackListedWords, args) : overrideColour(client, serverInfo, message, blackListedWords, args));
            break;
        default:
            break;
    }

}

function setTitle(client, serverInfo, message, blackListedWords, args) {
    var userTitle = createTitle(message, args, 2);
    var userTitleBad = false;
    blackListedWords.forEach(badWord => {
        if (badWord != '') {
            if (userTitle.includes(badWord)) {
                userTitleBad = true;
            }
        }
    });
    if (userTitleBad ? message.reply('Title not set') : message.reply('Title set'));
}

function setColour(client, serverInfo, message, blackListedWords, args) {

}

function overrideTitle(client, serverInfo, message, blackListedWords, args) {

}

function overideColour(client, serverInfo, message, blackListedWords, args) {

}

/**
 * Turns the args array into the title
 * @param {*} message 
 * @param {*} args 
 * @param {*} indexStart 
 */
function createTitle(message, args, indexStart) {
    var title = "";
    for (let word = indexStart; word < args.length; word++) {
        title += args[word] + ' ';
    }
    return title.trim();
}

function getTitlePermission(message) {
    var user = message.author;
    
}