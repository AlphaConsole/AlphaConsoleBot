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
const client = new Discord.Client();
let sql = require("./helpers/sql");

let config = {
  keys                   : keys,
  sql                    : sql,
  whitelistedLinksChannel: [],
  swearwords             : [],
  blacklistedWords       : [],
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
  require('./events/ready').run(client, serverInfo, config, checkStatus);
  require('./helpers/scheduled').run(client, serverInfo, config, checkStatus);
  require('./helpers/api_calls').run(client, serverInfo, config, checkStatus);
});

//New member joins
client.on("guildMemberAdd", member => {
  client.guilds.get(serverInfo.guildId).channels.get(serverInfo.channels.serverlog).send(`✅ \`[${new Date().toTimeString().split(" ")[0]}]\` **${member.user.tag}** (${member.id}) joined the guild. Total members: ${numberWithSpaces(client.guilds.get(serverInfo.guildId).memberCount)}`);
  require('./events/guildMemberAdd').run(client, serverInfo, config, member);
});

//User Left / kicked
client.on("guildMemberRemove", member => {
  client.guilds.get(serverInfo.guildId).channels.get(serverInfo.channels.serverlog).send(`❌ \`[${new Date().toTimeString().split(" ")[0]}]\` **${member.user.tag}** (${member.id}) left the guild. Total members: ${numberWithSpaces(client.guilds.get(serverInfo.guildId).memberCount)}`);
  require('./events/guildMemberRemove').run(client, serverInfo, config, member);
});

//User Info changed
client.on("guildMemberUpdate", (oldMember, newMember) => {
  require('./events/guildMemberUpdate').run(client, serverInfo, config, oldMember, newMember);
});

//Personal Info changed
client.on("userUpdate", (oldMember, newMember) => {
  if (oldMember.tag !== newMember.tag)
    client.guilds.get(serverInfo.guildId).channels.get(serverInfo.channels.serverlog).send(`:person_with_pouting_face: \`[${new Date().toTimeString().split(" ")[0]}]\` **\`${oldMember.tag}\`** changed their Discord name to **\`${newMember.tag}\`**`)
  require('./events/userUpdate').run(client, serverInfo, config, newMember);
});

//User Info changed
client.on("messageDelete", message => {
  require('./events/messageDelete').run(client, serverInfo, config, message);
});

//React has been added
client.on("messageReactionAdd", (reaction, user) => {
  require('./events/messageReactionAdd').run(client, serverInfo, config, reaction, user, sendEmbed);
});

//On a new ban
client.on("guildBanAdd", (guild, user) => {
  client.guilds.get(serverInfo.guildId).channels.get(serverInfo.channels.serverlog).send(`🔨 \`[${new Date().toTimeString().split(" ")[0]}]\` **${user.tag}** (${user.id}) has been banned from the guild.`)
});

//Voice users update
client.on("voiceStateUpdate", (oldMember, newMember) => {
  require('./events/voiceChannelUpdate').run(client, serverInfo, config, oldMember, newMember)
});

//Outputs unhandles promises
process.on("unhandledRejection", (reason, p) => {
  console.log("Unhandled Rejection at: Promise", p, "reason:", reason);
});








/**
 * ! New or edited message events / handling
 * 
 * ? All new and edited messages are checked.
 * ? Checks like "is this user allowed to chat in this channel" or "is the user spamming".
 */

