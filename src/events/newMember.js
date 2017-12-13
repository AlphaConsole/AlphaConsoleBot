const Discord = require('discord.js');

module.exports.run = async(client, serverInfo, member) => {
    client.guilds.get(serverInfo.guildId).channels.get(serverInfo.serverlogChannel).send(":white_check_mark: `["+ new Date().toTimeString().split(' ')[0] +"]` **" + member.user.tag + "** joined the guild. Total members: **" + numberWithSpaces(client.guilds.get(serverInfo.guildId).members.size) + "**");

    //Let's first check if the user even exists in the db
    sql.get(`select * from Members where DiscordID = '${member.user.id}'`).then(row => {
        if (!row) {
            var today = new Date().getTime();
            sql.run(`Insert into Members(DiscordID, Username, JoinedDate)VALUES('${member.user.id}', '${mysql_real_escape_string(member.user.username)}', '${today}')`)
                .catch(err => console.log(err));
        }
    }).catch(err => console.log(err))
};


function numberWithSpaces(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}


function mysql_real_escape_string (str) {
    return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
        switch (char) {
            case "\0":
                return "\\0";
            case "\x08":
                return "\\b";
            case "\x09":
                return "\\t";
            case "\x1a":
                return "\\z";
            case "\n":
                return "\\n";
            case "\r":
                return "\\r";
            case "\"":
            case "'":
            case "\\":
            case "%":
                return "\\"+char; // prepends a backslash to backslash, percent,
                                  // and double/single quotes
        }
    });
}