//Main file for AlphaConsole Discord Bot

//const
const Discord = require("discord.js");
const keys = require("../src/tokens.js");
const client = new Discord.Client();
const sql = require("sqlite");
sql.open("src/sqlite/Bot.db");

//vars
var AllowedLinksSet = new Set();
var SwearWordsSet = new Set();
var AutoResponds = new Map();
var Commands = [];
var Events = [];
var blackListedWords = [];
//anti-spam
var authors = [];
var messagelog = [];
var warned = [];
var banned = [];
var permits = [];
//server information
var serverInfoPath = process.argv
  .slice(2)
  .pop()
  .replace("-serverfile=", "");
var serverInfo = require(serverInfoPath).serverInfo;

//---------------------------//
//      Client Events        //
//---------------------------//

//Bot logs in
client.on("ready", () => {
  require("./events/ready.js").run(
    client,
    serverInfo,
    sql,
    AllowedLinksSet,
    AutoResponds,
    Commands,
    Events,
    SwearWordsSet,
    blackListedWords
  );
  require("./events/TitleCleanUp.js").run(client, serverInfo, sql);
  //require('./events/updatePartners.js').run(client, serverInfo, sql);
});

//New member joins
client.on("guildMemberAdd", member => {
  require("./events/newMember.js").run(client, serverInfo, member, sql);
});

//User Left / kicked
client.on("guildMemberRemove", member => {
  require("./events/guildMemberRemove.js").run(client, serverInfo, member, sql);
});

//Voice users update
client.on("voiceStateUpdate", (oldMember, newMember) => {
  require("./events/voiceChannelUpdate.js").run(
    client,
    serverInfo,
    oldMember,
    newMember
  );
});

//User Info changed
client.on("guildMemberUpdate", (oldMember, newMember) => {
  require("./events/guildMemberUpdate.js").run(
    client,
    serverInfo,
    oldMember,
    newMember,
    sql,
    keys
  );
});

//Personal Info changed
client.on("userUpdate", (oldMember, newMember) => {
  require("./events/userUpdate.js").run(
    client,
    serverInfo,
    oldMember,
    newMember
  );
});

//User Info changed
client.on("messageDelete", message => {
  require("./events/messageDelete.js").run(client, serverInfo, message);
});

//React has been added
client.on("messageReactionAdd", (reaction, user) => {
  require("./events/messageReactionAdd.js").run(
    client,
    serverInfo,
    reaction,
    user,
    sql
  );
});

//Message Updated - Run checks for links / blacklisted. Spam check not needed since it's not a new message.
client.on("messageUpdate", async (originalMessage, newMessage) => {
  messageProcess(newMessage);
});

client.on("guildBanAdd", (guild, user) => {
  require("./events/banAdd.js").run(client, serverInfo, user, sql);
});

//Outputs unhandles promises
process.on("unhandledRejection", (reason, p) => {
  console.log("Unhandled Rejection at: Promise", p, "reason:", reason);
  //client.users.get("136607366408962048").send(`Unhandled Rejection at: Promise ${p} \n reason: ${reason}`);
});

//--------------------------//
//    ALL MESSAGE EVENTS    //
//--------------------------//

client.on("message", async message => {
  //Note from Nameless,
  // Calls function below to process the message, this means it can be used in messageUpdate event just above to
  // run the exact same checks for commands, words, all sorts when edited.

  messageProcess(message);
});

//--------------------------//
//   DO MESSAGE FUNCTIONS   //
//--------------------------//

