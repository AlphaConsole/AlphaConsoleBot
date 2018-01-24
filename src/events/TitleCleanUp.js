module.exports = {
    title: "TitleCleanUp",
    description: "Cleans up the #set-title every 30 mins",
    
    run: async(client, serverInfo, sql) => {
 
        client.guilds.get(serverInfo.guildId).channels.get(serverInfo.setTitleChannel).messages.fetch().then(messages => {
            for (var message of messages.values()) {
                if (message.author.id !== client.user.id && message.author.id !== "345769053538746368" && !hasRole(message.member, "Admin") && !hasRole(message.member, "Developer")) {
                    if (message.author.id !== "181076473757696000")
                        message.delete();
                }
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