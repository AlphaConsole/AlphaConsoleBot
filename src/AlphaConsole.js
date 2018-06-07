/**
 * ! Main file for AlphaConsole Discord Bot
 * 
 * ? This is the main file where all event handlers are located and it routes to the correct file.
 * ? Also time based events are called from here
 * 
 * * You will notice that all the comments start with a ?, ! or *.
 * * This is done for nicer looking comments / documentation.
 * * I use the Better Comments exentension in vsc for the look
 * * -> https://marketplace.visualstudio.com/items?itemName=aaron-bond.better-comments
 */



/**
 * ! requires & setup
 * 
 * ? Requiring Discord & mysql and setting up the client.
 * ? Also requiring the private keys and the server information.
 */
const keys = require("../src/tokens.js");
const serverInfoPath = process.argv.slice(2).pop().replace("-serverfile=", "");
const serverInfo = require(serverInfoPath);

const Discord = require("discord.js");
const mysql = require('mysql');

const client = new Discord.Client();
const pool = mysql.createPool({
    host    : keys.dbHost,
    port    : 3306,
    user    : keys.dbUser,
    password: keys.dbPass,
    database: keys.dbName
});

// ? Database function to ensure we always have a connection but without having to repeat ourself in the code.
let sql = {};
sql.query = function(query, params, callback) {
  pool.getConnection(function(err, connection) {
    if(err) { 
      console.log(err); 
      if (callback) callback(true, null); 
      return; 
    }
    
    connection.query(query, params, function(err, results) {
      connection.release(); // always put connection back in pool after last query
      if(err) { 
        console.log(err); 
        if (callback) callback(true, null); 
        return; 
      }
      if (callback) callback(false, results);
    });
  });
};


let config = {
  sql                    : sql,
  whitelistedLinksChannel: [],
  swearwords             : [],
  autoResponds           : {},
  permits                : {},
  commands               : []
}





/**
 * ! Bot event handlers
 * 
 * ? These include all events that the bot receive except the message event.
 * ? This is used to check if a new user joins for example
 * ? or if to check if a new reaction has been added and the bot must take action
 */

//Bot logs in
client.on("ready", () => {
  require('./events/ready').run(client, serverInfo, config);
});

//New member joins
client.on("guildMemberAdd", member => {
  
});

//User Left / kicked
client.on("guildMemberRemove", member => {
  
});

//Voice users update
client.on("voiceStateUpdate", (oldMember, newMember) => {
  
});

//User Info changed
client.on("guildMemberUpdate", (oldMember, newMember) => {
  
});

//Personal Info changed
client.on("userUpdate", (oldMember, newMember) => {
  
});

//User Info changed
client.on("messageDelete", message => {
  
});

//React has been added
client.on("messageReactionAdd", (reaction, user) => {
  
});


client.on("guildBanAdd", (guild, user) => {
  
});

//Outputs unhandles promises
process.on("unhandledRejection", (reason, p) => {
  console.log("Unhandled Rejection at: Promise", p, "reason:", reason);
});








/**
 * ! New or edited message events / handling
 * 
 * ? All new and edited messages are checked.
 * ? Checks like is this user allowed to chat in this channel or is the user spamming.
 */

//* New message
client.on("message", async message => {
  messageProcess(message);
});

//* Message Updated
client.on("messageUpdate", async (originalMessage, newMessage) => {
  messageProcess(newMessage);
});


