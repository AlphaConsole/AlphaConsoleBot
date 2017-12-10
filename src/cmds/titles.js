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
    //var userTitle = createTitle(message, args, 2);
    var validTitle = isValidTitle(message, blackListedWords, createTitle(message, args, 2));
    if (validTitle ? message.reply('Title not set') : message.reply('Title set'));
}

function setColour(client, serverInfo, message, blackListedWords, args) {

}

function overrideTitle(client, serverInfo, message, blackListedWords, args) {

}

function overideColour(client, serverInfo, message, blackListedWords, args) {

}

//---------------------------//
//      Helper Functions     //
//---------------------------//

/**
 * Checks if titles are valid
 * @param {*} message 
 * @param {*} blackListedWords 
 * @param {*} userTitle 
 */
function isValidTitle(message, blackListedWords, userTitle) {
    var userTitleBad = false;
    if (!hasRole(message.member, "Admin") && !hasRole(message.member, "Developer")) {
        if (hasRole(message.member, "Moderator")) {
            var exemptWords = ['alphaconsole', 'mod', 'moderator', 'staff'];
            userTitleBad = inBlacklist(message, blackListedWords, userTitle, exemptWords);
        } else if (hasRole(message.member, "Support")) {
            var exemptWords = ['alphaconsole', 'support', 'staff'];
            userTitleBad = inBlacklist(message, blackListedWords, userTitle, exemptWords);
        } else if (hasRole(message.member, "Community Helper")) {
            var exemptWords = ['alphaconsole', 'community helper'];
            userTitleBad = inBlacklist(message, blackListedWords, userTitle, exemptWords);
        } else {
            var exemptWords =[];
            userTitleBad = inBlacklist(message, blackListedWords, userTitle, exemptWords);
        }
    }
    return userTitleBad;
}

/**
 * Checks if the title has bad words taking into consideratriion exempt words
 * @param {*} message 
 * @param {*} blackListedWords 
 * @param {*} userTitle 
 * @param {*} exemptWords 
 */
function inBlacklist(message, blackListedWords, userTitle, exemptWords) {
    var userTitleBad = false;
    blackListedWords.forEach(badWord => {
        if (badWord != '' && !exemptWords.includes(badWord)) {
            if (userTitle.toLowerCase().includes(badWord)) {
                userTitleBad = true;
            }
        }
    });
    return userTitleBad;
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