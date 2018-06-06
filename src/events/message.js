/**
 * ! New message event
 * 
 * ? Every single message being sent is being validated by this file
 * ? For example checking for links, checking for swear words etc...
 */

 module.exports.run = ({ client, serverInfo, message, sql, config, sendEmbed }) => {

    //* Swear words filter
    if (!message.member.isStaff) {
        for (let i = 0; i < config.swearwords.length; i++) {
            if (message.content.includes(config.swearwords[i])) {
                message.delete().catch(e => { });
            }
        }
    }

    //* Links filter
    if (!message.member.isCH) {
        if (!(config.permits[message.author.id] && config.permits[message.author.id].channel === message.channel.id && config.permits[message.author.id].until > new Date().getTime())) {
            if (!config.whitelistedLinksChannel.includes(message.channel.id)) {
                let matches = message.content.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/ig));
                let filtered = matches ? matches.filter(m => !m.endsWith("discord.gg/alphaconsole")) : null;

                if (filtered && filtered[0]) {
                    message.delete().catch(e => { });
                    sendEmbed(message.author, "Links are not allowed in this channel.")
                }
            }
        }
    }

    //* Invite guard
    if (!message.member.isAdmin) {
        if (!(config.permits[message.author.id] && config.permits[message.author.id].channel === message.channel.id && config.permits[message.author.id].until > new Date().getTime())) {
            if ((message.content.includes("discord.me/") || message.content.includes("discord.gg/") || message.content.includes("discordapp.com/invite/"))
                && !message.content.includes("discord.gg/alphaconsole")) {

                message.delete().catch(e => { });
                sendEmbed(message.author, "Discord invites are not allowed in this channel")
            }
        }
    }

    //* Auto responds
    if (!message.member.isStaff) {
        for (const word in config.autoResponds) {
            if (config.autoResponds.hasOwnProperty(word)) {
                let words = word.split(/[ ]+/);
                let counter = 0;

                for (let i = 0; i < words.length; i++) {
                    if (message.content.includes(words[i])) counter++;
                }

                if (counter == words.length) {
                    message.channel.send(`${message.member}, ${config.autoResponds[word]}`)
                }
                
            }
        }
    }

 }