//* New message
client.on("message", async message => {
  require('./events/message').botMessage(client, serverInfo, config.sql, message)
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
      client     : client,
      serverInfo : serverInfo,
      message    : message,
      args       : args,
      sql        : sql,
      config     : config,
      sendEmbed  : sendEmbed,
      checkStatus: checkStatus
    }


    if (message.channel.type === "text") {
      if (message.guild.id === serverInfo.mm.guildId)
        return processModMail(message, args, data);
      if (message.guild.id !== serverInfo.guildId) return;

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

        if (
          message.member.roles.has(serverInfo.roles.legacy) || 
          message.member.roles.has(serverInfo.roles.sub) || 
          message.member.roles.has(serverInfo.roles.orgPartner) || 
          message.member.roles.has(serverInfo.roles.partnerP) || 
          message.member.roles.has(serverInfo.roles.donator) || 
          message.member.roles.has(serverInfo.roles.beta) || 
          message.member.roles.has(serverInfo.roles.tempRole) || 
          message.member.isSupport
        )
          message.member.isBeta = true;
        else
          message.member.isBeta = false;
        
        /**
         * ! All possible commands
         * 
         * ? We assign the command to a variable. Based on that variable we'll redirect
         * ? the request to the right file. So this file is not one big mess
         * ? We also check every single message, to ensure the user is allowed to chat or for custom commands
         */
        
        let cmd = message.content.startsWith('!') ? args[0].substring(1).toLowerCase() : undefined;
        try {
          require('./events/message').run(data, cmd);
          require('./events/spamProtection').run(data);
        } catch (error) {
          console.log(error)
        }

        switch (cmd) {
          case "ping":
            if (!denyCommands(message.channel.id, serverInfo.channels))
              require('./cmds/ping').run(data);
            break;

          case "set":
          case "override":
            require('./cmds/settitle').run(data);
            break;

          case "get":
            require('./cmds/gettitle').run(data);
            break;

          case "disable":
            require('./cmds/disable').run(data);
            break;

          case "checkdb":
            require('./cmds/checkdb').run(data);
            break;

          case "checkwhitelist":
          case "checkw":
            require('./cmds/checkwhitelist').run(data);
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

          case "listcom":
          case "listcoms":
            require('./cmds/listcom').run(data);
            break;

          case "help":
            require("./cmds/help").run(data, false);
            break;

          case "role":
            require("./cmds/role").run(data);
            break;

          case "resetbeta":
            require("./cmds/resetbeta").run(data);
            break;

          case "serverinfo":
            require('./cmds/serverinfo').run(data);
            break;

          case "checktitles":
            require('./cmds/checkTitles').run(data);
            break;

          case "listroles":
            require('./cmds/listroles').run(data);
            break;

          case "purge":
            require('./cmds/purge').run(data);
            break;

          case "nick":
            require('./cmds/nick').run(data);
            break;

          case "partner":
            require('./cmds/partner').run(data);
            break;

          case "mute":
            require('./cmds/mute').run(data);
            break;

          case "unmute":
            require('./cmds/unmute').run(data);
            break;

          case "kick":
            require('./cmds/kick').run(data);
            break;

          case "ban":
            require('./cmds/ban').run(data);
            break;

          case "unban":
            require('./cmds/unban').run(data);
            break;

          case "warn":
            require('./cmds/warn').run(data);
            break;

          case "check":
          case "cases":
            require('./cmds/check').run(data);
            break;

          case "lastseen":
            require('./cmds/lastseen').run(data);
            break;

          case "checksub":
          case "subcount":
            require('./cmds/checksub').run(data);
            break;

          case "case":
            require('./cmds/case').run(data);
            break;

          case "givebeta":
            require('./cmds/givebeta').run(data);
            break;

          case "status":
            require('./cmds/status').run(data);
            break;
          
          case "lockdown":
            require('./cmds/lockdown').run(data);
            break;

          case "unlock":
            require('./cmds/unlock').run(data);
            break;

          case "blacklist":
            require('./cmds/blacklist').run(data);
            break;

          case "forcelock":
          case "forceunlock":
            require('./cmds/forcelock').run(data);
            break;

          case "update":
            require('./cmds/update').run(data);
            break;

          case "usercount":
            if (message.member.isCH) sendEmbed(message.channel, `AlphaConsole currently has ${message.guild.memberCount} members`)
        
          default:
            break;
        }

      }).catch(e => { })        
    } else {
      //* ALL DM COMMANDS

      /**
       * ! Fetching the user
       * 
       * ? Due to the Discord server having a lot of members there is a chance that the user itself is not fetched.
       * ? That's why we do so on every command, if the user is already fetched it'll take his information
       * ? from the cache anyway without extra effort. This is just to insure the user can always be used
       * ? in the command
       */
      await client.guilds.get(serverInfo.guildId).members.fetch(message.author.id).then(m => {

        /**
         * ! Assigning all positions to the member to easily detect if he is allowed to do certain commands
         * 
         * ? We are saving these varibales in the message.member object. This way at any point of time
         * ? we can request the information and detect if he is allowed to execute the command.
         */
        if (m.roles.has(serverInfo.roles.developer)) 
          m.isDeveloper = true;
        else
          m.isDeveloper = false;
        
        if (m.roles.has(serverInfo.roles.admin) || m.isDeveloper)
          m.isAdmin = true;
        else
          m.isAdmin = false;

        if (m.roles.has(serverInfo.roles.moderator) || m.isAdmin)
          m.isModerator = true;
        else
          m.isModerator = false;

        if (m.roles.has(serverInfo.roles.support) || m.isModerator)
          m.isSupport = true;
        else
          m.isSupport = false;

        if (m.roles.has(serverInfo.roles.staff) || m.isSupport)
          m.isStaff = true;
        else
          m.isStaff = false;

        if (m.roles.has(serverInfo.roles.ch) || m.isStaff)
          m.isCH = true;
        else
          m.isCH = false;

        data.member = m;
        data.discord = Discord;

        if (args[0].toLowerCase() == "!help" || args[0].toLowerCase() == "!h")
          require('./cmds/help').run(data, true);

        if (args[0].toLowerCase() == "!override")
          require('./cmds/titles').run(data);

      }).catch(e => { })


    }
}




