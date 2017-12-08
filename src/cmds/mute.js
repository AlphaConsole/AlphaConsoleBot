const Discord = require('discord.js');

module.exports.run = async(client, channels, message, connection, args) => {
    if (hasRole(message.member, "Staff")) {

        //Check if someone is tagged
        if (message.mentions.users.first() == undefined) {
            return message.channel.send('Please tag the user to be muted');
        }

        //Check if he didn't miss the hours
        if (args.length != 3) {
            return message.channel.send('Command wrongly build: `!Mute @User [Time in hours]`');
        }

        //First add the Muted Role to the user
        let MutedRole = message.guild.roles.find('name', 'Muted');
        let MutedUser = message.guild.member(message.mentions.users.first().id);
        MutedUser.addRole(MutedRole);


        //Let's first check if the user even exists in the db
        

        //Calculate the extra hours to be added
        MutedUntil = new Date().getTime() + args[2] * 3600000; //args is the amount of hours. 3600000 transfers it to ms

        //Update Database with the newest time of when to be muted to
        

        //Log it to the log-channel
        
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