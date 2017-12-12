//Main file for AlphaConsole Discord Bot


//const
const Discord = require('discord.js');
const client = new Discord.Client();
const sql = require("sqlite");
sql.open("src/sqlite/AlphaConsole.db");

//vars
var DisabledLinksSet = new Set();
var AutoResponds = new Map();

//Server Information
var serverInfo = {
    guildName: 'AC Beta',
    guildId: '348214140889989140',
    aclogChannel: '389536034041495562',
    serverlogChannel: '389536059177828374',
    modlogChannel: '389536131089432596',
    DynamicCat: '388834196782579712',
    BotSpam: '389241234100715520',
    EventsRole: '389384990087053312',
    suggestionsChannel: '389870221906804737',
    showcaseChannel: '349637406393237514'
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
    require('./events/ready.js').run(client, serverInfo, sql, DisabledLinksSet, AutoResponds);
});

//New member joins
client.on('guildMemberAdd', (member) => {
    require('./events/newMember.js').run(client, serverInfo, member);
}); 

//User Left / kicked
client.on('guildMemberRemove', (member) => {
    require('./events/guildMemberRemove.js').run(client, serverInfo, member);
}); 

//Voice users update
client.on('voiceStateUpdate', (oldMember, newMember) => {
    require('./events/voiceChannelUpdate.js').run(client, serverInfo, oldMember, newMember);
});

//User Info changed
client.on('guildMemberUpdate', (oldMember, newMember) => {
    require('./events/guildMemberUpdate.js').run(client, serverInfo, oldMember, newMember);
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

    if (message.channel.type != 'dm') {
        var args = message.content.split(/[ ]+/);
        require('./events/newMessage.js').run(client, serverInfo, sql, message, args, DisabledLinksSet, AutoResponds)

        /// USER COMMANDS
        // Bot-Spam: Self-Assign role
        if(message.channel.id.includes(serverInfo.BotSpam)) {
            if (args[0].toLowerCase() == "!role") {
                require('./cmds/role.js').run(client, serverInfo, sql, message, args)
            }
        }

        //Title commands
        if (args[0].toLowerCase() == "!set" || args[0].toLowerCase() == "!override") {
            require('./cmds/titles.js').run(client, serverInfo, message, blackListedWords, args)
        }

        /// SUPPORT COMMANDS
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
        if (args[0].toLowerCase() == "!togglelinks") {
            require('./cmds/togglelinks.js').run(client, serverInfo, sql, message, args, DisabledLinksSet)
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



        /// ADMIN COMMANDS
        //Admin Bot Status
        if (args[0].toLowerCase() == "!status") {
            require('./cmds/status.js').run(client, serverInfo, sql, message, args)
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

client.login(require('./keys.js').TestBotToken);