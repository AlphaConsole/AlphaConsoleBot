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
    DynamicCat: '388834196782579712',
    BotSpam : '389241234100715520',
    EventsRole: '389384990087053312'
  }



//---------------------------//
//      Client Events        //
//---------------------------//

//Bot logs in
client.on('ready', () => {
    require('./events/ready.js').run(client, serverInfo, sql);
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
        require('./events/newMessage.js').run(client, serverInfo, sql, message, args)

        /// USER COMMANDS
        // Bot-Spam: Self-Assign role
        if(message.channel.id.includes(serverInfo.BotSpam)) {
            if (args[0].toLowerCase() == "!role") {
                require('./cmds/role.js').run(client, serverInfo, sql, message, args)
            }
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



        /// ADMIN COMMANDS
        //Admin Bot Status
        if (args[0].toLowerCase() == "!status") {
            require('./cmds/status.js').run(client, serverInfo, sql, message, args)
        }

        if (args[0] == "!test") {
            require('./events/StatusUpdate.js').run(client, serverInfo, sql);
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