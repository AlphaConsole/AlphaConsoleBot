const Discord = require('discord.js');
const keys = require("../keys.js");

module.exports.run = async(client, serverInfo, message, args) => {
    switch (args[1]) {
        case "title":
            (args[0].toLowerCase() == "!set" ? setTitle(message) : overrideTitle(message));
            break;
        case "color":
        case "colour":
            (args[0].toLowerCase() == "!set" ? setColour(message) : overrideColour(message));
            break;
        default:
            break;
    }
    
}


function setTitle(message) {
   
}

function setColour(message) {

}

function overrideTitle(message) {
    
}

function overideColour(message) {

}