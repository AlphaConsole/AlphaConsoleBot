const Discord = require('discord.js');

module.exports = {
    title: "messageReactionAdd",
    description: "Event when a new reaction has been added for like `#Showcase` & `#Suggestions`",
    
    run: async(client, serverInfo, reaction, user) => {
    
        if (reaction._emoji.name == "❌") {
            if (hasRole(client.guilds.get(serverInfo.guildId).members.get(user.id), "Developer") || hasRole(client.guilds.get(serverInfo.guildId).members.get(user.id), "Admin")) {
                reaction.message.delete();
                const embed = new Discord.MessageEmbed()
                .setColor([255,255,0])
                .setAuthor(`Your suggestion was deleted by ${user.username}`, serverInfo.logo)
                .setDescription("It was not a valid suggestion, it has already been suggested, or it was in violation of the information listed at the top of our suggestions channel.\n Please read this information carefully if you intend to submit another suggestion in the future.") 
                reaction.message.author.send(embed);

                const embedLog = new Discord.MessageEmbed()
                .setColor([255,255,0])
                .setAuthor(`SUGGESTION / SHOWCASE DELETED`, serverInfo.logo)
                .addField(`Suggested by `, `${reaction.message.member} (${reaction.message.author.id})`)

                if (reaction.message.content.length != 0) {
                    embedLog.addField(`Content`, `${reaction.message.content}`)
                }
                embedLog.addField(`Channel`, `${reaction.message.channel}`)
                embedLog.addField(`Deleted by`, `${user.username}`)
                reaction.message.guild.channels.get(serverInfo.aclogChannel).send(embedLog)
            }
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