const Discord = require('discord.js');

module.exports.run = async(client, channels, message, connection, spammers, slowmode, callback) => {

}

//Functions used to check if a player has the desired role
function pluck(array) {
    return array.map(function(item) { return item["name"]; });
}
function hasRole(mem, role)
{
    if (pluck(mem.roles).includes(role))
    {
        return true;
    } else {
        return false;
    }

}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


  
function CheckUserExistence(message, connection, callback) {
    
    connection.query("select * from `JHZER-Members` where DiscordID = '" + message.author.id + "'", function (error, result) {
      if (error) {
        console.log(error);
        message.channel.send('An error occured. <@149223090134450177> has been notified!');
      } else {
          if (result.length == 0) {
          today = new Date();
          todayMSeconds = today.getTime();
  
          connection.query("insert into `JHZER-Members` (DiscordID, JoinedDate, MutedUntil) VALUES ('" + message.author.id + "', '" + todayMSeconds + "', null)", function (error1) {
            if (error1) {
              console.log(error1);
              message.channel.send('An error occured. <@149223090134450177> has been notified!');
            } else {
              CheckUserExistence(message, connection, callback);
            }
          })
  
        } else {
          callback(result[0]);
        }
      }
    });
}