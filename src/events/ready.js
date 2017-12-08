const Discord = require('discord.js');


module.exports.run = async(client, channels, callback) => {
    console.log('AlphaConsole Bot logged in and ready.');
    client.user.setActivity("@ alphaconsole.net", {type: "WATCHING"});
}