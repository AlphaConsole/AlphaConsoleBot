/**
 * ! Case command
 * 
 * ? Kinda obvious, too lazy to write anything smart anyway
 * ? We also have command description for a reason. So I actually don't know why I added this here. Welp...
 */
const Discord = require('discord.js');

module.exports = {
     title: "Case",
     details: [
        {
            perms      : "Support",
            command    : "!Case <Number>",
            description: "Shows all details of a case"
        },
        {
            perms      : "Support",
            command    : "!Case edit <Number> <Reason>",
            description: "Changes the reason of a case"
        },
        {
            perms      : "Support",
            command    : "!Case remove <Number>",
            description: "Removes the case"
        }
    ],

    run: ({ client, serverInfo, message, args, sql, config, sendEmbed }) => {

        if (!message.member.isSupport) return;

        if (args.length === 2) {
            let caseId = args[1];

            sql.query("Select * from Logs where ID = ?", [ caseId ], (err, res) => {
                if (err) {
                    let errorCode = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
                    console.error(`Error code ${errorCode} by ${message.author.tag}`, err);
                    return sendEmbed(message.author, "🚫 An error occurred. Please contact Pollie#0001. Error code: `" + errorCode + "`");
                }

                let row = res[0];
                if (row) {
                    const embed = new Discord.MessageEmbed()
                        .setColor([255, 255, 0])
                        .setAuthor(`Case check`, serverInfo.logo)
                        .addField(`Case ID`, row.ID, true)
                        .addField(`Member`, `<@${row.Member}>`, true)
                        .addField(`Action`, capitalizeFirstLetter(row.Action))
                        .addField(`Reason`, row.Reason, true);

                    if (row.Value != null) {
                        if (row.Value == 0) embed.addField(`Time`, "Permanent", true)
                        else embed.addField(`Time`, dhm(row.Value), true);
                    }

                    embed.setThumbnail("https://upload.wikimedia.org/wikipedia/commons/c/c4/600_px_Transparent_flag.png");
                    embed.addField("Case by", `<@${row.Moderator}>`, true);
                    embed.addField("At channel", `<#${row.ChannelID}>`, true);

                    var date = new Date(parseInt(row.Time));
                    embed.setFooter(`Time of case`)
                    embed.setTimestamp(date)
                    message.channel.send(embed);
                } else {
                    sendEmbed(message.channel, "Case not found.")
                }
            })
        } else if (args.length > 2 && args[1].toLowerCase() === "edit") {

            let caseId = args[2];
            let reason = "";
            for (i = 3; i < args.length; i++) reason += args[i] + " ";
            if (reason === "") reason = "No reason provided";

            sql.query("Update Logs set Reason = ? where ID = ?", [ reason, caseId ], (err, res) => {
                if (err) {
                    let errorCode = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
                    console.error(`Error code ${errorCode} by ${message.author.tag}`, err);
                    return sendEmbed(message.author, "🚫 An error occurred. Please contact Pollie#0001. Error code: `" + errorCode + "`");
                }

                if (res.affectedRows === 0) 
                    sendEmbed(message.channel, "No case found with this id.")
                else
                    sendEmbed(message.channel, `Case ${caseId} updated!`)
            })

        } else if (args.length > 2 && (args[1].toLowerCase() === "remove" || args[1].toLowerCase() === "delete")) {

            let caseId = args[2];

            sql.query("delete from Logs where ID = ?", [ caseId ], (err, res) => {
                if (err) {
                    let errorCode = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
                    console.error(`Error code ${errorCode} by ${message.author.tag}`, err);
                    return sendEmbed(message.author, "🚫 An error occurred. Please contact Pollie#0001. Error code: `" + errorCode + "`");
                }

                if (res.affectedRows === 0) 
                    sendEmbed(message.channel, "No case found with this id.")
                else
                    sendEmbed(message.channel, `Case ${caseId} deleted!`)
            })

        } else {
            sendEmbed(message.channel, "You must have forgotten the case id.", "`!Case <Number>`")
        }

    }
};

function dhm(t){
    var cd = 24 * 60 * 60 * 1000,
        ch = 60 * 60 * 1000,
        d = Math.floor(t / cd),
        h = Math.floor( (t - d * cd) / ch),
        m = Math.round( (t - d * cd - h * ch) / 60000),
        pad = function(n){ return n < 10 ? '0' + n : n; };
  if( m === 60 ){
    h++;
    m = 0;
  }
  if( h === 24 ){
    d++;
    h = 0;
  }
  return `${d}d ${pad(h)}h ${pad(m)}m`
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}