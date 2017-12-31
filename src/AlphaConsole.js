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

        var validCMD = false;

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
        else if (args[0].toLowerCase() == "!help" || args[0].toLowerCase() == "!h") {
            require('./cmds/helpPublic.js').run(client, serverInfo, message, args, Commands)
            validCMD = true;
        }

        //Title commands
        else if (args[0].toLowerCase() == "!set" || args[0].toLowerCase() == "!override") {
            require('./cmds/titles.js').run(client, serverInfo, message, blackListedWords, args, sql)
            validCMD = true;
        }

        else if (args[0].toLowerCase() == "!disable") {
            require('./cmds/disable.js').run(client, serverInfo, message, args)
            validCMD = true;
        }

        else if (args[0].toLowerCase() == "!events") {
            require('./cmds/events.js').run(client, serverInfo, message, args, Events)
            validCMD = true;
        }

        /// STAFF COMMANDS
        //Staff Custom Commands add
        else if (args[0].toLowerCase() == "!addcom") {
            require('./cmds/addcom.js').run(client, serverInfo, sql, message, args)
            validCMD = true;
        }

        //Staff Custom Commands edit
        else if (args[0].toLowerCase() == "!editcom") {
            require('./cmds/editcom.js').run(client, serverInfo, sql, message, args)
            validCMD = true;
        }

        //Staff Custom Commands delete
        else if (args[0].toLowerCase() == "!delcom") {
            require('./cmds/delcom.js').run(client, serverInfo, sql, message, args)
            validCMD = true;
        }

        //Staff usercount command
        else if (args[0].toLowerCase() == "!usercount") {
            require('./cmds/usercount.js').run(client, serverInfo, sql, message, args)
            validCMD = true;
        }



        /// SUPPORT COMMANDS
        //Support mute command
        else if (args[0].toLowerCase() == "!mute") {
            require('./cmds/mute.js').run(client, serverInfo, sql, message, args)
            validCMD = true;
        }

        //Support unmute command
        else if (args[0].toLowerCase() == "!unmute") {
            require('./cmds/unmute.js').run(client, serverInfo, sql, message, args)
            validCMD = true;
        }

        //Support warn command
        else if (args[0].toLowerCase() == "!warn") {
            require('./cmds/warn.js').run(client, serverInfo, sql, message, args)
            validCMD = true;
        }

        //Support check command
        else if (args[0].toLowerCase() == "!check") {
            require('./cmds/check.js').run(client, serverInfo, sql, message, args)
            validCMD = true;
        }

        //Support check command
        else if (args[0].toLowerCase() == "!case") {
            require('./cmds/case.js').run(client, serverInfo, sql, message, args)
            validCMD = true;
        }

        //Support check command
        else if (args[0].toLowerCase() == "!cases") {
            require('./cmds/cases.js').run(client, serverInfo, sql, message, args)
            validCMD = true;
        }

        //Support checkdb for titles command
        else if (args[0].toLowerCase() == "!checkdb") {
            require('./cmds/checkdb.js').run(client, serverInfo, message, args)
            validCMD = true;
        }


        /// MODERATOR COMMANDS
        //Moderator kick command
        else if (args[0].toLowerCase() == "!kick") {
            require('./cmds/kick.js').run(client, serverInfo, sql, message, args)
            validCMD = true;
        }

        //Moderator ban command
        else if (args[0].toLowerCase() == "!ban") {
            require('./cmds/ban.js').run(client, serverInfo, sql, message, args)
            validCMD = true;
        }

        //Moderator auto respond command
        else if (args[0].toLowerCase() == "!auto") {
            require('./cmds/auto.js').run(client, serverInfo, sql, message, args, AutoResponds)
            validCMD = true;
        }

        //Moderator swear words command
        else if (args[0].toLowerCase() == "!swearwords") {
            require('./cmds/swearwords.js').run(client, serverInfo, sql, message, args, SwearWordsSet)
            validCMD = true;
        }

        //Moderator togglelinks command
        else if (args[0].toLowerCase() == "!togglelinks") {
            require('./cmds/togglelinks.js').run(client, serverInfo, sql, message, args, AllowedLinksSet)
            validCMD = true;
        }

        //Moderator purge command
        else if (args[0].toLowerCase() == "!purge") {
            require('./cmds/purge.js').run(client, serverInfo, message, args)
            validCMD = true;
        }
        
        /// ADMIN COMMANDS
        //Admin Bot Status
        else if (args[0].toLowerCase() == "!status") {
            require('./cmds/status.js').run(client, serverInfo, sql, message, args)
            validCMD = true;
        }

        //Disables all channels which rely on the bot heavily. (#set-title, special title, etc)
        else if (args[0].toLowerCase() == "!lockdown") {
            require('./cmds/lockdown.js').run(client, serverInfo, message, args)
            validCMD = true;
        }
        else if (args[0].toLowerCase() == "!unlock") {
            require('./cmds/unlockdown.js').run(client, serverInfo, message, args)
            validCMD = true;
        }

        //Keep #Set-title clean
        if (validCMD) {
            try {
                message.delete()
            } catch (error) {
                console.error(error);
            }
        } else if (message.channel.id == serverInfo.setTitleChannel || message.channel.id == serverInfo.setSpecialTitleChannel) {
            message.delete().catch(console.error);
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