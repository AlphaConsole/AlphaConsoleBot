module.exports.run = async(client, channels, oldMember, newMember) => {
    if (newMember.voiceChannel) {
        if(newMember.voiceChannel.parentID == channels.Cat2s) {
          if(newMember.voiceChannel.members.array().length == 1) {
            Extra = 0;
            client.guilds.get(channels.guildID).channels.forEach(channel => {
              if (channel.parentID == channels.Cat2s) {
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
              newMember.guild.createChannel("🚀 Limited 2v2", "voice", {userLimit: 2, parent: channels.Cat2s});
            }
          }
        }
        if(newMember.voiceChannel.parentID == channels.Cat3s) {
          if(newMember.voiceChannel.members.array().length == 1) {
            Extra = 0;
            client.guilds.get(channels.guildID).channels.forEach(channel => {
              if (channel.parentID == channels.Cat3s) {
                if (channel.members.array().length == 0) {
                  if (Extra == 1) {
                    if (channel) {
                      channel.delete();
                    }
                  } else {
                    Extra = 1;
                  }
                }
              }
            });
            if (Extra == 0) {
              newMember.guild.createChannel("⚽ Limited 3v3", "voice", {userLimit: 3, parent: channels.Cat3s});
            }
          }
        }
      }
    
      if (oldMember.voiceChannel) {
        if(oldMember.voiceChannel.parentID == channels.Cat2s) {
          if(oldMember.voiceChannel.members.array().length == 0) {
            Extra = 0;
            client.guilds.get(channels.guildID).channels.forEach(channel => {
              if (channel.parentID == channels.Cat2s) {
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
              oldMember.guild.createChannel("🚀 Limited 2v2", "voice", {userLimit: 2, parent: channels.Cat2s});
            }
          }
        }
        if(oldMember.voiceChannel.parentID == channels.Cat3s) {
          if(oldMember.voiceChannel.members.array().length == 0) {
            Extra = 0;
            client.guilds.get(channels.guildID).channels.forEach(channel => {
              if (channel.parentID == channels.Cat3s) {
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
              oldMember.guild.createChannel("⚽ Limited 3v3", "voice", {userLimit: 3, parent: channels.Cat3s});
            }
          }
        }
      }
    
}