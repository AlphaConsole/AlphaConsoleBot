//Main file for AlphaConsole Discord Bot


//const
const Discord = require('discord.js');
const client = new Discord.Client();

//Server Information
var serverInfo = {
    guildName: 'AC Beta',
    logChannel: 'discord-log',
    modlogChannel: 'mod-log'
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
    
})

client.login(require('./keys.js').TestBotToken);