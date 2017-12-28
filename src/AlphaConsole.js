//Main file for AlphaConsole Discord Bot


//const
const Discord = require('discord.js');
const client = new Discord.Client();
const sql = require("sqlite");
sql.open("src/sqlite/AlphaConsole.db");

//vars
var AllowedLinksSet = new Set();
var SwearWordsSet = new Set();
var AutoResponds = new Map();
var Commands = [];
var Events = [];
//anti-spam
var authors = [];
var messagelog = [];
var warned = [];
var banned = [];
//server information
var serverInfoPath = process.argv.slice(2).pop().replace('-serverfile=', '');
var serverInfo = require(serverInfoPath).serverInfo;

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
    require('./events/ready.js').run(client, serverInfo, sql, AllowedLinksSet, AutoResponds, Commands, Events, SwearWordsSet);
});

//New member joins
client.on('guildMemberAdd', (member) => {
    require('./events/newMember.js').run(client, serverInfo, member, sql);
}); 

//User Left / kicked
client.on('guildMemberRemove', (member) => {
    require('./events/guildMemberRemove.js').run(client, serverInfo, member, sql);
}); 

//Voice users update
client.on('voiceStateUpdate', (oldMember, newMember) => {
    require('./events/voiceChannelUpdate.js').run(client, serverInfo, oldMember, newMember);
});

//User Info changed
client.on('guildMemberUpdate', (oldMember, newMember) => {
    require('./events/guildMemberUpdate.js').run(client, serverInfo, oldMember, newMember, sql, keys);
});

//Personal Info changed
client.on('userUpdate', (oldMember, newMember) => {
    require('./events/userUpdate.js').run(client, serverInfo, oldMember, newMember);
});

//User Info changed
client.on('messageDelete', (message) => {
    require('./events/messageDelete.js').run(client, serverInfo, message);
});

//React has been added
client.on('messageReactionAdd', (reaction, user) => {
    require('./events/messageReactionAdd.js').run(client, serverInfo, reaction, user);
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
    var args = message.content.split(/[ ]+/);


    if (message.channel.type != 'dm') {
        require('./events/newMessage.js').run(client, serverInfo, sql, message, args, AllowedLinksSet, AutoResponds, SwearWordsSet)
        require('./events/spamCheck.js').run(client, serverInfo, message, authors, messagelog, warned, banned, sql)


        /// USER COMMANDS
        // Bot-Spam: Self-Assign role
        if(message.channel.id.includes(serverInfo.BotSpam)) {
            if (args[0].toLowerCase() == "!role") {
                require('./cmds/role.js').run(client, serverInfo, sql, message, args)
            }
        }

        //Help command
        if (args[0].toLowerCase() == "!help" || args[0].toLowerCase() == "!h") {
            require('./cmds/helpPublic.js').run(client, serverInfo, message, args, Commands)
        }

        //Title commands
        if (args[0].toLowerCase() == "!set" || args[0].toLowerCase() == "!override") {
            require('./cmds/titles.js').run(client, serverInfo, message, blackListedWords, args, sql)
        }

        if (args[0].toLowerCase() == "!events") {
            require('./cmds/events.js').run(client, serverInfo, message, args, Events)
        }

        /// STAFF COMMANDS
        //Staff Custom Commands add
        if (args[0].toLowerCase() == "!addcom") {
            require('./cmds/addcom.js').run(client, serverInfo, sql, message, args)
        }

        //Staff Custom Commands edit
        if (args[0].toLowerCase() == "!editcom") {
            require('./cmds/editcom.js').run(client, serverInfo, sql, message, args)
        }

        //Staff Custom Commands delete
        if (args[0].toLowerCase() == "!delcom") {
            require('./cmds/delcom.js').run(client, serverInfo, sql, message, args)
        }

        //Staff usercount command
        if (args[0].toLowerCase() == "!usercount") {
            require('./cmds/usercount.js').run(client, serverInfo, sql, message, args)
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

        //Support warn command
        if (args[0].toLowerCase() == "!warn") {
            require('./cmds/warn.js').run(client, serverInfo, sql, message, args)
        }

        //Support check command
        if (args[0].toLowerCase() == "!check") {
            require('./cmds/check.js').run(client, serverInfo, sql, message, args)
        }

        //Support check command
        if (args[0].toLowerCase() == "!case") {
            require('./cmds/case.js').run(client, serverInfo, sql, message, args)
        }

        //Support check command
        if (args[0].toLowerCase() == "!cases") {
            require('./cmds/cases.js').run(client, serverInfo, sql, message, args)
        }

        //Support checkdb for titles command
        if (args[0].toLowerCase() == "!checkdb") {
            require('./cmds/checkdb.js').run(client, serverInfo, message, args)
        }


        /// MODERATOR COMMANDS
        //Moderator kick command
        if (args[0].toLowerCase() == "!kick") {
            require('./cmds/kick.js').run(client, serverInfo, sql, message, args)
        }

        //Moderator ban command
        if (args[0].toLowerCase() == "!ban") {
            require('./cmds/ban.js').run(client, serverInfo, sql, message, args)
        }

        //Moderator auto respond command
        if (args[0].toLowerCase() == "!auto") {
            require('./cmds/auto.js').run(client, serverInfo, sql, message, args, AutoResponds)
        }

        //Moderator swear words command
        if (args[0].toLowerCase() == "!swearwords") {
            require('./cmds/swearwords.js').run(client, serverInfo, sql, message, args, SwearWordsSet)
        }

        //Moderator togglelinks command
        if (args[0].toLowerCase() == "!togglelinks") {
            require('./cmds/togglelinks.js').run(client, serverInfo, sql, message, args, AllowedLinksSet)
        }

        //Moderator purge command
        if (args[0].toLowerCase() == "!purge") {
            require('./cmds/purge.js').run(client, serverInfo, message, args)
        }
        



        /// ADMIN COMMANDS
        //Admin Bot Status
        if (args[0].toLowerCase() == "!status") {
            require('./cmds/status.js').run(client, serverInfo, sql, message, args)
        }

    } else {
        /// ALL DM COMMANDS

        if (args[0].toLowerCase() == "!help" || args[0].toLowerCase() == "!h") {
            require('./cmds/help.js').run(client, serverInfo, message, args, Commands)
        }

    }
})

var schedule = require('node-schedule');

var j = schedule.scheduleJob({second: 1}, function(){
    require('./events/minuteCheck.js').run(client, serverInfo, sql);
});

var j = schedule.scheduleJob({minute: 1}, function(){
    require('./events/StatusUpdate.js').run(client, serverInfo, sql);
});

var j = schedule.scheduleJob({minute: 31}, function(){
    require('./events/StatusUpdate.js').run(client, serverInfo, sql);
});

var j = schedule.scheduleJob({hour: 9, minute: 40}, function(){
    require('./events/DailyStats.js').run(client, serverInfo, sql);
});

client.login(require('./keys.js').TestBotToken);