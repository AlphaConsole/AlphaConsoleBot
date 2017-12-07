const Discord = require('discord.js');


module.exports.run = async(client, channels, connection, callback) => {
    connection.query("select * from `JHZER-Members` where MutedUntil is not null", function (error, result) {
        if (error) {
          console.log(error);
        } else {
          result.forEach(MutedPerson => {
    
            now = new Date().getTime();
            if (MutedPerson.MutedUntil < now) {
              let TheRole = client.guilds.get(channels.guildID).roles.find('name', 'Muted');
              let TheUser = client.guilds.get(channels.guildID).members.get(MutedPerson.DiscordID);
    
              if (TheUser != undefined) {
                TheUser.removeRole(TheRole);
              }
              connection.query("update `JHZER-Members` set MutedUntil = null where ID = '" + MutedPerson.ID + "'", function (error, result) {
                if (error) {
                  console.log(error);
                }
              })
            }
          });
        }
    })
}

function numberWithSpaces(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}