async function messageProcess(message) {
  if (message.author.bot) return;
  var args = message.content.split(/[ ]+/);


  /**
   * ! Fetching the user
   * 
   * ? Due to the Discord server having a lot of members there is a chance that the user itself is not fetched.
   * ? That's why we do so on every command, if the user is already fetched it'll take his information
   * ? from the cache anyway without extra effort. This is just to insure the user can always be used
   * ? in the command
   */
  await client.guilds.get(serverInfo.guildId).members.fetch(message.author.id).then(m => {
    message.member = m;

    /**
     * ! Assigning all positions to the member to easily detect if he is allowed to do certain commands
     * 
     * ? We are saving these varibales in the message.member object. This way at any point of time
     * ? we can request the information and detect if he is allowed to execute the command.
     */
    if (message.member.roles.has(serverInfo.roles.developer)) 
      message.member.isDeveloper = true;
    else
      message.member.isDeveloper = false;
    
    if (message.member.roles.has(serverInfo.roles.admin) || message.member.isDeveloper)
      message.member.isAdmin = true;
    else
      message.member.isAdmin = false;

    if (message.member.roles.has(serverInfo.roles.moderator) || message.member.isAdmin)
      message.member.isModerator = true;
    else
      message.member.isModerator = false;

    if (message.member.roles.has(serverInfo.roles.support) || message.member.isModerator)
      message.member.isSupport = true;
    else
      message.member.isSupport = false;

    if (message.member.roles.has(serverInfo.roles.staff) || message.member.isSupport)
      message.member.isStaff = true;
    else
      message.member.isStaff = false;

    if (message.member.roles.has(serverInfo.roles.ch) || message.member.isStaff)
      message.member.isCH = true;
    else
      message.member.isCH = false;

    /** 
     * ! Assigned all data to a var
     * 
     * ? Here we'll be assigning all data we need in the other files to the `data` var.
     * ? This is done because we will be requiring 20+ times and to avoid repeating if
     * ? we need to update stuff we save it in 1 var we user everywhere.
     * 
     * * It might send more variables than needed in that file. But it's the same everywhere.
     * * So it shouldn't affect permformance too much.
     */

    let data = {
      client    : client,
      serverInfo: serverInfo,
      message   : message,
      args      : args,
      sql       : sql,
      config    : config,
      sendEmbed : sendEmbed
    }


    if (message.channel.type === "text") {
      if (message.guild.id !== serverInfo.guildId) return;
        
        /**
         * ! All possible commands
         * 
         * ? We assign the command to a variable. Based on that variable we'll redirect
         * ? the request to the right file. So this file is not one big mess
         * ? We also check every single message, to ensure the user is allowed to chat or for custom commands
         */
        let cmd = args[0].substring(1).toLowerCase();
        require('./events/message').run(data, cmd)

        switch (cmd) {
          case "ping":
            require('./cmds/ping').run(data);
            break;

          case "togglelinks":
            require('./cmds/toggleLinks').run(data);
            break;

          case "swearwords":
            require('./cmds/swearwords').run(data);
            break;

          case "permit":
            require('./cmds/permit').run(data);
            break;

          case "auto":
            require('./cmds/auto').run(data);
            break;

          case "addcom":
            require('./cmds/addcom').run(data);
            break;

          case "editcom":
            require('./cmds/editcom').run(data);
            break;

          case "delcom":
            require('./cmds/delcom').run(data);
            break;

          case "help":
            require("./cmds/help").run(data, false);
            break;

          case "role":
            require("./cmds/role").run(data);
            break;

          case "serverinfo":
            require('./cmds/serverinfo').run(data);
            break;

          case "listroles":
            require('./cmds/listroles').run(data);
            break;

          case "purge":
            require('./cmds/purge').run(data);
            break;
        
          default:
            break;
        }
        
    } else {
      //* ALL DM COMMANDS

      if (args[0].toLowerCase() == "!help" || args[0].toLowerCase() == "!h")
        require('./cmds/help').run(data, true);

    }

  }).catch(e => { })
}

let sendEmbed = (channel, message, desc) => {
  const embed = new Discord.MessageEmbed()
    .setColor([255, 255, 0])
    .setAuthor(message, client.user.displayAvatarURL({ format: "png" }));
    if (desc) embed.setDescription(desc)
  channel.send(embed).catch(e => { });
}



//This should be moved to another file eventually..
var schedule = require("node-schedule");

var a = schedule.scheduleJob({ second: 1 }, function() {
  
});

var b = schedule.scheduleJob({ minute: 1 }, function() {
  
});

var c = schedule.scheduleJob({ minute: 31 }, function() {
  
});

var d = schedule.scheduleJob({ hour: 9, minute: 40 }, function() {
  
});

var e = schedule.scheduleJob({ date: 1, hour: 17 }, function() {
  
});

var f = schedule.scheduleJob({ date: 16, hour: 17 }, function() {
  
});

client.login(require("./tokens.js").token);
