/**
 * ! Message Reaction add event
 *
 * ? This is triggered whenever a reaction has been added to a fetched message.
 * ? This is used for example to remove suggestions & showcases easily by ❌
 * ? But also purposes for other reasons
 */
const Discord = require("discord.js");
const request = require("request");
var cooldown = {};

module.exports.run = (
  client,
  serverInfo,
  config,
  reaction,
  user,
  sendEmbed,
  messageProcess
) => {
  if (reaction.message.guild.id !== serverInfo.guildId) return;
  if (user.bot) return;
  getRoles(user, serverInfo, client, member => {
    if (reaction.emoji.id == serverInfo.runCommandEmoji) {
      config.sql.query("Select * from reactions where messageID = ?", [reaction.message.id], (err, res) => {
        if (res.length != 0 && res[0].processed === true) return;
        if (member.isModerator || member.isAdmin) {
          //* Runs if the user is a mod and changes the author for easy logging
          let newCol = reaction.message;
          newCol.author = member
          return messageProcess(newCol);
        } else if (member.isSupport) {
            if (member.id === "408260674943451137") { //Do for joey counting as 2, since one was already set, no matter what it's two
              return config.sql.query(`UPDATE reactions set nOfSupports = ?`, [res[0].nOfSupports - 2], (err, res) => {
                if (err) console.log(err);
              });
            } else if(member.id != "408260674943451137") {
              return config.sql.query(`UPDATE reactions set nOfSupports = ?`, [res[0].nOfSupports - 1], (err, res) => {
                if (err) console.log(err);
              });
            }         
        }
      });
    }
  });
};

/**
 *
 * @param {Collection} user
 * @param {Object} serverInfo
 * @param {Collection} client
 * @param {Function} callback
 */
function getRoles(user, serverInfo, client, callback) {
  client.guilds
    .get(serverInfo.guildId)
    .members.fetch(user.id)
    .then(m => {

      if (m.roles.cache.has(serverInfo.roles.admin))
        m.isAdmin = true;
      else m.isAdmin = false;

      if (m.roles.cache.has(serverInfo.roles.moderator) || m.isAdmin)
        m.isModerator = true;
      else m.isModerator = false;

      if (m.roles.cache.has(serverInfo.roles.support) || m.isModerator)
        m.isSupport = true;
      else m.isSupport = false;

      if (m.roles.cache.has(serverInfo.roles.staff) || m.isSupport) m.isStaff = true;
      else m.isStaff = false;

      if (m.roles.cache.has(serverInfo.roles.ch) || m.isStaff) m.isCH = true;
      else m.isCH = false;

      callback(m);
    });
}

/**
 * @param {Collection} client
 * @param {Object} serverInfo
 * @param {Collection} user
 * @param {Collection} reaction
 * @param {String} reason
 * @param {String} event
 * @param {Function} sendEmbed
 */
function sendMessages(user, data, serverInfo, sql, errChannel) {
  // format fo messages {type: "", content: "", url: "", react: bool, id: ""}
  // if react then is partner message, and update db to new message id where message.id

  return new Promise((resolve, reject) => {
    var chain = Promise.resolve();
    for (let message of data.messages) {
      chain = chain.then(() => {
        switch (message.type) {
          case "hybrid":
            return user.send(message.content, {
              files: [message.url]
            });
          case "file":
            return user.send("", {
              files: [message.url]
            });
          case "text":
            return user.send(message.content);
          default:
            reject(
              "A Message Type error has occurred. Please contact an AlphaConsole Admin!"
            );
        }
      });
    }
    chain = chain.then(resolve()).catch(err => reject(err));
  });
}
