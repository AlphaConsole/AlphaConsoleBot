const Discord = require('discord.js');
const keys = require("../keys.js");


module.exports = {
    title: "titles",
    perms: "everyone",
    commands: ["!set Title <Title Name>", "!set Color <Color Number>"],
    description: ["Use this to set your in game title", "Use this to set your in game title color"],
    
    run: async (client, serverInfo, message, blackListedWords, args, sql) => {
        switch (args[1].toLowerCase()) {
            case "title":
                (args[0].toLowerCase() == "!set" ? setTitle(client, serverInfo, message, blackListedWords, args) : overrideTitle(client, serverInfo, message, blackListedWords, args));
                break;
            case "color":
            case "colour":
                (args[0].toLowerCase() == "!set" ? setColour(client, serverInfo, message, blackListedWords, args) : overrideColour(client, serverInfo, message, blackListedWords, args));
                break;
            case "special":
                setSpecialTitle(client, serverInfo, message, blackListedWords, args, sql);
                break;
            default:
                message.delete().catch(console.error);
                break;
        }
    }
}

function setTitle(client, serverInfo, message, blackListedWords, args) {
    var userTitle = createTitle(message, args, 2); //make title
    if (userTitle.replace(/[^::]/g, "").length > 5) {
        message.author.send('AlphaConsole does not support more than 5 rotations in your custom title. Please try again.');
    } else {
        var invalidTitle = isValidTitle(message, blackListedWords, userTitle); //check if title is valid
        if (!invalidTitle) {
            //Make web req.
            setUsersTitle(message.author, userTitle, message);
        } else {
            //DM user and say invalid.
            message.member.send("Your custom title was not set because it contained a blacklisted phrase. \n"
                + "AlphaConsole does not allow faking of real titles. If you continue to try and bypass the blacklist system, it could result in loss of access to our custom titles.");
        }
    }
    message.delete().catch(console.error);
}

function setColour(client, serverInfo, message, blackListedWords, args) {
    var success = setUsersColour(message.member, args[2], message);
    message.delete().catch(console.error);
    
}

function overrideTitle(client, serverInfo, message, blackListedWords, args) {
    if (hasRole(message.member, "Moderator") || hasRole(message.member, "Admin") || hasRole(message.member, "Developer")) {
        var user = message.mentions.users.first();
        var userTitle = createTitle(message, args, 3); //make title
        if(setUsersTitle(user, userTitle, message)) {
            message.author.send(`User ${args[2]} updated sucessfully.`);
        }
    }
    message.delete().catch(console.error);
}

function overrideColour(client, serverInfo, message, blackListedWords, args) {
    if (hasRole(message.member, "Moderator") || hasRole(message.member, "Admin") || hasRole(message.member, "Developer")) {
        var user = message.mentions.users.first();
        if (setUsersColour(message.member, args[3], message)) {
            message.author.send(`User ${args[2]} updated successfully.`);
        }
    }
    message.delete().catch(console.error);
}

function setSpecialTitle(client, serverInfo, message, blackListedWords, args, sql) {
    if (isNaN(args[2])) {
        message.author.send('Hi, it looks like you tried to use `!set special` wrong. Please use ' +
    'an ID at the end. Example `!set special 1`');
    } else {
        console.log(args[2]);
        sql.get(`Select * from SpecialTitles where ID = '${args[2]}'`).then(row => {
            if (row) {
                if (hasRole(message.member, row.PermittedRoles)) {
                    setUsersTitle(message.author, row.Title);
                } else {
                    message.author.send('Sorry, you do not have permission to the title you have choosen.');
                }
            } else {
                message.author.send('You have choosen an ID that is not available. Try again!');
            }
        }).catch(err => console.log(err))
    }
    message.delete().catch(console.error);
}

//---------------------------//
//      Helper Functions     //
//---------------------------//

/**
 * This function is to update a users title
 * @param {user object} user 
 * @param {string} userTitle 
 * @param {message object} message 
 */
