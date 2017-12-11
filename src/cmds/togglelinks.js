const Discord = require('discord.js');

module.exports.run = async(client, serverInfo, sql, message ,args, DisabledLinksSet) => {
    if(hasRole(message.member, 'Support') || hasRole(message.member, "Moderator") || hasRole(message.member, "Admin") || hasRole(message.member, "Developer")) {
        
        sql.get(`Select * from DisabledLinks where ChannelID = ${message.channel.id}`).then(row => {
            if (row) {
                sql.run(`Delete from DisabledLinks where ChannelID = ${message.channel.id}`)

                DisabledLinksSet.delete(message.channel.id)

                const embed = new Discord.MessageEmbed()
                .setColor([255,255,0])
                .setTitle("Links are now allowed in this channel") 
                message.channel.send(embed)
            } else {
                sql.run(`Insert into DisabledLinks(ChannelID) VALUES ('${message.channel.id}')`)

                DisabledLinksSet.add(message.channel.id)

                const embed = new Discord.MessageEmbed()
                .setColor([255,255,0])
                .setTitle("Links are no longer allowed in this channel") 
                message.channel.send(embed)
            }
        })

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