function processModMail(message, args, data) {
  client.guilds.get(serverInfo.mm.guildId).members.fetch(message.author.id).then(m => {
    message.member = m;

    /**
     * ! Assigning all positions to the member to easily detect if he is allowed to do certain commands
     * 
     * ? We are saving these varibales in the message.member object. This way at any point of time
     * ? we can request the information and detect if he is allowed to execute the command.
     */
    if (message.member.roles.has(serverInfo.mm.roles.developer)) 
      message.member.isDeveloper = true;
    else
      message.member.isDeveloper = false;
    
    if (message.member.roles.has(serverInfo.mm.roles.admin) || message.member.isDeveloper)
      message.member.isAdmin = true;
    else
      message.member.isAdmin = false;

    if (message.member.roles.has(serverInfo.mm.roles.moderator) || message.member.isAdmin)
      message.member.isModerator = true;
    else
      message.member.isModerator = false;

    message.member.isSupport = true;
    message.member.isStaff = true;
    message.member.isCH = true;
    
    /**
     * ! All possible commands
     * 
     * ? We assign the command to a variable. Based on that variable we'll redirect
     * ? the request to the right file. So this file is not one big mess
     * ? We also check every single message, to ensure the user is allowed to chat or for custom commands
     */
    
    let cmd = message.content.startsWith('!') ? args[0].substring(1).toLowerCase() : undefined;

    switch (cmd) {
      case "ping":
        if (!denyCommands(message.channel.id, serverInfo.channels))
          require('./cmds/ping').run(data);
        break;

      case "override":
        require('./cmds/settitle').run(data);
        break;

      case "checkdb":
        require('./cmds/checkdb').run(data);
        break;

      case "checkwhitelist":
      case "checkw":
        require('./cmds/checkwhitelist').run(data);
        break;

      case "resetbeta":
        require("./cmds/resetbeta").run(data);
        break;

      case "checktitles":
        require('./cmds/checkTitles').run(data);
        break;

      case "mute":
        require('./cmds/mute').run(data);
        break;

      case "unmute":
        require('./cmds/unmute').run(data);
        break;

      case "kick":
        require('./cmds/kick').run(data);
        break;

      case "ban":
        require('./cmds/ban').run(data);
        break;

      case "unban":
        require('./cmds/unban').run(data);
        break;

      case "warn":
        require('./cmds/warn').run(data);
        break;

      case "check":
      case "cases":
        require('./cmds/check').run(data);
        break;

      case "lastseen":
        require('./cmds/lastseen').run(data);
        break;

      case "checksub":
      case "subcount":
        require('./cmds/checksub').run(data);
        break;

      case "case":
        require('./cmds/case').run(data);
        break;

      case "givebeta":
        require('./cmds/givebeta').run(data);
        break;

      case "blacklist":
        require('./cmds/blacklist').run(data);
        break;

      case "update":
        require('./cmds/update').run(data);
        break;

      case "usercount":
        if (message.member.isCH) 
          sendEmbed(message.channel, `AlphaConsole currently has ${message.guild.memberCount} members`)
    
      default:
        break;
    }

  }).catch(e => { console.log(e) }) 
}













