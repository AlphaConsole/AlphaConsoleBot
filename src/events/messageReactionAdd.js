/**
 * ! Message Reaction add event
 * 
 * ? This is triggered whenever a reaction has been added to a fetched message.
 * ? This is used for example to remove suggestions & showcases easily by ❌
 * ? But also purposes for other reasons
 */
const Discord = require('discord.js');

module.exports.run = (client, serverInfo, config, reaction, user, sendEmbed) => {

    if (reaction.message.guild.id !== serverInfo.guildId) return;
    if (user.bot) return;
    
    getRoles(user, serverInfo, client, member => {
        
        if (reaction.emoji.name === "❌" && member.isAdmin) {
            //* Showcase deletion
            if (reaction.message.channel.id === serverInfo.channels.showcase) {
                user.send(`Please respond with the reason why you deleted the showcase. \n**This reason will be logged & sent to the user** \nYou have 30 seconds to respond.`)
                .then(msg => {
                    msg.channel.awaitMessages(response => response.content, { max: 1, time: 30000, errors: ["time"] }).then(collected => {
                        let reason = collected.first().content;
                        handleMessage(client, serverInfo, user, reaction, reason, "Showcase", sendEmbed);
                    }).catch(e => {
                        let reason = "Unrelated to the channel's purpose.";
                        handleMessage(client, serverInfo, user, reaction, reason, "Showcase", sendEmbed);
                    })
                })
            }

            //* Suggestion deletion
            if (reaction.message.channel.id === serverInfo.channels.suggestion) {
                user.send(`Please respond with the reason why you deleted the shosuggestionwcase. \n**This reason will be logged & sent to the user** \nYou have 30 seconds to respond.`)
                .then(msg => {
                    msg.channel.awaitMessages(response => response.content, { max: 1, time: 30000, errors: ["time"] }).then(collected => {
                        let reason = collected.first().content;
                        handleMessage(client, serverInfo, user, reaction, reason, "Suggestion", sendEmbed);
                    }).catch(e => {
                        let reason = "Not a valid suggestion, already been suggested, or in violation of the information listed at the top of our suggestions channel.";
                        handleMessage(client, serverInfo, user, reaction, reason, "Suggestion", sendEmbed);
                    })
                })
            }
        }
    });
    
    
}

/**
 * 
 * @param {Collection} user 
 * @param {Object} serverInfo 
 * @param {Collection} client 
 * @param {Function} callback 
 */
function getRoles(user, serverInfo, client, callback) {
    client.guilds.get(serverInfo.guildId).members.fetch(user.id).then(m => {
        console.log("hmm");
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

        callback(m)
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
function handleMessage(client, serverInfo, user, reaction, reason, event, sendEmbed) {
    reaction.message.delete();
    sendEmbed(reaction.message.author, `Your ${event.toLowerCase()} was deleted by ${user.tag}`, `Reason: ${reason}`);

    const embedLog = new Discord.MessageEmbed()
    .setColor([255, 255, 0])
    .setAuthor(`${event.toUpperCase()} DELETED`, client.user.displayAvatarURL({ format: "png" }))
    .addField(`${event} by `,`${reaction.message.member} (${reaction.message.author.id})`);

    if (reaction.message.content.length != 0) embedLog.addField(`Content`, `${reaction.message.content}`);
    embedLog.addField(`Channel`, `${reaction.message.channel}`);
    embedLog.addField(`Deleted by`, `${user.tag}`);
    embedLog.addField("Reason:", reason);
    client.guilds.get(serverInfo.guildId).channels.get(serverInfo.channels.aclog).send(embedLog);
}