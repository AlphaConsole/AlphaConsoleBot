module.exports.run = async(client, serverInfo, oldMember, newMember) => {
    if (newMember.voiceChannel) {
        if(newMember.voiceChannel.parentID == serverInfo.DynamicCat) {
          if(newMember.voiceChannel.members.array().length == 1) {
            Extra = 0;
            client.guilds.get(serverInfo.guildId).channels.forEach(channel => {
              if (channel.parentID == serverInfo.DynamicCat) {
                if (channel.members.array().length == 0) {
                  if (Extra == 1) {
                    channel.delete();
                  } else {
                    Extra = 1;
                  }
                }
              }
            });
            if (Extra == 0) {
              newMember.guild.createChannel("🎮 Game Channel", "voice", {parent: serverInfo.DynamicCat});
            }
          }
        }
      }
    
      if (oldMember.voiceChannel) {
        if(oldMember.voiceChannel.parentID == serverInfo.DynamicCat) {
          if(oldMember.voiceChannel.members.array().length == 0) {
            Extra = 0;
            client.guilds.get(serverInfo.guildId).channels.forEach(channel => {
              if (channel.parentID == serverInfo.DynamicCat) {
                if (channel.members.array().length == 0) {
                  if (Extra == 1) {
                    if (channel) {
                      channel.delete();
                    }              } else {
                    Extra = 1;
                  }
                }
              }
            });
            if (Extra == 0) {
              oldMember.guild.createChannel("🎮 Game Channel", "voice", {userLimit: 2, parent: serverInfo.DynamicCat});
            }
          }
        }
      }
}