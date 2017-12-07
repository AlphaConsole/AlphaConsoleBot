const getUrls = require('get-urls');

module.exports.run = async (client, message) => {
    if (!hasRole(message.member, 'Moidmins') && !hasRole(message.member,'JHZER') && !hasRole(message.member, 'Moids')) {
        var urlsArray = getUrls(message.content);
        var triggered = 0;
        urlsArray.forEach(element => {
          if (element.includes('youtube.com/watch?v=') || element.includes('imgur.com') || element.includes('rocketleague.com') || element.includes('gfycat.com') || element.includes('reddit.com') || element.includes('youtu.be/') || element.includes('twitch.tv/') || element.includes('giphy.com')) {

          } else {
            triggered = 1;
          }
        });

        if (triggered == 1) {
          message.delete();
          message.author.send('Only whitelisted links allowed.\nThese links are:\n- Youtube\n- Imgur\n- RocketLeague\n- gfycant\n- Giphy\n- Reddit\n- Twitch');
        }
    }
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

//Simple function to check if they are numbers
function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}