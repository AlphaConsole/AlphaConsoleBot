const Discord = require('discord.js');

module.exports.run = async(client, channels, message, connection, spammers, slowmode, callback) => {
    if (!message.channel.id.includes(channels.readThisChannel)) {

        CheckUserExistence(message, connection, function(UserInfo) {
            
            DateLastSaved = UserInfo.LastXP
            var Dnow = Date.now()
            var Diff = Dnow - DateLastSaved;
            var rounded = Math.round(Diff / 1000)

            if (rounded > 60) {

                var earnedXP = parseInt(getRandomIntInclusive(15,25))
                var oldXP = parseInt(UserInfo.XP);
                var newXP = parseInt(oldXP + earnedXP);
                var Level = UserInfo.XPLevel

                var oldMoney = parseInt(UserInfo.Currency);
                var newMoney = oldMoney + earnedXP

                if (oldXP < 100 && newXP > 99) // Level 1
                {
                    Level = '1'
                    //message.channel.sendMessage("<@" + message.author.id + "> is now level " + Level + "! :tada: ")
                }
                if (oldXP < 255 && newXP > 254) // Level 2
                {
                    Level = '2'
                    //message.channel.sendMessage("<@" + message.author.id + "> is now level " + Level + "! :tada: ")
                }
                if (oldXP < 475 && newXP > 474) // Level 3
                {
                    Level = '3'
                    //message.channel.sendMessage("<@" + message.author.id + "> is now level " + Level + "! :tada: ")
                }
                if (oldXP < 770 && newXP > 769) // Level 4
                {
                    Level = '4'
                    //message.channel.sendMessage("<@" + message.author.id + "> is now level " + Level + "! :tada: ")
                }
                if (oldXP < 1150 && newXP > 1149) // Level 5
                {
                    Level = '5'
                    //message.channel.sendMessage("<@" + message.author.id + "> is now level " + Level + "! :tada: ")
                }
                if (oldXP < 1625 && newXP > 1624) // Level 6
                {
                    Level = '6'
                    //message.channel.sendMessage("<@" + message.author.id + "> is now level " + Level + "! :tada: ")
                }
                if (oldXP < 2205 && newXP > 2204) // Level 7
                {
                    Level = '7'
                    //message.channel.sendMessage("<@" + message.author.id + "> is now level " + Level + "! :tada: ")
                }
                if (oldXP < 2900 && newXP > 2899) // Level 8
                {
                    Level = '8'
                    //message.channel.sendMessage("<@" + message.author.id + "> is now level " + Level + "! :tada: ")
                }
                if (oldXP < 3720 && newXP > 3719) // Level 9
                {
                    Level = '9'
                    //message.channel.sendMessage("<@" + message.author.id + "> is now level " + Level + "! :tada: ")
                }
                if (oldXP < 4675 && newXP > 4674) // Level 10
                {
                    Level = '10'
                    //message.channel.sendMessage("<@" + message.author.id + "> is now level " + Level + "! :tada: ")
                }
                if (oldXP < 5775 && newXP > 5774) // Level 11
                {
                    Level = '11'
                    //message.channel.sendMessage("<@" + message.author.id + "> is now level " + Level + "! :tada: ")
                }
                if (oldXP < 7030 && newXP > 7029) // Level 12
                {
                    Level = '12'
                    //message.channel.sendMessage("<@" + message.author.id + "> is now level " + Level + "! :tada: ")
                }
                if (oldXP < 8450 && newXP > 8449) // Level 13
                {
                    Level = '13'
                    //message.channel.sendMessage("<@" + message.author.id + "> is now level " + Level + "! :tada: ")
                }
                if (oldXP < 10045 && newXP > 10044) // Level 14
                {
                    Level = '14'
                    //message.channel.sendMessage("<@" + message.author.id + "> is now level " + Level + "! :tada: ")
                }
                if (oldXP < 11825 && newXP > 11824) // Level 15
                {
                    Level = '15'
                    //message.channel.sendMessage("<@" + message.author.id + "> is now level " + Level + "! :tada: ")
                }
                if (oldXP < 13800 && newXP > 13799) // Level 16
                {
                    Level = '16'
                    //message.channel.sendMessage("<@" + message.author.id + "> is now level " + Level + "! :tada: ")
                }
                if (oldXP < 15980 && newXP > 15979) // Level 17
                {
                    Level = '17'
                    //message.channel.sendMessage("<@" + message.author.id + "> is now level " + Level + "! :tada: ")
                }
                if (oldXP < 18375 && newXP > 18374) // Level 18
                {
                    Level = '18'
                    //message.channel.sendMessage("<@" + message.author.id + "> is now level " + Level + "! :tada: ")
                }
                if (oldXP < 20995 && newXP > 20994) // Level 19
                {
                    Level = '19'
                    //message.channel.sendMessage("<@" + message.author.id + "> is now level " + Level + "! :tada: ")
                }
                if (oldXP < 23850 && newXP > 23849) // Level 20
                {
                    Level = '20'
                    //message.channel.sendMessage("<@" + message.author.id + "> is now level " + Level + "! :tada: ")
                }
                if (oldXP < 26950 && newXP > 26949) // Level 21
                {
                    Level = '21'
                    //message.channel.sendMessage("<@" + message.author.id + "> is now level " + Level + "! :tada: ")
                }
                if (oldXP < 30305 && newXP > 30304) // Level 22
                {
                    Level = '22'
                    //message.channel.sendMessage("<@" + message.author.id + "> is now level " + Level + "! :tada: ")
                }
                if (oldXP < 33925 && newXP > 33924) // Level 23
                {
                    Level = '23'
                    //message.channel.sendMessage("<@" + message.author.id + "> is now level " + Level + "! :tada: ")
                }
                if (oldXP < 37820 && newXP > 37819) // Level 24
                {
                    Level = '24'
                    //message.channel.sendMessage("<@" + message.author.id + "> is now level " + Level + "! :tada: ")
                }
                if (oldXP < 42000 && newXP > 41999) // Level 25
                {
                    Level = '25'
                    //message.channel.sendMessage("<@" + message.author.id + "> is now level " + Level + "! :tada: ")
                }
                if (oldXP < 46475 && newXP > 46474) // Level 26
                {
                    Level = '26'
                    //message.channel.sendMessage("<@" + message.author.id + "> is now level " + Level + "! :tada: ")
                }
                if (oldXP < 51255 && newXP > 51254) // Level 27
                {
                    Level = '27'
                    //message.channel.sendMessage("<@" + message.author.id + "> is now level " + Level + "! :tada: ")
                }
                if (oldXP < 56350 && newXP > 56349) // Level 28
                {
                    Level = '28'
                    //message.channel.sendMessage("<@" + message.author.id + "> is now level " + Level + "! :tada: ")
                }
                if (oldXP < 61770 && newXP > 61769) // Level 29
                {
                    Level = '29'
                    //message.channel.sendMessage("<@" + message.author.id + "> is now level " + Level + "! :tada: ")
                }
                if (oldXP < 67525 && newXP > 67524) // Level 30
                {
                    Level = '30'
                    //message.channel.sendMessage("<@" + message.author.id + "> is now level " + Level + "! :tada: ")
                }
                if (oldXP < 73625 && newXP > 73624) // Level 31
                {
                    Level = '31'
                    //message.channel.sendMessage("<@" + message.author.id + "> is now level " + Level + "! :tada: ")
                }
                if (oldXP < 80080 && newXP > 80079) // Level 32
                {
                    Level = '32'
                    //message.channel.sendMessage("<@" + message.author.id + "> is now level " + Level + "! :tada: ")
                }
                if (oldXP < 86900 && newXP > 86899) // Level 33
                {
                    Level = '33'
                    //message.channel.sendMessage("<@" + message.author.id + "> is now level " + Level + "! :tada: ")
                }
                if (oldXP < 94095 && newXP > 94094) // Level 34
                {
                    Level = '34'
                    //message.channel.sendMessage("<@" + message.author.id + "> is now level " + Level + "! :tada: ")
                }
                if (oldXP < 101675 && newXP > 101674) // Level 35
                {
                    Level = '35'
                    //message.channel.sendMessage("<@" + message.author.id + "> is now level " + Level + "! :tada: ")
                }
                if (oldXP < 109650 && newXP > 109649) // Level 36
                {
                    Level = '36'
                    //message.channel.sendMessage("<@" + message.author.id + "> is now level " + Level + "! :tada: ")
                }
                if (oldXP < 118030 && newXP > 118029) // Level 37
                {
                    Level = '37'
                    //message.channel.sendMessage("<@" + message.author.id + "> is now level " + Level + "! :tada: ")
                }
                if (oldXP < 126825 && newXP > 126824) // Level 38
                {
                    Level = '38'
                    //message.channel.sendMessage("<@" + message.author.id + "> is now level " + Level + "! :tada: ")
                }
                if (oldXP < 136045 && newXP > 136044) // Level 39
                {
                    Level = '39'
                    //message.channel.sendMessage("<@" + message.author.id + "> is now level " + Level + "! :tada: ")
                }
                if (oldXP < 145700 && newXP > 145699) // Level 40
                {
                    Level = '40'
                    //message.channel.sendMessage("<@" + message.author.id + "> is now level " + Level + "! :tada: ")
                }

                var SQL = "update `JHZER-Members` set XP = '" + newXP + "', LastXP = '" + Date.now() + "', XPLevel = '" + Level + "', Currency = '" + newMoney + "' where DiscordID='" + message.author.id + "'"
                connection.query(SQL, function(error){
                    if(error)
                    {
                        console.log(error);

                    }
                })
            }
        });
    }

    if(message.channel.id.includes('377909590186131468')) {
        if(new RegExp("([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?").test(message.content)) {
            if (!hasRole(message.member, 'Moids') && !hasRole(message.member, 'Moidmins') && !hasRole(message.member, 'JHZER')) {
                message.author.send("No links allowed in this chat!\nPlease use the channels accordingly (like #promotion, #memes etc..)")
                return message.delete();
            }
        }
    }

    if (spammers[message.author.id] == undefined) {
        spammers[message.author.id] = new Date().getTime() + slowmode * 1000;
      } else {
        if (spammers[message.author.id] < new Date().getTime()) {
          spammers[message.author.id] = new Date().getTime() + slowmode * 1000;
        } else {
          if (!hasRole(message.member, 'Moidmins') && !hasRole(message.member,'JHZER') && !hasRole(message.member, 'Moids')) {
            message.delete();        
          }
        }
    }
    callback(spammers);
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