async function messageProcess(message) {
  if (message.author.bot) return;

  var args = message.content.split(/[ ]+/);

  if (message.channel.type != "dm") {
    await message.guild.members.fetch(message.author.id).then(m => {
      message.member = m;

      require("./events/newMessage.js").run(
        client,
        serverInfo,
        sql,
        message,
        args,
        AllowedLinksSet,
        AutoResponds,
        SwearWordsSet,
        permits
      );
      require("./events/spamCheck.js").run(
        client,
        serverInfo,
        message,
        authors,
        messagelog,
        warned,
        banned,
        sql
      );

      /// USER COMMANDS
      // Bot-Spam: Self-Assign role
      if (args[0].toLowerCase() == "!role") {
        require("./cmds/role.js").run(client, serverInfo, sql, message, args);
      }

      if (args[0].toLowerCase() == "!serverinfo") {
        require("./cmds/serverinfo.js").run(
          client,
          serverInfo,
          sql,
          message,
          args
        );
      }

      if (args[0].toLowerCase() == "!roleinfo") {
        require("./cmds/roleinfo.js").run(
          client,
          serverInfo,
          sql,
          message,
          args
        );
      }

      //Help command
      if (args[0].toLowerCase() == "!help" || args[0].toLowerCase() == "!h") {
        require("./cmds/helpPublic.js").run(
          client,
          serverInfo,
          message,
          args,
          Commands
        );
      } else if (
        args[0].toLowerCase() == "!set" ||
        args[0].toLowerCase() == "!override"
      ) {
        //Title commands
        require("./cmds/titles.js").run(
          client,
          serverInfo,
          message,
          blackListedWords,
          args,
          sql
        );
      } else if (args[0].toLowerCase() == "!disable") {
        require("./cmds/disable.js").run(client, serverInfo, message, args);
      } else if (args[0].toLowerCase() == "!events") {
        require("./cmds/events.js").run(
          client,
          serverInfo,
          message,
          args,
          Events
        );
      } else if (args[0].toLowerCase() == "!addcom") {
        /// STAFF COMMANDS
        //Staff Custom Commands add
        require("./cmds/addcom.js").run(client, serverInfo, sql, message, args);
      } else if (args[0].toLowerCase() == "!editcom") {
        //Staff Custom Commands edit
        require("./cmds/editcom.js").run(
          client,
          serverInfo,
          sql,
          message,
          args
        );
      } else if (args[0].toLowerCase() == "!delcom") {
        //Staff Custom Commands delete
        require("./cmds/delcom.js").run(client, serverInfo, sql, message, args);
      } else if (args[0].toLowerCase() == "!listcoms") {
        //Staff Custom Commands list
        require("./cmds/listcoms.js").run(
          client,
          serverInfo,
          sql,
          message,
          args
        );
      } else if (args[0].toLowerCase() == "!usercount") {
        //Staff usercount command
        require("./cmds/usercount.js").run(
          client,
          serverInfo,
          sql,
          message,
          args
        );
      } else if (args[0].toLowerCase() == "!lastseen") {
        //Last Seen
        require("./cmds/lastseen.js").run(client, serverInfo, message, args);
      } else if (args[0].toLowerCase() == "!mute") {
        /// SUPPORT COMMANDS
        //Support mute command
        require("./cmds/mute.js").run(client, serverInfo, sql, message, args);
      } else if (args[0].toLowerCase() == "!unmute") {
        //Support unmute command
        require("./cmds/unmute.js").run(client, serverInfo, sql, message, args);
      } else if (args[0].toLowerCase() == "!warn") {
        //Support warn command
        require("./cmds/warn.js").run(client, serverInfo, sql, message, args);
      } else if (args[0].toLowerCase() == "!check") {
        //Support check command
        require("./cmds/check.js").run(client, serverInfo, sql, message, args);
      } else if (args[0].toLowerCase() == "!case") {
        //Support check command
        require("./cmds/case.js").run(client, serverInfo, sql, message, args);
      } else if (args[0].toLowerCase() == "!cases") {
        //Support check command
        require("./cmds/cases.js").run(
          client,
          serverInfo,
          sql,
          message,
          args,
          keys
        );
      } else if (args[0].toLowerCase() == "!checkdb") {
        //Support checkdb for titles command
        require("./cmds/checkdb.js").run(client, serverInfo, message, args);
      } else if (args[0].toLowerCase() == "!kick") {
        /// MODERATOR COMMANDS
        //Moderator kick command
        require("./cmds/kick.js").run(client, serverInfo, sql, message, args);
      } else if (args[0].toLowerCase() == "!ban") {
        //Moderator ban command
        require("./cmds/ban.js").run(client, serverInfo, sql, message, args);
      } else if (args[0].toLowerCase() == "!auto") {
        //Moderator auto respond command
        require("./cmds/auto.js").run(
          client,
          serverInfo,
          sql,
          message,
          args,
          AutoResponds
        );
      } else if (args[0].toLowerCase() == "!swearwords") {
        //Moderator swear words command
        require("./cmds/swearwords.js").run(
          client,
          serverInfo,
          sql,
          message,
          args,
          SwearWordsSet
        );
      } else if (args[0].toLowerCase() == "!togglelinks") {
        //Moderator togglelinks command
        require("./cmds/togglelinks.js").run(
          client,
          serverInfo,
          sql,
          message,
          args,
          AllowedLinksSet
        );
      } else if (args[0].toLowerCase() == "!permit") {
        //Moderator permit command
        require("./cmds/permit.js").run(
          client,
          serverInfo,
          sql,
          message,
          args,
          permits
        );
      } else if (args[0].toLowerCase() == "!purge") {
        //Moderator purge command
        require("./cmds/purge.js").run(client, serverInfo, message, args);
      } else if (args[0].toLowerCase() == "!listroles") {
        //Moderator listroles command
        require("./cmds/listroles.js").run(
          client,
          serverInfo,
          sql,
          message,
          args
        );
      } else if (args[0].toLowerCase() == "!nick") {
        //Moderator nick command
        require("./cmds/nick.js").run(client, serverInfo, sql, message, args);
      } else if (args[0].toLowerCase() == "!status") {
        /// ADMIN COMMANDS
        //Admin Bot Status
        require("./cmds/status.js").run(client, serverInfo, sql, message, args);
      } else if (args[0].toLowerCase() == "!lockdown") {
        //Disables all channels which rely on the bot heavily. (#set-title, special title, etc)
        require("./cmds/lockdown.js").run(client, serverInfo, message, args);
      } else if (args[0].toLowerCase() == "!unlock") {
        require("./cmds/unlockdown.js").run(client, serverInfo, message, args);
      } else if (args[0].toLowerCase() == "!blacklist") {
        require("./cmds/blacklist.js").run(
          client,
          serverInfo,
          message,
          args,
          sql,
          blackListedWords
        );
      } else if (args[0].toLowerCase() == "!update") {
        require("./cmds/update.js").run(client, serverInfo, message, args);
      } else if (args[0].toLowerCase() == "!betaids") {
        require("./cmds/betaids.js").run(
          client,
          serverInfo,
          message,
          args,
          sql
        );
      } else if (args[0].toLowerCase() == "!startgiveaway") {
        require("./cmds/startgiveaway.js").run(
          client,
          serverInfo,
          message,
          args,
          sql
        );
      } else if (args[0].toLowerCase() == "!togglelegacy") {
        require("./cmds/togglelegacy.js").run(
          client,
          serverInfo,
          message,
          args,
          sql
        );
      } else if (args[0].toLowerCase() == "!partner") {
        //Admin partner command - only works in serverInfo.editPartnerChannel
        require("./cmds/partner.js").run(
          client,
          serverInfo,
          sql,
          message,
          args
        );
      } else if (args.length == 2) {
        //For commands with 2 args.
        if (
          args[0].toLowerCase() == "!get" &&
          args[1].toLowerCase() == "title"
        ) {
          require("./cmds/getTitle.js").run(client, serverInfo, message, args);
        }
      }

      //Keep #Set-title clean
      if (
        message.channel.id == serverInfo.setTitleChannel ||
        message.channel.id == serverInfo.setSpecialTitleChannel
      ) {
        if (args[0].toLowerCase() != "!override") {
          message.delete().catch(console.error);
        }
      }
    });
  } else {
    /// ALL DM COMMANDS

    if (args[0].toLowerCase() == "!help" || args[0].toLowerCase() == "!h") {
      require("./cmds/help.js").run(
        client,
        serverInfo,
        message,
        args,
        Commands
      );
    } else if (args[0].toLowerCase() == "!s") {
      require("./cmds/sendmessage.js").run(client, serverInfo, message, args);
    }
  }

  return;
}

var schedule = require("node-schedule");

var a = schedule.scheduleJob({ second: 1 }, function() {
  require("./events/minuteCheck.js").run(client, serverInfo, sql);
});

var b = schedule.scheduleJob({ minute: 1 }, function() {
  require("./events/StatusUpdate.js").run(client, serverInfo, sql);
  require("./events/TitleCleanUp.js").run(client, serverInfo, sql);
});

var b = schedule.scheduleJob({ minute: 31 }, function() {
  require("./events/StatusUpdate.js").run(client, serverInfo, sql);
  require("./events/TitleCleanUp.js").run(client, serverInfo, sql);
});

var c = schedule.scheduleJob({ hour: 9, minute: 40 }, function() {
  require("./events/DailyStats.js").run(client, serverInfo, sql);
});

var d = schedule.scheduleJob({ date: 1, hour: 17 }, function() {
  require("./events/legacygiveaway.js").run(client, serverInfo, sql);
});

var e = schedule.scheduleJob({ date: 16, hour: 17 }, function() {
  require("./events/legacygiveaway.js").run(client, serverInfo, sql);
});

client.login(require("./tokens.js").TestBotToken);