/**
  * ! Send information in embed form to the channel
  * 
  * ? Channel can be 2 things: Guild channel or an user object.
  * ? If it's a guild channel, all fine. Should be no problems.
  * ? But if it's a user then we'll DM him. DM's can be disabled.
  * 
  * ? So to check if channel is a user I check if the .tag property exist.
  * ? It it does exist I know it's a user object, and if we are already in the catch
  * ? It's most likely because he got his DM's disabled. So we let him know in the #bot-spam
 * 
 * @param {Collection} channel 
 * @param {String} message 
 * @param {String} desc (optional)
 */
let sendEmbed = (channel, message, desc, timeout, image, embedimg) => {
  const embed = new Discord.MessageEmbed()
    .setColor([255, 255, 0])
    .setAuthor(message, client.user.displayAvatarURL({ format: "png" }));
    if (desc) embed.setDescription(desc)
    if (embedimg) embed.setImage(embedimg);
  channel.send({
    embed,
    files: image ? [ image ] : []
  })
  .then(m => {
    if (timeout)
      m.delete({ timeout: timeout })
  })
  .catch(e => {
    console.log(e);
    if (channel.tag) 
      client.guilds.get(serverInfo.guildId).channels.get(serverInfo.channels.botSpam).send(`<@${channel.id}>, I could not DM you my message because you have your DM's disabled.`)
  });
}



/**
 * ! Status information check
 * 
 * ? We'll check all statuses from the db. Check which one was last active
 * ? and apply that one to the bot. If none was active we'll start with the first one again
 */
let checkStatus = () => {
  sql.query("select * from Statuses", [], (err, res) => {
    if (err) return console.error(err);
    if (res.length === 0) return;
  
    if (res.filter(r => r.Active == 1).length === 0) {
        let r = res[0];
        setStatus(r);
  
    } else {
        let r = res.filter(r => r.Active == 1)[0];
        setStatus(r);
    }

  })
}
function setStatus(r) {
  sql.query("Update Statuses set Active = 1 where ID = ?", [ r.ID ]); 


  //* All exceptions first
  if (r.StatusText.toLowerCase() === "counter") 
    client.user.setActivity(`with ${client.guilds.get(serverInfo.guildId).memberCount} members`, { type: "PLAYING" });
  else
    client.user.setActivity(r.StatusText, { type: r.StatusType });
}


function denyCommands(channelID, channels) {
	if (channelID === channels.aclog) return true;
	if (channelID === channels.betaSteamIDS) return true;
	if (channelID === channels.modlog) return true;
	if (channelID === channels.serverlog) return true;
	if (channelID === channels.setSpecialTitle) return true;
	if (channelID === channels.setTitle) return true;
	if (channelID === channels.showcase) return true;
	if (channelID === channels.suggestion) return true;
	//Else return false
	return false;
}
function numberWithSpaces(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}



client.login(require("./tokens.js").token);
