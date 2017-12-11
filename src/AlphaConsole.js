//Main file for AlphaConsole Discord Bot


//const
const Discord = require('discord.js');
const client = new Discord.Client();
const sql = require("sqlite");
sql.open("src/sqlite/AlphaConsole.db");

//Server Information
var serverInfo = {
    guildName: 'AC Beta',
    guildId: '348214140889989140',
    logChannel: '352842494507089920',
    modlogChannel: '352842494507089920',
    DynamicCat: '388834196782579712'
  }

//---------------------------//
//      Bot Load             //
//---------------------------//
//Load blacklist
const keys = require("../src/keys.js");
var request = require('request');
var blackListedWords = [];
request({
    method: 'GET',
    url: keys.BadWordsURL
}, function(err, response, body) {
    if (err) return console.error(err);
    blackListedWords = body.split(/\r?\n/);
});

//---------------------------//
//      Client Events        //
//---------------------------//

//Bot logs in
client.on('ready', () => {
    require('./events/ready.js').run(client, serverInfo, function(value) {
    });
});

//New member joins
client.on('guildMemberAdd', (member) => {
    require('./events/newMember.js').run(client, serverInfo, member, connection);
}); 

//Ban Removed
client.on('guildBanRemove', (guild, user) => {
    require('./events/banRemove.js').run(client, serverInfo, user);
  }); 

//Voice users update
client.on('voiceStateUpdate', (oldMember, newMember) => {
    require('./events/voiceChannelUpdate.js').run(client, serverInfo, oldMember, newMember);
});

//Outputs unhandles promises
process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  });


//--------------------------//
//    ALL MESSAGE EVENTS    //
//--------------------------//

client.on('message', async message =>
{
    if (message.author.bot) return;

    if (message.channel.type != 'dm') {
        var args = message.content.split(/[ ]+/);

        if (args[0].toLowerCase() == "!test") {
           
        }

        //Title commands
        if (args[0].toLowerCase() == "!set" || args[0].toLowerCase() == "!override") {
            require('./cmds/titles.js').run(client, serverInfo, message, blackListedWords, args)
        }


        /// SUPPORT COMMANDS

        //Support mute command
        if (args[0].toLowerCase() == "!mute") {
            require('./cmds/mute.js').run(client, serverInfo, sql, message, args)
        }

        //Support unmute command
        if (args[0].toLowerCase() == "!unmute") {
            require('./cmds/unmute.js').run(client, serverInfo, sql, message, args)
        }


        /// MODERATOR COMMANDS

        //Moderator kick command
        if (args[0].toLowerCase() == "!kick") {
            require('./cmds/kick.js').run(client, serverInfo, sql, message, args)
        }

        //Support unmute command
        if (args[0].toLowerCase() == "!ban") {
            require('./cmds/ban.js').run(client, serverInfo, sql, message, args)
        }

        
    }
})

var schedule = require('node-schedule');

var j = schedule.scheduleJob({second: 1}, function(){
    require('./events/minuteCheck.js').run(client, serverInfo, sql);
});

client.login(require('./keys.js').TestBotToken);