function setUsersTitle(user, userTitle, message) {
    var request = require('request');
    var url = keys.SetTitleURL;
    url += '?DiscordID=' + user.id + '&key=' + keys.Password + "&title=" + userTitle;
    request({
        method: 'GET',
        url: url
    }, function (err, response, body) {
        if (err) user.send('Their was an error updating your title. Please' +
            ' pm an admin this error: \n' + err);
        if (body.toLowerCase().includes('done')) {
            user.send('Your title has been updated to: `' + userTitle + '`');
        } else if (body.toLowerCase().includes('the user does not exist')) {
            user.send('Hi, in order to use our custom title service you must authorize your discord account. \n'
                + "Please click this link: http://alphaconsole.net/auth/index.php and login with your discord account.")
        }
    });
}

/**
 * This function is to update a users color
 * @param {user object} user 
 * @param {string} userTitle 
 * @param {message object} message 
 */
function setUsersColour(user, userColour, message) {
    if (isValidColour(user, userColour)) {
        var success = false;
        var request = require('request');
        var url = keys.SetTitleURL;
        url += '?DiscordID=' + user.id + '&key=' + keys.Password + "&color=" + userColour;
        request({
            method: 'GET',
            url: url
        }, function (err, response, body) {
            if (err) user.send('Their was error updating your colour. Please' +
                ' pm an admin this error: \n' + err);
            if (body.toLowerCase().includes('done')) {
                success = true;
                user.send('Your colour has been updated to: `' + userColour + '`');
            } else if (body.toLowerCase().includes('the user does not exist')) {
                user.send('Hi, in order to use our custom title service you must authorize your discord account. \n'
                    + "Please click this link: http://alphaconsole.net/auth/index.php and login with your discord account.")
            }
        });
    } else {
        message.author.send('Hi, you have either chosen an invalid colour or a colour you do not have access to.'
            + '\nSubscribe to our twitch for access to more colours! \nhttps://www.twitch.tv/alphaconsole')
    }
    return success;
}

/**
 * Checks if titles are valid
 * @param {message object} message 
 * @param {list} blackListedWords 
 * @param {string} userTitle 
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
        } else if (hasRole(message.member, "Legacy")) {
            var exemptWords = ['alphaconsole', 'legacy'];
            userTitleBad = inBlacklist(message, blackListedWords, userTitle, exemptWords);
        } else {
            var exemptWords = [];
            userTitleBad = inBlacklist(message, blackListedWords, userTitle, exemptWords);
        }
    }
    return userTitleBad;
}

function isValidColour(user, colour) {
    switch (colour) {
        case '0':
        case '1':
            return true;
            break;
        case '2':
            if (hasRole(user, 'Twitch Subs') || hasRole(user, 'Legacy') || isStaff(user)) {
                return true;
            } else {
                return false;
            }
            break;
        case '3':
        case '4':
        case '5':
            return true;
            break;
        case '6':
            if (hasRole(user, 'Twitch Subs') || hasRole(user, 'Legacy') || isStaff(user)) {
                return true;
            } else {
                return false;
            }
            break;
        case '7':
            return true;
            break;
        default:
            return false;
            break;
    }
}

/**
 * Returns true if user is part of staff
 * @param {user} user 
 */
function isStaff(user) {
    if (hasRole(user, "Developer") ||hasRole(user, "Admin") || hasRole(user, "Moderator") || hasRole(user, "Support")) {
        return true;
    } else {
        return false;
    }
}

/**
 * Checks if the title has bad words taking into consideratriion exempt words
 * @param {message object} message 
 * @param {list} blackListedWords 
 * @param {string} userTitle 
 * @param {string} exemptWords 
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

function hasRoleFromList(listOfRoles, user) {
    listOfRoles.forEach(role => {
        if (hasRole(user, role)) return true;
    });
    return false;
}

function pluck(array) {
    return array.map(function (item) { return item["name"]; });
}
function hasRole(mem, role) {
    if (pluck(mem.roles).includes(role)) {
        return true;
    } else {
        return false;
    }
}