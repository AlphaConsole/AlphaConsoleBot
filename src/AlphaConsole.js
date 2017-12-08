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
    logChannel: 'discord-log',
    modlogChannel: '352842494507089920'
  }



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

//User Banned
client.on('guildBanAdd', (guild, user) => {
    require('./events/banAdd.js').run(client, serverInfo, user);
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
    if (message.author.bot) {
        return;
    }

    if (message.channel.type != 'dm') {
        var args = message.content.split(/[ ]+/);

        //Staff mute command
        if (args[0].toLowerCase() == "!mute") {
            require('./cmds/mute.js').run(client, serverInfo, sql, message ,args)
        }




        //Fast testing place
        if (message.author.id.includes('149223090134450177') || message.author.id.includes('136607366408962048')) {
            console.log(new Date().getTime())
        }
    }
})

var schedule = require('node-schedule');

var j = schedule.scheduleJob({second: 1}, function(){
    require('./events/minuteCheck.js').run(client, serverInfo, sql);
});

client.login(require('./keys.js').TestBotToken);